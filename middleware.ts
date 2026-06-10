import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rootDomain } from '@/lib/utils'

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/)
    if (fullUrlMatch?.[1]) return fullUrlMatch[1]
    if (hostname.includes('.localhost')) return hostname.split('.')[0]
    return null
  }

  const rootDomainFormatted = rootDomain.split(':')[0]
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---')
    return parts.length > 0 ? parts[0] : null
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const subdomain = extractSubdomain(request)

  // ── Subdomain rewrites ───────────────────────────────────────────────────
  if (subdomain) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url))
    }
  }

  // ── Pep (system admin) — cookie-based auth, skip Supabase ───────────────
  if (pathname.startsWith('/pep')) {
    if (pathname !== '/pep/login') {
      const pepAuth = request.cookies.get('pep_auth')?.value
      if (!pepAuth || pepAuth !== process.env.PEP_SECRET) {
        return NextResponse.redirect(new URL('/pep/login', request.url))
      }
    }
    return NextResponse.next()
  }

  // ── Public routes — no auth needed ──────────────────────────────────────
  if (pathname.startsWith('/auth') || pathname.startsWith('/s/')) {
    return NextResponse.next()
  }

  // ── Pep admin viewing the dashboard — allow without Supabase session ────
  // When a Pep admin logs in as an account, they land on dashboard routes.
  // They have pep_auth + pep_account_id cookies but no Supabase session.
  const pepAuth = request.cookies.get('pep_auth')?.value
  const pepAccountId = request.cookies.get('pep_account_id')?.value
  if (pepAuth === process.env.PEP_SECRET && pepAccountId) {
    return NextResponse.next()
  }

  // ── Supabase session check (refreshes token if needed) ──────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() is required here (not getSession()) — it validates the JWT with Supabase's server
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → send to login (preserve intended destination)
  if (!user && !pathname.startsWith('/login')) {
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in → skip the login page
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/game-day', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
}
