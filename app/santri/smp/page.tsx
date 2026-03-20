import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, Wallet, Shirt, FileCheck, BookMarked, BookOpen, CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, CreditCard } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PaymentDialog } from "@/components/santri/payment-dialog"
import { TopupButton } from "@/components/santri/topup-button"
import { LaundryButton } from "@/components/santri/laundry-button"
import { Button } from "@/components/ui/button"

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

const colorClasses = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
}

const statusClasses = {
  Lunas: "bg-green-100 text-green-800",
  Menunggu: "bg-yellow-100 text-yellow-800",
  "Belum Lunas": "bg-red-100 text-red-800",
  in: "bg-green-100 text-green-600",
  out: "bg-red-100 text-red-600",
}

const statusIcons = {
  Lunas: <CheckCircle2 className="h-3 w-3 mr-1" />,
  Menunggu: <Clock className="h-3 w-3 mr-1" />,
  "Belum Lunas": <XCircle className="h-3 w-3 mr-1" />,
  in: <ArrowDown className="h-3 w-3 mr-1" />,
  out: <ArrowUp className="h-3 w-3 mr-1" />,
}

const transactionConfig: Record<
  TransactionType,
  { title: string; icon: React.ReactNode; color: keyof typeof colorClasses }
> = {
  spp: { title: "SPP", icon: <Receipt className="h-5 w-5" />, color: "blue" },
  syahriah: { title: "Syahriah", icon: <Receipt className="h-5 w-5" />, color: "green" },
  "uang-saku": { title: "Uang Saku", icon: <Wallet className="h-5 w-5" />, color: "yellow" },
  laundry: { title: "Laundry", icon: <Shirt className="h-5 w-5" />, color: "purple" },
  ujian: { title: "Ujian", icon: <FileCheck className="h-5 w-5" />, color: "red" },
  tka: { title: "TKA", icon: <BookMarked className="h-5 w-5" />, color: "indigo" },
  "buku-pendamping": { title: "Buku Pendamping", icon: <BookOpen className="h-5 w-5" />, color: "orange" },
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

export default async function SantriSMPPage() {
  const data = await getSantriData()
  const { tagihan, transaksi } = data

  // Process tagihan data
  const processedTransactions: TransactionData[] = []

  // Process SPP tagihan
  const sppTagihan = tagihan.filter((t: any) => t.jenis === "SPP")
  if (sppTagihan.length > 0) {
    processedTransactions.push({
      type: "spp",
      ...transactionConfig.spp,
      items: sppTagihan.map((t: any) => ({
        label: `${getMonthName(t.bulan)} ${t.tahun}`,
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu",
        date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
        tagihanId: t.id,
        rawAmount: t.jumlah,
      })),
    })
  }

  // Process Syahriah tagihan
  const syahriahTagihan = tagihan.filter((t: any) => t.jenis === "SYAHRIAH")
  if (syahriahTagihan.length > 0) {
    processedTransactions.push({
      type: "syahriah",
      ...transactionConfig.syahriah,
      items: syahriahTagihan.map((t: any) => ({
        label: `${getMonthName(t.bulan)} ${t.tahun}`,
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_LUNAS" ? "Belum Lunas" : "Menunggu",
        date: t.transaksi?.tanggalBayar ? formatDate(t.transaksi.tanggalBayar) : "-",
        tagihanId: t.id,
        rawAmount: t.jumlah,
      })),
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
    processedTransactions.push({
      type: "uang-saku",
      ...transactionConfig["uang-saku"],
      items: uangSakuItems,
    })
  }

  // Process Laundry transactions
  const laundryTransaksi = transaksi.filter((t: any) => t.jenis === "LAUNDRY")
  if (laundryTransaksi.length > 0) {
    processedTransactions.push({
      type: "laundry",
      ...transactionConfig.laundry,
      items: laundryTransaksi.map((t: any) => ({
        label: t.jenisLaundry || t.keterangan || "Laundry",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      })),
    })
  }

  // Process Ujian transactions (excluding TKA and Buku Pendamping)
  const ujianTransaksi = transaksi.filter((t: any) => t.jenis === "UJIAN")
  if (ujianTransaksi.length > 0) {
    processedTransactions.push({
      type: "ujian",
      ...transactionConfig.ujian,
      items: ujianTransaksi.map((t: any) => ({
        label: t.keterangan || "Ujian",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      })),
    })
  }

  // Process TKA transactions
  const tkaTransaksi = transaksi.filter((t: any) => t.jenis === "TKA")
  if (tkaTransaksi.length > 0) {
    processedTransactions.push({
      type: "tka",
      ...transactionConfig.tka,
      items: tkaTransaksi.map((t: any) => ({
        label: t.keterangan || "Biaya TKA",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      })),
    })
  }

  // Process Buku Pendamping transactions
  const bukuPendampingTransaksi = transaksi.filter((t: any) => t.jenis === "BUKU_PENDAMPING")
  if (bukuPendampingTransaksi.length > 0) {
    processedTransactions.push({
      type: "buku-pendamping",
      ...transactionConfig["buku-pendamping"],
      items: bukuPendampingTransaksi.map((t: any) => ({
        label: t.keterangan || "Buku Pendamping",
        amount: formatCurrency(t.jumlah),
        status: t.status === "LUNAS" ? "Lunas" : t.status === "BELUM_BAYAR" ? "Belum Lunas" : "Menunggu",
        date: t.tanggalBayar ? formatDate(t.tanggalBayar) : formatDate(t.createdAt),
        transaksiId: t.id,
        rawAmount: t.jumlah,
      })),
    })
  }

  // Calculate uang saku balance
  let uangSakuBalance = 0
  uangSakuTransaksi.forEach((t: any) => {
    if (t.statusUangSaku === "DITAMBAH") {
      uangSakuBalance += t.jumlah
    } else {
      uangSakuBalance -= t.jumlah
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tagihan & Transaksi</h1>
        <p className="text-muted-foreground">Semua tagihan dan riwayat transaksi Anda</p>
      </div>

      {/* Balance Card with Top-up Button */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Saldo Uang Saku</CardTitle>
                <p className="text-sm text-muted-foreground">Saldo Anda saat ini</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {formatCurrency(uangSakuBalance)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TopupButton className="w-full" />
        </CardContent>
      </Card>

      {processedTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada tagihan atau transaksi</p>
          </CardContent>
        </Card>
      ) : (
        processedTransactions.map((transaction) => (
          <Card key={transaction.type}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${colorClasses[transaction.color as keyof typeof colorClasses].bg} rounded-lg`}>
                    <div className={colorClasses[transaction.color as keyof typeof colorClasses].text}>
                      {transaction.icon}
                    </div>
                  </div>
                  <CardTitle>{transaction.title}</CardTitle>
                </div>
                {transaction.type === "laundry" && (
                  <LaundryButton />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 ${colorClasses[transaction.color as keyof typeof colorClasses].bg} rounded`}>
                        <div className={colorClasses[transaction.color as keyof typeof colorClasses].text}>
                          {transaction.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        {item.amount && <p className="text-xs text-muted-foreground">{item.amount}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses[item.status]}`}>
                        {statusIcons[item.status]}
                        {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      {item.balance && <p className="text-xs text-muted-foreground">Saldo: {item.balance}</p>}
                      {item.status === "Belum Lunas" && (item.tagihanId || item.transaksiId) && (
                        <PaymentDialog
                          tagihanId={item.tagihanId}
                          transaksiId={item.transaksiId}
                          jenis={transaction.title}
                          label={item.label}
                          amount={item.amount || ""}
                          rawAmount={item.rawAmount}
                          trigger={
                            <Button size="sm" className="mt-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                              <CreditCard data-icon="inline-start" className="mr-1" />
                              Bayar
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
        ))
      )}
    </div>
  )
}
