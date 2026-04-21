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
import { Loader2, CreditCard, AlertCircle, CheckCircle2, Wallet } from "lucide-react"
import { logger } from "@/lib/logger"

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

  const isSaldoSufficient = santriSaldo >= totalAmount

  const handleSaldoPayment = async () => {
    if (selectedIds.length === 0) {
      setError("Pilih minimal satu tagihan untuk dibayar")
      return
    }

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
          tagihanIds: selectedIds,
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
        onSelectionChange([])
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
          onSelectionChange([])
          window.location.href = buildRedirectUrl("success")
        },
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
        onError: (result: any) => {
          console.error("Payment error:", result)
          setOpen(false)
          window.location.href = buildRedirectUrl("error")
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
                Batal Pilih
              </Button>
            </div>

            {/* Tagihan List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tagihanList.map((tagihan) => (
                <div
                  key={tagihan.tagihanId}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  onClick={() => handleToggle(tagihan.tagihanId)}
                >
                  <Checkbox
                    checked={selectedIds.includes(tagihan.tagihanId)}
                    onCheckedChange={() => handleToggle(tagihan.tagihanId)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tagihan.label}</p>
                    <p className="text-xs text-muted-foreground">{tagihan.jenis}</p>
                  </div>
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
                  disabled={saldoLoading || !isSaldoSufficient || selectedIds.length === 0}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "saldo"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  } ${(!isSaldoSufficient && !saldoLoading) || selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  {!isSaldoSufficient && !saldoLoading && totalAmount > 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      Saldo tidak mencukupi. Kekurangan: {formatCurrency(totalAmount - santriSaldo)}
                    </p>
                  )}
                </button>

                {/* Midtrans Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("midtrans")}
                  disabled={selectedIds.length === 0}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "midtrans"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  } ${selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    <><strong>Catatan:</strong> Saldo akan langsung dipotong untuk membayar tagihan terpilih.</>
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
                disabled={loading || selectedIds.length === 0 || (paymentMethod === "midtrans" && !snapLoaded) || (paymentMethod === "saldo" && !isSaldoSufficient)}
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
