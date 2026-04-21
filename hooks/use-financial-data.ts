import { useState, useEffect, useCallback } from "react"
import {
  isTransaksiInPeriod,
  type FinancialSummary,
  type TransaksiByJenis,
  type TransaksiByStatus,
  type RecentTransaksi
} from "@/lib/financial"

interface UseFinancialDataReturn {
  summary: FinancialSummary | null
  byJenis: TransaksiByJenis[]
  byStatus: TransaksiByStatus[]
  recentTransaksi: RecentTransaksi[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFinancialData(
  selectedMonth: number,
  selectedYear: number
): UseFinancialDataReturn {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [byJenis, setByJenis] = useState<TransaksiByJenis[]>([])
  const [byStatus, setByStatus] = useState<TransaksiByStatus[]>([])
  const [recentTransaksi, setRecentTransaksi] = useState<RecentTransaksi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all transaksi for analysis
      const response = await fetch('/api/transaksi?limit=1000')
      if (!response.ok) throw new Error('Failed to fetch data')

      const data = await response.json()
      const transaksi = data.items || []

      // Calculate summary based on selected period
      const lunasTransaksi = transaksi.filter((t: RecentTransaksi) => t.status === 'LUNAS')
      // Exclude top-up transactions (UANG_SAKU + DITAMBAH) from pending count
      // because they are not real tagihan — they are top-up requests that may
      // never be completed if the user closes the Midtrans Snap popup
      const pendingTransaksi = transaksi.filter((t: RecentTransaksi) =>
        t.status === 'PENDING' && !(t.jenis === 'UANG_SAKU' && t.statusUangSaku === 'DITAMBAH')
      )
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
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    summary,
    byJenis,
    byStatus,
    recentTransaksi,
    loading,
    error,
    refetch: fetchData
  }
}
