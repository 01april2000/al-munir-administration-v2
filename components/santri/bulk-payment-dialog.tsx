"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"

interface TagihanItem {
  tagihanId: string
  label: string
  amount: string
  rawAmount: number
  jenis: string
}

interface BulkPaymentDialogProps {
  tagihanList: TagihanItem[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
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

export function BulkPaymentDialog({
  tagihanList,
  selectedIds,
  onSelectionChange,
  onPaymentComplete,
  trigger,
}: BulkPaymentDialogProps) {
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

  const handleSelectAll = () => {
    const allIds = tagihanList.map(t => t.tagihanId)
    onSelectionChange(allIds)
  }

  const handleDeselectAll = () => {
    onSelectionChange([])
  }

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const totalAmount = tagihanList
    .filter(t => selectedIds.includes(t.tagihanId))
    .reduce((sum, t) => sum + t.rawAmount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!snapLoaded) {
      setError("Payment gateway belum siap. Silakan coba lagi.")
      return
    }

    if (selectedIds.length === 0) {
      setError("Pilih minimal satu tagihan untuk dibayar")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call payment create API with tagihanIds array
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tagihanIds: selectedIds,
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
        url.searchParams.set("payment_type", "COMBINED")
        url.searchParams.set("amount", totalAmount.toString())
        url.searchParams.set("order_id", data.orderId)
        url.searchParams.set("refresh", Date.now().toString())
        return url.toString()
      }

      // Open Midtrans Snap popup
      window.snap.pay(data.token, {
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
          onSelectionChange([])
          window.location.href = buildRedirectUrl("success")
        },
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
        onError: (result: any) => {
          console.error("Payment error:", result)
          setOpen(false)
          window.location.href = buildRedirectUrl("error")
        },
        onClose: () => {
          setLoading(false)
        },
      })
      
      // Store orderId in sessionStorage as backup
      sessionStorage.setItem("pendingPayment", JSON.stringify({
        orderId: data.orderId,
        jenis: "COMBINED",
        amount: totalAmount,
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
        <DialogContent className="sm:max-w-lg mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              Bayar Tagihan Terpilih
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Pilih tagihan yang ingin dibayar sekaligus
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Select All / Deselect All */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Pilih Semua
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeselectAll}
                className="flex-1"
              >
                Hapus Pilihan
              </Button>
            </div>

            {/* Tagihan List */}
            <div className="space-y-2">
              {tagihanList.map((tagihan) => (
                <div
                  key={tagihan.tagihanId}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedIds.includes(tagihan.tagihanId)
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700"
                      : "bg-muted/50 border-border hover:bg-muted"
                  }`}
                >
                  <Checkbox
                    id={tagihan.tagihanId}
                    checked={selectedIds.includes(tagihan.tagihanId)}
                    onCheckedChange={() => handleToggle(tagihan.tagihanId)}
                  />
                  <label
                    htmlFor={tagihan.tagihanId}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-sm">{tagihan.label}</p>
                    <p className="text-xs text-muted-foreground">{tagihan.jenis}</p>
                  </label>
                  <p className="font-semibold text-sm">{tagihan.amount}</p>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-6 text-center border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-muted-foreground mb-1">
                Total Pembayaran ({selectedIds.length} tagihan)
              </p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalAmount)}
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
              disabled={loading || !snapLoaded || selectedIds.length === 0}
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
                  Bayar {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
