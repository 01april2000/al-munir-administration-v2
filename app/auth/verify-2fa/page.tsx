"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Verify2FAPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (result?.error) {
        setError(result.error.message || "Kode TOTP tidak valid");
        setLoading(false);
        return;
      }

      // After successful 2FA verification, fetch session to get user role
      const session = await authClient.getSession();
      const user = session?.data?.user as {
        role?: string;
        jenisSantri?: string | null;
      } | null;

      if (user?.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else if (user?.role === "BENDAHARA_SMK") {
        window.location.href = "/dashboard/bendahara/smk";
      } else if (user?.role === "BENDAHARA_SMP") {
        window.location.href = "/dashboard/bendahara/smp";
      } else if (user?.role === "BENDAHARA_PONDOK") {
        window.location.href = "/dashboard/bendahara/pondok";
      } else if (user?.role === "SANTRI") {
        if (user.jenisSantri === "SMK") {
          window.location.href = "/santri/smk";
        } else if (user.jenisSantri === "SMP") {
          window.location.href = "/santri/smp";
        } else if (user.jenisSantri === "PONDOK") {
          window.location.href = "/santri/pondok";
        } else {
          window.location.href = "/santri";
        }
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBackupCode = async () => {
    if (!code.trim()) {
      setError("Masukkan kode backup");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.twoFactor.verifyBackupCode({
        code,
      });

      if (result?.error) {
        setError(result.error.message || "Kode backup tidak valid");
        setLoading(false);
        return;
      }

      // After successful backup code verification, redirect
      const session = await authClient.getSession();
      const user = session?.data?.user as {
        role?: string;
        jenisSantri?: string | null;
      } | null;

      if (user?.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else if (user?.role === "BENDAHARA_SMK") {
        window.location.href = "/dashboard/bendahara/smk";
      } else if (user?.role === "BENDAHARA_SMP") {
        window.location.href = "/dashboard/bendahara/smp";
      } else if (user?.role === "BENDAHARA_PONDOK") {
        window.location.href = "/dashboard/bendahara/pondok";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verifikasi Two-Factor Authentication</CardTitle>
          <CardDescription>
            Masukkan kode 6-digit dari aplikasi authenticator Anda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerifyTotp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-code">Kode Authenticator</Label>
              <Input
                id="totp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || code.length !== 6}
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  atau
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={handleVerifyBackupCode}
            >
              Gunakan Kode Backup
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/auth";
                    },
                  },
                });
              }}
            >
              Kembali ke Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
