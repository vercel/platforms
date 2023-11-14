import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import type { NextRequest, NextResponse } from "next/server";

const handler = (async (req: NextRequest, ctx: { params: any}) => {
//   const host = req.headers.get("host");
//   //that worked for me
//   process.env.NEXTAUTH_URL = /localhost/.test(host || "")
//     ? `http://${host}`
//     : host as string;

  return await NextAuth(authOptions(req))(req, ctx);
});

export { handler as GET, handler as POST };
