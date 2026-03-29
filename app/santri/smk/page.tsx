import type { Metadata } from "next"
import { SantriTabProvider } from "@/components/santri/santri-tab-context"
import { SantriContent } from "@/components/santri/santri-content"
import { getSmkData } from "@/app/actions/santri"

export const metadata: Metadata = {
  title: "SMK - Portal Santri Al-Munir",
  description: "Halaman siswa SMK untuk pengelolaan administrasi dan transaksi",
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

export default async function SantriSMKPage() {
  const initialData = await getSmkData()

  return (
    <SantriTabProvider role="smk" initialData={initialData}>
      <SantriContent role="smk" initialData={initialData} />
    </SantriTabProvider>
  )
}
