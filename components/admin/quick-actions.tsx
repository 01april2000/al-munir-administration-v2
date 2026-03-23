"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, CreditCard, Users } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.location.href = '/dashboard/admin/laporan-keuangan'}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Laporan Lengkap</h3>
            <p className="text-sm text-muted-foreground">Lihat laporan keuangan detail</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.location.href = '/dashboard/admin/transaksi'}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Kelola Transaksi</h3>
            <p className="text-sm text-muted-foreground">Kelola semua transaksi</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.location.href = '/dashboard/admin/tagihan-management'}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">Kelola Tagihan</h3>
            <p className="text-sm text-muted-foreground">Atur tagihan santri</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
