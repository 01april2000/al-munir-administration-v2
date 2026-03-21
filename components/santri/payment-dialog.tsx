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
import { Loader2, CreditCard, AlertCircle, ExternalLink } from "lucide-react"

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

  const handlePayment = async () => {
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
          console.log("Payment success:", result)
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
          console.log("Payment pending:", result)
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

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Catatan:</strong> Setelah klik "Bayar Sekarang", Anda akan diarahkan ke halaman pembayaran Midtrans. 
                Selesaikan pembayaran dan Anda akan otomatis diarahkan kembali ke halaman ini dengan notifikasi hasil pembayaran.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading || !snapLoaded}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
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
