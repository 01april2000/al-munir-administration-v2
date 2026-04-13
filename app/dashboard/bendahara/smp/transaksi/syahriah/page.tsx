"use client";

import { BendaharaTransaksiSyahriah } from "@/components/bendahara/bendahara-transaksi-syahriah";

export default function SyahriahPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembayaran Syahriah</h1>
          <p className="text-muted-foreground">
            Data pembayaran Syahriah santri SMP
          </p>
        </div>
      </div>

      <BendaharaTransaksiSyahriah jenisSantri="SMP" />
    </div>
  );
}
