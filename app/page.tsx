"use client";

import { useEffect, useState } from "react";
import { UserInfo } from "@/components/user-info";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session to get user role
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data?.user?.role || null);
          
          // If user is SANTRI, redirect to /santri immediately
          if (data?.user?.role === "SANTRI") {
            router.replace("/santri");
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  // Show loading state while checking session
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    );
  }

  // If user is SANTRI, show nothing (will be redirected)
  if (userRole === "SANTRI") {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Al-Munir Administration</h1>
          <p className="text-muted-foreground mt-2">
            Sistem Administrasi Keuangan Santri
          </p>
        </div>

        <UserInfo showDetails />

        <div className="flex gap-2 justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
