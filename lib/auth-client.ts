import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import type { Role } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient(),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;

// Re-export role type for use in components
export type { Role };

// Extended user type with role
export interface UserWithRole {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}