"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Users,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  Shirt,
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

export function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isTransaksiPath = pathname === "/dashboard/admin/transaksi"
  const activeTab = searchParams.get("tab") || "SYAHRIAH"
  
  // Only open dropdown if on transaksi path AND on SYAHRIAH, PKL, UJIAN, BUKU_PENDAMPING, or LKS tab
  const isTransaksiSubmenuActive = isTransaksiPath && (activeTab === "SYAHRIAH" || activeTab === "PKL" || activeTab === "UJIAN" || activeTab === "BUKU_PENDAMPING" || activeTab === "LKS")
  const [isTransaksiOpen, setIsTransaksiOpen] = React.useState(isTransaksiSubmenuActive)

  React.useEffect(() => {
    if (isTransaksiSubmenuActive) {
      setIsTransaksiOpen(true)
    }
  }, [isTransaksiSubmenuActive])

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
                  isActive={pathname === "/dashboard/admin"}
                  render={
                    <Link href="/dashboard/admin">
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

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
                  isActive={isTransaksiPath && activeTab === "UANG_SAKU"}
                  render={
                    <Link href="/dashboard/admin/transaksi?tab=UANG_SAKU">
                      <Wallet className="h-4 w-4" />
                      <span>Saldo Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isTransaksiPath && activeTab === "LAUNDRY"}
                  render={
                    <Link href="/dashboard/admin/transaksi?tab=LAUNDRY">
                      <Shirt className="h-4 w-4" />
                      <span>Laundry</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
                  isActive={isTransaksiOpen && (activeTab === "SYAHRIAH" || activeTab === "PKL" || activeTab === "UJIAN" || activeTab === "BUKU_PENDAMPING" || activeTab === "LKS")}
                >
                  {isTransaksiOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>Transaksi Tagihan</span>
                </SidebarMenuButton>
                {isTransaksiOpen && (
                  <SidebarMenuSub>
                    {/* SPP dinonaktifkan sementara — lihat lib/config.ts */}
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
                        isActive={isTransaksiPath && activeTab === "PKL"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=PKL">
                            <span>PKL</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "UJIAN"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=UJIAN">
                            <span>Ujian</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "BUKU_PENDAMPING"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=BUKU_PENDAMPING">
                            <span>Buku Pendamping</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={isTransaksiPath && activeTab === "LKS"}
                        render={
                          <Link href="/dashboard/admin/transaksi?tab=LKS">
                            <span>LKS</span>
                          </Link>
                        }
                      />
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Rekap Transaksi Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/admin/rekap-transaksi"}
                  render={
                    <Link href="/dashboard/admin/rekap-transaksi">
                      <FileBarChart className="h-4 w-4" />
                      <span>Rekap Transaksi</span>
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
