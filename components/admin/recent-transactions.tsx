"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { formatCurrency, formatDate, getStatusBadge, getJenisLabel, type RecentTransaksi } from "@/lib/financial"

interface RecentTransactionsProps {
  recentTransaksi: RecentTransaksi[]
}

export function RecentTransactions({ recentTransaksi }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Transaksi Terbaru
            </CardTitle>
            <CardDescription>5 transaksi terakhir</CardDescription>
          </div>
          <a href="/dashboard/admin/transaksi">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransaksi.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data transaksi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Kode</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Santri</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Jenis</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Jumlah</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentTransaksi.map((transaksi) => (
                  <tr key={transaksi.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <span className="font-mono text-sm">{transaksi.kode}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-sm">{transaksi.santri.nama}</div>
                        <div className="text-xs text-muted-foreground">{transaksi.santri.nis}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm">{getJenisLabel(transaksi.jenis)}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-medium">{formatCurrency(transaksi.jumlah)}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {getStatusBadge(transaksi.status)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(transaksi.tanggalBayar || transaksi.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
