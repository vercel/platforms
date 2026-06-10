'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserAccount, requireAuth } from '@/lib/auth'
import type { Role } from '@/lib/roles'

const ROLE_RANK: Record<Role, number> = { owner: 4, admin: 3, coach: 2, viewer: 1 }

export async function switchUserAccount(accountId: string) {
  const current = await getUserAccount()
  if (!current) redirect('/login')

  // Verify the user actually belongs to this account before switching
  const { data } = await supabase
    .from('account_members')
    .select('id')
    .eq('user_id', current.userId)
    .eq('account_id', accountId)
    .maybeSingle()

  if (!data) throw new Error('Access denied')

  const cookieStore = await cookies()
  cookieStore.set('active_account_id', accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  redirect('/')
}

export async function setActiveRole(role: Role, returnTo: string = '/game-day') {
  const account = await requireAuth()
  if (ROLE_RANK[role] === undefined || ROLE_RANK[role] > ROLE_RANK[account.role]) {
    throw new Error('Invalid role')
  }
  const cookieStore = await cookies()
  cookieStore.set('active_view_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  redirect(returnTo)
}
