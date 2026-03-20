"use client";

import { BendaharaTransaksiSPP } from "@/components/bendahara/bendahara-transaksi-spp";

export default function SPPPage() {
  return (
    <div className="p-6">
      <BendaharaTransaksiSPP jenisSantri="SMP" />
    </div>
  );
}
