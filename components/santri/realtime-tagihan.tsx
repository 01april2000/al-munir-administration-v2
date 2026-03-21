"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Receipt, CheckCircle2, Clock, XCircle, CreditCard, AlertCircle, RefreshCw, FileCheck, BookMarked, Shirt, Wallet } from "lucide-react"
import { PaymentDialog } from "@/components/santri/payment-dialog"

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

interface TransactionData {
  type: TransactionType
  title: string
  icon: React.ReactNode
  color: string
  items: TransactionItem[]
}

interface RealtimeTagihanProps {
  initialTagihan: TransactionData[]
  apiEndpoint: "/api/santri/pondok" | "/api/santri/smp" | "/api/santri/smk"
  refreshInterval?: number // in milliseconds, default 30000 (30 seconds)
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

export function RealtimeTagihan({
  initialTagihan,
  apiEndpoint,
  refreshInterval = 30000 // Default 30 seconds
}: RealtimeTagihanProps) {
  const [tagihan, setTagihan] = useState<TransactionData[]>(initialTagihan)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  // Use ref to track if a fetch is in progress to prevent concurrent fetches
  const fetchingRef = useRef(false)
  // Use ref to track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) {
      return
    }
    
    try {
      fetchingRef.current = true
      setIsLoading(true)
      
      // Add timestamp to force network request and bypass cache
      const url = new URL(apiEndpoint, window.location.origin)
      url.searchParams.set('_t', Date.now().toString())
      
      const response = await fetch(url.toString(), {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })

      if (response.ok && mountedRef.current) {
        const data = await response.json()
        const { tagihan: newTagihan, transaksi } = data

        // Process tagihan data based on endpoint type
        // Use a map to prevent duplicate keys
        const processedTransactionsMap: Record<string, TransactionData> = {}

        // Process tagihan based on jenis - use a Set to track unique tagihan IDs
        const processedTagihanIds = new Set<string>()
        const tagihanByJenis: Record<string, TransactionItem[]> = {}

        for (const t of newTagihan) {
          // Skip if we've already processed this tagihan (prevent duplicates)
          if (processedTagihanIds.has(t.id)) {
            continue
          }
          processedTagihanIds.add(t.id)
          
          const jenis = t.jenis
          if (!tagihanByJenis[jenis]) {
            tagihanByJenis[jenis] = []
          }

          const item: TransactionItem = {
            label: t.bulan && t.tahun ? `${getMonthName(t.bulan)} ${t.tahun}` : (t.keterangan || jenis),
            amount: formatCurrency(t.jumlah),
            status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu" as const,
            date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
            tagihanId: t.id,
            rawAmount: t.jumlah,
          }
          tagihanByJenis[jenis].push(item)
        }

        // Map jenis to transaction type
        const jenisToType: Record<string, TransactionType> = {
          "SPP": "spp",
          "SYAHRIAH": "syahriah",
          "UJIAN": "ujian",
          "BUKU_PENDAMPING": "buku-pendamping",
          "LKS": "lks",
          "PKL": "pkl",
          "TKA": "tka",
        }

        for (const [jenis, items] of Object.entries(tagihanByJenis)) {
          const type = jenisToType[jenis]
          if (type && transactionConfig[type]) {
            if (processedTransactionsMap[type]) {
              // Merge items if type already exists
              processedTransactionsMap[type].items.push(...items)
            } else {
              // Create new entry if type doesn't exist
              processedTransactionsMap[type] = {
                type,
                ...transactionConfig[type],
                items,
              }
            }
          }
        }

        // Process Laundry transactions (for pondok) - use Set to prevent duplicates
        if (transaksi) {
          const processedTransaksiIds = new Set<string>()
          const laundryTransaksi = transaksi.filter((t: any) => {
            if (t.jenis !== "LAUNDRY") return false
            // Skip if already processed
            if (processedTransaksiIds.has(t.id)) return false
            processedTransaksiIds.add(t.id)
            return true
          })
          
          if (laundryTransaksi.length > 0) {
            const laundryItems = laundryTransaksi.map((t: any) => ({
              label: t.jenisLaundry || t.keterangan || "Laundry",
              amount: formatCurrency(t.jumlah),
              status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu" as const,
              date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
              transaksiId: t.id,
              rawAmount: t.jumlah,
            }))
            if (processedTransactionsMap.laundry) {
              // Merge items if laundry already exists
              processedTransactionsMap.laundry.items.push(...laundryItems)
            } else {
              // Create new entry if laundry doesn't exist
              processedTransactionsMap.laundry = {
                type: "laundry",
                ...transactionConfig.laundry,
                items: laundryItems,
              }
            }
          }
        }

        // Convert map to array
        const processedTransactions = Object.values(processedTransactionsMap)

        // Filter for unpaid bills only
        const tagihanOnly = processedTransactions
          .filter(t => t.type !== "uang-saku")
          .map(t => ({
            ...t,
            items: t.items.filter(item => item.status === "Belum Lunas" || item.status === "Menunggu")
          }))
          .filter(t => t.items.length > 0)

        // Only update state if component is still mounted
        if (mountedRef.current) {
          setTagihan(tagihanOnly)
          setLastUpdated(new Date())
        }
      }
    } catch (error) {
      console.error("Failed to fetch tagihan:", error)
    } finally {
      fetchingRef.current = false
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [apiEndpoint])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Polling effect - only start after initial delay to avoid immediate duplicate fetch
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    // Delay polling start to avoid race with initial SWR fetch
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(fetchData, refreshInterval)
    }, 5000) // Wait 5 seconds before starting polling
    
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchData, refreshInterval])

  // Listen for visibility change with debounce
  useEffect(() => {
    let lastFetchTime = 0
    const DEBOUNCE_MS = 2000 // 2 seconds debounce
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now()
        // Only fetch if enough time has passed since last fetch
        if (now - lastFetchTime > DEBOUNCE_MS) {
          lastFetchTime = now
          fetchData()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [fetchData])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Tagihan Anda</h2>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            Diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
          </span>
        </div>
      </div>
      
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
                  {transaction.items.map((item, index) => (
                    <div
                      key={index}
                      className={`group/item flex flex-col md:flex-row md:items-center justify-between p-4 md:p-4 rounded-2xl border transition-all duration-300 ${colorClasses[transaction.color as keyof typeof colorClasses].hover} bg-destructive/5 border-destructive/20 shadow-sm shadow-destructive/5`}
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
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
                        {(item.tagihanId || item.transaksiId) && (
                          <PaymentDialog
                            tagihanId={item.tagihanId}
                            transaksiId={item.transaksiId}
                            jenis={transaction.title}
                            label={item.label}
                            amount={item.amount || ""}
                            rawAmount={item.rawAmount}
                            onPaymentComplete={fetchData}
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
                  ))}
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
