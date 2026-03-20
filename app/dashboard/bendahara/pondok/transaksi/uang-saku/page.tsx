import { BendaharaTransaksiUangSaku } from "@/components/bendahara/bendahara-transaksi-uang-saku";

export default function UangSakuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaksi Uang Saku</h1>
        <p className="text-muted-foreground">
          Kelola transaksi uang saku santri Pondok Al-Munir
        </p>
      </div>

      <BendaharaTransaksiUangSaku />
    </div>
  )
}
