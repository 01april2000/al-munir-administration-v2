import { StatusTransaksi, StatusTagihan, JenisTransaksi, StatusUangSaku, MetodePembayaran } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Shared constants for top-up keterangan strings
// These MUST match between topup/route.ts and payment-handler.ts
export const KETERANGAN_TOPUP_TAGIHAN = "Top-up Saldo Tagihan" as const;
export const KETERANGAN_TOPUP_UANG_SAKU = "Top-up Uang Saku" as const;

/**
 * Handle successful payment - updates transaksi status, ALL related tagihan status, and santri saldo if applicable
 * This function is shared between webhook and check-status endpoints
 * Supports combined transactions with multiple tagihan (SPP + SYAHRIAH)
 * Uses Prisma transaction for atomicity
 */
export async function handleSuccessfulPayment(transaksiId: string, paymentTime: string | undefined) {
  logger.log("handleSuccessfulPayment: Starting for transaksi:", transaksiId);
  logger.log("handleSuccessfulPayment: Payment time:", paymentTime);
  
  try {
    // Use transaction for atomicity - all updates succeed or none do
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update transaksi status to LUNAS and set payment method to MIDTRANS
      const updatedTransaksi = await tx.transaksi.update({
        where: { id: transaksiId },
        data: {
          status: StatusTransaksi.LUNAS,
          tanggalBayar: paymentTime ? new Date(paymentTime) : new Date(),
          metodePembayaran: MetodePembayaran.MIDTRANS,
        },
      });
      logger.log("handleSuccessfulPayment: Transaksi updated to LUNAS:", updatedTransaksi.id);

      // 2. Get transaksi with related tagihan and santri
      const transaksi = await tx.transaksi.findUnique({
        where: { id: transaksiId },
        include: {
          tagihan: true,
          santri: true,
        },
      });

      if (!transaksi) {
        throw new Error(`Transaksi not found after update: ${transaksiId}`);
      }

      // 3. Update ALL related tagihan to LUNAS (supports combined SPP + SYAHRIAH payments)
      if (transaksi.tagihan.length > 0) {
        logger.log(`handleSuccessfulPayment: Updating ${transaksi.tagihan.length} tagihan to LUNAS`);
        
        const updateResult = await tx.tagihan.updateMany({
          where: { transaksiId: transaksiId },
          data: { status: StatusTagihan.LUNAS },
        });
        
        logger.log("handleSuccessfulPayment: Tagihan update result:", updateResult);
        logger.log("handleSuccessfulPayment: All tagihan updated successfully:",
          transaksi.tagihan.map(t => `${t.jenis}-${t.bulan}-${t.tahun}`).join(", ")
        );
      } else {
        logger.log("handleSuccessfulPayment: No tagihan found for this transaksi");
      }

      // 4. Update santri saldo if this is a UANG_SAKU top-up transaction
      if (transaksi.jenis === JenisTransaksi.UANG_SAKU && transaksi.statusUangSaku === StatusUangSaku.DITAMBAH) {
        // Use shared constant for reliable detection of tagihan vs uang saku top-up
        const isTagihanTopup = transaksi.keterangan === KETERANGAN_TOPUP_TAGIHAN;
        const saldoField = isTagihanTopup ? "saldoTagihan" : "saldoUangSaku";
        logger.log(`handleSuccessfulPayment: Updating santri ${saldoField} for top-up, amount:`, transaksi.jumlah, "keterangan:", transaksi.keterangan);
        
        if (isTagihanTopup) {
          await tx.santri.update({
            where: { id: transaksi.santriId },
            data: {
              saldoTagihan: {
                increment: transaksi.jumlah,
              },
            },
          });
        } else {
          await tx.santri.update({
            where: { id: transaksi.santriId },
            data: {
              saldoUangSaku: {
                increment: transaksi.jumlah,
              },
            },
          });
        }
        logger.log("handleSuccessfulPayment: Santri saldo updated successfully");
      }

      return { transaksi, updatedTransaksi };
    });
    
    logger.log("handleSuccessfulPayment: Transaction completed successfully");
    return result;
  } catch (error) {
    console.error("handleSuccessfulPayment: Error updating payment status:", error);
    throw error;
  }
}

/**
 * Handle failed/cancelled/expired payment - updates transaksi and ALL related tagihan status
 * This function is shared between webhook and check-status endpoints
 * Supports combined transactions with multiple tagihan (SPP + SYAHRIAH)
 */
export async function handleFailedPayment(transaksiId: string, tagihanId?: string) {
  logger.log("handleFailedPayment: Updating transaksi:", transaksiId, "to DITOLAK");
  
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: { status: StatusTransaksi.DITOLAK },
  });

  // Update ALL related tagihan to BELUM_LUNAS using updateMany
  // This handles both single and combined transactions
  const updateResult = await prisma.tagihan.updateMany({
    where: { transaksiId: transaksiId },
    data: { status: StatusTagihan.BELUM_LUNAS },
  });
  
  if (updateResult.count > 0) {
    logger.log(`handleFailedPayment: Updated ${updateResult.count} tagihan to BELUM_LUNAS`);
  } else if (tagihanId) {
    // Fallback: update single tagihan if provided and no tagihan found via transaksiId
    logger.log("handleFailedPayment: Updating single tagihan:", tagihanId, "to BELUM_LUNAS");
    await prisma.tagihan.update({
      where: { id: tagihanId },
      data: { status: StatusTagihan.BELUM_LUNAS },
    });
  }
}

/**
 * Handle pending payment - updates transaksi status and sets payment method to MIDTRANS
 * This function is shared between webhook and check-status endpoints
 */
export async function handlePendingPayment(transaksiId: string) {
  logger.log("handlePendingPayment: Updating transaksi:", transaksiId, "to PENDING");
  
  await prisma.transaksi.update({
    where: { id: transaksiId },
    data: {
      status: StatusTransaksi.PENDING,
      metodePembayaran: MetodePembayaran.MIDTRANS,
    },
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
