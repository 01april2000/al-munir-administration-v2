"use client";

import Image from "next/image";
import { TwoFactorSetup } from "@/components/two-factor-setup";

export default function Setup2FAPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Image
        src="/Al-Munir_Administration.png"
        alt="Al-Munir Administration"
        width={180}
        height={180}
        className="mb-6"
        priority
      />
      <TwoFactorSetup isMandatory />
    </main>
  );
}
