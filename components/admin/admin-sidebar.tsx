"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Users,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Receipt,
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

export function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isTransaksiPath = pathname === "/dashboard/admin/transaksi"
  const [isTransaksiOpen, setIsTransaksiOpen] = React.useState(isTransaksiPath ?? false)

  React.useEffect(() => {
    if (isTransaksiPath) {
      setIsTransaksiOpen(true)
    }
  }, [isTransaksiPath])

  const activeTab = searchParams.get("tab") || "SPP"

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-semibold">Admin Panel</span>
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
                  isActive={pathname === "/dashboard/admin/staff-management"}
                  render={
                    <Link href="/dashboard/admin/staff-management">
                      <Users className="h-4 w-4" />
                      <span>Staff Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/admin/santri-management"}
                  render={
                    <Link href="/dashboard/admin/santri-management">
                      <GraduationCap className="h-4 w-4" />
                      <span>Santri Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/admin/tagihan-management"}
                  render={
                    <Link href="/dashboard/admin/tagihan-management">
                      <Receipt className="h-4 w-4" />
                      <span>Tagihan Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
                  isActive={isTransaksiOpen}
                >
                  {isTransaksiOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>Transaksi</span>
                </SidebarMenuButton>
                {isTransaksiOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "SPP"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=SPP">
                            <span>SPP</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "SYAHRIAH"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=SYAHRIAH">
                            <span>Syahriah</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "UANG_SAKU"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=UANG_SAKU">
                            <span>Uang Saku</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "LAUNDRY"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=LAUNDRY">
                            <span>Laundry</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/admin/laporan-keuangan"}
                  render={
                    <Link href="/dashboard/admin/laporan-keuangan">
                      <FileText className="h-4 w-4" />
                      <span>Laporan Keuangan</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
