"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Shirt,
  FileCheck,
  Briefcase,
  Trophy,
  BookOpen,
  BookMarked,
  DollarSign,
} from "lucide-react"

type SantriRole = "smk" | "smp"

interface MobileBottomNavProps {
  role: SantriRole
}

const navItems = {
  smk: [
    { href: "/santri/smk", label: "Beranda", icon: LayoutDashboard },
    { href: "/santri/smk?tab=spp", label: "SPP", icon: Receipt },
    { href: "/santri/smk?tab=uang-saku", label: "Uang Saku", icon: Wallet },
    { href: "/santri/smk?tab=laundry", label: "Laundry", icon: Shirt },
  ],
  smp: [
    { href: "/santri/smp", label: "Beranda", icon: LayoutDashboard },
    { href: "/santri/smp?tab=spp", label: "SPP", icon: Receipt },
    { href: "/santri/smp?tab=uang-saku", label: "Uang Saku", icon: Wallet },
    { href: "/santri/smp?tab=laundry", label: "Laundry", icon: Shirt },
  ],
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()
  const items = navItems[role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around h-16 safe-area-bottom">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "scale-110" : "scale-100"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
