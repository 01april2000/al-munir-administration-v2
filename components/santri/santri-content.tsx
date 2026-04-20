"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Receipt, Wallet, Shirt, FileCheck, Briefcase, Trophy, BookOpen, BookMarked,
  CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, TrendingUp, AlertCircle,
  Bell, User, MoreHorizontal, Sparkles, Settings, School,
  Mail, Phone, MapPin, RefreshCw
} from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
import { TopupButton } from "@/components/santri/topup-button"
import { LaundryButton } from "@/components/santri/laundry-button"
import { MobileBottomNav } from "@/components/santri/mobile-bottom-nav"
import { DesktopSidebar } from "@/components/santri/desktop-sidebar"
import { SignOutButton } from "@/components/sign-out-button"
import { TagihanTabContent } from "@/components/santri/tagihan-tab-content"
import { AktivitasTabContent } from "@/components/santri/aktivitas-tab-content"
import { useSantriTabContext } from "@/components/santri/santri-tab-context"
import { TransactionHistoryDialog } from "@/components/santri/transaction-history-dialog"
import { NotificationDialog } from "@/components/santri/notification-dialog"
import {
  colorClasses,
  statusBadgeVariant,
  formatCurrency,
  getGreeting,
  smkTransactionConfig,
  smpTransactionConfig,
  getQuickActions,
  getRoleLabel,
} from "@/lib/santri-helpers"
import type { ProcessedSantriData, SantriRole } from "@/lib/types/santri"

// Transaction icon component - simple lookup
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

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-20 md:pb-6">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="px-4 md:px-6 py-4 md:py-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// Reusable account detail item component
function AccountDetailItem({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string | null 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  )
}

// Reusable summary card component
function SummaryCard({ 
  title, 
  value, 
  count, 
  icon: Icon, 
  colorScheme 
}: { 
  title: string
  value: number
  count: number
  icon: React.ComponentType<{ className?: string }>
  colorScheme: "red" | "green"
}) {
  const colors = {
    red: {
      gradient: "from-red-500 to-rose-600",
      shadow: "shadow-red-500/20",
      bgGradient: "from-red-500/5 to-rose-500/5",
      textGradient: "from-red-600 to-rose-600",
    },
    green: {
      gradient: "from-emerald-500 to-green-600",
      shadow: "shadow-emerald-500/20",
      bgGradient: "from-emerald-500/5 to-green-500/5",
      textGradient: "from-emerald-600 to-green-600",
    },
  }
  const c = colors[colorScheme]
  const total = value + 1 // Avoid division by zero
  
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-${colorScheme === 'red' ? 'red' : 'emerald'}-500/10 hover:-translate-y-1 active:scale-[0.98]">
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative px-4 py-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} p-2.5 shadow-lg ${c.shadow}`}>
          <Icon className="text-white h-4 w-4 md:h-5 md:w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative px-4 pb-4">
        <div className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${c.textGradient} bg-clip-text text-transparent`}>
          {formatCurrency(value)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${c.gradient} transition-all duration-500`} 
              style={{ width: `${Math.min((value / total) * 100, 100)}%` }} 
            />
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground">{count}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface SantriContentProps {
  role: SantriRole
  initialData?: ProcessedSantriData
}

export function SantriContent({ role, initialData }: SantriContentProps) {
  const context = useSantriTabContext()
  // Use initialData if provided (from Server Component), otherwise use context
  const data = initialData ?? context.data
  const activeTab = context.activeTab
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [notificationOpen, setNotificationOpen] = React.useState(false)
  const [selectedTransactionType, setSelectedTransactionType] = React.useState<string | null>(null)

  const router = useRouter()
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Use router.refresh() to refetch server component data
    // This avoids full page reload which can lose session cookies
    router.refresh()
    // Give a brief moment for the refresh to complete
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleQuickActionClick = (type: string) => {
    setSelectedTransactionType(type)
    setDialogOpen(true)
  }

  if (!data) {
    return <LoadingSkeleton />
  }

  const { summaryStats, tagihanOnly, aktivitasOnly, santri, santriName, santriInitials, processedTransactions } = data

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Desktop Sidebar */}
      <DesktopSidebar role={role} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-6">
      {/* Header with Profile */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/20">
              <AvatarImage src={santri?.foto ?? undefined} alt={santriName} />
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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh halaman"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setNotificationOpen(true)}
              title="Riwayat notifikasi transaksi"
            >
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
            {/* Balance Cards - Saldo Tagihan & Saldo Uang Saku */}
            <div className="grid grid-cols-2 gap-3">
              {/* Saldo Tagihan Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white shadow-2xl shadow-blue-500/20 flex flex-col">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
                <div className="relative pb-1 px-4 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-white/90">Saldo Tagihan</span>
                  </div>
                </div>
                <div className="relative pt-0 px-4 pb-4">
                  <div className="text-lg md:text-2xl font-bold tracking-tight">
                    {formatCurrency(summaryStats.saldoTagihan)}
                  </div>
                  <p className="text-[10px] text-white/70 mt-1">Untuk bayar tagihan</p>
                </div>
              </div>

              {/* Saldo Uang Saku Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-background shadow-2xl shadow-primary/20 flex flex-col">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
                <div className="relative pb-1 px-4 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-background/90">Saldo Uang Saku</span>
                  </div>
                </div>
                <div className="relative pt-0 px-4 pb-4">
                  <div className="text-lg md:text-2xl font-bold tracking-tight">
                    {formatCurrency(summaryStats.uangSakuBalance)}
                  </div>
                  <p className="text-[10px] text-background/70 mt-1">Uang saku harian</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <TopupButton className="flex-1" />
              <LaundryButton />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {getQuickActions(role).map((action) => (
                <Button
                  key={action.type}
                  variant="outline"
                  className="flex flex-col gap-2 h-auto py-4 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleQuickActionClick(action.type)}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[smkTransactionConfig[action.type]?.color || smpTransactionConfig[action.type]?.color || "blue"].gradient} text-white shadow-lg`}>
                    <TransactionIcon type={action.type} />
                  </div>
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard 
                title="Tagihan" 
                value={summaryStats.totalUnpaid} 
                count={summaryStats.unpaidCount} 
                icon={AlertCircle} 
                colorScheme="red" 
              />
              <SummaryCard 
                title="Dibayar" 
                value={summaryStats.totalPaid} 
                count={summaryStats.paidCount} 
                icon={CheckCircle2} 
                colorScheme="green" 
              />
            </div>
          </>
        )}

        {/* TAGIHAN TAB - With Infinite Scroll */}
        {activeTab === "tagihan" && (
          <TagihanTabContent
            role={role}
            initialData={tagihanOnly as any}
            initialCursor={null}
            initialHasMore={false}
          />
        )}

        {/* AKTIVITAS TAB - With Infinite Scroll */}
        {activeTab === "aktivitas" && (
          <AktivitasTabContent
            role={role}
            initialData={aktivitasOnly as any}
            initialCursor={null}
            initialHasMore={false}
          />
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
                    <AvatarImage src={santri?.foto ?? undefined} alt={santriName} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-2xl">
                      {santriInitials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{santriName}</h3>
                  <p className="text-sm text-muted-foreground">{getRoleLabel(role)}</p>
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
                <AccountDetailItem icon={User} label="Nama Lengkap" value={santri?.nama} />
                <AccountDetailItem icon={Mail} label="Email" value={santri?.email} />
                <AccountDetailItem icon={Phone} label="No. Telepon" value={santri?.telepon} />
                <AccountDetailItem icon={School} label="Kelas" value={santri?.kelas} />
                <AccountDetailItem icon={MapPin} label="Alamat" value={santri?.alamat} />
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
        <MobileBottomNav role={role} />

        {/* Transaction History Dialog */}
        <TransactionHistoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transactionType={selectedTransactionType}
          role={role}
          transactions={processedTransactions}
        />

        {/* Notification Dialog */}
        <NotificationDialog
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
          transactions={processedTransactions}
        />
      </div>
    </div>
  )
}
