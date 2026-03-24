import { NextRequest, NextResponse } from "next/server";
import { getTransactionStatus } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";

// POST - Debug payment status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    console.log("=== Debug Payment Status ===");
    console.log("Order ID:", orderId);

    // Find Midtrans transaction
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
      where: { orderId },
      include: {
        transaksi: {
          include: {
            tagihan: true,
            santri: true,
          },
        },
      },
    });

    if (!midtransTransaction) {
      return NextResponse.json({
        error: "Transaction not found",
        orderId,
      });
    }

    console.log("Midtrans Transaction:", {
      id: midtransTransaction.id,
      orderId: midtransTransaction.orderId,
      transaksiId: midtransTransaction.transaksiId,
      transactionStatus: midtransTransaction.transactionStatus,
      fraudStatus: midtransTransaction.fraudStatus,
      settlementTime: midtransTransaction.settlementTime,
      grossAmount: midtransTransaction.grossAmount,
    });

    console.log("Transaksi:", {
      id: midtransTransaction.transaksi.id,
      kode: midtransTransaction.transaksi.kode,
      status: midtransTransaction.transaksi.status,
      tanggalBayar: midtransTransaction.transaksi.tanggalBayar,
      jumlah: midtransTransaction.transaksi.jumlah,
    });

    console.log("Tagihan:", midtransTransaction.transaksi.tagihan.map(t => ({
      id: t.id,
      kode: t.kode,
      status: t.status,
      jumlah: t.jumlah,
      jenis: t.jenis,
      bulan: t.bulan,
      tahun: t.tahun,
    })));

    // Get status from Midtrans API
    let midtransStatus = null;
    try {
      midtransStatus = await getTransactionStatus(orderId);
      console.log("Midtrans API Status:", midtransStatus);
    } catch (error) {
      console.error("Error getting Midtrans status:", error);
    }

    return NextResponse.json({
      midtransTransaction: {
        id: midtransTransaction.id,
        orderId: midtransTransaction.orderId,
        transaksiId: midtransTransaction.transaksiId,
        transactionStatus: midtransTransaction.transactionStatus,
        fraudStatus: midtransTransaction.fraudStatus,
        settlementTime: midtransTransaction.settlementTime,
        grossAmount: midtransTransaction.grossAmount,
      },
      transaksi: {
        id: midtransTransaction.transaksi.id,
        kode: midtransTransaction.transaksi.kode,
        status: midtransTransaction.transaksi.status,
        tanggalBayar: midtransTransaction.transaksi.tanggalBayar,
        jumlah: midtransTransaction.transaksi.jumlah,
      },
      tagihan: midtransTransaction.transaksi.tagihan.map(t => ({
        id: t.id,
        kode: t.kode,
        status: t.status,
        jumlah: t.jumlah,
        jenis: t.jenis,
        bulan: t.bulan,
        tahun: t.tahun,
      })),
      midtransStatus,
    });
  } catch (error) {
    console.error("Error in debug:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
