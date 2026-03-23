"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import type { TransaksiByStatus } from "@/lib/financial"

interface StatusOverviewProps {
  byStatus: TransaksiByStatus[]
}

export function StatusOverview({ byStatus }: StatusOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Status Transaksi
        </CardTitle>
        <CardDescription>Distribusi berdasarkan status pembayaran</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {byStatus.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data transaksi
            </div>
          ) : (
            byStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status === 'LUNAS' && (
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  )}
                  {item.status === 'PENDING' && (
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  )}
                  {item.status === 'BELUM_BAYAR' && (
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  )}
                  {item.status === 'DITOLAK' && (
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                  )}
                  <span className="text-sm">{item.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.total}</span>
                  <span className="text-xs text-muted-foreground">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visual pie representation */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              {byStatus.reduce((acc: { offset: number; elements: React.ReactElement[] }, item) => {
                const colors: Record<string, string> = {
                  LUNAS: '#22c55e',
                  PENDING: '#eab308',
                  BELUM_BAYAR: '#ef4444',
                  DITOLAK: '#6b7280'
                }
                const percentage = item.percentage
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -acc.offset
                acc.elements.push(
                  <circle
                    key={item.status}
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke={colors[item.status] || '#ccc'}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                )
                acc.offset += percentage
                return acc
              }, { offset: 0, elements: [] }).elements}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {byStatus.reduce((sum, item) => sum + item.total, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
