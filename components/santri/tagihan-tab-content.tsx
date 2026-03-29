"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import {
  Receipt, AlertCircle, CheckCircle2, Clock, XCircle, Calendar
} from "lucide-react"
import { useInfiniteTagihan } from "@/hooks/use-infinite-scroll"
import type { TransactionData, SantriRole } from "@/lib/types/santri"
import {
  colorClasses,
  statusBadgeVariant,
  formatCurrency,
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
              {transaction.items.map((item, index) => (
                <div
                  key={index}
                  className={`group/item flex flex-col md:flex-row md:items-center justify-between p-4 md:p-4 rounded-2xl border transition-all duration-300 ${colorClasses[transaction.color as keyof typeof colorClasses]?.hover || colorClasses.blue.hover} hover:shadow-md active:scale-[0.98]`}
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
      {!hasMore && data.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Semua tagihan telah ditampilkan
        </p>
      )}
    </div>
  )
}