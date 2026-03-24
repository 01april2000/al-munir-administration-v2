import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// POST - Directly confirm laundry payment as LUNAS (called from Snap onSuccess)
export async function POST(request: NextRequest) {
  try {
    console.log("=== Laundry Payment Confirm API Called ===");
    
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

    console.log("Confirming payment for order_id:", orderId);

    // Find Midtrans transaction
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
      where: { orderId },
      include: {
        transaksi: true,
      },
    });

    if (!midtransTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update Midtrans transaction record
    await prisma.midtransTransaction.update({
      where: { id: midtransTransaction.id },
      data: {
        transactionStatus: "settlement",
        settlementTime: new Date(),
      },
    });

    // Update transaksi status to LUNAS
    await prisma.transaksi.update({
      where: { id: midtransTransaction.transaksiId },
      data: {
        status: StatusTransaksi.LUNAS,
        tanggalBayar: new Date(),
      },
    });

    console.log("Payment confirmed successfully for transaksi:", midtransTransaction.transaksiId);

    return NextResponse.json({
      success: true,
      transaksiStatus: StatusTransaksi.LUNAS,
    });
  } catch (error) {
    console.error("Error confirming laundry payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
