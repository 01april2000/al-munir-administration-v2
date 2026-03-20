import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BendaharaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">← Kembali ke Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Panel Bendahara</h1>
          <p className="text-slate-600">Kelola keuangan dan pembayaran</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/bendahara/smk">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Bendahara SMK</CardTitle>
                <CardDescription>Kelola keuangan Sekolah Menengah Kejuruan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses ke panel keuangan SMK untuk mengelola SPP, pembayaran, dan laporan keuangan.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bendahara/smp">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Bendahara SMP</CardTitle>
                <CardDescription>Kelola keuangan Sekolah Menengah Pertama</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses ke panel keuangan SMP untuk mengelola SPP, pembayaran, dan laporan keuangan.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bendahara/pondok">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Bendahara Pondok</CardTitle>
                <CardDescription>Kelola keuangan Pondok Pesantren</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses ke panel keuangan Pondok untuk mengelola pembayaran santri dan laporan keuangan.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
