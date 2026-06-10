import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Per-request Supabase client that reads/writes the user's session cookies.
// Use this in Server Components, Server Actions, and Route Handlers.
// Do NOT use in middleware — middleware creates its own client with request/response cookies.
export async function createSupabaseServer() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components can't set cookies — only middleware/route handlers/actions can.
            // Token refresh will be handled by middleware on the next request.
          }
        },
      },
    }
  )
}
