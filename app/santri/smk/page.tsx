import type { Metadata } from "next"
import { SantriTabProvider } from "@/components/santri/santri-tab-context"
import { SantriContent } from "@/components/santri/santri-content"

export const metadata: Metadata = {
  title: "SMK - Portal Santri Al-Munir",
  description: "Halaman santri SMK untuk pengelolaan administrasi dan transaksi",
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

export default function SantriSMKPage() {
  return (
    <SantriTabProvider role="smk">
      <SantriContent role="smk" />
    </SantriTabProvider>
  )
}
