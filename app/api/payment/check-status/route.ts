import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, StatusTagihan, JenisTransaksi, StatusUangSaku } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactionStatus } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";

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

    // Handle different transaction statuses
    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        await prisma.transaksi.update({
          where: { id: midtransTransaction.transaksiId },
          data: { status: StatusTransaksi.PENDING },
        });
      } else if (fraud_status === "accept") {
        await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
      }
    } else if (transaction_status === "settlement") {
      await handleSuccessfulPayment(midtransTransaction.transaksiId, settlement_time || transaction_time);
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      await prisma.transaksi.update({
        where: { id: midtransTransaction.transaksiId },
        data: { status: StatusTransaksi.DITOLAK },
      });

      if (midtransTransaction.transaksi.tagihan.length > 0) {
        await prisma.tagihan.update({
          where: { id: midtransTransaction.transaksi.tagihan[0].id },
          data: { status: StatusTagihan.BELUM_LUNAS },
        });
      }
    } else if (transaction_status === "pending") {
      await prisma.transaksi.update({
        where: { id: midtransTransaction.transaksiId },
        data: { status: StatusTransaksi.PENDING },
      });
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

async function handleSuccessfulPayment(transaksiId: string, paymentTime: string) {
  console.log("handleSuccessfulPayment: Updating transaksi:", transaksiId, "to LUNAS");
  
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: {
      status: StatusTransaksi.LUNAS,
      tanggalBayar: new Date(paymentTime),
    },
  });

  const transaksi = await prisma.transaksi.findUnique({
    where: { id: transaksiId },
    include: {
      tagihan: true,
      santriId: true,
      jenis: true,
      statusUangSaku: true,
      jumlah: true,
    },
  });

  if (transaksi && transaksi.tagihan.length > 0) {
    console.log("handleSuccessfulPayment: Updating tagihan:", transaksi.tagihan[0].id, "to LUNAS");
    await prisma.tagihan.update({
      where: { id: transaksi.tagihan[0].id },
      data: { status: StatusTagihan.LUNAS },
    });
    console.log("handleSuccessfulPayment: Tagihan updated successfully");
  } else {
    console.log("handleSuccessfulPayment: No tagihan found for this transaksi");
  }

  // Update santri saldo if this is a UANG_SAKU top-up transaction
  if (transaksi && transaksi.jenis === JenisTransaksi.UANG_SAKU && transaksi.statusUangSaku === StatusUangSaku.DITAMBAH) {
    console.log("handleSuccessfulPayment: Updating santri saldo for top-up, amount:", transaksi.jumlah);
    await prisma.santri.update({
      where: { id: transaksi.santriId },
      data: {
        saldoUangSaku: {
          increment: transaksi.jumlah,
        },
      },
    });
    console.log("handleSuccessfulPayment: Santri saldo updated successfully");
  }
}
