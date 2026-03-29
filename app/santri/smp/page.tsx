import type { Metadata } from "next"
import { SantriTabProvider } from "@/components/santri/santri-tab-context"
import { SantriContent } from "@/components/santri/santri-content"
import { getSmpData } from "@/app/actions/santri"

export const metadata: Metadata = {
  title: "SMP - Portal Santri Al-Munir",
  description: "Halaman siswa SMP untuk pengelolaan administrasi dan transaksi",
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

export default async function SantriSMPPage() {
  const initialData = await getSmpData()

  return (
    <SantriTabProvider role="smp" initialData={initialData}>
      <SantriContent role="smp" initialData={initialData} />
    </SantriTabProvider>
  )
}
