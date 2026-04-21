"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Users,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  Receipt,
  FileCheck,
  Briefcase,
  Trophy,
  Home,
  BookOpen,
  Shirt,
  DollarSign,
  FileText,
  BookMarked,
  Sparkles,
  FileBarChart,
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
import { ModeToggle } from "@/components/theme-toggle"

type BendaharaRole = "smk" | "smp" | "pondok"

interface BendaharaSidebarProps {
  role: BendaharaRole
}

export function BendaharaSidebar({ role }: BendaharaSidebarProps) {
  const pathname = usePathname()
  const basePath = `/dashboard/bendahara/${role}`

  const getRoleTitle = () => {
    switch (role) {
      case "smk":
        return "Bendahara SMK"
      case "smp":
        return "Bendahara SMP"
      case "pondok":
        return "Bendahara Pondok"
      default:
        return "Bendahara"
    }
  }

  const getTransaksiItems = () => {
    switch (role) {
      case "smk":
        return [
          { href: "spp", label: "SPP", icon: Receipt },
          { href: "syahriah", label: "Syahriah", icon: Receipt },
          { href: "ujian", label: "Ujian", icon: FileCheck },
          { href: "pkl", label: "PKL", icon: Briefcase },
          { href: "lks", label: "LKS", icon: Trophy },
        ]
      case "smp":
        return [
          { href: "spp", label: "SPP", icon: Receipt },
          { href: "syahriah", label: "Syahriah", icon: Receipt },
          { href: "ujian", label: "Ujian", icon: FileCheck },
          { href: "buku-pendamping", label: "Buku Pendamping", icon: BookOpen },
        ]
      case "pondok":
        return [
          { href: "uang-saku", label: "Uang Saku", icon: DollarSign },
          { href: "laundry", label: "Laundry", icon: Shirt },
        ]
      default:
        return []
    }
  }

  const transaksiItems = getTransaksiItems()
  const isTransaksiPath = transaksiItems.some((item) => pathname?.startsWith(`${basePath}/transaksi/${item.href}`))
  const [isTransaksiOpen, setIsTransaksiOpen] = React.useState(isTransaksiPath ?? false)

  React.useEffect(() => {
    if (isTransaksiPath) {
      setIsTransaksiOpen(true)
    }
  }, [isTransaksiPath])

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-almunir.png"
              alt="Al-Munir"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-lg font-semibold">{getRoleTitle()}</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === basePath}
                  render={
                    <Link href={basePath}>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname?.startsWith(`${basePath}/santri-management`) ?? false}
                  render={
                    <Link href={`${basePath}/santri-management`}>
                      <GraduationCap className="h-4 w-4" />
                      <span>Santri Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
                {role !== "pondok" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname?.startsWith(`${basePath}/tagihan-management`) ?? false}
                    render={
                      <Link href={`${basePath}/tagihan-management`}>
                        <Sparkles className="h-4 w-4" />
                        <span>Tagihan Management</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
                  isActive={isTransaksiPath}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Transaksi</span>
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
                      const itemHref = `${basePath}/transaksi/${item.href}`
                      const isItemActive = pathname?.startsWith(itemHref) ?? false
                      return (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            isActive={isItemActive}
                            render={
                              <Link href={itemHref}>
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            }
                          />
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Rekap Transaksi - for SMK and SMP */}
              {(role === "smk" || role === "smp") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname?.startsWith(`${basePath}/rekap-transaksi`) ?? false}
                    render={
                      <Link href={`${basePath}/rekap-transaksi`}>
                        <FileBarChart className="h-4 w-4" />
                        <span>Rekap Transaksi</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )}
            
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
