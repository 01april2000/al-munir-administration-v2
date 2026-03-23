"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shirt, CreditCard } from "lucide-react"

export function PondokQuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.location.href = '/dashboard/bendahara/pondok/transaksi/uang-saku'}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Transaksi Uang Saku</h3>
            <p className="text-sm text-muted-foreground">Kelola transaksi uang saku santri</p>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.location.href = '/dashboard/bendahara/pondok/transaksi/laundry'}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shirt className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Transaksi Laundry</h3>
            <p className="text-sm text-muted-foreground">Kelola transaksi laundry santri</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
