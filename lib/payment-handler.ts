import { StatusTransaksi, StatusTagihan, JenisTransaksi, StatusUangSaku, MetodePembayaran } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Handle successful payment - updates transaksi status, ALL related tagihan status, and santri saldo if applicable
 * This function is shared between webhook and check-status endpoints
 * Supports combined transactions with multiple tagihan (SPP + SYAHRIAH)
 * Uses Prisma transaction for atomicity
 */
export async function handleSuccessfulPayment(transaksiId: string, paymentTime: string | undefined) {
  console.log("handleSuccessfulPayment: Starting for transaksi:", transaksiId);
  console.log("handleSuccessfulPayment: Payment time:", paymentTime);
  
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
      console.log("handleSuccessfulPayment: Transaksi updated to LUNAS:", updatedTransaksi.id);

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
        console.log(`handleSuccessfulPayment: Updating ${transaksi.tagihan.length} tagihan to LUNAS`);
        
        const updateResult = await tx.tagihan.updateMany({
          where: { transaksiId: transaksiId },
          data: { status: StatusTagihan.LUNAS },
        });
        
        console.log("handleSuccessfulPayment: Tagihan update result:", updateResult);
        console.log("handleSuccessfulPayment: All tagihan updated successfully:",
          transaksi.tagihan.map(t => `${t.jenis}-${t.bulan}-${t.tahun}`).join(", ")
        );
      } else {
        console.log("handleSuccessfulPayment: No tagihan found for this transaksi");
      }

      // 4. Update santri saldo if this is a UANG_SAKU top-up transaction
      if (transaksi.jenis === JenisTransaksi.UANG_SAKU && transaksi.statusUangSaku === StatusUangSaku.DITAMBAH) {
        console.log("handleSuccessfulPayment: Updating santri saldo for top-up, amount:", transaksi.jumlah);
        await tx.santri.update({
          where: { id: transaksi.santriId },
          data: {
            saldoUangSaku: {
              increment: transaksi.jumlah,
            },
          },
        });
        console.log("handleSuccessfulPayment: Santri saldo updated successfully");
      }

      return { transaksi, updatedTransaksi };
    });
    
    console.log("handleSuccessfulPayment: Transaction completed successfully");
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
  console.log("handleFailedPayment: Updating transaksi:", transaksiId, "to DITOLAK");
  
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
    console.log(`handleFailedPayment: Updated ${updateResult.count} tagihan to BELUM_LUNAS`);
  } else if (tagihanId) {
    // Fallback: update single tagihan if provided and no tagihan found via transaksiId
    console.log("handleFailedPayment: Updating single tagihan:", tagihanId, "to BELUM_LUNAS");
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
  console.log("handlePendingPayment: Updating transaksi:", transaksiId, "to PENDING");
  
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
