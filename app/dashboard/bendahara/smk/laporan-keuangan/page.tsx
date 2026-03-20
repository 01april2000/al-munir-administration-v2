"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"

export default function LaporanKeuanganPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Laporan Keuangan</h1>
        <p className="text-slate-600">Lihat laporan keuangan SMK</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Bulanan</CardTitle>
            </div>
            <CardDescription>Laporan keuangan bulanan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Unduh Laporan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Tahunan</CardTitle>
            </div>
            <CardDescription>Laporan keuangan tahunan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Unduh Laporan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Laporan Kustom</CardTitle>
            </div>
            <CardDescription>Buat laporan kustom</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Buat Laporan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
          <CardDescription>Ringkasan keuangan SMK</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            Belum ada data keuangan
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
