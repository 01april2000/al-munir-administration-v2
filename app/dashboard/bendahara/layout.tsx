"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BendaharaSidebar } from "@/components/bendahara/bendahara-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function BendaharaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine the role from the pathname
  const getRole = (): "smk" | "smp" | "pondok" | null => {
    if (pathname?.startsWith("/dashboard/bendahara/smk")) return "smk"
    if (pathname?.startsWith("/dashboard/bendahara/smp")) return "smp"
    if (pathname?.startsWith("/dashboard/bendahara/pondok")) return "pondok"
    return null
  }

  const role = getRole()

  // Only show sidebar when in a specific role (smk, smp, or pondok)
  if (!role) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <BendaharaSidebar role={role} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex-1" />
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/bendahara">
              <Button variant="ghost" size="sm">
                Kembali
              </Button>
            </Link>
          </nav>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
