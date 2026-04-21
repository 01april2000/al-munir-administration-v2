"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Receipt, Wallet, Shirt, FileCheck, Briefcase, Trophy, BookOpen, BookMarked,
  CheckCircle2, Clock, XCircle, ArrowDown, ArrowUp, Calendar, CreditCard, FileText, Info
} from "lucide-react"
import type { TransactionItem, TransactionData } from "@/lib/types/santri"
import {
  colorClasses,
  statusBadgeVariant,
  formatCurrency,
  getMonthName,
} from "@/lib/santri-helpers"

// Transaction icon component
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
    case "LUNAS":
      return <CheckCircle2 {...iconProps} />
    case "Menunggu":
    case "PENDING":
      return <Clock {...iconProps} />
    case "Belum Lunas":
    case "BELUM_LUNAS":
    case "BELUM_BAYAR":
      return <XCircle {...iconProps} />
    case "in":
    case "DITAMBAH":
      return <ArrowDown {...iconProps} />
    case "out":
    case "DIAMBIL":
      return <ArrowUp {...iconProps} />
    default:
      return null
  }
}

function getMetodePembayaranLabel(metode: string | null): string {
  if (!metode) return "-"
  switch (metode) {
    case "CASH":
      return "Tunai"
    case "MIDTRANS":
      return "Midtrans (Online)"
    case "TRANSFER":
      return "Transfer Bank"
    case "SALDO":
      return "Saldo Uang Saku"
    default:
      return metode
  }
}

function getJenisLabel(jenis: string): string {
  switch (jenis) {
    case "SPP":
      return "SPP"
    case "SYAHRIAH":
      return "Syahriah"
    case "UANG_SAKU":
      return "Uang Saku"
    case "LAUNDRY":
      return "Laundry"
    case "UJIAN":
      return "Ujian"
    case "PKL":
      return "PKL"
    case "LKS":
      return "LKS"
    case "BUKU_PENDAMPING":
      return "Buku Pendamping"
    case "TKA":
      return "TKA"
    default:
      return jenis
  }
}

function formatDateString(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr))
}

// Detail row component
function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex shrink-0 items-center justify-center p-1.5 rounded-lg bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

// Loading skeleton for detail
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface TransaksiDetail {
  id: string
  kode: string
  jenis: string
  jumlah: number
  bulan?: string | null
  tahun?: number | null
  tanggalBayar?: string | null
  status: string
  statusUangSaku?: string | null
  jenisLaundry?: string | null
  keterangan?: string | null
  metodePembayaran?: string | null
  createdAt: string
  santri: {
    id: string
    nis: string
    nama: string
    kelas: string
  }
}

interface TagihanDetail {
  id: string
  kode: string
  jenis: string
  bulan: string
  tahun: number
  jumlah: number
  status: string
  jatuhTempo: string
  keterangan?: string | null
  createdAt: string
  santri: {
    id: string
    nis: string
    nama: string
    kelas: string
  }
  transaksi?: {
    id: string
    kode: string
    status: string
    tanggalBayar?: string | null
    metodePembayaran?: string | null
    keterangan?: string | null
    createdAt: string
  } | null
}

interface AktivitasDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: TransactionItem | null
  transaction: TransactionData | null
}

export function AktivitasDetailDialog({
  open,
  onOpenChange,
  item,
  transaction,
}: AktivitasDetailDialogProps) {
  const [detail, setDetail] = React.useState<TransaksiDetail | TagihanDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch detail when dialog opens
  React.useEffect(() => {
    if (!open || !item) {
      setDetail(null)
      setError(null)
      return
    }

    const currentItem = item

    async function fetchDetail() {
      setIsLoading(true)
      setError(null)
      try {
        if (currentItem.transaksiId) {
          const res = await fetch(`/api/transaksi/${currentItem.transaksiId}`)
          if (!res.ok) throw new Error("Gagal memuat detail transaksi")
          const data = await res.json()
          setDetail(data.transaksi)
        } else if (currentItem.tagihanId) {
          const res = await fetch(`/api/tagihan/${currentItem.tagihanId}`)
          if (!res.ok) throw new Error("Gagal memuat detail tagihan")
          const data = await res.json()
          setDetail(data.tagihan)
        }
      } catch (err) {
        console.error("Error fetching detail:", err)
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [open, item])

  const colorStyle = transaction
    ? colorClasses[transaction.color as keyof typeof colorClasses] || colorClasses.blue
    : colorClasses.blue

  const isTransaksi = detail && "metodePembayaran" in detail
  const isTagihan = detail && "jatuhTempo" in detail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`flex items-center justify-center p-2 bg-gradient-to-br ${colorStyle.gradient} rounded-xl shadow-lg`}>
              <div className="text-white">
                <TransactionIcon type={transaction?.type || ""} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate">Detail {transaction?.title || "Transaksi"}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Status Badge */}
        {item && (
          <div className="flex items-center gap-2">
            <Badge
              variant={statusBadgeVariant[item.status] || "outline"}
              className="shadow-sm text-xs rounded-full px-3 py-1"
            >
              <StatusIcon status={item.status} />
              {item.status === "in" ? "Masuk" : item.status === "out" ? "Keluar" : item.status}
            </Badge>
          </div>
        )}

        {isLoading && <DetailSkeleton />}

        {error && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Info className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!isLoading && !error && item && (
          <div className="flex flex-col">
            {/* Basic info from item */}
            <DetailRow
              icon={FileText}
              label="Keterangan"
              value={<span className="truncate">{item.label}</span>}
            />

            {item.rawAmount !== undefined && item.rawAmount !== null && (
              <DetailRow
                icon={CreditCard}
                label="Jumlah"
                value={<span className="font-bold text-base">{formatCurrency(item.rawAmount)}</span>}
              />
            )}

            {item.balance && (
              <DetailRow
                icon={Wallet}
                label="Saldo"
                value={item.balance}
              />
            )}

            <DetailRow
              icon={Calendar}
              label="Tanggal"
              value={item.date}
            />

            {/* Additional details from API */}
            {detail && (
              <>
                <Separator className="my-2" />

                {"kode" in detail && (
                  <DetailRow
                    icon={Receipt}
                    label="Kode"
                    value={<span className="font-mono text-xs">{detail.kode}</span>}
                  />
                )}

                {"jenis" in detail && (
                  <DetailRow
                    icon={FileText}
                    label="Jenis"
                    value={getJenisLabel(detail.jenis)}
                  />
                )}

                {isTransaksi && (
                  <>
                    {(detail as TransaksiDetail).bulan && (detail as TransaksiDetail).tahun && (
                      <DetailRow
                        icon={Calendar}
                        label="Periode"
                        value={`${getMonthName((detail as TransaksiDetail).bulan!)} ${(detail as TransaksiDetail).tahun}`}
                      />
                    )}
                    {(detail as TransaksiDetail).metodePembayaran && (
                      <DetailRow
                        icon={CreditCard}
                        label="Metode Pembayaran"
                        value={getMetodePembayaranLabel((detail as TransaksiDetail).metodePembayaran!)}
                      />
                    )}
                    {(detail as TransaksiDetail).tanggalBayar && (
                      <DetailRow
                        icon={Calendar}
                        label="Tanggal Bayar"
                        value={formatDateString((detail as TransaksiDetail).tanggalBayar)}
                      />
                    )}
                    {(detail as TransaksiDetail).keterangan && (
                      <DetailRow
                        icon={Info}
                        label="Catatan"
                        value={(detail as TransaksiDetail).keterangan}
                      />
                    )}
                  </>
                )}

                {isTagihan && (
                  <>
                    <DetailRow
                      icon={Calendar}
                      label="Periode"
                      value={`${getMonthName((detail as TagihanDetail).bulan)} ${(detail as TagihanDetail).tahun}`}
                    />
                    <DetailRow
                      icon={Calendar}
                      label="Jatuh Tempo"
                      value={formatDateString((detail as TagihanDetail).jatuhTempo)}
                    />
                    {(detail as TagihanDetail).keterangan && (
                      <DetailRow
                        icon={Info}
                        label="Catatan"
                        value={(detail as TagihanDetail).keterangan}
                      />
                    )}
                    {(detail as TagihanDetail).transaksi && (
                      <>
                        <Separator className="my-2" />
                        <p className="text-xs font-medium text-muted-foreground mb-1">Data Pembayaran</p>
                        <DetailRow
                          icon={Receipt}
                          label="Kode Transaksi"
                          value={<span className="font-mono text-xs">{(detail as TagihanDetail).transaksi!.kode}</span>}
                        />
                        <DetailRow
                          icon={CreditCard}
                          label="Metode Pembayaran"
                          value={getMetodePembayaranLabel((detail as TagihanDetail).transaksi!.metodePembayaran || null)}
                        />
                        {(detail as TagihanDetail).transaksi!.tanggalBayar && (
                          <DetailRow
                            icon={Calendar}
                            label="Tanggal Bayar"
                            value={formatDateString((detail as TagihanDetail).transaksi!.tanggalBayar)}
                          />
                        )}
                      </>
                    )}
                  </>
                )}

                <Separator className="my-2" />

                <DetailRow
                  icon={Info}
                  label="Dibuat"
                  value={formatDateString("createdAt" in detail ? detail.createdAt : null)}
                />
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
