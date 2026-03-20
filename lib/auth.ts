import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "SANTRI",
        input: false,
      },
      santriId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    nextCookies(), // Required for server actions to set cookies
    admin({
      adminRole: "ADMIN",
      defaultRole: "SANTRI",
    }),
  ],
});

// Export type for role
export type Role = "ADMIN" | "BENDAHARA_SMK" | "BENDAHARA_SMP" | "BENDAHARA_PONDOK" | "SANTRI";