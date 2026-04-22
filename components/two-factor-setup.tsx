"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldOff, Copy, Check, AlertTriangle } from "lucide-react";
import QRCode from "qrcode";

interface TwoFactorSetupProps {
  isMandatory?: boolean;
}

type SetupStep = "password" | "qr" | "verify" | "backup-codes";

export function TwoFactorSetup({ isMandatory = false }: TwoFactorSetupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<SetupStep>("password");
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  // Check if 2FA is already enabled
  const check2FAStatus = useCallback(async () => {
    const session = await authClient.getSession();
    const user = session?.data?.user as { twoFactorEnabled?: boolean } | null;
    setIsEnabled(user?.twoFactorEnabled ?? false);
  }, []);

  useEffect(() => {
    check2FAStatus();
  }, [check2FAStatus]);

  // Generate QR code from TOTP URI
  useEffect(() => {
    if (totpUri) {
      QRCode.toDataURL(totpUri, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }).then(setQrCodeDataUrl).catch(console.error);
    }
  }, [totpUri]);

  const resetState = useCallback(() => {
    setStep("password");
    setPassword("");
    setVerifyCode("");
    setTotpUri("");
    setQrCodeDataUrl("");
    setBackupCodes([]);
    setError(null);
  }, []);

  const handleEnable = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.twoFactor.enable({
        password,
        issuer: "Al-Munir Administration",
      });

      if (result?.error) {
        setError(result.error.message || "Gagal mengaktifkan 2FA");
        setLoading(false);
        return;
      }

      const data = result.data as { totpURI?: string; backupCodes?: string[] } | null;
      if (data?.totpURI) {
        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes ?? []);
        setStep("qr");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: verifyCode,
      });

      if (result?.error) {
        setError(result.error.message || "Kode tidak valid. Pastikan kode benar.");
        setLoading(false);
        return;
      }

      setStep("backup-codes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setError(null);
    setIsDisabling(true);

    try {
      const result = await authClient.twoFactor.disable({
        password: disablePassword,
      });

      if (result?.error) {
        setError(result.error.message || "Gagal menonaktifkan 2FA");
        setIsDisabling(false);
        return;
      }

      setIsEnabled(false);
      setDisablePassword("");
      setIsOpen(false);
      await check2FAStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsDisabling(false);
    }
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    resetState();
    setIsOpen(false);
    check2FAStatus();

    if (isMandatory) {
      window.location.href = "/dashboard/admin";
    }
  };

  // If 2FA is already enabled, show status with disable option
  if (isEnabled && !isOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Akun Anda dilindungi dengan autentikasi dua faktor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <ShieldCheck className="h-3 w-3" />
              Aktif
            </span>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button variant="destructive" size="sm" />}>
              <ShieldOff className="h-4 w-4 mr-2" />
              Nonaktifkan 2FA
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nonaktifkan Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Masukkan password Anda untuk menonaktifkan 2FA. Ini akan mengurangi keamanan akun Anda.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disable-password">Password</Label>
                  <Input
                    id="disable-password"
                    type="password"
                    placeholder="••••••••"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDisable}
                    disabled={isDisabling || !disablePassword}
                  >
                    {isDisabling ? "Menonaktifkan..." : "Nonaktifkan"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setError(null);
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // If mandatory and not enabled, show setup directly (no dialog)
  if (isMandatory) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Setup Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Keamanan tambahan diperlukan untuk akun Anda. Silakan setup 2FA terlebih dahulu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetupSteps
            step={step}
            password={password}
            setPassword={setPassword}
            qrCodeDataUrl={qrCodeDataUrl}
            backupCodes={backupCodes}
            verifyCode={verifyCode}
            setVerifyCode={setVerifyCode}
            error={error}
            loading={loading}
            copied={copied}
            onEnable={handleEnable}
            onVerify={handleVerifySetup}
            onCopyBackupCodes={handleCopyBackupCodes}
            onFinish={handleFinish}
            onGoToVerify={() => setStep("verify")}
          />
        </CardContent>
      </Card>
    );
  }

  // Optional setup with dialog
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Tambahkan lapisan keamanan ekstra untuk akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="h-3 w-3" />
            Belum Aktif
          </span>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetState();
        }}>
          <DialogTrigger render={<Button size="sm" />}>
            <Shield className="h-4 w-4 mr-2" />
            Aktifkan 2FA
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Aktifkan Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Ikuti langkah-langkah berikut untuk mengaktifkan 2FA
              </DialogDescription>
            </DialogHeader>
            <SetupSteps
              step={step}
              password={password}
              setPassword={setPassword}
              qrCodeDataUrl={qrCodeDataUrl}
              backupCodes={backupCodes}
              verifyCode={verifyCode}
              setVerifyCode={setVerifyCode}
              error={error}
              loading={loading}
              copied={copied}
              onEnable={handleEnable}
              onVerify={handleVerifySetup}
              onCopyBackupCodes={handleCopyBackupCodes}
              onFinish={handleFinish}
              onGoToVerify={() => setStep("verify")}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Extracted setup steps component
interface SetupStepsProps {
  step: SetupStep;
  password: string;
  setPassword: (password: string) => void;
  qrCodeDataUrl: string;
  backupCodes: string[];
  verifyCode: string;
  setVerifyCode: (code: string) => void;
  error: string | null;
  loading: boolean;
  copied: boolean;
  onEnable: () => void;
  onVerify: () => void;
  onCopyBackupCodes: () => void;
  onFinish: () => void;
  onGoToVerify: () => void;
}

function SetupSteps({
  step,
  password,
  setPassword,
  qrCodeDataUrl,
  backupCodes,
  verifyCode,
  setVerifyCode,
  error,
  loading,
  copied,
  onEnable,
  onVerify,
  onCopyBackupCodes,
  onFinish,
  onGoToVerify,
}: SetupStepsProps) {
  const steps: SetupStep[] = ["password", "qr", "verify", "backup-codes"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {["Password", "Scan QR", "Verifikasi", "Backup"].map((label, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${
                isActive ? "font-medium" : "text-muted-foreground"
              }`}>
                {label}
              </span>
              {i < 3 && (
                <div className={`w-4 h-0.5 ${
                  i < currentIndex ? "bg-green-600" : "bg-muted"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Password verification */}
      {step === "password" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Masukkan password Anda untuk memulai setup 2FA.
          </p>
          <div className="space-y-2">
            <Label htmlFor="setup-password">Password</Label>
            <Input
              id="setup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={onEnable}
            disabled={loading || !password}
            className="w-full"
          >
            {loading ? "Memproses..." : "Lanjutkan"}
          </Button>
        </div>
      )}

      {/* Step 2: QR Code */}
      {step === "qr" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan QR code di bawah ini menggunakan aplikasi authenticator (Google Authenticator, Authy, dll.)
          </p>
          {qrCodeDataUrl && (
            <div className="flex justify-center">
              <img
                src={qrCodeDataUrl}
                alt="TOTP QR Code"
                className="rounded-lg border"
                width={256}
                height={256}
              />
            </div>
          )}
          <Button
            onClick={onGoToVerify}
            className="w-full"
          >
            Saya Sudah Scan QR Code
          </Button>
        </div>
      )}

      {/* Step 3: Verify TOTP code */}
      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Masukkan kode 6-digit yang ditampilkan di aplikasi authenticator Anda.
          </p>
          <div className="space-y-2">
            <Label htmlFor="verify-code">Kode Verifikasi</Label>
            <Input
              id="verify-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              autoFocus
            />
          </div>
          <Button
            onClick={onVerify}
            disabled={loading || verifyCode.length !== 6}
            className="w-full"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </div>
      )}

      {/* Step 4: Backup codes */}
      {step === "backup-codes" && (
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Penting!</strong> Simpan kode backup ini di tempat yang aman. Kode ini dapat digunakan untuk login jika Anda kehilangan akses ke authenticator app.
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, i) => (
                <div key={i} className="text-center p-1 bg-background rounded">
                  {code}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onCopyBackupCodes}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Salin Kode Backup
              </>
            )}
          </Button>
          <Button onClick={onFinish} className="w-full">
            Selesai — Ke Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
