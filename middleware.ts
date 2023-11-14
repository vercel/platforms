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
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  const searchParams = url.searchParams;
  // rewrites for app pages
  if (
    hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    hostname === `app.${process.env.VERCEL_URL}`
  ) {
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
      new URL(
        `/app${path === "/" ? "" : path}${
          typeof searchParams === "string" ? `?${searchParams}` : ""
        }`,
        req.url,
      ),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    console.log("Hostname is vercel.pub, redirecting to Vercel blog");
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }

  if (
    hostname === 'api.' + process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log("Hostname is api, redirecting to api");
    return NextResponse.rewrite(new URL(
      `/api${path === "/" ? "" : path}${
        typeof searchParams === "string" ? `?${searchParams}` : ""
      }`,
      req.url,
    ));
    
  }

  // rewrite root application to `/home` folder
  if (
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log(
      "Hostname is localhost or root domain, rewriting URL to /home folder",
    );
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite root application to `/home` folder
  if (hostname === process.env.VERCEL_URL && path === "/") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  console.log("Rewriting URL for all other cases");
  const nextUrl = new URL(`/${hostname}${path}`, req.url);
  return NextResponse.rewrite(nextUrl);
}
console.log("Middleware function ended");
