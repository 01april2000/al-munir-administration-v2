"use client"

import { useState } from "react"
import { usePondokFinancialData } from "@/hooks/use-pondok-financial-data"
import { PeriodSelector } from "@/components/admin/period-selector"
import { SummaryCards } from "@/components/admin/summary-cards"
import { TransactionByType } from "@/components/admin/transaction-by-type"
import { StatusOverview } from "@/components/admin/status-overview"
import { RecentTransactions } from "@/components/admin/recent-transactions"
import { LoadingState, ErrorState } from "@/components/admin/admin-loading-error"
import { PondokQuickActions } from "@/components/bendahara/pondok-quick-actions"
import { ExportLaporanButton } from "@/components/admin/export-laporan-button"
import { MONTHS } from "@/lib/financial"

export default function BendaharaPondokPage() {
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

  // Fetch financial data using custom hook (filtered for UANG_SAKU and LAUNDRY only)
  const {
    summary,
    byJenis,
    byStatus,
    recentTransaksi,
    loading,
    error,
    refetch
  } = usePondokFinancialData(selectedMonth, selectedYear)

  const handleApplyPeriod = () => {
    setSelectedMonth(tempMonth)
    setSelectedYear(tempYear)
    setIsPeriodDialogOpen(false)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan Pondok</h1>
          <p className="text-muted-foreground">
            Ringkasan transaksi Uang Saku dan Laundry (Semua Jenis Santri)
            <span className="ml-2 text-primary font-medium">
              • {MONTHS[selectedMonth]} {selectedYear}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <ExportLaporanButton
            summary={summary}
            byJenis={byJenis}
            byStatus={byStatus}
            recentTransaksi={recentTransaksi}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <PeriodSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            tempMonth={tempMonth}
            tempYear={tempYear}
            isPeriodDialogOpen={isPeriodDialogOpen}
            onOpenChange={setIsPeriodDialogOpen}
            onTempMonthChange={setTempMonth}
            onTempYearChange={setTempYear}
            onApply={handleApplyPeriod}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction by Type */}
        <TransactionByType byJenis={byJenis} />

        {/* Status Overview */}
        <StatusOverview byStatus={byStatus} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions recentTransaksi={recentTransaksi} />

      {/* Quick Actions */}
      <PondokQuickActions />
    </div>
  )
}
