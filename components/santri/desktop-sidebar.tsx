"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Receipt,
  History,
  User,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSantriTabContext, TabType } from "./santri-tab-context"
import { Separator } from "@/components/ui/separator"

interface DesktopSidebarProps {
  role: "smk" | "smp" | "pondok"
}

const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda", icon: LayoutDashboard },
  { id: "tagihan", label: "Tagihan", icon: Receipt },
  { id: "aktivitas", label: "Aktivitas", icon: History },
  { id: "akun", label: "Akun", icon: User },
]

export function DesktopSidebar({ role }: DesktopSidebarProps) {
  const { activeTab, setActiveTab } = useSantriTabContext()

  const handleTabClick = React.useCallback(
    (tabId: TabType) => {
      setActiveTab(tabId)
    },
    [setActiveTab]
  )

  const getRoleTitle = () => {
    switch (role) {
      case "smk":
        return "Santri SMK"
      case "smp":
        return "Santri SMP"
      case "pondok":
        return "Santri Pondok"
      default:
        return "Santri"
    }
  }

  const getRoleBadge = () => {
    switch (role) {
      case "smk":
        return "SMK"
      case "smp":
        return "SMP"
      case "pondok":
        return "Pondok"
      default:
        return ""
    }
  }

  const getRoleBadgeColor = () => {
    switch (role) {
      case "smk":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "smp":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "pondok":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-background border-r border-border/50 fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{getRoleTitle()}</span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full w-fit mt-0.5", getRoleBadgeColor())}>
            {getRoleBadge()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Menu Utama
          </span>
        </div>
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
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
              </div>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Online</span>
        </div>
      </div>
    </aside>
  )
}
