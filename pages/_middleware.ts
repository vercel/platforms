import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

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
  if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
    return NextResponse.redirect("https://demo.vercel.pub");
  }

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? // You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
        // You can use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
        // in this case, our team slug is "platformize", thus *.platformize.vercel.app works
        hostname
          .replace(`.vercel.pub`, "")
          .replace(`.platformize.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (pathname.startsWith(`/_sites`))
    return new Response(null, {
      status: 404,
    });

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (currentHost == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      ) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    }

    if (
      hostname === "localhost:3000" ||
      hostname === "platformize.vercel.app"
    ) {
      url.pathname = `/home`;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${currentHost}${pathname}`;
    return NextResponse.rewrite(url);
  }
}
