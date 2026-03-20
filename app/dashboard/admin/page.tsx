import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Admin</h1>
        <p className="text-muted-foreground">Kelola pengaturan dan akses sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kelola Pengguna</CardTitle>
            <CardDescription>Tambah, edit, atau hapus pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Pengguna</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peran & Izin</CardTitle>
            <CardDescription>Atur peran dan hak akses</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Peran</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Aktivitas</CardTitle>
            <CardDescription>Lihat riwayat aktivitas sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Lihat Log</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Sistem</CardTitle>
            <CardDescription>Konfigurasi pengaturan umum</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Pengaturan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan</CardTitle>
            <CardDescription>Generate dan lihat laporan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Lihat Laporan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
            <CardDescription>Kelola backup data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Backup</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
