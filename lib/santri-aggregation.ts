import { prisma } from "@/lib/prisma"
import { StatusTagihan, StatusTransaksi, JenisTransaksi } from "@/lib/generated/prisma"

export interface TagihanSummary {
  totalUnpaid: number
  unpaidCount: number
  totalPaid: number
  paidCount: number
}

export interface TransaksiSummary {
  totalUnpaid: number
  unpaidCount: number
  totalPaid: number
  paidCount: number
}

/**
 * Get tagihan summary using Prisma aggregation
 * This is more efficient than fetching all records and calculating in JS
 */
export async function getTagihanSummary(santriId: string): Promise<TagihanSummary> {
  // Aggregate unpaid tagihan
  const unpaid = await prisma.tagihan.aggregate({
    where: {
      santriId,
      status: { not: StatusTagihan.LUNAS }
    },
    _sum: { jumlah: true },
    _count: true,
  })
  
  // Aggregate paid tagihan
  const paid = await prisma.tagihan.aggregate({
    where: {
      santriId,
      status: StatusTagihan.LUNAS
    },
    _sum: { jumlah: true },
    _count: true,
  })
  
  return {
    totalUnpaid: unpaid._sum.jumlah ?? 0,
    unpaidCount: unpaid._count,
    totalPaid: paid._sum.jumlah ?? 0,
    paidCount: paid._count,
  }
}

/**
 * Get transaksi summary using Prisma aggregation
 * Excludes SPP and SYAHRIAH as they are handled via tagihan
 * Also excludes transaksi that are linked to tagihan to avoid double counting
 */
export async function getTransaksiSummary(santriId: string): Promise<TransaksiSummary> {
  // Get all transaksi IDs that are linked to tagihan
  const transaksiWithTagihan = await prisma.transaksi.findMany({
    where: {
      santriId,
      tagihan: { some: {} } // Has at least one linked tagihan
    },
    select: { id: true }
  })
  const transaksiIdsToExclude = transaksiWithTagihan.map(t => t.id)

  // Aggregate unpaid transaksi (excluding SPP/Syahriah and those linked to tagihan)
  const unpaid = await prisma.transaksi.aggregate({
    where: {
      santriId,
      status: { not: StatusTransaksi.LUNAS },
      jenis: { notIn: [JenisTransaksi.SPP, JenisTransaksi.SYAHRIAH] },
      id: { notIn: transaksiIdsToExclude }
    },
    _sum: { jumlah: true },
    _count: true,
  })
  
  // Aggregate paid transaksi (excluding SPP/Syahriah and those linked to tagihan)
  const paid = await prisma.transaksi.aggregate({
    where: {
      santriId,
      status: StatusTransaksi.LUNAS,
      jenis: { notIn: [JenisTransaksi.SPP, JenisTransaksi.SYAHRIAH] },
      id: { notIn: transaksiIdsToExclude }
    },
    _sum: { jumlah: true },
    _count: true,
  })
  
  return {
    totalUnpaid: unpaid._sum.jumlah ?? 0,
    unpaidCount: unpaid._count,
    totalPaid: paid._sum.jumlah ?? 0,
    paidCount: paid._count,
  }
}

/**
 * Get combined summary stats for a santri
 * Combines tagihan and transaksi summaries
 */
export async function getCombinedSummary(santriId: string, saldoUangSaku: number) {
  const [tagihanSummary, transaksiSummary] = await Promise.all([
    getTagihanSummary(santriId),
    getTransaksiSummary(santriId),
  ])
  
  return {
    totalUnpaid: tagihanSummary.totalUnpaid + transaksiSummary.totalUnpaid,
    unpaidCount: tagihanSummary.unpaidCount + transaksiSummary.unpaidCount,
    totalPaid: tagihanSummary.totalPaid + transaksiSummary.totalPaid,
    paidCount: tagihanSummary.paidCount + transaksiSummary.paidCount,
    uangSakuBalance: saldoUangSaku,
  }
}