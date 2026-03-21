"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, XCircle, X } from "lucide-react"

interface PaymentNotificationProps {
  onNotificationClose?: () => void
}

export function PaymentNotification({ onNotificationClose }: PaymentNotificationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [notification, setNotification] = useState<{
    status: "success" | "pending" | "error"
    type: string
    amount: string
    orderId?: string
  } | null>(null)

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

      // Auto-hide after 10 seconds for success, 15 seconds for others
      const timeout = paymentStatus === "success" ? 10000 : 15000
      setTimeout(() => {
        setIsVisible(false)
        onNotificationClose?.()
      }, timeout)
    }
  }, [searchParams, router, onNotificationClose])

  const handleClose = () => {
    setIsVisible(false)
    onNotificationClose?.()
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
            {icon}
          </div>
          
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-white/90 text-sm mb-4">{message}</p>

          {notification.orderId && (
            <p className="text-xs text-white/70 mb-4">
              Order ID: {notification.orderId}
            </p>
          )}

          {/* Status-specific actions */}
          {notification.status === "success" && (
            <div className="w-full bg-white/20 rounded-lg p-3">
              <p className="text-sm">
                ✅ Status pembayaran Anda telah diperbarui
              </p>
            </div>
          )}

          {notification.status === "pending" && (
            <div className="w-full bg-white/20 rounded-lg p-3">
              <p className="text-sm">
                💡 Silakan selesaikan pembayaran Anda. Halaman akan otomatis diperbarui setelah pembayaran dikonfirmasi.
              </p>
            </div>
          )}

          {notification.status === "error" && (
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
