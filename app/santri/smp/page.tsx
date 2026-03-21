import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SMP - Portal Santri Al-Munir",
  description: "Halaman santri SMP untuk pengelolaan administrasi dan transaksi",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Santri Portal",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

import { SantriTabProvider } from "@/components/santri/santri-tab-context"
import { SantriContent } from "@/components/santri/santri-content"

export default function SantriSMPPage() {
  return (
    <SantriTabProvider role="smp">
      <SantriContent role="smp" />
    </SantriTabProvider>
  )
}
