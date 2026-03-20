"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransaksiTabContent } from "@/components/admin/transaksi-tab-content";
import { JenisTransaksi } from "@/lib/types/transaksi";
import { Loader2 } from "lucide-react";

const transaksiTabs: { value: JenisTransaksi; label: string; description: string }[] = [
  { value: "SPP", label: "SPP", description: "Kelola pembayaran SPP santri" },
  { value: "SYAHRIAH", label: "Syahriah", description: "Kelola pembayaran syahriah santri" },
  { value: "UANG_SAKU", label: "Uang Saku", description: "Kelola uang saku santri (setoran & penarikan)" },
  { value: "LAUNDRY", label: "Laundry", description: "Kelola pembayaran laundry santri" },
];

const validTabs = transaksiTabs.map(t => t.value);

function TransaksiPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  // Validate tab param, default to SPP if invalid or missing
  const activeTab: JenisTransaksi = validTabs.includes(tabParam as JenisTransaksi)
    ? (tabParam as JenisTransaksi)
    : "SPP";

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
            Kelola semua transaksi pembayaran
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
            <TransaksiTabContent
              jenis={tab.value}
              title={tab.label}
              description={tab.description}
            />
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