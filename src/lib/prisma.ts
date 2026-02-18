import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const skipDb = process.env.SKIP_DATABASE === "1" || !process.env.DATABASE_URL;

function createPrisma(): PrismaClient {
  if (skipDb) {
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          "Database is disabled (SKIP_DATABASE=1). Remove SKIP_DATABASE and configure DATABASE_URL to enable."
        );
      },
    });
  }
  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    })
  );
}

export const prisma = createPrisma();
if (process.env.NODE_ENV !== "production" && !skipDb) {
  globalForPrisma.prisma = prisma;
}
