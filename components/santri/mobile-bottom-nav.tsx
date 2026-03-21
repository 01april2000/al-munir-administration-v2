"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Receipt,
  History,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSantriTabContext, TabType } from "./santri-tab-context"

interface MobileBottomNavProps {
  role: "smk" | "smp" | "pondok"
}

const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda", icon: LayoutDashboard },
  { id: "tagihan", label: "Tagihan", icon: Receipt },
  { id: "aktivitas", label: "Aktivitas", icon: History },
  { id: "akun", label: "Akun", icon: User },
]

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const { activeTab, setActiveTab } = useSantriTabContext()

  const handleTabClick = React.useCallback(
    (tabId: TabType) => {
      // Instant tab switch - no navigation needed
      setActiveTab(tabId)
    },
    [setActiveTab]
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around h-16 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground",
                "active:scale-95"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "scale-110" : "scale-100"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
