import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Receipt, Wallet, Shirt, CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, CreditCard, TrendingUp, AlertCircle, Calendar, RefreshCw, Bell, User } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PaymentDialog } from "@/components/santri/payment-dialog"
import { TopupButton } from "@/components/santri/topup-button"
import { LaundryButton } from "@/components/santri/laundry-button"
import { Button } from "@/components/ui/button"
import { MobileBottomNav } from "@/components/santri/mobile-bottom-nav"

type TransactionType = "syahriah" | "uang-saku" | "laundry"

interface TransactionData {
  type: TransactionType
  title: string
  icon: React.ReactNode
  color: string
  items: Array<{
    label: string
    amount?: string
    status: "Lunas" | "Menunggu" | "Belum Lunas" | "in" | "out"
    date: string
    balance?: string
    tagihanId?: string
    transaksiId?: string
    rawAmount?: number
  }>
}

interface SummaryStats {
  totalUnpaid: number
  totalPaid: number
  unpaidCount: number
  paidCount: number
  uangSakuBalance: number
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

const statusBadgeVariant = {
  Lunas: "secondary",
  Menunggu: "outline",
  "Belum Lunas": "destructive",
  in: "secondary",
  out: "destructive",
} as const

const statusIcons = {
  Lunas: <CheckCircle2 data-icon="inline-start" />,
  Menunggu: <Clock data-icon="inline-start" />,
  "Belum Lunas": <XCircle data-icon="inline-start" />,
  in: <ArrowDown data-icon="inline-start" />,
  out: <ArrowUp data-icon="inline-start" />,
}

const transactionConfig: Record<
  TransactionType,
  { title: string; icon: React.ReactNode; color: keyof typeof colorClasses }
> = {
  syahriah: { title: "Syahriah", icon: <Receipt />, color: "green" },
  "uang-saku": { title: "Uang Saku", icon: <Wallet />, color: "yellow" },
  laundry: { title: "Laundry", icon: <Shirt />, color: "purple" },
}

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

async function getSantriData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth")
  }

  // Get the host and protocol from headers to construct absolute URL
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const response = await fetch(`${baseUrl}/api/santri/pondok`, {
    cache: "no-store",
    headers: {
      Cookie: headersList.get("cookie") || "",
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(errorData.error || `Failed to fetch data (${response.status})`)
  }

  return response.json()
}

export default async function SantriPondokPage() {
  const data = await getSantriData()
  const { tagihan, transaksi } = data

  // Process tagihan data
  const processedTransactions: TransactionData[] = []

  // Calculate summary stats
  const summaryStats: SummaryStats = {
    totalUnpaid: 0,
    totalPaid: 0,
    unpaidCount: 0,
    paidCount: 0,
    uangSakuBalance: 0,
  }

  // Process Syahriah tagihan
  const syahriahTagihan = tagihan.filter((t: any) => t.jenis === "SYAHRIAH")
  if (syahriahTagihan.length > 0) {
    const syahriahItems = syahriahTagihan.map((t: any) => {
      const isPaid = t.status === "LUNAS"
      if (!isPaid) {
        summaryStats.totalUnpaid += t.jumlah
        summaryStats.unpaidCount++
      } else {
        summaryStats.totalPaid += t.jumlah
        summaryStats.paidCount++
      }
      return {
        label: `${getMonthName(t.bulan)} ${t.tahun}`,
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu",
        date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
        tagihanId: t.id,
        rawAmount: t.jumlah,
      }
    })
    processedTransactions.push({
      type: "syahriah",
      ...transactionConfig.syahriah,
      items: syahriahItems,
    })
  }

  // Process Uang Saku transactions
  const uangSakuTransaksi = transaksi.filter((t: any) => t.jenis === "UANG_SAKU")
  if (uangSakuTransaksi.length > 0) {
    let runningBalance = 0
    // Reverse to process oldest first for correct balance calculation
    const chronologicalItems = [...uangSakuTransaksi].reverse().map((t: any) => {
      const isIncoming = t.statusUangSaku === "DITAMBAH"
      if (isIncoming) {
        runningBalance += t.jumlah
      } else {
        runningBalance -= t.jumlah
      }
      return {
        label: t.keterangan || (isIncoming ? "Top-up Uang Saku" : "Pengambilan Uang Saku"),
        amount: formatCurrency(t.jumlah),
        status: (isIncoming ? "in" : "out") as "in" | "out",
        date: formatDate(t.createdAt),
        balance: formatCurrency(runningBalance),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      }
    })
    // Reverse again to show newest first
    const uangSakuItems = chronologicalItems.reverse()
    summaryStats.uangSakuBalance = runningBalance
    processedTransactions.push({
      type: "uang-saku",
      ...transactionConfig["uang-saku"],
      items: uangSakuItems,
    })
  }

  // Process Laundry transactions
  const laundryTransaksi = transaksi.filter((t: any) => t.jenis === "LAUNDRY")
  if (laundryTransaksi.length > 0) {
    const laundryItems = laundryTransaksi.map((t: any) => {
      const isPaid = t.status === "LUNAS"
      if (!isPaid) {
        summaryStats.totalUnpaid += t.jumlah
        summaryStats.unpaidCount++
      } else {
        summaryStats.totalPaid += t.jumlah
        summaryStats.paidCount++
      }
      return {
        label: t.jenisLaundry || t.keterangan || "Laundry",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      }
    })
    processedTransactions.push({
      type: "laundry",
      ...transactionConfig.laundry,
      items: laundryItems,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold tracking-tight">Tagihan & Transaksi</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Kelola pembayaran Anda</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full md:hidden">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Pull to refresh indicator */}
        <div className="h-1 bg-muted overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-4 md:py-6 space-y-6">
        {/* Summary Stats - Horizontal Scroll on Mobile */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 active:scale-[0.98]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-3 py-2 md:px-4 md:py-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Tagihan
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-red-500 to-rose-600 p-2 md:p-2.5 shadow-lg shadow-red-500/20">
                <AlertCircle className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative px-3 pb-3 md:px-4 md:pb-4">
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{formatCurrency(summaryStats.totalUnpaid)}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500" style={{ width: `${Math.min((summaryStats.totalUnpaid / (summaryStats.totalUnpaid + summaryStats.totalPaid + 1)) * 100, 100)}%` }} />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground">{summaryStats.unpaidCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 active:scale-[0.98]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-3 py-2 md:px-4 md:py-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Dibayar
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-2 md:p-2.5 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative px-3 pb-3 md:px-4 md:pb-4">
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(summaryStats.totalPaid)}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500" style={{ width: `${Math.min((summaryStats.totalPaid / (summaryStats.totalUnpaid + summaryStats.totalPaid + 1)) * 100, 100)}%` }} />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground">{summaryStats.paidCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 active:scale-[0.98]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-3 py-2 md:px-4 md:py-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Saldo
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-2 md:p-2.5 shadow-lg shadow-amber-500/20">
                <Wallet className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative px-3 pb-3 md:px-4 md:pb-4">
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">{formatCurrency(summaryStats.uangSakuBalance)}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500 ${summaryStats.uangSakuBalance > 0 ? 'w-full' : 'w-0'}`} />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground">Aktif</span>
              </div>
              <TopupButton className="w-full mt-3" />
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-3 py-2 md:px-4 md:py-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 md:p-2.5 shadow-lg shadow-blue-500/20">
                <TrendingUp className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative px-3 pb-3 md:px-4 md:pb-4">
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{summaryStats.paidCount + summaryStats.unpaidCount}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 w-full" />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground">Semua</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
      {processedTransactions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>Belum ada tagihan atau transaksi</EmptyTitle>
            <EmptyDescription>
              Tagihan dan riwayat transaksi Anda akan muncul di sini setelah tersedia.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {processedTransactions.map((transaction) => (
            <Card key={transaction.type} className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50">
              <CardHeader className={`border-b ${colorClasses[transaction.color as keyof typeof colorClasses].bg} transition-colors duration-300 px-4 py-3 md:px-6 md:py-4`}>
                <div className="flex items-center gap-3">
                  <div className={`flex shrink-0 items-center justify-center p-2.5 md:p-3 bg-gradient-to-br ${colorClasses[transaction.color as keyof typeof colorClasses].gradient} rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <div className="text-white">
                      {transaction.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg">{transaction.title}</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {transaction.items.length} item{transaction.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  {transaction.items.some(item => item.status === "Belum Lunas") && (
                    <Badge variant="destructive" className="shadow-sm text-xs md:text-sm">
                      {transaction.items.filter(item => item.status === "Belum Lunas").length} belum lunas
                    </Badge>
                  )}
                  {transaction.type === "laundry" && (
                    <LaundryButton />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col gap-2 md:gap-3">
                  {transaction.items.map((item, index) => (
                    <div
                      key={index}
                      className={`group/item flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 rounded-xl border transition-all duration-300 ${colorClasses[transaction.color as keyof typeof colorClasses].hover} ${item.status === "Belum Lunas" ? "bg-destructive/5 border-destructive/20 shadow-sm shadow-destructive/5" : "hover:shadow-md active:scale-[0.98]"}`}
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className={`flex shrink-0 items-center justify-center p-2 md:p-2.5 ${colorClasses[transaction.color as keyof typeof colorClasses].bg} rounded-lg transition-all duration-300 group-hover/item:scale-110`}>
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
                            {item.balance && (
                              <p className="text-xs text-muted-foreground">Saldo: {item.balance}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0 mt-2 md:mt-0">
                        <div className="text-right">
                          <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-xs">
                            {statusIcons[item.status]}
                            {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                        {item.status === "Belum Lunas" && (item.tagihanId || item.transaksiId) && (
                          <PaymentDialog
                            tagihanId={item.tagihanId}
                            transaksiId={item.transaksiId}
                            jenis={transaction.title}
                            label={item.label}
                            amount={item.amount || ""}
                            rawAmount={item.rawAmount}
                            trigger={
                              <Button size="sm" className="shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 min-w-[80px] md:min-w-auto">
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
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="pondok" />
    </div>
  )
}
