"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, Building2, Shirt, Book, FileText, History } from "lucide-react"

export default function BendaharaSMKPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bendahara SMK</h1>
        <p className="text-slate-600">Kelola keuangan Sekolah Menengah Kejuruan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle>Pembayaran SPP</CardTitle>
            </div>
            <CardDescription>Kelola pembayaran SPP siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola SPP</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Pembayaran Uang Gedung</CardTitle>
            </div>
            <CardDescription>Kelola pembayaran uang gedung</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Uang Gedung</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-primary" />
              <CardTitle>Pembayaran Seragam</CardTitle>
            </div>
            <CardDescription>Kelola pembayaran seragam</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Seragam</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <CardTitle>Pembayaran Buku</CardTitle>
            </div>
            <CardDescription>Kelola pembayaran buku</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Buku</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Keuangan</CardTitle>
            </div>
            <CardDescription>Lihat laporan keuangan SMK</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Lihat Laporan</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle>Riwayat Transaksi</CardTitle>
            </div>
            <CardDescription>Lihat riwayat transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Lihat Riwayat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
