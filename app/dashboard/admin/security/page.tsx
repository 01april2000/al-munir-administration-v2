import { TwoFactorSetup } from "@/components/two-factor-setup";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Keamanan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan keamanan akun Anda
        </p>
      </div>
      <TwoFactorSetup />
    </div>
  );
}
