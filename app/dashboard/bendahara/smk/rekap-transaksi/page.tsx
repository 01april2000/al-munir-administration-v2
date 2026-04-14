"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { FileBarChart, Download, Filter } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingState, ErrorState } from "@/components/admin/admin-loading-error"

interface TransaksiRekap {
  id: string
  kode: string
  santriNama: string
  santriNis: string
  kelas: string
  jenis: string
  jumlah: number
  status: string
  tanggalBayar: string | null
  metodePembayaran: string | null
  createdAt: string
}

interface RekapSummary {
  totalTransaksi: number
  totalLunas: number
  totalPending: number
  totalBelumBayar: number
  totalDitolak: number
  totalNominal: number
  nominalLunas: number
  nominalPending: number
  nominalBelumBayar: number
}

// SMK-specific kelas options
const KELAS_SMK_OPTIONS = [
  { value: "", label: "Semua Kelas" },
  { value: "X_RPL_A", label: "Kelas X RPL A" },
  { value: "X_RPL_B", label: "Kelas X RPL B" },
  { value: "X_AKL", label: "Kelas X AKL" },
  { value: "XI_RPL_A", label: "Kelas XI RPL A" },
  { value: "XI_RPL_B", label: "Kelas XI RPL B" },
  { value: "XI_AKL", label: "Kelas XI AKL" },
  { value: "XII_RPL_A", label: "Kelas XII RPL A" },
  { value: "XII_RPL_B", label: "Kelas XII RPL B" },
  { value: "XII_AKL", label: "Kelas XII AKL" },
]

// SMK-specific jenis transaksi options
const JENIS_TRANSAKSI_SMK_OPTIONS = [
  { value: "", label: "Semua Jenis" },
  { value: "SPP", label: "SPP" },
  { value: "SYAHRIAH", label: "Syahriah" },
  { value: "UJIAN", label: "Ujian" },
  { value: "PKL", label: "PKL" },
  { value: "LKS", label: "LKS" },
]

const STATUS_COLORS: Record<string, string> = {
  LUNAS: "bg-green-500",
  PENDING: "bg-yellow-500",
  BELUM_BAYAR: "bg-red-500",
  DITOLAK: "bg-gray-500",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function RekapTransaksiSMKContent() {
  const searchParams = useSearchParams()
  const kelasParam = searchParams.get("kelas") || ""

  const [selectedKelas, setSelectedKelas] = React.useState(kelasParam)
  const [selectedJenis, setSelectedJenis] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [transaksi, setTransaksi] = React.useState<TransaksiRekap[]>([])
  const [summary, setSummary] = React.useState<RekapSummary | null>(null)

  React.useEffect(() => {
    setSelectedKelas(kelasParam)
  }, [kelasParam])

  const fetchRekap = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (selectedKelas) params.append("kelas", selectedKelas)
      if (selectedJenis) params.append("jenis", selectedJenis)
      if (selectedStatus) params.append("status", selectedStatus)
      params.append("limit", "1000")

      // API auto-filters by BENDAHARA_SMK role -> SMK transactions only
      const response = await fetch(`/api/transaksi?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi")
      }

      const data = await response.json()

      // Transform data for rekap
      const transformedData: TransaksiRekap[] = (data.items || []).map((t: any) => ({
        id: t.id,
        kode: t.kode,
        santriNama: t.santri?.nama || "-",
        santriNis: t.santri?.nis || "-",
        kelas: t.santri?.kelas || "-",
        jenis: t.jenis,
        jumlah: t.jumlah,
        status: t.status,
        tanggalBayar: t.tanggalBayar,
        metodePembayaran: t.metodePembayaran,
        createdAt: t.createdAt,
      }))

      setTransaksi(transformedData)

      // Calculate summary
      const totalNominal = transformedData.reduce((sum, t) => sum + t.jumlah, 0)
      const lunasData = transformedData.filter((t) => t.status === "LUNAS")
      const pendingData = transformedData.filter((t) => t.status === "PENDING")
      const belumBayarData = transformedData.filter((t) => t.status === "BELUM_BAYAR")
      const ditolakData = transformedData.filter((t) => t.status === "DITOLAK")

      setSummary({
        totalTransaksi: transformedData.length,
        totalLunas: lunasData.length,
        totalPending: pendingData.length,
        totalBelumBayar: belumBayarData.length,
        totalDitolak: ditolakData.length,
        totalNominal,
        nominalLunas: lunasData.reduce((sum, t) => sum + t.jumlah, 0),
        nominalPending: pendingData.reduce((sum, t) => sum + t.jumlah, 0),
        nominalBelumBayar: belumBayarData.reduce((sum, t) => sum + t.jumlah, 0),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }, [selectedKelas, selectedJenis, selectedStatus])

  React.useEffect(() => {
    fetchRekap()
  }, [fetchRekap])

  const handleExport = () => {
    const headers = [
      "No",
      "Kode",
      "NIS",
      "Nama",
      "Kelas",
      "Jenis",
      "Jumlah",
      "Status",
      "Tanggal Bayar",
      "Metode Pembayaran",
      "Tanggal Dibuat",
    ]
    const rows = transaksi.map((t, index) => [
      index + 1,
      t.kode,
      t.santriNis,
      t.santriNama,
      t.kelas,
      t.jenis,
      t.jumlah,
      t.status,
      t.tanggalBayar ? formatDate(t.tanggalBayar) : "-",
      t.metodePembayaran || "-",
      formatDate(t.createdAt),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `rekap-transaksi-smk-${selectedKelas || "semua"}-${new Date().toISOString().split("T")[0]}.csv`
    )
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTitle = () => {
    if (!selectedKelas) return "Rekap Semua Transaksi SMK"
    const kelasLabel = KELAS_SMK_OPTIONS.find((k) => k.value === selectedKelas)?.label || selectedKelas
    return `Rekap Transaksi SMK - ${kelasLabel}`
  }

  const handleKelasChange = (value: string | null) => {
    setSelectedKelas(!value || value === "all" ? "" : value)
  }

  const handleJenisChange = (value: string | null) => {
    setSelectedJenis(!value || value === "all" ? "" : value)
  }

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(!value || value === "all" ? "" : value)
  }

  if (loading) {
    return <LoadingState message="Memuat rekap transaksi SMK..." />
  }

  if (error && !transaksi.length) {
    return <ErrorState error={error} onRetry={fetchRekap} />
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
          <p className="text-muted-foreground">
            Rekap semua transaksi SMK berdasarkan filter yang dipilih
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalTransaksi}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(summary.totalNominal)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lunas</CardTitle>
              <Badge className="bg-green-500">Lunas</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.totalLunas}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(summary.nominalLunas)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Badge className="bg-yellow-500">Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.totalPending}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(summary.nominalPending)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
              <Badge className="bg-red-500">Belum Bayar</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.totalBelumBayar}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(summary.nominalBelumBayar)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <Badge className="bg-gray-500">Ditolak</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{summary.totalDitolak}</div>
              <p className="text-xs text-muted-foreground">Transaksi ditolak</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-[200px]">
              <label className="text-sm font-medium mb-2 block">Kelas</label>
              <Select value={selectedKelas || "all"} onValueChange={handleKelasChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {KELAS_SMK_OPTIONS.map((option) => (
                    <SelectItem key={option.value || "all"} value={option.value || "all"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <label className="text-sm font-medium mb-2 block">Jenis Transaksi</label>
              <Select value={selectedJenis || "all"} onValueChange={handleJenisChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_TRANSAKSI_SMK_OPTIONS.map((option) => (
                    <SelectItem key={option.value || "all"} value={option.value || "all"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus || "all"} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="LUNAS">Lunas</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="BELUM_BAYAR">Belum Bayar</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && <ErrorState error={error} onRetry={fetchRekap} />}

      {/* Transaction Table */}
      {!error && transaksi.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi SMK</CardTitle>
            <CardDescription>Menampilkan {transaksi.length} transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Metode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaksi.map((t, index) => (
                    <TableRow key={t.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{t.kode}</TableCell>
                      <TableCell>{t.santriNis}</TableCell>
                      <TableCell>{t.santriNama}</TableCell>
                      <TableCell>{t.kelas}</TableCell>
                      <TableCell>{t.jenis}</TableCell>
                      <TableCell className="text-right">{formatCurrency(t.jumlah)}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[t.status]}>{t.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(t.tanggalBayar)}</TableCell>
                      <TableCell>{t.metodePembayaran || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!error && transaksi.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileBarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Tidak ada transaksi</h3>
            <p className="text-muted-foreground text-center">
              Tidak ada transaksi SMK yang ditemukan dengan filter yang dipilih.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function RekapTransaksiSMKPage() {
  return (
    <Suspense fallback={<LoadingState message="Memuat rekap transaksi SMK..." />}>
      <RekapTransaksiSMKContent />
    </Suspense>
  )
}
