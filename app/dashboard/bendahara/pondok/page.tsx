import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BendaharaPondokPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/bendahara">
            <Button variant="ghost" className="mb-4">← Kembali ke Bendahara</Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Bendahara Pondok</h1>
          <p className="text-slate-600">Kelola keuangan Pondok Pesantren</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran SPP Santri</CardTitle>
              <CardDescription>Kelola pembayaran SPP santri</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Kelola SPP</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Uang Makan</CardTitle>
              <CardDescription>Kelola pembayaran uang makan</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Kelola Uang Makan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Perlengkapan</CardTitle>
              <CardDescription>Kelola pembayaran perlengkapan santri</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Kelola Perlengkapan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Kitab</CardTitle>
              <CardDescription>Kelola pembayaran kitab</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Kelola Kitab</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Keuangan</CardTitle>
              <CardDescription>Lihat laporan keuangan Pondok</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Lihat Laporan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Lihat riwayat transaksi</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Lihat Riwayat</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
