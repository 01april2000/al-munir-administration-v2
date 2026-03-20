import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Selamat datang di panel administrasi Al-Munir</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/admin">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Admin</CardTitle>
                <CardDescription>Kelola pengaturan dan akses sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses ke panel administrasi utama untuk mengelola pengguna, peran, dan konfigurasi sistem.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bendahara">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Bendahara</CardTitle>
                <CardDescription>Kelola keuangan dan pembayaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  Akses ke panel bendahara untuk mengelola keuangan SMK, SMP, dan Pondok.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
