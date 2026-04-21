"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CreditCard, AlertCircle, Wallet, Plus, Receipt } from "lucide-react"

type SaldoType = "UANG_SAKU" | "TAGIHAN"

interface TopupDialogProps {
  onTopupComplete?: () => void
  trigger: React.ReactNode
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void
    }
  }
}

const PRESET_AMOUNTS = [
  { label: "50.000", value: 50000 },
  { label: "100.000", value: 100000 },
  { label: "200.000", value: 200000 },
  { label: "500.000", value: 500000 },
  { label: "1.000.000", value: 1000000 },
]

export function TopupDialog({
  onTopupComplete,
  trigger,
}: TopupDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [saldoType, setSaldoType] = useState<SaldoType>("UANG_SAKU")

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
      setAmount("")
      setSelectedPreset(null)
      setSaldoType("UANG_SAKU")
    }
  }, [open])

  const handlePresetClick = (value: number) => {
    setAmount(value.toString())
    setSelectedPreset(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAmount(value)
    setSelectedPreset(null)
  }

  const handleTopup = async () => {
    if (!snapLoaded) {
      setError("Payment gateway belum siap. Silakan coba lagi.")
      return
    }

    const numericAmount = parseInt(amount)
    if (!numericAmount || numericAmount < 10000) {
      setError("Minimal top-up adalah Rp 10.000")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call top-up API
      const response = await fetch("/api/payment/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          saldoType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Top-up failed")
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
          // Wait 2 seconds for database to update before refreshing UI
          // This prevents race condition where saldo hasn't been updated yet
          await new Promise(resolve => setTimeout(resolve, 2000))
          setOpen(false)
          setAmount("")
          setSelectedPreset(null)
          onTopupComplete?.()
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
          // Wait briefly for database to update
          await new Promise(resolve => setTimeout(resolve, 1000))
          // Payment is pending, user can close the dialog
          setOpen(false)
          setAmount("")
          setSelectedPreset(null)
          onTopupComplete?.()
        },
        onError: () => {
          setError("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: async () => {
          // User closed the popup without completing payment
          // Check status from Midtrans and cancel if still pending
          try {
            const statusResponse = await fetch("/api/payment/check-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderId: data.orderId }),
            })

            if (statusResponse.ok) {
              const statusData = await statusResponse.json()
              // If still pending in Midtrans, it means user didn't complete payment
              if (statusData.transactionStatus === "pending") {
                await fetch("/api/payment/cancel", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
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
      setError(err instanceof Error ? err.message : "An error occurred during top-up")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("id-ID").format(parseInt(value) || 0)
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
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5">
                <Wallet className="h-5 w-5 text-amber-600" />
              </div>
              Top Up Saldo
            </DialogTitle>
            <DialogDescription className="text-sm">
              Tambah saldo Anda dengan mudah dan aman
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Saldo Type Selector */}
            <div className="space-y-2">
              <Label>Pilih Jenis Saldo</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSaldoType("UANG_SAKU")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    saldoType === "UANG_SAKU"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    saldoType === "UANG_SAKU"
                      ? "bg-amber-100 dark:bg-amber-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <Wallet className={`h-4 w-4 ${
                      saldoType === "UANG_SAKU"
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      saldoType === "UANG_SAKU"
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>Uang Saku</p>
                    <p className="text-[10px] text-muted-foreground">Saldo harian</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSaldoType("TAGIHAN")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    saldoType === "TAGIHAN"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    saldoType === "TAGIHAN"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <Receipt className={`h-4 w-4 ${
                      saldoType === "TAGIHAN"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      saldoType === "TAGIHAN"
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>Saldo Tagihan</p>
                    <p className="text-[10px] text-muted-foreground">Bayar tagihan</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={selectedPreset === preset.value ? "default" : "outline"}
                  className={`h-10 text-sm transition-all ${
                    selectedPreset === preset.value
                      ? saldoType === "TAGIHAN"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                      : saldoType === "TAGIHAN"
                        ? "hover:border-blue-500"
                        : "hover:border-amber-500"
                  }`}
                  onClick={() => handlePresetClick(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0"
                  value={formatCurrency(amount)}
                  onChange={handleAmountChange}
                  className="pl-10 text-lg font-semibold"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimal top-up: Rp 10.000
              </p>
            </div>

            {/* Summary */}
            {amount && (
              <div className={`rounded-xl border p-4 space-y-2 ${
                saldoType === "TAGIHAN"
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800"
                  : "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800"
              }`}>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Jenis Saldo</span>
                  <span className={`font-semibold ${
                    saldoType === "TAGIHAN"
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}>
                    {saldoType === "TAGIHAN" ? "Saldo Tagihan" : "Uang Saku"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Jumlah Top Up</span>
                  <span className={`font-semibold ${
                    saldoType === "TAGIHAN"
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}>
                    Rp {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Gratis
                  </span>
                </div>
                <div className={`h-px ${
                  saldoType === "TAGIHAN"
                    ? "bg-blue-200 dark:bg-blue-800"
                    : "bg-amber-200 dark:bg-amber-800"
                }`} />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Bayar</span>
                  <span className={`font-bold text-lg ${
                    saldoType === "TAGIHAN"
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}>
                    Rp {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Methods Info */}
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
              <CreditCard className="h-4 w-4 mt-0.5 shrink-0" />
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
              onClick={handleTopup}
              disabled={loading || !amount || parseInt(amount) < 10000}
              className={`w-full ${
                saldoType === "TAGIHAN"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Top Up {saldoType === "TAGIHAN" ? "Saldo Tagihan" : "Uang Saku"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
