import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub)
  const hostname = req.headers.get("host");
  if (!hostname)
    return new Response(null, {
      status: 400,
      statusText: "No hostname found in request headers",
    });

  // Only for demo purposes – remove this if you want to use your root domain as the landing page
  if (hostname === "vercel.pub" || hostname === "platforms.vercel.app")
    return NextResponse.redirect("https://demo.vercel.pub");

  // Strip root domain from hostname string
  const currentHost = hostname.replace(
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? `.vercel.pub`
      : `.localhost:3000`,
    ""
  );

  if (pathname.startsWith(`/_sites`))
    return new Response(null, { status: 404 });

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (currentHost == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      )
        return NextResponse.redirect("/");

      return NextResponse.rewrite(`/app${pathname}`);
    }

    if (hostname === "localhost:3000") return NextResponse.rewrite(`/home`);

    return NextResponse.rewrite(`/_sites/${currentHost}${pathname}`);
  }
}
