import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.url;
  let subdomain: string | null = null;

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL for local development
    // This handles cases where browsers normalize the hostname
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      subdomain = fullUrlMatch[1];
    } else {
      // Standard host header approach as fallback
      const host = request.headers.get('host') || '';
      const hostname = host.split(':')[0];

      if (hostname.includes('.localhost')) {
        subdomain = hostname.split('.')[0];
      }
    }
  } else {
    // Production/non-localhost handling
    const host = request.headers.get('host') || '';
    const hostname = host.split(':')[0];
    const rootDomainFormatted = rootDomain.split(':')[0];

    // Handle preview deployment URLs (tenant---branch-name.vercel.app)
    const isPreviewDeployment =
      hostname.includes('---') && hostname.endsWith('.vercel.app');

    if (isPreviewDeployment) {
      // Extract subdomain from preview URL (format: tenant---branch-name.vercel.app)
      const parts = hostname.split('---');
      if (parts.length > 0) {
        subdomain = parts[0];
      }
    } else {
      // Regular subdomain detection
      const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

      if (isSubdomain) {
        subdomain = hostname.replace(`.${rootDomainFormatted}`, '');
      }
    }
  }

  // If we have a subdomain (either from regular URL or preview deployment)
  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|examples|[\\w-]+\\.\\w+).*)'
  ]
};
