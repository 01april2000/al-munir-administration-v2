import Image from "next/image";
import { AuthCard } from "@/components/auth-card";

export default function AuthPage() {
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
      <AuthCard />
    </main>
  );
}