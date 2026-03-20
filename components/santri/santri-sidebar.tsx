"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  User,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Wallet,
  Shirt,
  Home,
  Receipt,
  FileCheck,
  Briefcase,
  Trophy,
  BookOpen,
  BookMarked,
  DollarSign,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type SantriRole = "smk" | "smp"

interface SantriSidebarProps {
  role: SantriRole
}

export function SantriSidebar({ role }: SantriSidebarProps) {
  const pathname = usePathname()
  const basePath = `/dashboard/santri/${role}`
  const isTransaksiPath = pathname?.startsWith(`${basePath}/transaksi`)
  const [isTransaksiOpen, setIsTransaksiOpen] = React.useState(isTransaksiPath ?? false)

  React.useEffect(() => {
    if (isTransaksiPath) {
      setIsTransaksiOpen(true)
    }
  }, [isTransaksiPath])

  const getRoleTitle = () => {
    switch (role) {
      case "smk":
        return "Santri SMK"
      case "smp":
        return "Santri SMP"
      default:
        return "Santri"
    }
  }

  const getTransaksiItems = () => {
    switch (role) {
      case "smk":
        return [
          { href: "spp", label: "SPP", icon: Receipt },
          { href: "syahriah", label: "Syahriah", icon: Receipt },
          { href: "uang-saku", label: "Uang Saku", icon: DollarSign },
          { href: "laundry", label: "Laundry", icon: Shirt },
          { href: "ujian", label: "Ujian", icon: FileCheck },
          { href: "pkl", label: "PKL", icon: Briefcase },
          { href: "lks", label: "LKS", icon: Trophy },
        ]
      case "smp":
        return [
          { href: "spp", label: "SPP", icon: Receipt },
          { href: "syahriah", label: "Syahriah", icon: Receipt },
          { href: "uang-saku", label: "Uang Saku", icon: DollarSign },
          { href: "laundry", label: "Laundry", icon: Shirt },
          { href: "ujian", label: "Ujian", icon: FileCheck },
          { href: "tka", label: "TKA", icon: BookMarked },
          { href: "buku-pendamping", label: "Buku Pendamping", icon: BookOpen },
        ]
      default:
        return []
    }
  }

  const transaksiItems = getTransaksiItems()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-semibold">{getRoleTitle()}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <a href={basePath}>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <a href={`${basePath}/profil`}>
                      <User className="h-4 w-4" />
                      <span>Profil Saya</span>
                    </a>
                  }
                />
              </SidebarMenuItem>


              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
                  isActive={isTransaksiOpen}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Riwayat Transaksi</span>
                  {isTransaksiOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
                {isTransaksiOpen && (
                  <SidebarMenuSub>
                    {transaksiItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            render={
                              <a href={`${basePath}/transaksi/${item.href}`}>
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </a>
                            }
                          />
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

            
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
