"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { formatCurrency, getJenisLabel, type TransaksiByJenis } from "@/lib/financial"

interface TransactionByTypeProps {
  byJenis: TransaksiByJenis[]
}

export function TransactionByType({ byJenis }: TransactionByTypeProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Transaksi per Jenis
        </CardTitle>
        <CardDescription>Distribusi transaksi berdasarkan jenis pembayaran</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {byJenis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data transaksi
            </div>
          ) : (
            byJenis.map((item) => (
              <div key={item.jenis} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{getJenisLabel(item.jenis)}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.total} transaksi
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right min-w-[120px]">
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.jumlah)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
