"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Receipt, Wallet, Shirt, FileCheck, Briefcase, Trophy, BookOpen, BookMarked,
  CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, Calendar, Bell
} from "lucide-react"

// Color classes for transaction types
const colorClasses = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-500 to-indigo-600"
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-500 to-green-600"
  },
  yellow: {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    gradient: "from-amber-500 to-yellow-600"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    gradient: "from-purple-500 to-violet-600"
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    gradient: "from-red-500 to-rose-600"
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    text: "text-indigo-600 dark:text-blue-400",
    border: "border-indigo-200 dark:border-indigo-800",
    gradient: "from-indigo-500 to-blue-600"
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    gradient: "from-orange-500 to-amber-600"
  },
}

const statusBadgeVariant = {
  Lunas: "secondary",
  Menunggu: "outline",
  "Belum Lunas": "destructive",
  in: "secondary",
  out: "destructive",
  Gagal: "destructive",
} as const

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

// Transaction icon component
function TransactionIcon({ type }: { type: string }) {
  const iconProps = { className: "h-4 w-4" }
  switch (type) {
    case "spp":
    case "syahriah":
      return <Receipt {...iconProps} />
    case "uang-saku":
      return <Wallet {...iconProps} />
    case "laundry":
      return <Shirt {...iconProps} />
    case "ujian":
      return <FileCheck {...iconProps} />
    case "pkl":
      return <Briefcase {...iconProps} />
    case "lks":
      return <Trophy {...iconProps} />
    case "tka":
      return <BookOpen {...iconProps} />
    case "buku-pendamping":
      return <BookMarked {...iconProps} />
    default:
      return <Receipt {...iconProps} />
  }
}

// Status icon component
function StatusIcon({ status }: { status: string }) {
  const iconProps = { "data-icon": "inline-start" as const, className: "h-3 w-3" }
  switch (status) {
    case "Lunas":
      return <CheckCircle2 {...iconProps} />
    case "Menunggu":
      return <Clock {...iconProps} />
    case "Belum Lunas":
      return <XCircle {...iconProps} />
    case "Gagal":
      return <XCircle {...iconProps} />
    case "in":
      return <ArrowDown {...iconProps} />
    case "out":
      return <ArrowUp {...iconProps} />
    default:
      return null
  }
}

export interface NotificationTransactionItem {
  label: string
  amount?: string
  status: "Lunas" | "Menunggu" | "Belum Lunas" | "in" | "out" | "Gagal"
  date: string
  balance?: string
  rawAmount?: number
}

export interface NotificationTransactionData {
  type: string
  title: string
  color: string
  items: NotificationTransactionItem[]
}

interface NotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: NotificationTransactionData[]
}

export function NotificationDialog({ open, onOpenChange, transactions }: NotificationDialogProps) {
  // Flatten all transactions and sort by date (most recent first)
  const allTransactions = React.useMemo(() => {
    const flatTransactions: (NotificationTransactionItem & { 
      type: string
      title: string
      color: string
    })[] = []

    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        flatTransactions.push({
          ...item,
          type: transaction.type,
          title: transaction.title,
          color: transaction.color,
        })
      })
    })

    // Sort by date (most recent first) - assuming date is in format "DD MMM YYYY"
    return flatTransactions.sort((a, b) => {
      const dateA = new Date(a.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$1 $2 $3"))
      const dateB = new Date(b.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$1 $2 $3"))
      return dateB.getTime() - dateA.getTime()
    })
  }, [transactions])

  // Get recent transactions (last 10)
  const recentTransactions = allTransactions.slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Riwayat Notifikasi Transaksi
          </DialogTitle>
        </DialogHeader>
        
        {recentTransactions.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>Belum ada notifikasi</EmptyTitle>
              <EmptyDescription>
                Riwayat transaksi Anda akan muncul di sini.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {recentTransactions.map((item, index) => {
                const colorConfig = colorClasses[item.color as keyof typeof colorClasses] || colorClasses.blue
                return (
                  <div
                    key={`${item.type}-${index}`}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${colorConfig.bg} ${colorConfig.border} transition-all duration-300`}
                  >
                    <div className={`flex shrink-0 items-center justify-center p-2 bg-gradient-to-br ${colorConfig.gradient} rounded-lg text-white`}>
                      <TransactionIcon type={item.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.amount && (
                          <p className="text-xs font-semibold text-foreground">{item.amount}</p>
                        )}
                        {item.balance && (
                          <p className="text-xs text-muted-foreground">Saldo: {item.balance}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-[10px] rounded-full px-2 py-0.5">
                        <StatusIcon status={item.status} />
                        <span className="ml-1">
                          {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
                        </span>
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
