import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, Role, StatusTagihan, MetodePembayaran } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// POST - Confirm cash payment for a transaction
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    
    // Only ADMIN and BENDAHARA roles can confirm cash payments
    const allowedRoles: Role[] = ["ADMIN", "BENDAHARA_SMK", "BENDAHARA_SMP", "BENDAHARA_PONDOK"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Forbidden - Only admin or bendahara can confirm cash payments" }, { status: 403 });
    }

    const body = await request.json();
    const { transaksiId } = body;

    if (!transaksiId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Get the transaction
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId },
      include: {
        santri: {
          select: {
            id: true,
            nis: true,
            nama: true,
            kelas: true,
            asrama: true,
            jenisSantri: true,
            saldoUangSaku: true,
          },
        },
        tagihan: true,
      },
    });

    if (!transaksi) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Check if transaction is already paid
    if (transaksi.status === StatusTransaksi.LUNAS) {
      return NextResponse.json({ error: "Transaction is already paid" }, { status: 400 });
    }

    // Update transaction status to LUNAS with cash payment method
    const updatedTransaksi = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: {
        status: StatusTransaksi.LUNAS,
        metodePembayaran: MetodePembayaran.CASH,
        tanggalBayar: new Date(),
      },
      include: {
        santri: {
          select: {
            id: true,
            nis: true,
            nama: true,
            kelas: true,
            asrama: true,
            jenisSantri: true,
            saldoUangSaku: true,
          },
        },
      },
    });

    // Update related tagihan status if exists
    if (transaksi.tagihan && transaksi.tagihan.length > 0) {
      await prisma.tagihan.updateMany({
        where: { transaksiId: transaksiId },
        data: { status: StatusTagihan.LUNAS },
      });
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${transaksi.kode}`;

    return NextResponse.json({
      success: true,
      message: "Cash payment confirmed successfully",
      transaksi: updatedTransaksi,
      receipt: {
        receiptNumber,
        paymentDate: updatedTransaksi.tanggalBayar,
        paymentMethod: "CASH",
        santri: updatedTransaksi.santri,
        jumlah: updatedTransaksi.jumlah,
        jenis: updatedTransaksi.jenis,
        kode: updatedTransaksi.kode,
      },
    });
  } catch (error) {
    console.error("Error confirming cash payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm cash payment" },
      { status: 500 }
    );
  }
}
