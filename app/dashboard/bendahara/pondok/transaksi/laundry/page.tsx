import { BendaharaTransaksiLaundry } from "@/components/bendahara/bendahara-transaksi-laundry";

export default function LaundryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaksi Laundry</h1>
        <p className="text-muted-foreground">
          Kelola transaksi laundry santri Pondok Al-Munir
        </p>
      </div>

      <BendaharaTransaksiLaundry />
    </div>
  )
}
