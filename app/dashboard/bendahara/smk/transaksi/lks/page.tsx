"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trophy, Plus, Search } from "lucide-react"

export default function LksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pembayaran LKS</h1>
          <p className="text-slate-600">Kelola pembayaran LKS siswa SMK</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pembayaran
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>Daftar Pembayaran LKS</CardTitle>
          </div>
          <CardDescription>Kelola pembayaran LKS siswa SMK</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari pembayaran..." className="pl-10" />
            </div>
          </div>
          <div className="text-center py-8 text-slate-500">
            Belum ada data pembayaran LKS
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
