import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");
  console.log("hostname is ", hostname);
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.vercel.pub`, "")
      : hostname.replace(`.localhost:3000`, "");

  console.log("currentHost is ", currentHost);
  console.log("pathname is ", pathname);

  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    return NextResponse.rewrite(`/_sites/${currentHost}${pathname}`);
  }
}
