import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const client = new PrismaClient();
    return client;
  })();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
