import type { Metadata } from "next"
import { SantriTabProvider } from "@/components/santri/santri-tab-context"
import { SantriContent } from "@/components/santri/santri-content"
import { getPondokData } from "@/app/actions/santri"

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

export default async function SantriPondokPage() {
  const initialData = await getPondokData()

  return (
    <SantriTabProvider role="pondok" initialData={initialData}>
      <SantriContent role="pondok" initialData={initialData} />
    </SantriTabProvider>
  )
}
