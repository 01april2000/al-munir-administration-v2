"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import {
  Receipt, Wallet, Shirt, FileCheck, Briefcase, Trophy, BookOpen, BookMarked,
  CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, Calendar, History, Filter
} from "lucide-react"
import { useInfiniteAktivitas } from "@/hooks/use-infinite-scroll"
import type { TransactionData, TransactionItem, SantriRole } from "@/lib/types/santri"
import {
  colorClasses,
  statusBadgeVariant,
} from "@/lib/santri-helpers"
import { AktivitasDetailDialog } from "@/components/santri/aktivitas-detail-dialog"

// Time filter type
type TimeFilter = "semua" | "hari-ini" | "kemarin" | "minggu-ini" | "bulan-ini"

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "hari-ini", label: "Hari Ini" },
  { value: "kemarin", label: "Kemarin" },
  { value: "minggu-ini", label: "Minggu Ini" },
  { value: "bulan-ini", label: "Bulan Ini" },
]

// Indonesian month abbreviations mapping
const indonesianMonths: Record<string, number> = {
  "jan": 0, "feb": 1, "mar": 2, "apr": 3, "mei": 4, "jun": 5,
  "jul": 6, "agu": 7, "sep": 8, "okt": 9, "nov": 10, "des": 11,
}

/**
 * Parse an Indonesian-formatted date string (e.g. "21 Apr 2026") back to a Date.
 * Returns null if parsing fails.
 */
function parseIndonesianDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === "-") return null
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = indonesianMonths[parts[1].toLowerCase()]
  const year = parseInt(parts[2], 10)
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day)
}

/**
 * Check if a given date falls within the specified time filter range.
 * All comparisons use local time (user's timezone).
 */
function isDateInRange(date: Date | null, filter: TimeFilter): boolean {
  if (filter === "semua" || !date) return true

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (filter) {
    case "hari-ini": {
      return date >= today && date < new Date(today.getTime() + 86400000)
    }
    case "kemarin": {
      const yesterday = new Date(today.getTime() - 86400000)
      return date >= yesterday && date < today
    }
    case "minggu-ini": {
      const dayOfWeek = today.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const startOfWeek = new Date(today.getTime() + mondayOffset * 86400000)
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 86400000)
      return date >= startOfWeek && date < endOfWeek
    }
    case "bulan-ini": {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      return date >= startOfMonth && date < startOfNextMonth
    }
    default:
      return true
  }
}

// Transaction icon component
const transactionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "spp": Receipt,
  "syahriah": Receipt,
  "uang-saku": Wallet,
  "laundry": Shirt,
  "ujian": FileCheck,
  "pkl": Briefcase,
  "lks": Trophy,
  "tka": BookOpen,
  "buku-pendamping": BookMarked,
}

function TransactionIcon({ type, className = "h-5 w-5" }: { type: string; className?: string }) {
  const Icon = transactionIconMap[type] ?? Receipt
  return <Icon className={className} />
}

// Status icon component
function StatusIcon({ status }: { status: string }) {
  const iconProps = { "data-icon": "inline-start" as const }
  switch (status) {
    case "Lunas":
      return <CheckCircle2 {...iconProps} />
    case "Menunggu":
      return <Clock {...iconProps} />
    case "Belum Lunas":
      return <XCircle {...iconProps} />
    case "in":
      return <ArrowDown {...iconProps} />
    case "out":
      return <ArrowUp {...iconProps} />
    default:
      return null
  }
}

// Loading skeleton for infinite scroll
function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden border-border/50 rounded-2xl">
          <CardHeader className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface AktivitasTabContentProps {
  role: SantriRole
  initialData?: TransactionData[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export function AktivitasTabContent({
  role,
  initialData = [],
  initialCursor = null,
  initialHasMore = false
}: AktivitasTabContentProps) {
  const { data, isLoading, hasMore, sentinelRef } = useInfiniteAktivitas({
    role,
    initialData,
    initialCursor,
    initialHasMore,
  })

  // Time filter state
  const [activeFilter, setActiveFilter] = React.useState<TimeFilter>("semua")

  // Filtered data based on selected time range
  const filteredData = React.useMemo(() => {
    if (activeFilter === "semua") return data

    return data
      .map((transaction) => ({
        ...transaction,
        items: transaction.items.filter((item) => {
          const date = parseIndonesianDate(item.date)
          return isDateInRange(date, activeFilter)
        }),
      }))
      .filter((transaction) => transaction.items.length > 0)
  }, [data, activeFilter])

  // Detail dialog state
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<TransactionItem | null>(null)
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionData | null>(null)

  const handleItemClick = (item: TransactionItem, transaction: TransactionData) => {
    setSelectedItem(item)
    setSelectedTransaction(transaction)
    setDetailOpen(true)
  }

  if (data.length === 0 && !isLoading) {
    return (
      <>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <History />
            </EmptyMedia>
            <EmptyTitle>Belum ada riwayat</EmptyTitle>
            <EmptyDescription>
              Riwayat pembayaran dan transaksi Anda akan muncul di sini.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
        </div>
      </div>

      {/* Time filter buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {timeFilterOptions.map((option) => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(option.value)}
            className="rounded-full text-xs h-8 px-3 shrink-0 transition-all"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Empty state when filter yields no results */}
      {filteredData.length === 0 && !isLoading && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>Tidak ada transaksi</EmptyTitle>
            <EmptyDescription>
              Tidak ada riwayat transaksi untuk filter "{timeFilterOptions.find(f => f.value === activeFilter)?.label}".
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      
      {filteredData.map((transaction, idx) => (
        <Card key={`${transaction.type}-${idx}`} className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 rounded-2xl">
          <CardHeader className={`border-b ${colorClasses[transaction.color as keyof typeof colorClasses]?.bg || colorClasses.blue.bg} transition-colors duration-300 px-4 py-4 md:px-6 md:py-4`}>
            <div className="flex items-center gap-3">
              <div className={`flex shrink-0 items-center justify-center p-3 md:p-3.5 bg-gradient-to-br ${colorClasses[transaction.color as keyof typeof colorClasses]?.gradient || colorClasses.blue.gradient} rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <div className="text-white">
                  <TransactionIcon type={transaction.type} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base md:text-lg">{transaction.title}</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {transaction.items.length} transaksi
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-2 md:gap-3">
              {transaction.items.map((item, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleItemClick(item, transaction)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleItemClick(item, transaction)
                    }
                  }}
                  className={`group/item flex flex-col md:flex-row md:items-center justify-between p-4 md:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${colorClasses[transaction.color as keyof typeof colorClasses]?.hover || colorClasses.blue.hover} hover:shadow-md active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={`flex shrink-0 items-center justify-center p-2.5 md:p-3 ${colorClasses[transaction.color as keyof typeof colorClasses]?.bg || colorClasses.blue.bg} rounded-xl transition-all duration-300 group-hover/item:scale-110`}>
                      <div className={colorClasses[transaction.color as keyof typeof colorClasses]?.text || colorClasses.blue.text}>
                        <TransactionIcon type={transaction.type} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{item.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.amount && (
                          <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                        )}
                        {item.balance && (
                          <p className="text-xs text-muted-foreground">Saldo: {item.balance}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0 mt-3 md:mt-0">
                    <div className="text-right">
                      <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-xs rounded-full px-2.5 py-1">
                        <StatusIcon status={item.status} />
                        {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
                      </Badge>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />
      
      {/* Loading indicator */}
      {isLoading && <LoadingSkeleton />}
      
      {/* End of list indicator */}
      {!hasMore && filteredData.length > 0 && activeFilter === "semua" && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Semua riwayat telah ditampilkan
        </p>
      )}

      {/* Detail Dialog */}
      <AktivitasDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={selectedItem}
        transaction={selectedTransaction}
      />
    </div>
  )
}