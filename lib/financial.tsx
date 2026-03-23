import { Badge } from "@/components/ui/badge"

// Types for financial data
export interface FinancialSummary {
  totalPemasukan: number
  totalPending: number
  totalBelumBayar: number
  transaksiBulanIni: number
  pertumbuhan: number
}

export interface TransaksiByJenis {
  jenis: string
  total: number
  jumlah: number
  percentage: number
}

export interface TransaksiByStatus {
  status: string
  total: number
  percentage: number
}

export interface TransaksiByJenisSantri {
  jenisSantri: string
  total: number
  jumlah: number
}

export interface RecentTransaksi {
  id: string
  kode: string
  jenis: string
  jumlah: number
  status: string
  bulan: string | null
  tahun: number | null
  santri: {
    nama: string
    nis: string
  }
  tanggalBayar: string | null
  createdAt: string
}

// Month names in Indonesian
export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Format currency to IDR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

// Get status badge variant
export function getStatusBadge(status: string) {
  switch (status) {
    case 'LUNAS':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
    case 'PENDING':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case 'BELUM_BAYAR':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Belum Bayar</Badge>
    case 'DITOLAK':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Ditolak</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

// Get jenis transaksi label
export function getJenisLabel(jenis: string): string {
  const labels: Record<string, string> = {
    SPP: 'SPP',
    SYAHRIAH: 'Syahriah',
    UANG_SAKU: 'Uang Saku',
    LAUNDRY: 'Laundry',
    UJIAN: 'Ujian',
    PKL: 'PKL',
    LKS: 'LKS',
    BUKU_PENDAMPING: 'Buku Pendamping',
    TKA: 'TKA'
  }
  return labels[jenis] || jenis
}

// Get jenis santri label
export function getJenisSantriLabel(jenis: string): string {
  const labels: Record<string, string> = {
    SMK: 'SMK',
    SMP: 'SMP',
    PONDOK: 'Pondok'
  }
  return labels[jenis] || jenis
}

// Helper function to get month name from index
export function getMonthName(monthIndex: number): string {
  return MONTHS[monthIndex]
}

// Helper function to filter transaksi by period (using bulan and tahun fields)
export function isTransaksiInPeriod(transaksi: RecentTransaksi, monthIndex: number, year: number): boolean {
  // If bulan and tahun are set, use them for filtering
  if (transaksi.bulan && transaksi.tahun) {
    const monthName = getMonthName(monthIndex)
    return transaksi.bulan === monthName && transaksi.tahun === year
  }
  // Fallback to createdAt if bulan/tahun not set
  const date = new Date(transaksi.createdAt)
  return date.getMonth() === monthIndex && date.getFullYear() === year
}
