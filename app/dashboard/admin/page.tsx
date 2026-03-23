"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  FileText,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useEffect, useState } from "react"

// Types for financial data
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

interface TransaksiByJenisSantri {
  jenisSantri: string
  total: number
  jumlah: number
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

// Format currency to IDR
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
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

// Get status badge variant
function getStatusBadge(status: string) {
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

// Get jenis santri label
function getJenisSantriLabel(jenis: string): string {
  const labels: Record<string, string> = {
    SMK: 'SMK',
    SMP: 'SMP',
    PONDOK: 'Pondok'
  }
  return labels[jenis] || jenis
}

// Month names in Indonesian
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Helper function to get month name from index
function getMonthName(monthIndex: number): string {
  return MONTHS[monthIndex]
}

// Helper function to filter transaksi by period (using bulan and tahun fields)
function isTransaksiInPeriod(transaksi: RecentTransaksi, monthIndex: number, year: number): boolean {
  // If bulan and tahun are set, use them for filtering
  if (transaksi.bulan && transaksi.tahun) {
    const monthName = getMonthName(monthIndex)
    return transaksi.bulan === monthName && transaksi.tahun === year
  }
  // Fallback to createdAt if bulan/tahun not set
  const date = new Date(transaksi.createdAt)
  return date.getMonth() === monthIndex && date.getFullYear() === year
}

export default function AdminPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [byJenis, setByJenis] = useState<TransaksiByJenis[]>([])
  const [byStatus, setByStatus] = useState<TransaksiByStatus[]>([])
  const [byJenisSantri, setByJenisSantri] = useState<TransaksiByJenisSantri[]>([])
  const [recentTransaksi, setRecentTransaksi] = useState<RecentTransaksi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Period selection state
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const now = new Date()
    return now.getMonth()
  })
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const now = new Date()
    return now.getFullYear()
  })
  const [tempMonth, setTempMonth] = useState<number>(selectedMonth)
  const [tempYear, setTempYear] = useState<number>(selectedYear)

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const handleApplyPeriod = () => {
    setSelectedMonth(tempMonth)
    setSelectedYear(tempYear)
    setIsPeriodDialogOpen(false)
  }

  const handleOpenDialog = () => {
    setTempMonth(selectedMonth)
    setTempYear(selectedYear)
    setIsPeriodDialogOpen(true)
  }

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        setLoading(true)
        
        // Fetch all transaksi for analysis
        const response = await fetch('/api/transaksi?limit=1000')
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const data = await response.json()
        const transaksi = data.items || []
        
        // Calculate summary based on selected period
        const lunasTransaksi = transaksi.filter((t: RecentTransaksi) => t.status === 'LUNAS')
        const pendingTransaksi = transaksi.filter((t: RecentTransaksi) => t.status === 'PENDING')
        const belumBayarTransaksi = transaksi.filter((t: RecentTransaksi) => t.status === 'BELUM_BAYAR')
        
        const totalPemasukan = lunasTransaksi.reduce((sum: number, t: RecentTransaksi) => sum + t.jumlah, 0)
        const totalPending = pendingTransaksi.reduce((sum: number, t: RecentTransaksi) => sum + t.jumlah, 0)
        const totalBelumBayar = belumBayarTransaksi.reduce((sum: number, t: RecentTransaksi) => sum + t.jumlah, 0)
        
        // Transaksi bulan yang dipilih (using bulan and tahun fields)
        const transaksiBulanIni = transaksi.filter((t: RecentTransaksi) =>
          isTransaksiInPeriod(t, selectedMonth, selectedYear)
        )
        const pemasukanBulanIni = transaksiBulanIni
          .filter((t: RecentTransaksi) => t.status === 'LUNAS')
          .reduce((sum: number, t: RecentTransaksi) => sum + t.jumlah, 0)
        
        // Calculate growth (comparing with previous month)
        const lastMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
        const lastMonthYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear
        const transaksiBulanLalu = transaksi.filter((t: RecentTransaksi) =>
          isTransaksiInPeriod(t, lastMonth, lastMonthYear)
        )
        const pemasukanBulanLalu = transaksiBulanLalu
          .filter((t: RecentTransaksi) => t.status === 'LUNAS')
          .reduce((sum: number, t: RecentTransaksi) => sum + t.jumlah, 0)
        
        const pertumbuhan = pemasukanBulanLalu === 0
          ? 100
          : ((pemasukanBulanIni - pemasukanBulanLalu) / pemasukanBulanLalu) * 100
        
        setSummary({
          totalPemasukan,
          totalPending,
          totalBelumBayar,
          transaksiBulanIni: pemasukanBulanIni,
          pertumbuhan
        })
        
        // Calculate by jenis (filtered by selected period using bulan and tahun fields)
        const periodTransaksi = transaksi.filter((t: RecentTransaksi) =>
          isTransaksiInPeriod(t, selectedMonth, selectedYear)
        )
        
        const jenisCount: Record<string, { total: number; jumlah: number }> = {}
        periodTransaksi.forEach((t: RecentTransaksi) => {
          if (!jenisCount[t.jenis]) {
            jenisCount[t.jenis] = { total: 0, jumlah: 0 }
          }
          jenisCount[t.jenis].total++
          jenisCount[t.jenis].jumlah += t.jumlah
        })
        
        const totalAll = Object.values(jenisCount).reduce((sum, j) => sum + j.total, 0)
        const byJenisData = Object.entries(jenisCount)
          .map(([jenis, data]) => ({
            jenis,
            total: data.total,
            jumlah: data.jumlah,
            percentage: totalAll > 0 ? (data.total / totalAll) * 100 : 0
          }))
          .sort((a, b) => b.jumlah - a.jumlah)
        
        setByJenis(byJenisData)
        
        // Calculate by status (filtered by selected period)
        const statusCount: Record<string, number> = {}
        periodTransaksi.forEach((t: RecentTransaksi) => {
          statusCount[t.status] = (statusCount[t.status] || 0) + 1
        })
        
        const byStatusData = Object.entries(statusCount).map(([status, total]) => ({
          status,
          total,
          percentage: periodTransaksi.length > 0 ? (total / periodTransaksi.length) * 100 : 0
        }))
        
        setByStatus(byStatusData)
        
        // Get recent transactions (last 5 from selected period)
        const recent = periodTransaksi
          .sort((a: RecentTransaksi, b: RecentTransaksi) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
        
        setRecentTransaksi(recent)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }
    
    fetchFinancialData()
  }, [selectedMonth, selectedYear])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Ringkasan dan analisis keuangan keseluruhan
            <span className="ml-2 text-primary font-medium">
              • {MONTHS[selectedMonth]} {selectedYear}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" onClick={handleOpenDialog}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Pilih Periode
                  </Button>
                }
              />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pilih Periode</DialogTitle>
                <DialogDescription>
                  Pilih bulan dan tahun untuk melihat laporan keuangan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bulan</label>
                    <select
                      value={tempMonth}
                      onChange={(e) => setTempMonth(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tahun</label>
                    <select
                      value={tempYear}
                      onChange={(e) => setTempYear(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleApplyPeriod}>
                  Terapkan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalPemasukan || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari transaksi yang sudah lunas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
            {summary && summary.pertumbuhan >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.transaksiBulanIni || 0)}
            </div>
            <div className="flex items-center text-xs mt-1">
              {summary && summary.pertumbuhan >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{summary.pertumbuhan.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{summary?.pertumbuhan.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(summary?.totalPending || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu konfirmasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary?.totalBelumBayar || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tagihan yang belum dibayar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction by Type */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Transaksi per Jenis
            </CardTitle>
            <CardDescription>Distribusi transaksi berdasarkan jenis pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {byJenis.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data transaksi
                </div>
              ) : (
                byJenis.map((item) => (
                  <div key={item.jenis} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{getJenisLabel(item.jenis)}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.total} transaksi
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right min-w-[120px]">
                      <span className="text-sm font-semibold">
                        {formatCurrency(item.jumlah)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Status Transaksi
            </CardTitle>
            <CardDescription>Distribusi berdasarkan status pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {byStatus.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada data transaksi
                </div>
              ) : (
                byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.status === 'LUNAS' && (
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      )}
                      {item.status === 'PENDING' && (
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      )}
                      {item.status === 'BELUM_BAYAR' && (
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      )}
                      {item.status === 'DITOLAK' && (
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                      )}
                      <span className="text-sm">{item.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.total}</span>
                      <span className="text-xs text-muted-foreground">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Visual pie representation */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {byStatus.reduce((acc: { offset: number; elements: React.ReactElement[] }, item, index) => {
                    const colors: Record<string, string> = {
                      LUNAS: '#22c55e',
                      PENDING: '#eab308',
                      BELUM_BAYAR: '#ef4444',
                      DITOLAK: '#6b7280'
                    }
                    const percentage = item.percentage
                    const strokeDasharray = `${percentage} ${100 - percentage}`
                    const strokeDashoffset = -acc.offset
                    acc.elements.push(
                      <circle
                        key={item.status}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="transparent"
                        stroke={colors[item.status] || '#ccc'}
                        strokeWidth="3"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    )
                    acc.offset += percentage
                    return acc
                  }, { offset: 0, elements: [] }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {byStatus.reduce((sum, item) => sum + item.total, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transaksi Terbaru
              </CardTitle>
              <CardDescription>5 transaksi terakhir</CardDescription>
            </div>
            <a href="/dashboard/admin/transaksi">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransaksi.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data transaksi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Kode</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Santri</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Jenis</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Jumlah</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransaksi.map((transaksi) => (
                    <tr key={transaksi.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <span className="font-mono text-sm">{transaksi.kode}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-sm">{transaksi.santri.nama}</div>
                          <div className="text-xs text-muted-foreground">{transaksi.santri.nis}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm">{getJenisLabel(transaksi.jenis)}</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-medium">{formatCurrency(transaksi.jumlah)}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {getStatusBadge(transaksi.status)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(transaksi.tanggalBayar || transaksi.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/admin/laporan-keuangan'}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Laporan Lengkap</h3>
              <p className="text-sm text-muted-foreground">Lihat laporan keuangan detail</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/admin/transaksi'}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Kelola Transaksi</h3>
              <p className="text-sm text-muted-foreground">Kelola semua transaksi</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard/admin/tagihan-management'}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Kelola Tagihan</h3>
              <p className="text-sm text-muted-foreground">Atur tagihan santri</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
