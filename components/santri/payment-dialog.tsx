"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CreditCard, AlertCircle, Wallet, CheckCircle2 } from "lucide-react"
import { logger } from "@/lib/logger"

interface PaymentDialogProps {
  tagihanId?: string
  transaksiId?: string
  jenis: string
  label: string
  amount: string
  rawAmount?: number
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

export function PaymentDialog({
  tagihanId,
  transaksiId,
  jenis,
  label,
  amount,
  rawAmount,
  onPaymentComplete,
  trigger,
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "saldo">("midtrans")
  const [santriSaldo, setSantriSaldo] = useState<number>(0)
  const [saldoLoading, setSaldoLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  // Fetch santri saldo (use saldoTagihan for bill payments)
  useEffect(() => {
    async function fetchSaldo() {
      try {
        const res = await fetch("/api/santri/saldo")
        if (res.ok) {
          const data = await res.json()
          setSantriSaldo(data.saldoTagihan ?? data.saldo)
        }
      } catch (error) {
        console.error("Error fetching saldo:", error)
      } finally {
        setSaldoLoading(false)
      }
    }
    
    if (open) {
      fetchSaldo()
    }
  }, [open])

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

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setError(null)
      setSuccess(false)
      setPaymentMethod("midtrans")
    }
  }, [open])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const isSaldoSufficient = rawAmount !== undefined && santriSaldo >= rawAmount

  const handleSaldoPayment = async () => {
    if (!isSaldoSufficient) {
      setError("Saldo tidak mencukupi untuk pembayaran ini")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payment/saldo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tagihanId,
          transaksiId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Pembayaran gagal")
      }

      // Show success state
      setSuccess(true)
      setSantriSaldo(data.remainingSaldo)
      
      // Call completion callback and close dialog after delay
      setTimeout(() => {
        onPaymentComplete?.()
        setOpen(false)
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat pembayaran")
    } finally {
      setLoading(false)
    }
  }

  const handleMidtransPayment = async () => {
    if (!snapLoaded) {
      setError("Payment gateway belum siap. Silakan coba lagi.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call payment create API
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tagihanId,
          transaksiId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Payment failed")
      }

      const data = await response.json()
      
      // Get current path for redirect URLs
      const currentPath = window.location.pathname
      
      // Build redirect URL with payment info
      const buildRedirectUrl = (status: string) => {
        const url = new URL(window.location.origin + currentPath)
        url.searchParams.set("payment_status", status)
        url.searchParams.set("payment_type", jenis)
        url.searchParams.set("amount", amount)
        url.searchParams.set("order_id", data.orderId)
        url.searchParams.set("refresh", Date.now().toString())
        return url.toString()
      }

      // Open Midtrans Snap popup with finish redirect URL
      // This ensures user is redirected back after payment on simulator
      window.snap.pay(data.token, {
        // Callback when payment is successful (for regular popup flow)
        onSuccess: async (result: any) => {
          logger.log("Payment success:", result)
          try {
            await fetch("/api/payment/check-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId }),
            })
          } catch (error) {
            console.error("Error checking payment status:", error)
          }
          setOpen(false)
          window.location.href = buildRedirectUrl("success")
        },
        // Callback when payment is pending
        onPending: async (result: any) => {
          logger.log("Payment pending:", result)
          try {
            await fetch("/api/payment/check-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId }),
            })
          } catch (error) {
            console.error("Error checking payment status:", error)
          }
          setOpen(false)
          window.location.href = buildRedirectUrl("pending")
        },
        // Callback when payment fails
        onError: (result: any) => {
          console.error("Payment error:", result)
          setOpen(false)
          window.location.href = buildRedirectUrl("error")
        },
        // Callback when user closes the popup
        onClose: () => {
          setLoading(false)
        },
      })
      
      // Also store orderId in sessionStorage as backup
      // User can manually check status if redirect fails
      sessionStorage.setItem("pendingPayment", JSON.stringify({
        orderId: data.orderId,
        jenis,
        amount,
        timestamp: Date.now(),
      }))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during payment")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const handlePayment = async () => {
    if (paymentMethod === "saldo") {
      await handleSaldoPayment()
    } else {
      await handleMidtransPayment()
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
              <CreditCard className="h-6 w-6 text-emerald-600" />
              Konfirmasi Pembayaran
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Anda akan membayar <span className="font-semibold text-foreground">{label}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Amount Display */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-6 text-center border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {amount}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Jenis: {jenis}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">Pembayaran berhasil! Sisa saldo: {formatCurrency(santriSaldo)}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Payment Method Selection */}
            {!success && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Pilih Metode Pembayaran:</p>
                
                {/* Saldo Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("saldo")}
                  disabled={saldoLoading || !isSaldoSufficient}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "saldo"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  } ${!isSaldoSufficient && !saldoLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        paymentMethod === "saldo" 
                          ? "bg-emerald-100 dark:bg-emerald-900" 
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <Wallet className={`h-5 w-5 ${
                          paymentMethod === "saldo" 
                            ? "text-emerald-600" 
                            : "text-gray-600 dark:text-gray-400"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">Bayar dengan Saldo</p>
                        <p className="text-xs text-muted-foreground">
                          {saldoLoading ? "Memuat..." : `Saldo: ${formatCurrency(santriSaldo)}`}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "saldo"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {paymentMethod === "saldo" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  {!isSaldoSufficient && !saldoLoading && rawAmount && (
                    <p className="text-xs text-red-500 mt-2">
                      Saldo tidak mencukupi. Kekurangan: {formatCurrency(rawAmount - santriSaldo)}
                    </p>
                  )}
                </button>

                {/* Midtrans Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("midtrans")}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "midtrans"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        paymentMethod === "midtrans" 
                          ? "bg-blue-100 dark:bg-blue-900" 
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          paymentMethod === "midtrans" 
                            ? "text-blue-600" 
                            : "text-gray-600 dark:text-gray-400"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">Bayar dengan Midtrans</p>
                        <p className="text-xs text-muted-foreground">
                          QRIS, Transfer Bank, E-Wallet, dll
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "midtrans"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {paymentMethod === "midtrans" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Payment Info */}
            {!success && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {paymentMethod === "saldo" ? (
                    <><strong>Catatan:</strong> Saldo akan langsung dipotong untuk membayar tagihan ini.</>
                  ) : (
                    <><strong>Catatan:</strong> Setelah klik "Bayar Sekarang", Anda akan diarahkan ke halaman pembayaran Midtrans. Selesaikan pembayaran dan Anda akan otomatis diarahkan kembali.</>
                  )}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              {success ? "Tutup" : "Batal"}
            </Button>
            {!success && (
              <Button
                onClick={handlePayment}
                disabled={loading || (paymentMethod === "midtrans" && !snapLoaded) || (paymentMethod === "saldo" && !isSaldoSufficient)}
                className={`flex-1 ${
                  paymentMethod === "saldo" 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {paymentMethod === "saldo" ? (
                      <Wallet className="h-4 w-4 mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Bayar {paymentMethod === "saldo" ? "dengan Saldo" : "Sekarang"}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
