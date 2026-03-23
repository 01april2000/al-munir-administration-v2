"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { Role, JenisSantri } from "@/lib/auth-client";

// Get redirect path based on role and jenisSantri
function getRedirectPath(role: Role, jenisSantri?: JenisSantri | null): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "BENDAHARA_SMK":
      return "/dashboard/bendahara/smk";
    case "BENDAHARA_SMP":
      return "/dashboard/bendahara/smp";
    case "BENDAHARA_PONDOK":
      return "/dashboard/bendahara/pondok";
    case "SANTRI":
      // Redirect santri based on their jenisSantri
      switch (jenisSantri) {
        case "SMK":
          return "/santri/smk";
        case "SMP":
          return "/santri/smp";
        case "PONDOK":
          return "/santri/pondok";
        default:
          return "/santri";
      }
    default:
      return "/dashboard";
  }
}

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    if (session?.user) {
      // Redirect based on role and jenisSantri
      const user = session.user as {
        role: Role;
        jenisSantri?: JenisSantri | null;
      };
      const redirectPath = getRedirectPath(user.role, user.jenisSantri);
      router.replace(redirectPath);
    } else {
      // If no session, redirect to auth
      router.replace("/auth");
    }
  }, [session, isPending, router]);

  // Show loading state while checking session
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </main>
  );
}
