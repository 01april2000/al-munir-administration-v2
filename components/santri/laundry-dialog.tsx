"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Shirt, AlertCircle, Calendar, Check, CheckCircle2, Clock, XCircle, X } from "lucide-react"

interface LaundryDialogProps {
  onPaymentComplete?: () => void
  trigger: React.ReactNode
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void
    }
  }
}

const LAUNDRY_PRICE = 100000

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const years = Array.from({ length: 3 }, (_, i) => currentYear + i)

type PaymentNotificationStatus = "success" | "pending" | "error" | null

export function LaundryDialog({
  onPaymentComplete,
  trigger,
}: LaundryDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [notification, setNotification] = useState<{
    status: PaymentNotificationStatus
    amount: number
    month: string
  } | null>(null)

  // Load Midtrans Snap script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.snap) {
      const script = document.createElement("script")
      script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 
        "https://app.sandbox.midtrans.com/snap/snap.js"
      script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "")
      script.async = true
      script.onload = () => {
        setSnapLoaded(true)
      }
      script.onerror = () => {
        setError("Gagal memuat payment gateway")
      }
      document.body.appendChild(script)
    } else if (window.snap) {
      setSnapLoaded(true)
    }
  }, [])

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month)
  }

  const handlePayment = async () => {
    if (!snapLoaded) {
      setError("Payment gateway belum siap. Silakan coba lagi.")
      return
    }

    if (!selectedMonth || !selectedYear) {
      setError("Silakan pilih bulan dan tahun laundry")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call laundry payment API
      const response = await fetch("/api/payment/laundry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bulan: selectedMonth.toString().padStart(2, "0"),
          tahun: selectedYear,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Pembayaran laundry gagal")
      }

      const data = await response.json()

      // Open Midtrans Snap popup
      window.snap.pay(data.token, {
        onSuccess: async () => {
          // Payment is successful - directly update status to LUNAS
          try {
            await fetch("/api/payment/laundry/confirm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderId: data.orderId }),
            })
          } catch (error) {
            console.error("Error confirming payment:", error)
          }
          setOpen(false)
          setSelectedMonth(null)
          // Show success notification
          setNotification({
            status: "success",
            amount: LAUNDRY_PRICE,
            month: `${monthNames[selectedMonth! - 1]} ${selectedYear}`,
          })
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          onPaymentComplete?.()
        },
        onPending: async () => {
          // Payment is pending (e.g., bank transfer waiting for confirmation)
          // Status remains PENDING until webhook confirms payment
          setOpen(false)
          setSelectedMonth(null)
          // Show pending notification
          setNotification({
            status: "pending",
            amount: LAUNDRY_PRICE,
            month: `${monthNames[selectedMonth! - 1]} ${selectedYear}`,
          })
          // Auto-hide notification after 8 seconds
          setTimeout(() => {
            setNotification(null)
          }, 8000)
          onPaymentComplete?.()
        },
        onError: () => {
          // Show error notification
          setNotification({
            status: "error",
            amount: LAUNDRY_PRICE,
            month: `${monthNames[selectedMonth! - 1]} ${selectedYear}`,
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        },
        onClose: () => {
          // User closed the popup without completing payment
          setLoading(false)
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pembayaran")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value)
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5">
                <Shirt className="h-5 w-5 text-purple-600" />
              </div>
              Bayar Laundry
            </DialogTitle>
            <DialogDescription className="text-sm">
              Pilih bulan laundry yang ingin Anda bayar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Year Selection */}
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    type="button"
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`h-10 text-sm transition-all ${
                      selectedYear === year
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                        : "hover:border-purple-500"
                    }`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>

            {/* Month Selection */}
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((month, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedMonth === index + 1 ? "default" : "outline"}
                    className={`h-10 text-xs transition-all ${
                      selectedMonth === index + 1
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                        : "hover:border-purple-500"
                    }`}
                    onClick={() => handleMonthClick(index + 1)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedMonth && selectedYear && (
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800 p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Bulan Laundry</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">
                    {monthNames[selectedMonth - 1]} {selectedYear}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">
                    Rp {formatCurrency(LAUNDRY_PRICE)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Gratis
                  </span>
                </div>
                <div className="h-px bg-purple-200 dark:bg-purple-800" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Bayar</span>
                  <span className="font-bold text-lg text-purple-700 dark:text-purple-400">
                    Rp {formatCurrency(LAUNDRY_PRICE)}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Methods Info */}
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Metode Pembayaran</p>
                <p className="text-xs mt-1 opacity-80">
                  Transfer Bank (BCA, BNI, BRI, Mandiri), GoPay, ShopeePay, QRIS, dan Kartu Kredit
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              onClick={handlePayment}
              disabled={loading || !selectedMonth || !selectedYear}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Bayar Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Notification */}
      {notification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setNotification(null)}
          />
          
          {/* Notification Card */}
          <div
            className={`relative text-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-300 ${
              notification.status === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-500"
                : notification.status === "pending"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                : "bg-gradient-to-r from-red-500 to-rose-500"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setNotification(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-white/20 rounded-full">
                {notification.status === "success" ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : notification.status === "pending" ? (
                  <Clock className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}
              </div>
              
              <h2 className="text-xl font-bold mb-2">
                {notification.status === "success"
                  ? "Pembayaran Berhasil!"
                  : notification.status === "pending"
                  ? "Menunggu Pembayaran"
                  : "Pembayaran Gagal"}
              </h2>
              <p className="text-white/90 text-sm mb-2">
                {notification.status === "success"
                  ? `Pembayaran Laundry ${notification.month} sebesar Rp ${formatCurrency(notification.amount)} telah berhasil diproses.`
                  : notification.status === "pending"
                  ? `Pembayaran Laundry ${notification.month} sebesar Rp ${formatCurrency(notification.amount)} sedang menunggu konfirmasi.`
                  : `Pembayaran Laundry ${notification.month} sebesar Rp ${formatCurrency(notification.amount)} gagal diproses. Silakan coba lagi.`}
              </p>

              {notification.status === "success" && (
                <div className="w-full bg-white/20 rounded-lg p-3 mt-2">
                  <p className="text-sm">
                    ✅ Status pembayaran Anda telah diperbarui
                  </p>
                </div>
              )}

              {notification.status === "pending" && (
                <div className="w-full bg-white/20 rounded-lg p-3 mt-2">
                  <p className="text-sm">
                    💡 Silakan selesaikan pembayaran Anda. Status akan diperbarui secara otomatis setelah pembayaran dikonfirmasi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
