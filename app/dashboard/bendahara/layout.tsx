"use client"

import * as React from "react"
import { Suspense } from "react"
import { BendaharaSidebar } from "@/components/bendahara/bendahara-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserInfo } from "@/components/user-info"
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"

export default function BendaharaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()

  // Determine the role from the user session
  const getRole = (): "smk" | "smp" | "pondok" | null => {
    const userRole = session?.user?.role
    if (userRole === "BENDAHARA_SMK") return "smk"
    if (userRole === "BENDAHARA_SMP") return "smp"
    if (userRole === "BENDAHARA_PONDOK") return "pondok"
    return null
  }

  const role = getRole()

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Only show sidebar when user has a valid bendahara role
  if (!role) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <BendaharaSidebar role={role} />
      </Suspense>
      <SidebarInset>
        <header className="flex items-center gap-4 p-2">
          <SidebarTrigger />
          <div className="flex-1" />
          <UserInfo />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
