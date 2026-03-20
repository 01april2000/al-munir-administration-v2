import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SantriPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">← Kembali ke Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Panel Santri</h1>
          <p className="text-slate-600">Akses informasi akademik dan keuangan santri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/santri/smk">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Santri SMK</CardTitle>
                <CardDescription>Sekolah Menengah Kejuruan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses panel santri SMK untuk melihat profil, informasi akademik, riwayat transaksi, dan laporan.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/santri/smp">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Santri SMP</CardTitle>
                <CardDescription>Sekolah Menengah Pertama</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses panel santri SMP untuk melihat profil, informasi akademik, riwayat transaksi, dan laporan.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
