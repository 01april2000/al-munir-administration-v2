"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * SPP dinonaktifkan sementara — lihat lib/config.ts
 * Halaman ini me-redirect ke halaman syahriah.
 */
export default function SppPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/bendahara/smk/transaksi/syahriah");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <p className="text-muted-foreground">Mengalihkan ke halaman Syahriah...</p>
    </div>
  );
}
