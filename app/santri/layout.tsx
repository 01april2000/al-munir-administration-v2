"use client"

import * as React from "react"
import { Suspense } from "react"
import { PWAProvider } from "@/components/santri/pwa-provider"
import { PaymentNotification } from "@/components/santri/payment-notification"
import { ThemeProvider } from "@/components/theme-provider"

export default function SantriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="santri-theme">
      <PWAProvider />
      <Suspense fallback={null}>
        <PaymentNotification />
      </Suspense>
      {children}
    </ThemeProvider>
  )
}
