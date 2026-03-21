"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SantriSidebar } from "@/components/santri/santri-sidebar"
import { PWAProvider } from "@/components/santri/pwa-provider"
import { PaymentNotification } from "@/components/santri/payment-notification"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export default function SantriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine the role from the pathname
  const getRole = (): "smk" | "smp" | "pondok" | null => {
    if (pathname?.includes("/santri/smk")) return "smk"
    if (pathname?.includes("/santri/smp")) return "smp"
    if (pathname?.includes("/santri/pondok")) return "pondok"
    return null
  }

  const role = getRole()

  // Only show sidebar when in a specific role (smk, smp, or pondok)
  if (!role) {
    return (
      <>
        <PWAProvider />
        <Suspense fallback={null}>
          <PaymentNotification />
        </Suspense>
        {children}
      </>
    )
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="santri-theme">
      <PWAProvider />
      <Suspense fallback={null}>
        <PaymentNotification />
      </Suspense>
      <SidebarProvider>
        <SantriSidebar role={role} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <nav className="flex items-center gap-4">
              <Link href="/santri">
                <Button variant="ghost" size="sm">
                  Kembali
                </Button>
              </Link>
            </nav>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
