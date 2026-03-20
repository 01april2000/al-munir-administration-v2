import { UserInfo } from "@/components/user-info";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
