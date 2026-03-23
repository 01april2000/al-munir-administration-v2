"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface FinancialSummary {
  totalPemasukan: number
  totalPending: number
  totalBelumBayar: number
  transaksiBulanIni: number
  pertumbuhan: number
}

interface TransaksiByJenis {
  jenis: string
  total: number
  jumlah: number
  percentage: number
}

interface TransaksiByStatus {
  status: string
  total: number
  percentage: number
}

interface RecentTransaksi {
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

interface ExportLaporanButtonProps {
  summary: FinancialSummary | null
  byJenis: TransaksiByJenis[]
  byStatus: TransaksiByStatus[]
  recentTransaksi: RecentTransaksi[]
  selectedMonth: number
  selectedYear: number
}

// Get jenis transaksi label
function getJenisLabel(jenis: string): string {
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

// Format date
function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

// Month names in Indonesian
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export function ExportLaporanButton({
  summary,
  byJenis,
  byStatus,
  recentTransaksi,
  selectedMonth,
  selectedYear
}: ExportLaporanButtonProps) {
  const handleExportReport = () => {
    // Create CSV content
    const period = `${MONTHS[selectedMonth]} ${selectedYear}`
    let csvContent = ''
    
    // Header
    csvContent += 'LAPORAN KEUANGAN\n'
    csvContent += `Periode: ${period}\n`
    csvContent += `Diekspor pada: ${new Date().toLocaleString('id-ID')}\n\n`
    
    // Summary Section
    csvContent += 'RINGKASAN KEUANGAN\n'
    csvContent += 'Keterangan,Jumlah\n'
    csvContent += `Total Pemasukan,${summary?.totalPemasukan || 0}\n`
    csvContent += `Pemasukan Bulan Ini (${period}),${summary?.transaksiBulanIni || 0}\n`
    csvContent += `Pertumbuhan,${summary?.pertumbuhan?.toFixed(2) || 0}%\n`
    csvContent += `Total Pending,${summary?.totalPending || 0}\n`
    csvContent += `Total Belum Bayar,${summary?.totalBelumBayar || 0}\n\n`
    
    // Transaction by Type Section
    csvContent += 'TRANSAKSI PER JENIS\n'
    csvContent += 'Jenis,Jumlah Transaksi,Total Nominal,Persentase\n'
    byJenis.forEach(item => {
      csvContent += `${getJenisLabel(item.jenis)},${item.total},${item.jumlah},${item.percentage.toFixed(2)}%\n`
    })
    csvContent += '\n'
    
    // Transaction by Status Section
    csvContent += 'TRANSAKSI PER STATUS\n'
    csvContent += 'Status,Jumlah,Persentase\n'
    byStatus.forEach(item => {
      csvContent += `${item.status.replace('_', ' ')},${item.total},${item.percentage.toFixed(2)}%\n`
    })
    csvContent += '\n'
    
    // Recent Transactions Section
    csvContent += 'TRANSAKSI TERBARU\n'
    csvContent += 'Kode,Santri,NIS,Jenis,Jumlah,Status,Tanggal\n'
    recentTransaksi.forEach(item => {
      csvContent += `${item.kode},"${item.santri.nama}",${item.santri.nis},${getJenisLabel(item.jenis)},${item.jumlah},${item.status},${formatDate(item.tanggalBayar || item.createdAt)}\n`
    })
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-keuangan-${MONTHS[selectedMonth].toLowerCase()}-${selectedYear}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExportReport}>
      <Download className="h-4 w-4 mr-2" />
      Export Laporan
    </Button>
  )
}
