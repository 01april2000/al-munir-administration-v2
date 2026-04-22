"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import {
  Receipt, AlertCircle, CheckCircle2, Clock, XCircle, Calendar, CreditCard, ShoppingCart
} from "lucide-react"
import { useInfiniteTagihan } from "@/hooks/use-infinite-scroll"
import { PaymentDialog } from "@/components/santri/payment-dialog"
import { BulkPaymentDialog } from "@/components/santri/bulk-payment-dialog"
import type { TransactionData, SantriRole, TransactionItem } from "@/lib/types/santri"
import {
  colorClasses,
  statusBadgeVariant,
} from "@/lib/santri-helpers"

// Transaction icon component
const transactionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "spp": Receipt,
  "syahriah": Receipt,
  "ujian": AlertCircle,
  "pkl": Receipt,
  "lks": Receipt,
  "tka": Receipt,
  "buku-pendamping": Receipt,
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

interface TagihanTabContentProps {
  role: SantriRole
  initialData?: TransactionData[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export function TagihanTabContent({ 
  role, 
  initialData = [], 
  initialCursor = null, 
  initialHasMore = false 
}: TagihanTabContentProps) {
  const { data, isLoading, hasMore, sentinelRef } = useInfiniteTagihan({
    role,
    initialData,
    initialCursor,
    initialHasMore,
  })

  // State for bulk selection
  const [selectedTagihanIds, setSelectedTagihanIds] = React.useState<string[]>([])

  // Get all unpaid tagihan items from all transactions
  const allUnpaidTagihan = React.useMemo(() => {
    const items: { tagihanId: string; label: string; amount: string; rawAmount: number; jenis: string; type: string }[] = []
    data.forEach(transaction => {
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
  }, [data])

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

  if (data.length === 0 && !isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Receipt />
          </EmptyMedia>
          <EmptyTitle>Tidak ada tagihan</EmptyTitle>
          <EmptyDescription>
            Anda tidak memiliki tagihan yang belum dibayar saat ini.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
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

      {/* Tagihan List with Checkboxes */}
      {data.map((transaction, idx) => (
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
                  {transaction.items.length} tagihan
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
                        : colorClasses[transaction.color as keyof typeof colorClasses]?.hover || colorClasses.blue.hover
                    } hover:shadow-md active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      {/* Checkbox for unpaid items */}
                      {canPay && item.tagihanId && (
                        <Checkbox
                          id={`checkbox-${item.tagihanId}`}
                          checked={isSelected || false}
                          onCheckedChange={() => handleToggleTagihan(item.tagihanId!)}
                          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                      )}
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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0 mt-3 md:mt-0">
                      <div className="text-right">
                        <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-xs rounded-full px-2.5 py-1">
                          <StatusIcon status={item.status} />
                          {item.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      {/* Payment Button - Only show for unpaid items and when not selected for bulk */}
                      {canPay && item.tagihanId && !isSelected && (
                        <PaymentDialog
                          tagihanId={item.tagihanId}
                          transaksiId={item.transaksiId}
                          jenis={transaction.type}
                          label={item.label}
                          amount={item.amount || ""}
                          rawAmount={item.rawAmount}
                          trigger={
                            <Button
                              size="sm"
                              className="gap-1.5 h-8 rounded-full shadow-sm"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
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
      
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />
      
      {/* Loading indicator */}
      {isLoading && <LoadingSkeleton />}
      
      {/* End of list indicator */}
      {!hasMore && data.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Semua tagihan telah ditampilkan
        </p>
      )}
    </div>
  )
}
