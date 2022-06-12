import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Clone the request url
  const url = req.nextUrl.clone();

  // Get pathname of request (e.g. /blog-slug)
  const { pathname } = req.nextUrl;

  // Check if user is currently authed by presense of next-auth cookie
  const isAuthed =
    req.cookies["next-auth.session-token"] ||
    req.cookies["__Secure-next-auth.session-token"];

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host");

  if (!hostname) {
    return new Response(null, {
      status: 400,
      statusText: "No hostname found in request headers",
    });
  }

  // Parse request to get subdomain and root domain
  const domain = {
    sub: "",
    root: hostname,
  };

  if (hostname.split(".").length > 1) {
    const [subdomain, ...rest] = hostname.split(".");
    domain.sub = subdomain;
    domain.root = rest.join(".");
  }

  // Only for demo purposes – remove this if you want to use your root domain as the landing page
  if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
    return NextResponse.redirect("https://demo.vercel.pub");
  }

  // Hide sites directory from client
  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, {
      status: 404,
    });
  }

  // Ignore files and api directory
  if (pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (domain.sub === "app") {
    const redirectToHome = () => {
      url.pathname = "/";
      return NextResponse.redirect(url);
    };

    const rewritePathToApp = () => {
      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    };

    return isAuthed && pathname === "/login"
      ? redirectToHome()
      : rewritePathToApp();
  }

  // Map the root domain to the home directory
  if (hostname === domain.root) {
    url.pathname = `/home${pathname}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = `/_sites/${domain.sub}${pathname}`;
  return NextResponse.rewrite(url);
}
