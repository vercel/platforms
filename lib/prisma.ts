import { PrismaClient } from "@prisma/client";

declare module globalThis {
  let prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") globalThis.prisma = prisma;
