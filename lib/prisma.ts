import { PrismaClient } from "@/lib/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if using Accelerate (prisma:// or prisma+postgres:// protocol)
const databaseUrl = process.env.DATABASE_URL || "";
const useAccelerate = databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://");

function createPrismaClient() {
  if (useAccelerate) {
    // Use Prisma Accelerate for connection pooling and caching
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    }).$extends(withAccelerate());
  } else {
    // Fallback to direct connection with PrismaPg adapter
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
}

// Use type assertion to handle the union type from $extends
export const prisma = (globalForPrisma.prisma ?? createPrismaClient()) as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
