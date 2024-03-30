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
  const hostname = getProcessedHostname(req);
  const path = getRequestPath(url);

  if (isAppDomain(hostname)) {
    return handleAppDomainRequests(req, path);
  }

  if (isVercelPubDomain(hostname)) {
    return redirectToVercelBlog();
  }

  if (isLocalOrRootDomain(hostname)) {
    return rewriteToHomeFolder(url, path);
  }

  return rewriteToDynamicRoute(url, hostname, path);
}

/**
 * Processes the request hostname, adjusting it for local development and Vercel preview deployments.
 * It ensures that the hostname is standardized to use the application's root domain environment variable.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {string} The processed hostname.
 */
function getProcessedHostname(req: NextRequest) {
  let hostname = req.headers.get("host")!.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  if (hostname.includes("---") && hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)) {
    hostname = `${hostname.split("---")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }
  return hostname;
}

/**
 * Constructs the full request path including any search parameters.
 *
 * @param {URL} url - The URL object of the request.
 * @returns {string} The full path for the request.
 */
function getRequestPath(url: URL) {
  const searchParams = url.searchParams.toString();
  return `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
}

/**
 * Checks if the request is targeted at the application's subdomain.
 *
 * @param {string} hostname - The hostname from the request.
 * @returns {boolean} True if the request is for the app domain, false otherwise.
 */
function isAppDomain(hostname: string) {
  return hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
}

/**
 * Handles requests to the app domain, including authentication checks and redirections
 * based on the session state and requested path.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {string} path - The path extracted from the request.
 * @returns {Response} A Next.js response object to redirect or rewrite the request.
 */
async function handleAppDomainRequests(req: NextRequest, path: string) {
  const session = await getToken({ req });
  if (!session && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && path == "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
}

/**
 * Determines if the request's hostname is specifically for a `vercel.pub` domain.
 *
 * @param {string} hostname - The hostname from the request.
 * @returns {boolean} True if the hostname is `vercel.pub`, false otherwise.
 */
function isVercelPubDomain(hostname: string) {
  return hostname === "vercel.pub";
}

/**
 * Redirects requests to the `vercel.pub` domain to a specific blog post.
 *
 * @returns {Response} A Next.js response object for the redirection.
 */
function redirectToVercelBlog() {
  return NextResponse.redirect("https://vercel.com/blog/platforms-starter-kit");
}

/**
 * Checks if the request is coming from localhost or the application's root domain.
 *
 * @param {string} hostname - The hostname from the request.
 * @returns {boolean} True if the hostname is localhost or the root domain, false otherwise.
 */
function isLocalOrRootDomain(hostname: string) {
  return hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN;
}

/**
 * Rewrites requests from the root or local domain to the '/home' folder, maintaining the path and query.
 * @param {URL} url - The URL object from the incoming request.
 * @param {string} path - The path from the request URL.
 * @returns {NextResponse} A response object rewriting the request to the '/home' folder.
 */
function rewriteToHomeFolder(url: URL, path: string) {
  return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, url));
}

/**
 * Rewrites the request to a dynamic route based on the processed hostname and path. This is particularly useful
 * for handling requests in a multi-tenant application with custom domains, allowing for flexible routing based on the request's domain.
 * @param {URL} url - The URL object from the incoming request.
 * @param {string} hostname - The processed request hostname, adjusted for specific use cases.
 * @param {string} path - The path from the request URL, including query parameters.
 * @returns {NextResponse} A response object rewriting the request to a dynamic route.
 */
function rewriteToDynamicRoute(url: URL, hostname: string, path: string) {
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, url));
}