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
  console.log("Middleware function started");
  const url = req.nextUrl;
  console.log(`URL: ${url}`);

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  console.log(`Hostname: ${hostname}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  console.log(`Path: ${path}`);

  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log("Hostname matches app domain");
    const session = await getToken({ req });
    console.log(`Session: ${session}`);
    if (!session && path !== "/login") {
      console.log("No session and path is not /login, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      console.log("Session exists and path is /login, redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("Rewriting URL for app pages");
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    console.log("Hostname is vercel.pub, redirecting to Vercel blog");
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }
  
  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log("Hostname is localhost or root domain, rewriting URL to /home folder");
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  console.log("process.env", process.env);

  // rewrite everything else to `/[domain]/[path] dynamic route
  console.log("Rewriting URL for all other cases");
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
console.log("Middleware function ended");
