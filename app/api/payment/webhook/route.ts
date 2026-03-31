import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulPayment, handleFailedPayment, handlePendingPayment } from "@/lib/payment-handler";

// POST - Handle Midtrans webhook notifications
export async function POST(request: NextRequest) {
  try {
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

    console.log("Webhook: Found transaction:", {
      transaksiId: midtransTransaction.transaksiId,
      currentStatus: midtransTransaction.transactionStatus,
    });

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
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        // Payment is being challenged
        await handlePendingPayment(midtransTransaction.transaksiId);
      } else if (fraud_status === "accept") {
        // Payment is successful
        await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
      }
    } else if (transaction_status === "settlement") {
      // Payment is settled
      console.log("Webhook: Payment settled, updating status to LUNAS");
      await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      // Payment failed or cancelled
      const tagihanId = midtransTransaction.transaksi.tagihan[0]?.id;
      await handleFailedPayment(midtransTransaction.transaksiId, tagihanId);
    } else if (transaction_status === "pending") {
      // Payment is pending
      await handlePendingPayment(midtransTransaction.transaksiId);
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
