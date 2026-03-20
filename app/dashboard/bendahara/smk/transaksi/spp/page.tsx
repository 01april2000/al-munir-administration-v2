"use client";

import { BendaharaTransaksiSPP } from "@/components/bendahara/bendahara-transaksi-spp";

export default function SppPage() {
  return (
    <div className="p-6">
      <BendaharaTransaksiSPP jenisSantri="SMK" />
    </div>
  );
}
