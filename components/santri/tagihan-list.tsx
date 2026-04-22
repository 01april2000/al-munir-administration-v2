"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Receipt, CheckCircle2, Clock, XCircle, CreditCard, AlertCircle, RefreshCw, FileCheck, BookMarked, Shirt, Wallet, ShoppingCart } from "lucide-react"
import { PaymentDialog } from "@/components/santri/payment-dialog"
import { BulkPaymentDialog } from "@/components/santri/bulk-payment-dialog"

type TransactionType = "spp" | "syahriah" | "uang-saku" | "laundry" | "ujian" | "buku-pendamping" | "lks" | "pkl" | "tka"

interface TransactionItem {
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
  type: TransactionType
  title: string
  icon: React.ReactNode
  color: string
  items: TransactionItem[]
}

interface TagihanListProps {
  tagihan: TransactionData[]
}

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

const statusIcons = {
  Lunas: <CheckCircle2 data-icon="inline-start" />,
  Menunggu: <Clock data-icon="inline-start" />,
  "Belum Lunas": <XCircle data-icon="inline-start" />,
  in: <RefreshCw data-icon="inline-start" />,
  out: <RefreshCw data-icon="inline-start" />,
}

const transactionConfig: Record<
  TransactionType,
  { title: string; icon: React.ReactNode; color: keyof typeof colorClasses }
> = {
  spp: { title: "SPP", icon: <Receipt />, color: "blue" },
  syahriah: { title: "Syahriah", icon: <Receipt />, color: "green" },
  "uang-saku": { title: "Uang Saku", icon: <Wallet />, color: "yellow" },
  laundry: { title: "Laundry", icon: <Shirt />, color: "purple" },
  ujian: { title: "Ujian", icon: <FileCheck />, color: "purple" },
  "buku-pendamping": { title: "Buku Pendamping", icon: <BookMarked />, color: "indigo" },
  lks: { title: "LKS", icon: <BookMarked />, color: "orange" },
  pkl: { title: "PKL", icon: <BookMarked />, color: "indigo" },
  tka: { title: "TKA", icon: <BookMarked />, color: "blue" },
}

export function TagihanList({ tagihan }: TagihanListProps) {
  // State for bulk selection
  const [selectedTagihanIds, setSelectedTagihanIds] = React.useState<string[]>([])

  // Get all unpaid tagihan items from all transactions
  const allUnpaidTagihan = React.useMemo(() => {
    const items: { tagihanId: string; label: string; amount: string; rawAmount: number; jenis: string; type: string }[] = []
    tagihan.forEach(transaction => {
      transaction.items.forEach(item => {
        if ((item.status === "Belum Lunas" || item.status === "Menunggu") && item.tagihanId) {
          items.push({
            tagihanId: item.tagihanId,
            label: item.label,
            amount: item.amount || "",
            rawAmount: item.rawAmount || 0,
            jenis: transaction.title,
            type: transaction.type,
          })
        }
      })
    })
    return items
  }, [tagihan])

  // // Get unpaid SPP items - Disabled
  // const unpaidSPP = React.useMemo(() => {
  //   return allUnpaidTagihan.filter(t => t.type === "spp")
  // }, [allUnpaidTagihan])

  // Get unpaid Syahriah items
  const unpaidSyahriah = React.useMemo(() => {
    return allUnpaidTagihan.filter(t => t.type === "syahriah")
  }, [allUnpaidTagihan])

  // Calculate total selected amount
  const selectedTotal = React.useMemo(() => {
    return allUnpaidTagihan
      .filter(t => selectedTagihanIds.includes(t.tagihanId))
      .reduce((sum, t) => sum + t.rawAmount, 0)
  }, [selectedTagihanIds, allUnpaidTagihan])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSelectAll = (type?: "spp" | "syahriah") => {
    let itemsToSelect = type 
      ? allUnpaidTagihan.filter(t => t.type === type)
      : allUnpaidTagihan
    setSelectedTagihanIds(itemsToSelect.map(t => t.tagihanId))
  }

  const handleToggleTagihan = (tagihanId: string) => {
    setSelectedTagihanIds(prev => 
      prev.includes(tagihanId)
        ? prev.filter(id => id !== tagihanId)
        : [...prev, tagihanId]
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Tagihan Anda</h2>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>
      
      {/* Bulk Payment Actions */}
      {allUnpaidTagihan.length > 0 && (
        <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-sm">Pembayaran Bulk</span>
                </div>
                {selectedTagihanIds.length > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {selectedTagihanIds.length} dipilih • {formatCurrency(selectedTotal)}
                  </Badge>
                )}
              </div>
              
              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2">
                {/* SPP bulk select button - Disabled */}
                {unpaidSyahriah.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll("syahriah")}
                    className="rounded-full text-xs"
                  >
                    <Receipt className="h-3.5 w-3.5 mr-1.5" />
                    Pilih Semua Syahriah ({unpaidSyahriah.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll()}
                  className="rounded-full text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Pilih Semua ({allUnpaidTagihan.length})
                </Button>
                {selectedTagihanIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTagihanIds([])}
                    className="rounded-full text-xs"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Hapus Pilihan
                  </Button>
                )}
              </div>

              {/* Bulk Pay Button */}
              {selectedTagihanIds.length > 0 && (
                <BulkPaymentDialog
                  tagihanList={allUnpaidTagihan}
                  selectedIds={selectedTagihanIds}
                  onSelectionChange={setSelectedTagihanIds}
                  trigger={
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Bayar {selectedTagihanIds.length} Tagihan Terpilih ({formatCurrency(selectedTotal)})
                    </Button>
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {tagihan.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle2 />
            </EmptyMedia>
            <EmptyTitle>Semua Tagihan Lunas!</EmptyTitle>
            <EmptyDescription>
              Anda tidak memiliki tagihan yang belum dibayar.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {tagihan.map((transaction) => (
            <Card key={transaction.type} className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 rounded-2xl">
              <CardHeader className={`border-b ${colorClasses[transaction.color as keyof typeof colorClasses].bg} transition-colors duration-300 px-4 py-4 md:px-6 md:py-4`}>
                <div className="flex items-center gap-3">
                  <div className={`flex shrink-0 items-center justify-center p-3 md:p-3.5 bg-gradient-to-br ${colorClasses[transaction.color as keyof typeof colorClasses].gradient} rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <div className="text-white">
                      {transaction.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg">{transaction.title}</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {transaction.items.length} item{transaction.items.length > 1 ? 's' : ''} belum lunas
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col gap-2 md:gap-3">
                  {transaction.items.map((item, index) => {
                    const isSelected = item.tagihanId && selectedTagihanIds.includes(item.tagihanId)
                    const canPay = item.status === "Belum Lunas" || item.status === "Menunggu"
                    
                    return (
                      <div
                        key={index}
                        className={`group/item flex flex-col md:flex-row md:items-center justify-between p-4 md:p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20"
                            : `${colorClasses[transaction.color as keyof typeof colorClasses].hover} bg-destructive/5 border-destructive/20 shadow-sm shadow-destructive/5`
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                          {/* Checkbox for unpaid items */}
                          {canPay && item.tagihanId && (
                            <Checkbox
                              id={`checkbox-list-${item.tagihanId}`}
                              checked={isSelected || false}
                              onCheckedChange={() => handleToggleTagihan(item.tagihanId!)}
                              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                          )}
                          <div className={`flex shrink-0 items-center justify-center p-2.5 md:p-3 ${colorClasses[transaction.color as keyof typeof colorClasses].bg} rounded-xl transition-all duration-300 group-hover/item:scale-110`}>
                            <div className={colorClasses[transaction.color as keyof typeof colorClasses].text}>
                              {transaction.icon}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{item.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.amount && (
                                <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0 mt-3 md:mt-0">
                          <div className="text-right">
                            <Badge variant="destructive" className="shadow-sm text-xs rounded-full px-2.5 py-1">
                              {statusIcons[item.status]}
                              {item.status}
                            </Badge>
                          </div>
                          {/* Payment Button - Only show for unpaid items and when not selected for bulk */}
                          {(item.tagihanId || item.transaksiId) && canPay && !isSelected && (
                            <PaymentDialog
                              tagihanId={item.tagihanId}
                              transaksiId={item.transaksiId}
                              jenis={transaction.title}
                              label={item.label}
                              amount={item.amount || ""}
                              rawAmount={item.rawAmount}
                              trigger={
                                <Button size="sm" className="shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 min-w-[80px] md:min-w-auto rounded-full">
                                  <CreditCard data-icon="inline-start" className="md:mr-1" />
                                  <span className="hidden md:inline">Bayar</span>
                                </Button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

// Helper functions
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
