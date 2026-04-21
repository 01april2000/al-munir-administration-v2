import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { handleFailedPayment } from "@/lib/payment-handler";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// POST - Cancel a pending top-up transaction when user closes Snap popup
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CREATE);
    if (ipLimit) return ipLimit;

    logger.log("=== Cancel Payment API Called ===");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    logger.log("Cancel payment for orderId:", orderId);

    // Find Midtrans transaction
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
      where: { orderId },
    });

    if (!midtransTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Only cancel if still pending
    if (midtransTransaction.transactionStatus !== "pending") {
      logger.log("Transaction is not pending, current status:", midtransTransaction.transactionStatus);
      return NextResponse.json(
        { error: "Cannot cancel non-pending transaction", status: midtransTransaction.transactionStatus },
        { status: 400 }
      );
    }

    // Determine transaction IDs to process
    let transaksiIds: string[] = [];

    if (midtransTransaction.transaksiIds) {
      try {
        transaksiIds = JSON.parse(midtransTransaction.transaksiIds);
      } catch (e) {
        console.error("Failed to parse transaksiIds:", midtransTransaction.transaksiIds);
        transaksiIds = [];
      }
    } else if (midtransTransaction.transaksiId) {
      transaksiIds = [midtransTransaction.transaksiId];
    }

    if (transaksiIds.length === 0) {
      return NextResponse.json(
        { error: "No transaction IDs found" },
        { status: 400 }
      );
    }

    // Mark all related transactions as failed (DITOLAK)
    for (const transaksiId of transaksiIds) {
      // Get tagihan ID for this transaction if exists
      const tx = await prisma.transaksi.findUnique({
        where: { id: transaksiId },
        include: { tagihan: true },
      });
      const tagihanId = tx?.tagihan[0]?.id;
      await handleFailedPayment(transaksiId, tagihanId);
      logger.log("Cancelled transaksi:", transaksiId);
    }

    // Update Midtrans transaction record to cancelled
    await prisma.midtransTransaction.update({
      where: { id: midtransTransaction.id },
      data: { transactionStatus: "cancel" },
    });

    logger.log("Payment cancelled successfully for orderId:", orderId);

    return NextResponse.json({ success: true, message: "Transaction cancelled" });
  } catch (error) {
    console.error("Error cancelling payment:", error);
    return NextResponse.json(
      { error: "Failed to cancel payment" },
      { status: 500 }
    );
  }
}
