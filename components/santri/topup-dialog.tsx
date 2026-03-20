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
import { Loader2, CreditCard, AlertCircle, Wallet, Plus } from "lucide-react"

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
          // Payment is pending, user can close the dialog
          setOpen(false)
          setAmount("")
          setSelectedPreset(null)
          onTopupComplete?.()
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
              Tambah saldo uang saku Anda dengan mudah dan aman
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={selectedPreset === preset.value ? "default" : "outline"}
                  className={`h-10 text-sm transition-all ${
                    selectedPreset === preset.value
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
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
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Jumlah Top Up</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Rp {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Gratis
                  </span>
                </div>
                <div className="h-px bg-amber-200 dark:bg-amber-800" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Bayar</span>
                  <span className="font-bold text-lg text-amber-700 dark:text-amber-400">
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
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Top Up Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
