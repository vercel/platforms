import NextAuth from "@auth/nextjs";
import authConfig from "auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const {
  auth,
  handlers: { GET, POST },
  // @ts-ignore
} = NextAuth({ ...authConfig, adapter: PrismaAdapter(prisma) });
