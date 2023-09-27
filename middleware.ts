import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (process.env.VERCEL_ENV != "production" && !url.searchParams.has("host")) {
    url.searchParams.set("host", "app");
    return NextResponse.redirect(url);
  }

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = (url.searchParams.get("host") ?? req.headers.get("host")!)
    .replace(".localhost:3000", ``)
    .replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, ``);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // rewrites for app pages
  if (hostname == "app") {
    const session = await getToken({ req });
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }
  
  // rewrite root application to `/home` folder
  if (hostname === "" || hostname === "www") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
