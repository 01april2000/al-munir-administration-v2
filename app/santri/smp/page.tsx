import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "SMP - Portal Santri Al-Munir",
  description: "Halaman santri SMP untuk pengelolaan administrasi dan transaksi",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Santri Portal",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Receipt, Wallet, Shirt, FileCheck, BookMarked, BookOpen, CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, CreditCard, TrendingUp, AlertCircle, Calendar, RefreshCw, Bell, User, Send, QrCode, MoreHorizontal, Sparkles, History, Settings, LogOut, Mail, Phone, MapPin, School } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PaymentDialog } from "@/components/santri/payment-dialog"
import { TopupButton } from "@/components/santri/topup-button"
import { LaundryButton } from "@/components/santri/laundry-button"
import { Button } from "@/components/ui/button"
import { MobileBottomNav } from "@/components/santri/mobile-bottom-nav"
import { SignOutButton } from "@/components/sign-out-button"
import { RealtimeTagihan } from "@/components/santri/realtime-tagihan"

type TransactionType = "spp" | "syahriah" | "uang-saku" | "laundry" | "ujian" | "tka" | "buku-pendamping"

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
  spp: { title: "SPP", icon: <Receipt />, color: "blue" },
  syahriah: { title: "Syahriah", icon: <Receipt />, color: "green" },
  "uang-saku": { title: "Uang Saku", icon: <Wallet />, color: "yellow" },
  laundry: { title: "Laundry", icon: <Shirt />, color: "purple" },
  ujian: { title: "Ujian", icon: <FileCheck />, color: "red" },
  tka: { title: "TKA", icon: <BookMarked />, color: "indigo" },
  "buku-pendamping": { title: "Buku Pendamping", icon: <BookOpen />, color: "orange" },
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

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
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

  const response = await fetch(`${baseUrl}/api/santri/smp`, {
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

export default async function SantriSMPPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = tab || "beranda"
  
  const data = await getSantriData()
  const { tagihan, transaksi, santri } = data

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

  // Process SPP tagihan
  const sppTagihan = tagihan.filter((t: any) => t.jenis === "SPP")
  if (sppTagihan.length > 0) {
    const sppItems = sppTagihan.map((t: any) => {
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
      type: "spp",
      ...transactionConfig.spp,
      items: sppItems,
    })
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

  // Process Ujian transactions (excluding TKA and Buku Pendamping)
  const ujianTransaksi = transaksi.filter((t: any) =>
    t.jenis === "UJIAN"
  )
  if (ujianTransaksi.length > 0) {
    const ujianItems = ujianTransaksi.map((t: any) => {
      const isPaid = t.status === "LUNAS"
      if (!isPaid) {
        summaryStats.totalUnpaid += t.jumlah
        summaryStats.unpaidCount++
      } else {
        summaryStats.totalPaid += t.jumlah
        summaryStats.paidCount++
      }
      return {
        label: t.keterangan || "Ujian",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      }
    })
    processedTransactions.push({
      type: "ujian",
      ...transactionConfig.ujian,
      items: ujianItems,
    })
  }

  // Process TKA transactions
  const tkaTransaksi = transaksi.filter((t: any) => t.jenis === "TKA")
  if (tkaTransaksi.length > 0) {
    const tkaItems = tkaTransaksi.map((t: any) => {
      const isPaid = t.status === "LUNAS"
      if (!isPaid) {
        summaryStats.totalUnpaid += t.jumlah
        summaryStats.unpaidCount++
      } else {
        summaryStats.totalPaid += t.jumlah
        summaryStats.paidCount++
      }
      return {
        label: t.keterangan || "Biaya TKA",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      }
    })
    processedTransactions.push({
      type: "tka",
      ...transactionConfig.tka,
      items: tkaItems,
    })
  }

  // Process Buku Pendamping transactions
  const bukuPendampingTransaksi = transaksi.filter((t: any) => t.jenis === "BUKU_PENDAMPING")
  if (bukuPendampingTransaksi.length > 0) {
    const bukuPendampingItems = bukuPendampingTransaksi.map((t: any) => {
      const isPaid = t.status === "LUNAS"
      if (!isPaid) {
        summaryStats.totalUnpaid += t.jumlah
        summaryStats.unpaidCount++
      } else {
        summaryStats.totalPaid += t.jumlah
        summaryStats.paidCount++
      }
      return {
        label: t.keterangan || "Buku Pendamping",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      }
    })
    processedTransactions.push({
      type: "buku-pendamping",
      ...transactionConfig["buku-pendamping"],
      items: bukuPendampingItems,
    })
  }

  // Filter for tagihan (unpaid bills only)
  const tagihanOnly = processedTransactions
    .filter(t => t.type !== "uang-saku")
    .map(t => ({
      ...t,
      items: t.items.filter(item => item.status === "Belum Lunas" || item.status === "Menunggu")
    }))
    .filter(t => t.items.length > 0)

  // Filter for aktivitas (payment history - paid items and uang saku)
  const aktivitasOnly = processedTransactions
    .map(t => ({
      ...t,
      items: t.type === "uang-saku" 
        ? t.items 
        : t.items.filter(item => item.status === "Lunas")
    }))
    .filter(t => t.items.length > 0)

  const santriName = santri?.nama || "Santri"
  const santriInitials = santriName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-20 md:pb-6">
      {/* Header with Profile */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/20">
              <AvatarImage src={santri?.foto} alt={santriName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-semibold text-sm md:text-base">
                {santriInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-xs md:text-sm text-muted-foreground">{getGreeting()},</p>
              <h1 className="text-base md:text-lg font-bold tracking-tight">{santriName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="rounded-full md:hidden">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-4 md:py-6 space-y-6">
        {/* BERANDA TAB */}
        {activeTab === "beranda" && (
          <>
            {/* Balance Card - Prominent */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white border-0 shadow-2xl shadow-primary/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className="text-sm md:text-base font-medium text-white/90">Saldo Uang Saku</span>
                  </div>
                  <Sparkles className="h-5 w-5 text-white/60 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="relative pt-0">
                <div className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
                  {formatCurrency(summaryStats.uangSakuBalance)}
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Aktif</span>
                  </div>
                  <span>•</span>
                  <span>Santri SMP</span>
                </div>
                <div className="flex gap-2 mt-4 md:mt-6">
                  <TopupButton className="flex-1 bg-white text-primary hover:bg-white/90 shadow-lg" />
                  <LaundryButton />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <Receipt className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">SPP</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Lunas</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Tagihan</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20">
                  <Shirt className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Laundry</span>
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                      Tagihan
                    </CardTitle>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 p-2.5 shadow-lg shadow-red-500/20">
                    <AlertCircle className="text-white h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </CardHeader>
                <CardContent className="relative px-4 pb-4">
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{formatCurrency(summaryStats.totalUnpaid)}</div>
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                      Dibayar
                    </CardTitle>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-2.5 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="text-white h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </CardHeader>
                <CardContent className="relative px-4 pb-4">
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(summaryStats.totalPaid)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500" style={{ width: `${Math.min((summaryStats.totalPaid / (summaryStats.totalUnpaid + summaryStats.totalPaid + 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-[10px] md:text-xs text-muted-foreground">{summaryStats.paidCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* TAGIHAN TAB */}
        {activeTab === "tagihan" && (
          <RealtimeTagihan
            initialTagihan={tagihanOnly}
            apiEndpoint="/api/santri/smp"
            refreshInterval={30000} // Refresh every 30 seconds
          />
        )}

        {/* AKTIVITAS TAB */}
        {activeTab === "aktivitas" && (
          <>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
            </div>
            
            {aktivitasOnly.length === 0 ? (
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
            ) : (
              <div className="flex flex-col gap-4">
                {aktivitasOnly.map((transaction) => (
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
                            className={`group/item flex flex-col md:flex-row md:items-center justify-between p-4 md:p-4 rounded-2xl border transition-all duration-300 ${colorClasses[transaction.color as keyof typeof colorClasses].hover} hover:shadow-md active:scale-[0.98]`}
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
                                  {item.balance && (
                                    <p className="text-xs text-muted-foreground">Saldo: {item.balance}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0 mt-3 md:mt-0">
                              <div className="text-right">
                                <Badge variant={statusBadgeVariant[item.status] || "outline"} className="shadow-sm text-xs rounded-full px-2.5 py-1">
                                  {statusIcons[item.status]}
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
              </div>
            )}
          </>
        )}

        {/* AKUN TAB */}
        {activeTab === "akun" && (
          <>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Informasi Akun</h2>
            </div>

            {/* Profile Card */}
            <Card className="overflow-hidden border-border/50 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20 mb-4">
                    <AvatarImage src={santri?.foto} alt={santriName} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-2xl">
                      {santriInitials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{santriName}</h3>
                  <p className="text-sm text-muted-foreground">Santri SMP</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="overflow-hidden border-border/50 rounded-2xl">
              <CardHeader className="px-4 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Detail Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                    <p className="text-sm font-medium">{santri?.nama || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{santri?.email || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">No. Telepon</p>
                    <p className="text-sm font-medium">{santri?.telepon || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Kelas</p>
                    <p className="text-sm font-medium">{santri?.kelas || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    <p className="text-sm font-medium">{santri?.alamat || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="overflow-hidden border-border/50 rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3" disabled>
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Button>
                <SignOutButton 
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive bg-transparent hover:bg-destructive/10"
                  variant="ghost"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="smp" />
    </div>
  )
}
