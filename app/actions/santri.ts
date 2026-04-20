"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { JenisSantri } from "@/lib/generated/prisma"
import type {
  ProcessedSantriData,
  TransactionData,
  TransactionItem,
  SantriInfo,
  SummaryStats,
  PaginatedResult,
  PaginatedProcessedData,
} from "@/lib/types/santri"
import {
  getTransactionConfig,
  getMonthName,
  formatCurrency,
  formatDate
} from "@/lib/santri-helpers"
import { getCombinedSummary } from "@/lib/santri-aggregation"

// Pagination constants
const DEFAULT_PAGE_SIZE = 20
const TAGIHAN_PAGE_SIZE = 30
const TRANSAKSI_PAGE_SIZE = 50

// Raw data types from Prisma
interface RawTagihan {
  id: string
  jenis: string
  bulan: string
  tahun: number
  jumlah: number
  status: string
  createdAt: Date
  transaksi?: {
    id: string
    kode: string
    status: string
    tanggalBayar: Date | null
    jumlah: number
  } | null
}

interface RawTransaksi {
  id: string
  jenis: string
  jumlah: number
  status: string
  statusUangSaku?: string | null
  keterangan?: string | null
  jenisLaundry?: string | null
  tanggalBayar?: Date | null
  createdAt: Date
  tagihan?: { id: string }[] // To check if this transaksi is linked to tagihan
}

// Paginated fetch for tagihan
async function getTagihan(
  santriId: string,
  cursor?: string,
  limit: number = TAGIHAN_PAGE_SIZE
): Promise<PaginatedResult<RawTagihan>> {
  const items = await prisma.tagihan.findMany({
    where: { santriId },
    take: limit + 1, // Take one extra to determine if there's a next page
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      transaksi: {
        select: {
          id: true,
          kode: true,
          status: true,
          tanggalBayar: true,
          jumlah: true,
        },
      },
    },
    orderBy: [
      { tahun: "desc" },
      { bulan: "desc" },
      { createdAt: "desc" },
    ],
  })

  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, -1) : items
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    data: data as RawTagihan[],
    nextCursor,
    hasMore,
  }
}

// Paginated fetch for transaksi
async function getTransaksi(
  santriId: string,
  cursor?: string,
  limit: number = TRANSAKSI_PAGE_SIZE
): Promise<PaginatedResult<RawTransaksi>> {
  const items = await prisma.transaksi.findMany({
    where: { santriId },
    take: limit + 1, // Take one extra to determine if there's a next page
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      santri: {
        select: {
          id: true,
          nis: true,
          nama: true,
          kelas: true,
          asrama: true,
          jenisSantri: true,
        },
      },
      tagihan: {
        select: { id: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, -1) : items
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    data: data as RawTransaksi[],
    nextCursor,
    hasMore,
  }
}

// Non-paginated versions for initial load (with limit)
async function getTagihanInitial(santriId: string): Promise<RawTagihan[]> {
  return prisma.tagihan.findMany({
    where: { santriId },
    take: TAGIHAN_PAGE_SIZE,
    include: {
      transaksi: {
        select: {
          id: true,
          kode: true,
          status: true,
          tanggalBayar: true,
          jumlah: true,
        },
      },
    },
    orderBy: [
      { tahun: "desc" },
      { bulan: "desc" },
      { createdAt: "desc" },
    ],
  }) as Promise<RawTagihan[]>
}

async function getTransaksiInitial(santriId: string): Promise<RawTransaksi[]> {
  return prisma.transaksi.findMany({
    where: { santriId },
    take: TRANSAKSI_PAGE_SIZE,
    include: {
      santri: {
        select: {
          id: true,
          nis: true,
          nama: true,
          kelas: true,
          asrama: true,
          jenisSantri: true,
        },
      },
      tagihan: {
        select: { id: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  }) as Promise<RawTransaksi[]>
}

async function getAuthenticatedSantri(expectedJenisSantri: JenisSantri) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id
  const santri = await prisma.santri.findUnique({
    where: { userId },
    select: {
      id: true,
      nama: true,
      saldoTagihan: true,
      saldoUangSaku: true,
      jenisSantri: true,
      nis: true,
      kelas: true,
      asrama: true,
      user: {
        select: {
          email: true,
          image: true,
        },
      },
    },
  })

  if (!santri) {
    redirect("/auth")
  }

  if (santri.jenisSantri !== expectedJenisSantri) {
    redirect("/auth")
  }

  return santri
}

// Process data on the server (display items only, stats via aggregation)
function processSantriData(
  tagihan: RawTagihan[],
  transaksi: RawTransaksi[],
  santri: SantriInfo,
  role: "smk" | "smp" | "pondok",
  summaryStats: SummaryStats // Now passed from aggregation
): ProcessedSantriData {
  const transactionConfig = getTransactionConfig(role)
  const colorClasses = {
    blue: "blue",
    green: "green",
    yellow: "yellow",
    purple: "purple",
    red: "red",
    indigo: "indigo",
    orange: "orange",
  } as const

  const processedTransactionsMap: Record<string, TransactionData> = {}

  // Helper to add or merge items
  const addTransactionItems = (
    type: string, 
    config: { title: string; color: keyof typeof colorClasses }, 
    newItems: TransactionItem[]
  ) => {
    if (processedTransactionsMap[type]) {
      processedTransactionsMap[type].items.push(...newItems)
    } else {
      processedTransactionsMap[type] = {
        type,
        title: config.title,
        color: config.color,
        items: newItems,
      }
    }
  }

  // Process tagihan
  const tagihanByType: Record<string, RawTagihan[]> = {}
  tagihan.forEach((t) => {
    const type = t.jenis.toLowerCase().replace("_", "-")
    if (!tagihanByType[type]) tagihanByType[type] = []
    tagihanByType[type].push(t)
  })

  Object.entries(tagihanByType).forEach(([type, items]) => {
    const config = transactionConfig[type]
    if (!config) return

    // Process items for display only (stats calculated via aggregation)
    const processedItems: TransactionItem[] = items.map((t) => {
      return {
        label: `${getMonthName(t.bulan)} ${t.tahun}`,
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu",
        date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
        tagihanId: t.id,
        rawAmount: t.jumlah,
      }
    })

    addTransactionItems(type, config, processedItems)
  })

  // Process transaksi (skip SPP and SYAHRIAH as they're handled via tagihan)
  // Also skip transaksi that are linked to tagihan to avoid duplicates
  const transaksiByType: Record<string, RawTransaksi[]> = {}
  transaksi.forEach((t) => {
    const type = t.jenis.toLowerCase().replace("_", "-")
    // Skip SPP and SYAHRIAH as they're handled via tagihan
    if (type === "spp" || type === "syahriah") return
    // Skip transaksi that are linked to tagihan (to avoid duplicates with tagihan display)
    if (t.tagihan && t.tagihan.length > 0) return
    if (!transaksiByType[type]) transaksiByType[type] = []
    transaksiByType[type].push(t)
  })

  Object.entries(transaksiByType).forEach(([type, items]) => {
    const config = transactionConfig[type]
    if (!config) return

    if (type === "uang-saku") {
      // Process uang saku items for display (balance from aggregation)
      const chronologicalItems = [...items].reverse().map((t) => {
        const isIncoming = t.statusUangSaku === "DITAMBAH"
        return {
          label: t.keterangan || (isIncoming ? "Top-up Uang Saku" : "Pengambilan Uang Saku"),
          amount: formatCurrency(t.jumlah),
          status: (isIncoming ? "in" : "out") as "in" | "out",
          date: formatDate(t.createdAt),
          transaksiId: t.id,
          rawAmount: t.jumlah,
        }
      })
      const uangSakuItems = chronologicalItems.reverse()
      addTransactionItems(type, config, uangSakuItems)
    } else {
      // Process items for display only (stats calculated via aggregation)
      const processedItems: TransactionItem[] = items.map((t) => {
        return {
          label: t.keterangan || t.jenisLaundry || type,
          amount: formatCurrency(t.jumlah),
          status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
          date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
          transaksiId: t.id,
          rawAmount: t.jumlah,
        }
      })
      addTransactionItems(type, config, processedItems)
    }
  })

  // Convert map to array
  const processedTransactions = Object.values(processedTransactionsMap)

  // Filter for tagihan (unpaid bills only)
  const tagihanOnly = processedTransactions
    .filter(t => t.type !== "uang-saku")
    .map(t => ({
      ...t,
      items: t.items.filter(item => item.status === "Belum Lunas" || item.status === "Menunggu")
    }))
    .filter(t => t.items.length > 0)

  // Filter for aktivitas (payment history - paid items and uang saku)
  const aktivitasOnly = processedTransactions
    .map(t => ({
      ...t,
      items: t.type === "uang-saku"
        ? t.items
        : t.items.filter(item => item.status === "Lunas")
    }))
    .filter(t => t.items.length > 0)

  const santriName = santri?.nama || "Santri"
  const santriInitials = santriName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  return {
    summaryStats,
    tagihanOnly,
    aktivitasOnly,
    processedTransactions,
    santri,
    santriName,
    santriInitials,
  }
}

// Export processed data functions (initial load with limit)
export async function getSmkData(): Promise<ProcessedSantriData> {
  const santri = await getAuthenticatedSantri(JenisSantri.SMK)

  // Fetch data and aggregate stats in parallel (with initial limit)
  const [tagihan, transaksi, summaryStats] = await Promise.all([
    getTagihanInitial(santri.id),
    getTransaksiInitial(santri.id),
    getCombinedSummary(santri.id, santri.saldoUangSaku, santri.saldoTagihan),
  ])

  const santriInfo: SantriInfo = {
    id: santri.id,
    nama: santri.nama,
    nis: santri.nis || "",
    kelas: santri.kelas || "",
    saldoTagihan: santri.saldoTagihan,
    saldoUangSaku: santri.saldoUangSaku,
    foto: santri.user?.image,
    email: santri.user?.email,
    telepon: null,
    alamat: santri.asrama,
  }

  return processSantriData(tagihan, transaksi, santriInfo, "smk", summaryStats)
}

export async function getSmpData(): Promise<ProcessedSantriData> {
  const santri = await getAuthenticatedSantri(JenisSantri.SMP)

  // Fetch data and aggregate stats in parallel (with initial limit)
  const [tagihan, transaksi, summaryStats] = await Promise.all([
    getTagihanInitial(santri.id),
    getTransaksiInitial(santri.id),
    getCombinedSummary(santri.id, santri.saldoUangSaku, santri.saldoTagihan),
  ])

  const santriInfo: SantriInfo = {
    id: santri.id,
    nama: santri.nama,
    nis: santri.nis || "",
    kelas: santri.kelas || "",
    saldoTagihan: santri.saldoTagihan,
    saldoUangSaku: santri.saldoUangSaku,
    foto: santri.user?.image,
    email: santri.user?.email,
    telepon: null,
    alamat: santri.asrama,
  }

  return processSantriData(tagihan, transaksi, santriInfo, "smp", summaryStats)
}

export async function getPondokData(): Promise<ProcessedSantriData> {
  const santri = await getAuthenticatedSantri(JenisSantri.PONDOK)

  // Fetch data and aggregate stats in parallel (with initial limit)
  const [tagihan, transaksi, summaryStats] = await Promise.all([
    getTagihanInitial(santri.id),
    getTransaksiInitial(santri.id),
    getCombinedSummary(santri.id, santri.saldoUangSaku, santri.saldoTagihan),
  ])

  const santriInfo: SantriInfo = {
    id: santri.id,
    nama: santri.nama,
    nis: santri.nis || "",
    kelas: santri.kelas || "",
    saldoTagihan: santri.saldoTagihan,
    saldoUangSaku: santri.saldoUangSaku,
    foto: santri.user?.image,
    email: santri.user?.email,
    telepon: null,
    alamat: santri.asrama,
  }

  return processSantriData(tagihan, transaksi, santriInfo, "pondok", summaryStats)
}

// Paginated data fetching for infinite scroll
export async function getSmkDataPaginated(
  cursorTagihan?: string,
  cursorTransaksi?: string
): Promise<PaginatedProcessedData> {
  const santri = await getAuthenticatedSantri(JenisSantri.SMK)

  const [tagihanResult, transaksiResult] = await Promise.all([
    getTagihan(santri.id, cursorTagihan),
    getTransaksi(santri.id, cursorTransaksi),
  ])

  const processedTagihan = processTagihanOnly(tagihanResult.data, "smk")
  const processedAktivitas = processAktivitasOnly(transaksiResult.data, "smk")

  return {
    tagihanOnly: processedTagihan,
    aktivitasOnly: processedAktivitas,
    nextCursorTagihan: tagihanResult.nextCursor,
    nextCursorTransaksi: transaksiResult.nextCursor,
    hasMoreTagihan: tagihanResult.hasMore,
    hasMoreTransaksi: transaksiResult.hasMore,
  }
}

export async function getSmpDataPaginated(
  cursorTagihan?: string,
  cursorTransaksi?: string
): Promise<PaginatedProcessedData> {
  const santri = await getAuthenticatedSantri(JenisSantri.SMP)

  const [tagihanResult, transaksiResult] = await Promise.all([
    getTagihan(santri.id, cursorTagihan),
    getTransaksi(santri.id, cursorTransaksi),
  ])

  const processedTagihan = processTagihanOnly(tagihanResult.data, "smp")
  const processedAktivitas = processAktivitasOnly(transaksiResult.data, "smp")

  return {
    tagihanOnly: processedTagihan,
    aktivitasOnly: processedAktivitas,
    nextCursorTagihan: tagihanResult.nextCursor,
    nextCursorTransaksi: transaksiResult.nextCursor,
    hasMoreTagihan: tagihanResult.hasMore,
    hasMoreTransaksi: transaksiResult.hasMore,
  }
}

export async function getPondokDataPaginated(
  cursorTagihan?: string,
  cursorTransaksi?: string
): Promise<PaginatedProcessedData> {
  const santri = await getAuthenticatedSantri(JenisSantri.PONDOK)

  const [tagihanResult, transaksiResult] = await Promise.all([
    getTagihan(santri.id, cursorTagihan),
    getTransaksi(santri.id, cursorTransaksi),
  ])

  const processedTagihan = processTagihanOnly(tagihanResult.data, "pondok")
  const processedAktivitas = processAktivitasOnly(transaksiResult.data, "pondok")

  return {
    tagihanOnly: processedTagihan,
    aktivitasOnly: processedAktivitas,
    nextCursorTagihan: tagihanResult.nextCursor,
    nextCursorTransaksi: transaksiResult.nextCursor,
    hasMoreTagihan: tagihanResult.hasMore,
    hasMoreTransaksi: transaksiResult.hasMore,
  }
}

// Helper functions to process only tagihan or aktivitas
function processTagihanOnly(
  tagihan: RawTagihan[],
  role: "smk" | "smp" | "pondok"
): TransactionData[] {
  const transactionConfig = getTransactionConfig(role)
  const colorClasses = {
    blue: "blue",
    green: "green",
    yellow: "yellow",
    purple: "purple",
    red: "red",
    indigo: "indigo",
    orange: "orange",
  } as const

  const processedTransactionsMap: Record<string, TransactionData> = {}

  // Process tagihan
  const tagihanByType: Record<string, RawTagihan[]> = {}
  tagihan.forEach((t) => {
    const type = t.jenis.toLowerCase().replace("_", "-")
    if (!tagihanByType[type]) tagihanByType[type] = []
    tagihanByType[type].push(t)
  })

  Object.entries(tagihanByType).forEach(([type, items]) => {
    const config = transactionConfig[type]
    if (!config) return

    const processedItems: TransactionItem[] = items.map((t) => {
      return {
        label: `${getMonthName(t.bulan)} ${t.tahun}`,
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu",
        date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
        tagihanId: t.id,
        rawAmount: t.jumlah,
      }
    })

    if (processedTransactionsMap[type]) {
      processedTransactionsMap[type].items.push(...processedItems)
    } else {
      processedTransactionsMap[type] = {
        type,
        title: config.title,
        color: config.color,
        items: processedItems,
      }
    }
  })

  // Filter for unpaid bills only
  return Object.values(processedTransactionsMap)
    .filter(t => t.type !== "uang-saku")
    .map(t => ({
      ...t,
      items: t.items.filter(item => item.status === "Belum Lunas" || item.status === "Menunggu")
    }))
    .filter(t => t.items.length > 0)
}

function processAktivitasOnly(
  transaksi: RawTransaksi[],
  role: "smk" | "smp" | "pondok"
): TransactionData[] {
  const transactionConfig = getTransactionConfig(role)
  const colorClasses = {
    blue: "blue",
    green: "green",
    yellow: "yellow",
    purple: "purple",
    red: "red",
    indigo: "indigo",
    orange: "orange",
  } as const

  const processedTransactionsMap: Record<string, TransactionData> = {}

  // Process transaksi (skip SPP and SYAHRIAH as they're handled via tagihan)
  // Also skip transaksi that are linked to tagihan to avoid duplicates
  const transaksiByType: Record<string, RawTransaksi[]> = {}
  transaksi.forEach((t) => {
    const type = t.jenis.toLowerCase().replace("_", "-")
    // Skip SPP and SYAHRIAH as they're handled via tagihan
    if (type === "spp" || type === "syahriah") return
    // Skip transaksi that are linked to tagihan (to avoid duplicates with tagihan display)
    if (t.tagihan && t.tagihan.length > 0) return
    if (!transaksiByType[type]) transaksiByType[type] = []
    transaksiByType[type].push(t)
  })

  Object.entries(transaksiByType).forEach(([type, items]) => {
    const config = transactionConfig[type]
    if (!config) return

    if (type === "uang-saku") {
      const chronologicalItems = [...items].reverse().map((t) => {
        const isIncoming = t.statusUangSaku === "DITAMBAH"
        return {
          label: t.keterangan || (isIncoming ? "Top-up Uang Saku" : "Pengambilan Uang Saku"),
          amount: formatCurrency(t.jumlah),
          status: (isIncoming ? "in" : "out") as "in" | "out",
          date: formatDate(t.createdAt),
          transaksiId: t.id,
          rawAmount: t.jumlah,
        }
      })
      const uangSakuItems = chronologicalItems.reverse()
      
      if (processedTransactionsMap[type]) {
        processedTransactionsMap[type].items.push(...uangSakuItems)
      } else {
        processedTransactionsMap[type] = {
          type,
          title: config.title,
          color: config.color,
          items: uangSakuItems,
        }
      }
    } else {
      const processedItems: TransactionItem[] = items.map((t) => {
        return {
          label: t.keterangan || t.jenisLaundry || type,
          amount: formatCurrency(t.jumlah),
          status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
          date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
          transaksiId: t.id,
          rawAmount: t.jumlah,
        }
      })

      if (processedTransactionsMap[type]) {
        processedTransactionsMap[type].items.push(...processedItems)
      } else {
        processedTransactionsMap[type] = {
          type,
          title: config.title,
          color: config.color,
          items: processedItems,
        }
      }
    }
  })

  // Filter for paid items and uang saku
  return Object.values(processedTransactionsMap)
    .map(t => ({
      ...t,
      items: t.type === "uang-saku"
        ? t.items
        : t.items.filter(item => item.status === "Lunas")
    }))
    .filter(t => t.items.length > 0)
}
