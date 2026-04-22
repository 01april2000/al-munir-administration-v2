import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import type { Role, JenisSantri } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient(),
    twoFactorClient({
      twoFactorPage: "/auth/verify-2fa",
    }),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;

// Re-export types for use in components
export type { Role, JenisSantri };

// Extended user type with role
export interface UserWithRole {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: Role;
  jenisSantri?: JenisSantri | null;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}