import { SantriRole } from "@/lib/types/santri"

// Color classes for transaction types
export const colorClasses = {
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
} as const

export const statusBadgeVariant = {
  Lunas: "secondary",
  Menunggu: "outline",
  "Belum Lunas": "destructive",
  in: "secondary",
  out: "destructive",
  Gagal: "destructive",
} as const

export const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function getMonthName(bulan: string): string {
  const monthIndex = parseInt(bulan) - 1
  return monthNames[monthIndex] || bulan
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

// Transaction type definitions per role
export const smkTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  spp: { title: "SPP", color: "blue" },
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
  ujian: { title: "Ujian", color: "red" },
  pkl: { title: "PKL", color: "indigo" },
  lks: { title: "LKS", color: "orange" },
}

export const smpTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  spp: { title: "SPP", color: "blue" },
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
  ujian: { title: "Ujian", color: "red" },
  tka: { title: "TKA", color: "indigo" },
  "buku-pendamping": { title: "Buku Pendamping", color: "orange" },
}

export const pondokTransactionConfig: Record<string, { title: string; color: keyof typeof colorClasses }> = {
  syahriah: { title: "Syahriah", color: "green" },
  "uang-saku": { title: "Uang Saku", color: "yellow" },
  laundry: { title: "Laundry", color: "purple" },
}

// Quick action configurations per role
export const smkQuickActions = [
  // { type: "spp", title: "SPP", icon: "Receipt" }, // Disabled
  { type: "syahriah", title: "Syahriah", icon: "Receipt" },
  { type: "uang-saku", title: "Uang Saku", icon: "Wallet" },
  { type: "laundry", title: "Laundry", icon: "Shirt" },
  { type: "ujian", title: "Ujian", icon: "FileCheck" },
  { type: "pkl", title: "PKL", icon: "Briefcase" },
  { type: "lks", title: "LKS", icon: "Trophy" },
] as const

export const smpQuickActions = [
  // { type: "spp", title: "SPP", icon: "Receipt" }, // Disabled
  { type: "syahriah", title: "Syahriah", icon: "Receipt" },
  { type: "uang-saku", title: "Uang Saku", icon: "Wallet" },
  { type: "laundry", title: "Laundry", icon: "Shirt" },
  { type: "ujian", title: "Ujian", icon: "FileCheck" },
  { type: "buku-pendamping", title: "Buku Pendamping", icon: "BookMarked" },
] as const

export const pondokQuickActions = [
  { type: "uang-saku", title: "Uang Saku", icon: "Wallet" },
  { type: "laundry", title: "Laundry", icon: "Shirt" },
] as const

export function getQuickActions(role: SantriRole) {
  switch (role) {
    case "smk":
      return smkQuickActions
    case "smp":
      return smpQuickActions
    case "pondok":
      return pondokQuickActions
    default:
      return smkQuickActions
  }
}

export function getTransactionConfig(role: SantriRole) {
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

export function getRoleLabel(role: SantriRole): string {
  switch (role) {
    case "smk":
      return "Santri SMK"
    case "smp":
      return "Santri SMP"
    case "pondok":
      return "Santri Pondok"
    default:
      return "Santri"
  }
}