import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulPayment, handleFailedPayment, handlePendingPayment } from "@/lib/payment-handler";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// POST - Handle Midtrans webhook notifications
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit for webhook (no auth, uses IP only)
    const ipLimit = rateLimit(request, RATE_LIMITS.WEBHOOK);
    if (ipLimit) return ipLimit;

    console.log("=== Webhook received ===");
    
    // Get notification data
    const notificationJson = await request.text();
    const notification = JSON.parse(notificationJson);
    
    console.log("Webhook notification:", {
      order_id: notification.order_id,
      transaction_status: notification.transaction_status,
      fraud_status: notification.fraud_status,
      status_code: notification.status_code,
      gross_amount: notification.gross_amount,
    });

    // Verify signature
    // Midtrans sends the signature in X-Signature-Key header
    const signatureKey = request.headers.get("X-Signature-Key") || request.headers.get("x-signature-key");
    if (!signatureKey) {
      console.error("Webhook: Missing signature key");
      return NextResponse.json(
        { error: "Missing signature key" },
        { status: 400 }
      );
    }

    if (!verifyWebhookSignature(notificationJson, signatureKey)) {
      console.error("Webhook: Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("Webhook: Signature verified successfully");

    const { order_id, transaction_status, fraud_status, transaction_id, payment_type, transaction_time, settlement_time } = notification;

    // Find Midtrans transaction
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
      where: { orderId: order_id },
      include: {
        transaksi: {
          include: {
            tagihan: true,
          },
        },
      },
    });

    if (!midtransTransaction) {
      console.error("Webhook: Transaction not found for order_id:", order_id);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Determine transaction IDs to process
    // Support both new format (transaksiIds JSON array) and legacy format (single transaksiId)
    let transaksiIds: string[] = [];
    
    if (midtransTransaction.transaksiIds) {
      // New format: multiple transactions stored as JSON array
      try {
        transaksiIds = JSON.parse(midtransTransaction.transaksiIds);
        console.log("Webhook: Using transaksiIds (multiple transactions):", transaksiIds);
      } catch (e) {
        console.error("Webhook: Failed to parse transaksiIds:", midtransTransaction.transaksiIds);
        transaksiIds = [];
      }
    } else if (midtransTransaction.transaksiId) {
      // Legacy format: single transaction
      transaksiIds = [midtransTransaction.transaksiId];
      console.log("Webhook: Using transaksiId (single transaction):", midtransTransaction.transaksiId);
    }

    if (transaksiIds.length === 0) {
      console.error("Webhook: No transaction IDs found");
      return NextResponse.json(
        { error: "No transaction IDs found" },
        { status: 400 }
      );
    }

    console.log("Webhook: Found transaction(s) to process:", {
      transaksiIds,
      count: transaksiIds.length,
      currentStatus: midtransTransaction.transactionStatus,
    });

    // Idempotency check — skip if already in a terminal state
    const terminalStates = ["settlement", "capture", "cancel", "deny", "expire"];
    const currentStatus = midtransTransaction.transactionStatus;
    const isDuplicate = currentStatus === transaction_status;
    const isAlreadyTerminal = terminalStates.includes(currentStatus);

    if (isAlreadyTerminal || isDuplicate) {
      console.log("Webhook: Idempotent skip — already processed:", {
        currentStatus,
        incomingStatus: transaction_status,
        isAlreadyTerminal,
        isDuplicate,
      });

      // Still update the Midtrans record with latest data (e.g. settlement_time)
      await prisma.midtransTransaction.update({
        where: { id: midtransTransaction.id },
        data: {
          transactionId: transaction_id,
          paymentType: payment_type,
          transactionStatus: transaction_status,
          fraudStatus: fraud_status,
          transactionTime: transaction_time ? new Date(transaction_time) : null,
          settlementTime: settlement_time ? new Date(settlement_time) : null,
        },
      });

      return NextResponse.json({ success: true, status: "already_processed" });
    }

    // Update Midtrans transaction record
    await prisma.midtransTransaction.update({
      where: { id: midtransTransaction.id },
      data: {
        transactionId: transaction_id,
        paymentType: payment_type,
        transactionStatus: transaction_status,
        fraudStatus: fraud_status,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        settlementTime: settlement_time ? new Date(settlement_time) : null,
      },
    });

    console.log("Webhook: Processing transaction status:", transaction_status);

    // Handle different transaction statuses using shared handlers
    // Process ALL transactions (both single and combined payments)
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        // Payment is being challenged
        for (const transaksiId of transaksiIds) {
          await handlePendingPayment(transaksiId);
        }
      } else if (fraud_status === "accept") {
        // Payment is successful - update all transactions
        for (const transaksiId of transaksiIds) {
          await handleSuccessfulPayment(transaksiId, settlement_time || transaction_time);
        }
      }
    } else if (transaction_status === "settlement") {
      // Payment is settled - update all transactions
      console.log("Webhook: Payment settled, updating all transactions to LUNAS");
      for (const transaksiId of transaksiIds) {
        console.log(`Webhook: Updating transaction ${transaksiId} to LUNAS`);
        await handleSuccessfulPayment(transaksiId, settlement_time || transaction_time);
      }
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      // Payment failed or cancelled - update all transactions
      for (const transaksiId of transaksiIds) {
        // Get tagihan ID for this transaction
        const tx = await prisma.transaksi.findUnique({
          where: { id: transaksiId },
          include: { tagihan: true },
        });
        const tagihanId = tx?.tagihan[0]?.id;
        await handleFailedPayment(transaksiId, tagihanId);
      }
    } else if (transaction_status === "pending") {
      // Payment is pending - update all transactions
      for (const transaksiId of transaksiIds) {
        await handlePendingPayment(transaksiId);
      }
    }

    console.log("Webhook: Processed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : undefined);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
