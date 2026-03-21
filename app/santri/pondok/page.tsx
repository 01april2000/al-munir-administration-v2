import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pondok - Portal Santri Al-Munir",
  description: "Halaman santri pondok untuk pengelolaan administrasi dan transaksi",
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

export default function SantriPondokPage() {
  return (
    <SantriTabProvider role="pondok">
      <SantriContent role="pondok" />
    </SantriTabProvider>
  )
}
