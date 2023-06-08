import NextAuth from "next-auth";
import authConfig from "auth.config";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({ ...authConfig, adapter: PrismaAdapter(prisma) });
