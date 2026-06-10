import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client for Client Components.
// Requires NEXT_PUBLIC_SUPABASE_ANON_KEY to be exposed to the browser.
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
