import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactionStatus } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulPayment, handleFailedPayment, handlePendingPayment } from "@/lib/payment-handler";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// POST - Manually check and update payment status from Midtrans
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CONFIRM);
    if (ipLimit) return ipLimit;

    logger.log("=== Payment Status Check API Called ===");
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CONFIRM, session.user.id);
    if (userLimit) return userLimit;

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    logger.log("Checking status for order_id:", orderId);

    // Find Midtrans transaction
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
      where: { orderId },
      include: {
        transaksi: {
          include: {
            tagihan: true,
          },
        },
      },
    });

    if (!midtransTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Get transaction status from Midtrans
    const midtransStatus = await getTransactionStatus(orderId);
    logger.log("Midtrans status:", midtransStatus);

    const { transaction_status, fraud_status, settlement_time, transaction_time } = midtransStatus;

    // Update Midtrans transaction record
    await prisma.midtransTransaction.update({
      where: { id: midtransTransaction.id },
      data: {
        transactionId: midtransStatus.transaction_id,
        paymentType: midtransStatus.payment_type,
        transactionStatus: transaction_status,
        fraudStatus: fraud_status,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        settlementTime: settlement_time ? new Date(settlement_time) : null,
      },
    });

    // Determine transaction IDs to process
    // Support both new format (transaksiIds JSON array) and legacy format (single transaksiId)
    let transaksiIds: string[] = [];
    
    if (midtransTransaction.transaksiIds) {
      // New format: multiple transactions stored as JSON array
      try {
        transaksiIds = JSON.parse(midtransTransaction.transaksiIds);
        logger.log("Check-status: Using transaksiIds (multiple transactions):", transaksiIds);
      } catch (e) {
        console.error("Check-status: Failed to parse transaksiIds:", midtransTransaction.transaksiIds);
        transaksiIds = [];
      }
    } else if (midtransTransaction.transaksiId) {
      // Legacy format: single transaction
      transaksiIds = [midtransTransaction.transaksiId];
      logger.log("Check-status: Using transaksiId (single transaction):", midtransTransaction.transaksiId);
    }

    if (transaksiIds.length === 0) {
      return NextResponse.json(
        { error: "No transaction IDs found" },
        { status: 400 }
      );
    }

    // Handle different transaction statuses using shared handlers
    // Process ALL transactions (both single and combined payments)
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        for (const transaksiId of transaksiIds) {
          await handlePendingPayment(transaksiId);
        }
      } else if (fraud_status === "accept") {
        for (const transaksiId of transaksiIds) {
          await handleSuccessfulPayment(transaksiId, settlement_time || transaction_time);
        }
      }
    } else if (transaction_status === "settlement") {
      for (const transaksiId of transaksiIds) {
        await handleSuccessfulPayment(transaksiId, settlement_time || transaction_time);
      }
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      for (const transaksiId of transaksiIds) {
        const tx = await prisma.transaksi.findUnique({
          where: { id: transaksiId },
          include: { tagihan: true },
        });
        const tagihanId = tx?.tagihan[0]?.id;
        await handleFailedPayment(transaksiId, tagihanId);
      }
    } else if (transaction_status === "pending") {
      for (const transaksiId of transaksiIds) {
        await handlePendingPayment(transaksiId);
      }
    }

    // Get updated transaksi records
    const updatedTransaksiList = await prisma.transaksi.findMany({
      where: { id: { in: transaksiIds } },
      include: {
        tagihan: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactionStatus: transaction_status,
      fraudStatus: fraud_status,
      transactionsCount: transaksiIds.length,
      transactions: updatedTransaksiList.map(t => ({
        id: t.id,
        jenis: t.jenis,
        status: t.status,
        jumlah: t.jumlah,
        tagihanStatus: t.tagihan[0]?.status,
      })),
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
