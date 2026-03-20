"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SantriSidebar } from "@/components/santri/santri-sidebar"
import { PWAProvider } from "@/components/santri/pwa-provider"
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
  const getRole = (): "smk" | "smp" | null => {
    if (pathname?.startsWith("/dashboard/santri/smk")) return "smk"
    if (pathname?.startsWith("/dashboard/santri/smp")) return "smp"
    return null
  }

  const role = getRole()

  // Only show sidebar when in a specific role (smk or smp)
  if (!role) {
    return (
      <>
        <PWAProvider />
        {children}
      </>
    )
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="santri-theme">
      <PWAProvider />
      <SidebarProvider>
        <SantriSidebar role={role} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <nav className="flex items-center gap-4">
              <Link href="/dashboard/santri">
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
