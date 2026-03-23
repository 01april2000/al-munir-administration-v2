"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, XCircle, X, RefreshCw } from "lucide-react"

// Custom event for payment success to trigger data refresh
export const PAYMENT_SUCCESS_EVENT = "payment-success"

interface PaymentNotificationProps {
  onNotificationClose?: () => void
  onDataRefresh?: () => void // Callback to refresh data after successful payment
}

export function PaymentNotification({ onNotificationClose, onDataRefresh }: PaymentNotificationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [notification, setNotification] = useState<{
    status: "success" | "pending" | "error"
    type: string
    amount: string
    orderId?: string
  } | null>(null)

  // Handle redirect from Midtrans with query params
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status")
    const paymentType = searchParams.get("payment_type")
    const amount = searchParams.get("amount")
    const orderId = searchParams.get("order_id")

    if (paymentStatus && paymentType && amount) {
      setNotification({
        status: paymentStatus as "success" | "pending" | "error",
        type: paymentType,
        amount,
        orderId: orderId || undefined,
      })
      setIsVisible(true)

      // Clean up URL by removing query params
      const url = new URL(window.location.href)
      url.searchParams.delete("payment_status")
      url.searchParams.delete("payment_type")
      url.searchParams.delete("amount")
      url.searchParams.delete("order_id")
      url.searchParams.delete("refresh")
      router.replace(url.pathname + url.search, { scroll: false })

      // Clear pending payment from sessionStorage
      sessionStorage.removeItem("pendingPayment")

      // If payment is successful, refresh data immediately
      if (paymentStatus === "success") {
        // Call the data refresh callback if provided
        onDataRefresh?.()
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent(PAYMENT_SUCCESS_EVENT))
        // Also trigger router refresh for server-side data
        router.refresh()
      }

      // Auto-hide after timeout
      const timeout = paymentStatus === "success" ? 10000 : 15000
      setTimeout(() => {
        setIsVisible(false)
        onNotificationClose?.()
      }, timeout)
    }
  }, [searchParams, router, onNotificationClose, onDataRefresh])

  // Check for pending payment in sessionStorage (backup if redirect failed)
  useEffect(() => {
    const pendingPayment = sessionStorage.getItem("pendingPayment")
    if (pendingPayment && !notification) {
      try {
        const data = JSON.parse(pendingPayment)
        // Only check if payment was initiated less than 30 minutes ago
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
          // Show checking notification
          setNotification({
            status: "pending",
            type: data.jenis,
            amount: data.amount,
            orderId: data.orderId,
          })
          setIsVisible(true)
          setIsChecking(true)
          
          // Check payment status
          fetch("/api/payment/check-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId }),
          })
            .then(res => res.json())
            .then(result => {
              if (result.status === "success" || result.transactionStatus === "settlement") {
                setNotification(prev => prev ? { ...prev, status: "success" } : null)
              } else if (result.transactionStatus === "pending") {
                setNotification(prev => prev ? { ...prev, status: "pending" } : null)
              } else {
                setNotification(prev => prev ? { ...prev, status: "error" } : null)
              }
            })
            .catch(console.error)
            .finally(() => {
              setIsChecking(false)
              sessionStorage.removeItem("pendingPayment")
            })
        } else {
          // Old pending payment, clear it
          sessionStorage.removeItem("pendingPayment")
        }
      } catch (e) {
        console.error("Error parsing pending payment:", e)
        sessionStorage.removeItem("pendingPayment")
      }
    }
  }, [notification])

  const handleClose = () => {
    setIsVisible(false)
    onNotificationClose?.()
  }

  const handleManualRefresh = async () => {
    if (!notification?.orderId) return
    
    setIsChecking(true)
    try {
      await fetch("/api/payment/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: notification.orderId }),
      })
      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error("Error checking payment status:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!isVisible || !notification) {
    return null
  }

  const config = {
    success: {
      icon: <CheckCircle2 className="h-8 w-8" />,
      bgColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      title: "Pembayaran Berhasil!",
      message: `Pembayaran ${notification.type} sebesar ${notification.amount} telah berhasil diproses.`,
    },
    pending: {
      icon: <Clock className="h-8 w-8" />,
      bgColor: "bg-gradient-to-r from-amber-500 to-yellow-500",
      title: "Menunggu Pembayaran",
      message: `Pembayaran ${notification.type} sebesar ${notification.amount} sedang menunggu konfirmasi.`,
    },
    error: {
      icon: <XCircle className="h-8 w-8" />,
      bgColor: "bg-gradient-to-r from-red-500 to-rose-500",
      title: "Pembayaran Gagal",
      message: `Pembayaran ${notification.type} sebesar ${notification.amount} gagal diproses. Silakan coba lagi.`,
    },
  }

  const { icon, bgColor, title, message } = config[notification.status]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Notification Card */}
      <div 
        className={`relative ${bgColor} text-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-300`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-white/20 rounded-full">
            {isChecking ? (
              <RefreshCw className="h-8 w-8 animate-spin" />
            ) : (
              icon
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-2">
            {isChecking ? "Memeriksa Status..." : title}
          </h2>
          <p className="text-white/90 text-sm mb-4">{message}</p>

          {notification.orderId && (
            <p className="text-xs text-white/70 mb-4">
              Order ID: {notification.orderId}
            </p>
          )}

          {/* Status-specific actions */}
          {notification.status === "success" && !isChecking && (
            <div className="w-full bg-white/20 rounded-lg p-3">
              <p className="text-sm">
                ✅ Status pembayaran Anda telah diperbarui
              </p>
            </div>
          )}

          {notification.status === "pending" && !isChecking && (
            <div className="w-full space-y-3">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm">
                  💡 Silakan selesaikan pembayaran Anda. Klik tombol di bawah untuk memeriksa status pembayaran.
                </p>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={isChecking}
                className="w-full bg-white text-amber-600 font-semibold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isChecking ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Memeriksa...
                  </span>
                ) : (
                  "Cek Status Pembayaran"
                )}
              </button>
            </div>
          )}

          {notification.status === "error" && !isChecking && (
            <button
              onClick={handleClose}
              className="w-full bg-white text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
