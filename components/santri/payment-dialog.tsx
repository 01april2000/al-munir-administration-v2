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

      // Open Midtrans Snap popup
      window.snap.pay(data.token, {
        onSuccess: async () => {
          // Check payment status from Midtrans API
          try {
            await fetch("/api/payment/check-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderId: data.orderId }),
            })
          } catch (error) {
            console.error("Error checking payment status:", error)
          }
          setOpen(false)
          onPaymentComplete?.()
        },
        onPending: async () => {
          // Check payment status from Midtrans API
          try {
            await fetch("/api/payment/check-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderId: data.orderId }),
            })
          } catch (error) {
            console.error("Error checking payment status:", error)
          }
          // Payment is pending, user can close the dialog
          setOpen(false)
          onPaymentComplete?.()
        },
        onError: () => {
          setError("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: () => {
          // User closed the popup without completing payment
          setLoading(false)
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during payment")
    } finally {
      // Only set loading to false if we're not waiting for Snap callback
      // The callback will handle it
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
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              Konfirmasi Pembayaran
            </DialogTitle>
            <DialogDescription className="text-sm">
              Anda akan melakukan pembayaran untuk tagihan berikut:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jenis Tagihan</span>
                <span className="font-medium text-sm">{jenis}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Keterangan</span>
                <span className="font-medium text-sm text-right max-w-[60%]">{label}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jumlah</span>
                <span className="font-bold text-xl text-primary">{amount}</span>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
              <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Pembayaran Aman</p>
                <p className="text-xs mt-1 opacity-80">
                  Pembayaran diproses melalui Midtrans dengan berbagai metode pembayaran yang tersedia.
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
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading || !snapLoaded}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
