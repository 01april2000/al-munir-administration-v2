"use client"

import * as React from "react"
import type { ProcessedSantriData, SantriRole } from "@/lib/types/santri"

type TabType = "beranda" | "tagihan" | "aktivitas" | "akun"

interface SantriTabContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  role: SantriRole
  data: ProcessedSantriData | undefined
}

const SantriTabContext = React.createContext<SantriTabContextType | undefined>(undefined)

export function useSantriTabContext() {
  const context = React.useContext(SantriTabContext)
  if (!context) {
    throw new Error("useSantriTabContext must be used within SantriTabProvider")
  }
  return context
}

interface SantriTabProviderProps {
  children: React.ReactNode
  role: SantriRole
  initialTab?: TabType
  initialData?: ProcessedSantriData
}

export function SantriTabProvider({ children, role, initialTab = "beranda", initialData }: SantriTabProviderProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab)

  // Handle URL sync on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab")
    if (tabParam && ["beranda", "tagihan", "aktivitas", "akun"].includes(tabParam)) {
      setActiveTab(tabParam as TabType)
    }
  }, [])

  // Update URL when tab changes (without navigation)
  React.useEffect(() => {
    const url = new URL(window.location.href)
    if (activeTab === "beranda") {
      url.searchParams.delete("tab")
    } else {
      url.searchParams.set("tab", activeTab)
    }
    window.history.replaceState({}, "", url.toString())
  }, [activeTab])

  return (
    <SantriTabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        role,
        data: initialData,
      }}
    >
      {children}
    </SantriTabContext.Provider>
  )
}

export type { TabType, SantriTabContextType, SantriRole }
