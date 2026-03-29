"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, Calendar
} from "lucide-react"
import { SantriRole } from "@/components/santri/santri-tab-context"

// Color classes for transaction types
const colorClasses = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]",
    gradient: "from-blue-500 to-indigo-600"
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02]",
    gradient: "from-emerald-500 to-green-600"
  },
  yellow: {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hover: "hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02]",
    gradient: "from-amber-500 to-yellow-600"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]",
    gradient: "from-purple-500 to-violet-600"
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02]",
    gradient: "from-red-500 to-rose-600"
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    hover: "hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02]",
    gradient: "from-indigo-500 to-blue-600"
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02]",
    gradient: "from-orange-500 to-amber-600"
  },
}

const statusBadgeVariant = {
  Lunas: "secondary",
  Menunggu: "outline",
  "Belum Lunas": "destructive",
  in: "secondary",
  out: "destructive",
} as const

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

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

function getMonthName(bulan: string): string {
  const monthIndex = parseInt(bulan) - 1
  return monthNames[monthIndex] || bulan
}

// Transaction type definitions per role
const smkTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  spp: { title: "SPP", color: "blue" },
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
  ujian: { title: "Ujian", color: "red" },
  pkl: { title: "PKL", color: "indigo" },
  lks: { title: "LKS", color: "orange" },
}

const smpTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  spp: { title: "SPP", color: "blue" },
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
  ujian: { title: "Ujian", color: "red" },
  tka: { title: "TKA", color: "indigo" },
  "buku-pendamping": { title: "Buku Pendamping", color: "orange" },
}

const pondokTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
}

function getTransactionConfig(role: SantriRole) {
  switch (role) {
    case "smk":
      return smkTransactionConfig
    case "smp":
      return smpTransactionConfig
    case "pondok":
      return pondokTransactionConfig
    default:
      return smkTransactionConfig
  }
}

// Transaction icon component
function TransactionIcon({ type }: { type: string }) {
  const iconProps = { className: "h-5 w-5" }
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

export interface TransactionItem {
  label: string
  amount?: string
  status: "Lunas" | "Menunggu" | "Belum Lunas" | "in" | "out"
  date: string
  balance?: string
  tagihanId?: string
  transaksiId?: string
  rawAmount?: number
}

export interface TransactionData {
  type: string
  title: string
  color: string
  items: TransactionItem[]
}

interface TransactionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionType: string | null
  role: SantriRole
  transactions: TransactionData[]
}

export function TransactionHistoryDialog({
  open,
  onOpenChange,
  transactionType,
  role,
  transactions,
}: TransactionHistoryDialogProps) {
  const transactionConfig = getTransactionConfig(role)
  
  // Find the transaction data for the selected type
  const transactionData = React.useMemo(() => {
    if (!transactionType) return null
    return transactions.find(t => t.type === transactionType) || null
  }, [transactionType, transactions])
  
  const config = transactionType ? transactionConfig[transactionType] : null
  const title = config?.title || transactionType || "Riwayat Transaksi"
  const color = config?.color || "blue"
  const colorStyle = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`flex items-center justify-center p-2 bg-gradient-to-br ${colorStyle.gradient} rounded-xl shadow-lg`}>
              <div className="text-white">
                <TransactionIcon type={transactionType || ""} />
              </div>
            </div>
            Riwayat {title}
          </DialogTitle>
        </DialogHeader>

        {!transactionData || transactionData.items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>Belum ada riwayat</EmptyTitle>
              <EmptyDescription>
                Riwayat transaksi {title} akan muncul di sini.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {transactionData.items.map((item, index) => (
              <div
                key={index}
                className={`group/item flex flex-col p-4 rounded-2xl border transition-all duration-300 ${colorStyle.hover} hover:shadow-md active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex shrink-0 items-center justify-center p-2.5 ${colorStyle.bg} rounded-xl transition-all duration-300 group-hover/item:scale-110`}>
                    <div className={colorStyle.text}>
                      <TransactionIcon type={transactionType || ""} />
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
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-xs rounded-full px-2.5 py-1">
                    <StatusIcon status={item.status} />
                    {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
