"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Define SMK-specific transaction types (SPP dinonaktifkan sementara — lihat lib/config.ts)
type JenisTransaksiSMK = "SYAHRIAH" | "LKS" | "PKL" | "UJIAN";

const transaksiTabs: { value: JenisTransaksiSMK; label: string; description: string }[] = [
  { value: "SYAHRIAH", label: "Syahriah", description: "Kelola pembayaran syahriah siswa SMK" },
  { value: "LKS", label: "LKS", description: "Kelola pembayaran LKS siswa SMK" },
  { value: "PKL", label: "PKL", description: "Kelola pembayaran PKL siswa SMK" },
  { value: "UJIAN", label: "Ujian", description: "Kelola pembayaran ujian siswa SMK" },
];

const validTabs = transaksiTabs.map(t => t.value);

function TransaksiPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  // Validate tab param, default to SYAHRIAH if invalid or missing
  const activeTab: JenisTransaksiSMK = validTabs.includes(tabParam as JenisTransaksiSMK)
    ? (tabParam as JenisTransaksiSMK)
    : "SYAHRIAH";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola semua transaksi pembayaran siswa SMK
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {transaksiTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {transaksiTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{tab.label}</h2>
                  <p className="text-muted-foreground">{tab.description}</p>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                Data pembayaran {tab.label.toLowerCase()} akan ditampilkan di sini
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function TransaksiPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <TransaksiPageContent />
    </Suspense>
  );
}
