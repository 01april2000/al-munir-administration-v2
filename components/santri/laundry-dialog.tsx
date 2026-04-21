"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2, Shirt, AlertCircle, Calendar, Check } from "lucide-react"

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

const years = Array.from({ length: 3 }, (_, i) => currentYear + i)

export function LaundryDialog({
  onPaymentComplete,
  trigger,
}: LaundryDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value)
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

    const monthName = `${monthNames[selectedMonth - 1]} ${selectedYear}`
    const amountFormatted = `Rp ${formatCurrency(LAUNDRY_PRICE)}`

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

      // Get current path to determine santri base path
      const currentPath = window.location.pathname
      const santriBasePath = currentPath.includes('/smp') ? '/santri/smp' :
                             currentPath.includes('/smk') ? '/santri/smk' :
                             currentPath.includes('/pondok') ? '/santri/pondok' : '/santri'

      // Store pending payment in sessionStorage as backup for PWA mode
      // This allows the payment-notification component to check status even if redirect fails
      sessionStorage.setItem("pendingPayment", JSON.stringify({
        orderId: data.orderId,
        jenis: `Laundry ${monthName}`,
        amount: amountFormatted,
        timestamp: Date.now(),
      }))

      // Check if running in PWA standalone mode
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true ||
                    document.referrer.includes('android-app://')

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
          
          // Clear pending payment from sessionStorage since payment succeeded
          sessionStorage.removeItem("pendingPayment")
          
          setOpen(false)
          setSelectedMonth(null)
          
          // In PWA mode, use window.location.href for more reliable navigation
          // This ensures the page properly reloads and query params are processed
          const redirectUrl = `${santriBasePath}?payment_status=success&payment_type=Laundry ${monthName}&amount=${encodeURIComponent(amountFormatted)}&order_id=${data.orderId || ''}`
          
          if (isPWA) {
            // Use full page navigation in PWA mode to ensure notification appears
            window.location.href = redirectUrl
          } else {
            router.push(redirectUrl)
          }
          onPaymentComplete?.()
        },
        onPending: async () => {
          // Payment is pending (e.g., bank transfer waiting for confirmation)
          // Status remains PENDING until webhook confirms payment
          setOpen(false)
          setSelectedMonth(null)
          
          // Redirect to santri page with pending notification
          const redirectUrl = `${santriBasePath}?payment_status=pending&payment_type=Laundry ${monthName}&amount=${encodeURIComponent(amountFormatted)}&order_id=${data.orderId || ''}`
          
          if (isPWA) {
            window.location.href = redirectUrl
          } else {
            router.push(redirectUrl)
          }
          onPaymentComplete?.()
        },
        onError: () => {
          // Clear pending payment from sessionStorage
          sessionStorage.removeItem("pendingPayment")
          
          // Redirect to santri page with error notification
          const redirectUrl = `${santriBasePath}?payment_status=error&payment_type=Laundry ${monthName}&amount=${encodeURIComponent(amountFormatted)}`
          
          if (isPWA) {
            window.location.href = redirectUrl
          } else {
            router.push(redirectUrl)
          }
        },
        onClose: async () => {
          // User closed the popup without completing payment
          // Check status from Midtrans and cancel if still pending
          try {
            const statusResponse = await fetch("/api/payment/check-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId }),
            })

            if (statusResponse.ok) {
              const statusData = await statusResponse.json()
              if (statusData.transactionStatus === "pending") {
                // Clear pending payment from sessionStorage since we're cancelling
                sessionStorage.removeItem("pendingPayment")
                await fetch("/api/payment/cancel", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: data.orderId }),
                })
              }
            }
          } catch (error) {
            console.error("Error handling snap close:", error)
          }
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
    </>
  )
}
