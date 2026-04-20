import { NextRequest, NextResponse } from "next/server";
import { StatusTransaksi, Role, StatusTagihan, MetodePembayaran, JenisTagihan } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// POST - Confirm cash payment for a transaction
// Supports:
// - Single transaction: { transaksiId: string }
// - Combined payment from multiple tagihan: { tagihanIds: string[], santriId: string }
export async function POST(request: NextRequest) {
  try {
    // IP-based rate limit
    const ipLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CONFIRM);
    if (ipLimit) return ipLimit;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User-based rate limit
    const userLimit = rateLimit(request, RATE_LIMITS.PAYMENT_CONFIRM, session.user.id);
    if (userLimit) return userLimit;

    const userRole = session.user.role as Role;
    
    // Only ADMIN and BENDAHARA roles can confirm cash payments
    const allowedRoles: Role[] = ["ADMIN", "BENDAHARA_SMK", "BENDAHARA_SMP", "BENDAHARA_PONDOK"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Forbidden - Only admin or bendahara can confirm cash payments" }, { status: 403 });
    }

    const body = await request.json();
    const { transaksiId, tagihanIds, santriId } = body;

    // Handle combined payment from multiple tagihan
    if (tagihanIds && Array.isArray(tagihanIds) && tagihanIds.length > 0 && santriId) {
      return await handleCombinedCashPayment(tagihanIds, santriId, userRole);
    }

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
            saldoTagihan: true,
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
            saldoTagihan: true,
            saldoUangSaku: true,
          },
        },
        tagihan: true,
      },
    });

    // Update ALL related tagihan status to LUNAS (supports combined payments)
    if (updatedTransaksi.tagihan && updatedTransaksi.tagihan.length > 0) {
      const updateResult = await prisma.tagihan.updateMany({
        where: { transaksiId: transaksiId },
        data: { status: StatusTagihan.LUNAS },
      });
      logger.log(`Updated ${updateResult.count} tagihan to LUNAS for transaksi ${transaksiId}`);
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${transaksi.kode}`;

    // Build receipt items for combined payments
    const receiptItems = updatedTransaksi.tagihan.map(t => ({
      jenis: t.jenis,
      bulan: t.bulan,
      tahun: t.tahun,
      jumlah: t.jumlah,
    }));

    return NextResponse.json({
      success: true,
      message: updatedTransaksi.tagihan.length > 1
        ? `Cash payment confirmed successfully for ${updatedTransaksi.tagihan.length} tagihan`
        : "Cash payment confirmed successfully",
      transaksi: updatedTransaksi,
      receipt: {
        receiptNumber,
        paymentDate: updatedTransaksi.tanggalBayar,
        paymentMethod: "CASH",
        santri: updatedTransaksi.santri,
        jumlah: updatedTransaksi.jumlah,
        jenis: updatedTransaksi.jenis,
        kode: updatedTransaksi.kode,
        isCombined: updatedTransaksi.tagihan.length > 1,
        items: receiptItems,
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

/**
 * Handle combined cash payment for multiple tagihan (SPP + SYAHRIAH)
 * Creates a single transaction that combines all tagihan into one payment
 */
async function handleCombinedCashPayment(
  tagihanIds: string[],
  santriId: string,
  userRole: Role
) {
  logger.log("=== Handling Combined Cash Payment for tagihanIds:", tagihanIds);

  // Fetch all tagihan
  const tagihanList = await prisma.tagihan.findMany({
    where: {
      id: { in: tagihanIds },
      santriId: santriId,
    },
  });

  if (tagihanList.length === 0) {
    return NextResponse.json(
      { error: "No valid tagihan found for this santri" },
      { status: 404 }
    );
  }

  // Validate all tagihan are not paid
  const alreadyPaid = tagihanList.filter((t) => t.status === StatusTagihan.LUNAS);
  if (alreadyPaid.length > 0) {
    return NextResponse.json(
      { error: `Some tagihan are already paid: ${alreadyPaid.map(t => `${t.jenis} ${t.bulan} ${t.tahun}`).join(", ")}` },
      { status: 400 }
    );
  }

  // Validation rules for combining tagihan:
  // 1. Single tagihan of any type is allowed
  // 2. Multiple tagihan: allow SPP + SYAHRIAH combination, or same type combination
  if (tagihanList.length > 1) {
    const jenisSet = new Set(tagihanList.map((t) => t.jenis));
    const uniqueJenis = Array.from(jenisSet);
    
    // If there are multiple different types, only allow SPP + SYAHRIAH combination
    if (uniqueJenis.length > 1) {
      const hasInvalidTypes = uniqueJenis.filter(
        (j) => j !== JenisTagihan.SPP && j !== JenisTagihan.SYAHRIAH
      );
      
      if (hasInvalidTypes.length > 0) {
        return NextResponse.json(
          { error: "Only SPP and SYAHRIAH can be combined together. Other tagihan types must be paid separately or combined with the same type only." },
          { status: 400 }
        );
      }
    }
  }

  // Get santri data
  const santri = await prisma.santri.findUnique({
  where: { id: santriId },
  select: {
    id: true,
    nis: true,
    nama: true,
    kelas: true,
    asrama: true,
    jenisSantri: true,
    saldoTagihan: true,
    saldoUangSaku: true,
  },
});

  if (!santri) {
    return NextResponse.json(
      { error: "Santri not found" },
      { status: 404 }
    );
  }

  // Calculate total amount
  const totalAmount = tagihanList.reduce((sum, t) => sum + t.jumlah, 0);
  logger.log("Combined cash payment total amount:", totalAmount);

  // Determine primary jenis:
  // - If SPP exists, use SPP
  // - Otherwise use the first tagihan's jenis
  const hasSPP = tagihanList.some((t) => t.jenis === JenisTagihan.SPP);
  const primaryJenis = hasSPP ? "SPP" : tagihanList[0].jenis;

  // Find and mark old individual transactions as DITOLAK
  // This happens when there were previous payment attempts for individual tagihan
  const oldTransactions = await prisma.transaksi.findMany({
    where: {
      santriId: santriId,
      tagihan: {
        some: {
          id: { in: tagihanIds },
        },
      },
      status: { in: [StatusTransaksi.PENDING, StatusTransaksi.BELUM_BAYAR] },
    },
    include: {
      tagihan: true,
    },
  });

  // Mark old individual transactions as DITOLAK
  for (const oldTx of oldTransactions) {
    await prisma.transaksi.update({
      where: { id: oldTx.id },
      data: { status: StatusTransaksi.DITOLAK },
    });
    logger.log(`Marked old transaction ${oldTx.id} as DITOLAK (replaced by combined cash payment)`);
  }

  // Create combined transaction
  const newTransaksi = await prisma.transaksi.create({
    data: {
      kode: `TRX-CASH-COMBINED-${santri.nis}-${Date.now()}`,
      santriId: santri.id,
      jenis: primaryJenis,
      bulan: tagihanList[0].bulan,
      tahun: tagihanList[0].tahun,
      jumlah: totalAmount,
      keterangan: tagihanList.length === 1 ? tagihanList[0].keterangan : null,
      status: StatusTransaksi.LUNAS,
      metodePembayaran: MetodePembayaran.CASH,
      tanggalBayar: new Date(),
      managedBy: userRole,
      tagihan: {
        connect: tagihanIds.map((id) => ({ id })),
      },
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
          saldoTagihan: true,
          saldoUangSaku: true,
        },
      },
      tagihan: true,
    },
  });

  // Update ALL tagihan to LUNAS
  const updateResult = await prisma.tagihan.updateMany({
    where: { id: { in: tagihanIds } },
    data: {
      status: StatusTagihan.LUNAS,
      transaksiId: newTransaksi.id,
    },
  });

  logger.log(`Created combined cash transaction ${newTransaksi.id}, updated ${updateResult.count} tagihan to LUNAS`);

  // Generate receipt number
  const receiptNumber = `RCP-${Date.now()}-${newTransaksi.kode}`;

  // Build receipt items
  const receiptItems = tagihanList.map(t => ({
    jenis: t.jenis,
    bulan: t.bulan,
    tahun: t.tahun,
    jumlah: t.jumlah,
  }));

  return NextResponse.json({
    success: true,
    message: `Combined cash payment confirmed successfully for ${tagihanList.length} tagihan`,
    transaksi: newTransaksi,
    receipt: {
      receiptNumber,
      paymentDate: newTransaksi.tanggalBayar,
      paymentMethod: "CASH",
      santri: newTransaksi.santri,
      jumlah: newTransaksi.jumlah,
      jenis: newTransaksi.jenis,
      kode: newTransaksi.kode,
      isCombined: true,
      items: receiptItems,
    },
  });
}
