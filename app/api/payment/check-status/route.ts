import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactionStatus } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulPayment, handleFailedPayment, handlePendingPayment } from "@/lib/payment-handler";

// POST - Manually check and update payment status from Midtrans
export async function POST(request: NextRequest) {
  try {
    console.log("=== Payment Status Check API Called ===");
    
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

    console.log("Checking status for order_id:", orderId);

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
    console.log("Midtrans status:", midtransStatus);

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

    // Handle different transaction statuses using shared handlers
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        await handlePendingPayment(midtransTransaction.transaksiId);
      } else if (fraud_status === "accept") {
        await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
      }
    } else if (transaction_status === "settlement") {
      await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      const tagihanId = midtransTransaction.transaksi.tagihan[0]?.id;
      await handleFailedPayment(midtransTransaction.transaksiId, tagihanId);
    } else if (transaction_status === "pending") {
      await handlePendingPayment(midtransTransaction.transaksiId);
    }

    // Get updated transaksi with tagihan
    const updatedTransaksi = await prisma.transaksi.findUnique({
      where: { id: midtransTransaction.transaksiId },
      include: {
        tagihan: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactionStatus: transaction_status,
      fraudStatus: fraud_status,
      transaksiStatus: updatedTransaksi?.status,
      tagihanStatus: updatedTransaksi?.tagihan[0]?.status,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
