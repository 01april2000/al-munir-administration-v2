"use client"

import { useEffect, useState } from "react"

export function PWAProvider() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showUpdateToast, setShowUpdateToast] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
          setRegistration(registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update toast
                  setShowUpdateToast(true)
                }
              })
            }
          })

          // Check for updates every 5 minutes
          setInterval(() => {
            registration.update().catch(console.error)
          }, 5 * 60 * 1000)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })

      // Handle controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Auto reload when new service worker takes over
        window.location.reload()
      })
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstallable(false)
    }

    setDeferredPrompt(null)
  }

  const handleUpdateClick = () => {
    if (registration?.waiting) {
      // Tell the waiting service worker to activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    setShowUpdateToast(false)
  }

  return (
    <>
      {/* Update Available Toast */}
      {showUpdateToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3">
          <span className="text-sm">Update tersedia!</span>
          <button
            onClick={handleUpdateClick}
            className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Sekarang
          </button>
        </div>
      )}

      {/* Install PWA Button */}
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-24 right-4 z-50 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
          Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
        </div>
      )}
    </>
  )
}
