import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabase as adminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/game-day'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=Missing+auth+code', origin))
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin))
  }

  // Auto-link: if user has no account_members entry, match by email to coaches table
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: existing } = await adminClient
      .from('account_members')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing && user.email) {
      const { data: coach } = await adminClient
        .from('coaches')
        .select('id, account_id')
        .eq('email', user.email)
        .maybeSingle()

      if (coach) {
        await adminClient.from('account_members').insert({
          account_id: coach.account_id,
          user_id: user.id,
          role: 'coach',
        })
      }
    }
  }

  return NextResponse.redirect(new URL(next, origin))
}
