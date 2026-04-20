import { NextRequest, NextResponse } from "next/server";
import {
  StatusTransaksi,
  StatusTagihan,
  MetodePembayaran,
  JenisTransaksi,
  Role
} from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// POST - Pay tagihan using santri saldo
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_SALDO);
    if (ipLimit) return ipLimit;

    logger.log("=== Saldo Payment API Called ===");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    logger.log("Session:", session?.user?.id, session?.user?.role);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_SALDO, session.user.id);
    if (userLimit) return userLimit;

    const body = await request.json();
    const { tagihanId, tagihanIds, transaksiId } = body;

    logger.log("Request body:", { tagihanId, tagihanIds, transaksiId });

    // Support single tagihanId, multiple tagihanIds, or transaksiId
    const isBulkPayment = tagihanIds && Array.isArray(tagihanIds) && tagihanIds.length > 0;
    const isSinglePayment = tagihanId && !isBulkPayment;
    
    if (!isSinglePayment && !isBulkPayment && !transaksiId) {
      return NextResponse.json(
        { error: "Tagihan ID, Tagihan IDs array, or Transaksi ID is required" },
        { status: 400 }
      );
    }

    // Get santri with current saldo
    const santri = await prisma.santri.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        nis: true,
        nama: true,
        saldoTagihan: true,
      },
    });

    if (!santri) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    logger.log("Santri found:", santri.id, "Saldo Tagihan:", santri.saldoTagihan);

    // Handle payment for existing transaksi (e.g., laundry, ujian, etc.)
    if (transaksiId) {
      return await handleTransaksiPayment(request, santri, transaksiId, session);
    }

    // Collect all tagihan IDs
    const idsToPay = isBulkPayment ? tagihanIds : [tagihanId];

    // Get all unpaid tagihan
    const tagihanList = await prisma.tagihan.findMany({
      where: {
        id: { in: idsToPay },
        santriId: santri.id,
        status: { not: StatusTagihan.LUNAS },
      },
    });

    if (tagihanList.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada tagihan yang perlu dibayar" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = tagihanList.reduce((sum, t) => sum + t.jumlah, 0);

    logger.log("Total amount to pay:", totalAmount);

    // Check if saldo is sufficient
    if (santri.saldoTagihan < totalAmount) {
      return NextResponse.json(
        {
          error: "Saldo tagihan tidak mencukupi",
          required: totalAmount,
          available: santri.saldoTagihan,
          shortfall: totalAmount - santri.saldoTagihan,
        },
        { status: 400 }
      );
    }

    // Determine jenis transaksi based on tagihan
    const jenisTransaksi = tagihanList[0]?.jenis === "SPP" 
      ? JenisTransaksi.SPP 
      : JenisTransaksi.SYAHRIAH;

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct saldo
      const updatedSantri = await tx.santri.update({
        where: { id: santri.id },
        data: {
          saldoTagihan: {
            decrement: totalAmount,
          },
        },
      });

      logger.log("Saldo deducted. New saldo tagihan:", updatedSantri.saldoTagihan);

      // 2. Create transaksi
      const transaksi = await tx.transaksi.create({
        data: {
          kode: `SALDO-${santri.nis}-${Date.now()}`,
          santriId: santri.id,
          jenis: jenisTransaksi,
          jumlah: totalAmount,
          status: StatusTransaksi.LUNAS,
          metodePembayaran: MetodePembayaran.SALDO,
          tanggalBayar: new Date(),
          managedBy: (session.user.role as Role) || Role.ADMIN,
          bulan: tagihanList[0]?.bulan,
          tahun: tagihanList[0]?.tahun,
        },
      });

      logger.log("Transaksi created:", transaksi.id);

      // 3. Update all tagihan to LUNAS and link to transaksi
      const updateResult = await tx.tagihan.updateMany({
        where: { id: { in: tagihanList.map((t) => t.id) } },
        data: {
          status: StatusTagihan.LUNAS,
          transaksiId: transaksi.id,
        },
      });

      logger.log("Tagihan updated:", updateResult.count);

      return { transaksi, updatedSantri, tagihanCount: updateResult.count };
    });

    logger.log("Payment transaction completed successfully");

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil",
      transaksi: {
        id: result.transaksi.id,
        kode: result.transaksi.kode,
        jumlah: result.transaksi.jumlah,
        tanggalBayar: result.transaksi.tanggalBayar,
      },
      deductedAmount: totalAmount,
      remainingSaldo: result.updatedSantri.saldoTagihan,
      tagihanPaid: result.tagihanCount,
    });
  } catch (error) {
    console.error("Error processing saldo payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

// Handle payment for existing transaksi (laundry, ujian, etc.)
async function handleTransaksiPayment(
  request: NextRequest,
  santri: { id: string; nis: string; nama: string; saldoTagihan: number },
  transaksiId: string,
  session: any
) {
  // Get transaksi
  const transaksi = await prisma.transaksi.findUnique({
    where: { id: transaksiId },
    include: { tagihan: true },
  });

  if (!transaksi) {
    return NextResponse.json(
      { error: "Transaksi not found" },
      { status: 404 }
    );
  }

  if (transaksi.status === StatusTransaksi.LUNAS) {
    return NextResponse.json(
      { error: "Transaksi sudah lunas" },
      { status: 400 }
    );
  }

  // Check if santri owns this transaksi
  if (transaksi.santriId !== santri.id) {
    return NextResponse.json(
      { error: "Unauthorized - You can only pay your own bills" },
      { status: 403 }
    );
  }

  const totalAmount = transaksi.jumlah;

  logger.log("Transaksi amount to pay:", totalAmount);

  // Check if saldo is sufficient
  if (santri.saldoTagihan < totalAmount) {
    return NextResponse.json(
      {
        error: "Saldo tagihan tidak mencukupi",
        required: totalAmount,
        available: santri.saldoTagihan,
        shortfall: totalAmount - santri.saldoTagihan,
      },
      { status: 400 }
    );
  }

  // Use transaction for atomicity
  const result = await prisma.$transaction(async (tx) => {
    // 1. Deduct saldo tagihan
    const updatedSantri = await tx.santri.update({
      where: { id: santri.id },
      data: {
        saldoTagihan: {
          decrement: totalAmount,
        },
      },
    });

    logger.log("Saldo deducted. New saldo tagihan:", updatedSantri.saldoTagihan);

    // 2. Update transaksi to LUNAS
    const updatedTransaksi = await tx.transaksi.update({
      where: { id: transaksiId },
      data: {
        status: StatusTransaksi.LUNAS,
        metodePembayaran: MetodePembayaran.SALDO,
        tanggalBayar: new Date(),
      },
    });

    logger.log("Transaksi updated to LUNAS:", updatedTransaksi.id);

    // 3. Update related tagihan if any
    if (transaksi.tagihan.length > 0) {
      await tx.tagihan.updateMany({
        where: { transaksiId: transaksiId },
        data: { status: StatusTagihan.LUNAS },
      });
      logger.log("Related tagihan updated to LUNAS");
    }

    return { transaksi: updatedTransaksi, updatedSantri };
  });

  logger.log("Transaksi payment completed successfully");

  return NextResponse.json({
    success: true,
    message: "Pembayaran berhasil",
    transaksi: {
      id: result.transaksi.id,
      kode: result.transaksi.kode,
      jenis: result.transaksi.jenis,
      jumlah: result.transaksi.jumlah,
      tanggalBayar: result.transaksi.tanggalBayar,
    },
    deductedAmount: totalAmount,
    remainingSaldo: result.updatedSantri.saldoTagihan,
  });
}
