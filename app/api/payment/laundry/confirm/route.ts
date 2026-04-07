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

    // Determine transaction IDs to process
    // Support both new format (transaksiIds JSON array) and legacy format (single transaksiId)
    let transaksiIds: string[] = [];
    
    if (midtransTransaction.transaksiIds) {
      try {
        transaksiIds = JSON.parse(midtransTransaction.transaksiIds);
      } catch (e) {
        console.error("Failed to parse transaksiIds:", midtransTransaction.transaksiIds);
      }
    }
    
    // Fallback to single transaksiId if no transaksiIds
    if (transaksiIds.length === 0 && midtransTransaction.transaksiId) {
      transaksiIds = [midtransTransaction.transaksiId];
    }

    if (transaksiIds.length === 0) {
      return NextResponse.json(
        { error: "No transaction IDs found" },
        { status: 400 }
      );
    }

    // Update all transaksi status to LUNAS
    for (const transaksiId of transaksiIds) {
      await prisma.transaksi.update({
        where: { id: transaksiId },
        data: {
          status: StatusTransaksi.LUNAS,
          tanggalBayar: new Date(),
        },
      });
    }

    console.log("Payment confirmed successfully for transaksi:", transaksiIds);

    return NextResponse.json({
      success: true,
      transactionsCount: transaksiIds.length,
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
