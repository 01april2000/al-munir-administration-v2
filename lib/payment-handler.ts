import { StatusTransaksi, StatusTagihan, JenisTransaksi, StatusUangSaku } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Handle successful payment - updates transaksi status, tagihan status, and santri saldo if applicable
 * This function is shared between webhook and check-status endpoints
 */
export async function handleSuccessfulPayment(transaksiId: string, paymentTime: string) {
  console.log("handleSuccessfulPayment: Updating transaksi:", transaksiId, "to LUNAS");
  
  // Update transaksi status to LUNAS
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: {
      status: StatusTransaksi.LUNAS,
      tanggalBayar: new Date(paymentTime),
    },
  });

  // Get transaksi with related tagihan and santri
  const transaksi = await prisma.transaksi.findUnique({
    where: { id: transaksiId },
    include: {
      tagihan: true,
      santri: true,
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

/**
 * Handle failed/cancelled/expired payment - updates transaksi and tagihan status
 * This function is shared between webhook and check-status endpoints
 */
export async function handleFailedPayment(transaksiId: string, tagihanId?: string) {
  console.log("handleFailedPayment: Updating transaksi:", transaksiId, "to DITOLAK");
  
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: { status: StatusTransaksi.DITOLAK },
  });

  // Update related tagihan status if provided
  if (tagihanId) {
    console.log("handleFailedPayment: Updating tagihan:", tagihanId, "to BELUM_LUNAS");
    await prisma.tagihan.update({
      where: { id: tagihanId },
      data: { status: StatusTagihan.BELUM_LUNAS },
    });
  }
}

/**
 * Handle pending payment - updates transaksi status
 * This function is shared between webhook and check-status endpoints
 */
export async function handlePendingPayment(transaksiId: string) {
  console.log("handlePendingPayment: Updating transaksi:", transaksiId, "to PENDING");
  
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: { status: StatusTransaksi.PENDING },
  });
}

/**
 * Get tagihan ID from transaksi if exists
 */
export async function getTagihanIdFromTransaksi(transaksiId: string): Promise<string | null> {
  const transaksi = await prisma.transaksi.findUnique({
    where: { id: transaksiId },
    include: { tagihan: true },
  });
  
  return transaksi?.tagihan[0]?.id || null;
}
