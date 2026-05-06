import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from './supabase-server'
import { supabase as adminClient } from './supabase'
import type { Role } from './roles'

const ROLE_RANK: Record<Role, number> = { owner: 4, admin: 3, coach: 2, viewer: 1 }

export interface UserAccount {
  userId: string
  accountId: string
  role: Role
  email: string | null
  displayName: string | null
}

// Cached per-request — multiple calls in the same render resolve once.
export const getUserAccount = cache(async (): Promise<UserAccount | null> => {
  try {
    const client = await createSupabaseServer()
    const { data: { user } } = await client.auth.getUser()
    if (!user) return null

    const cookieStore = await cookies()
    const activeAccountId = cookieStore.get('active_account_id')?.value

    let query = adminClient
      .from('account_members')
      .select('account_id, role')
      .eq('user_id', user.id)

    if (activeAccountId) {
      query = query.eq('account_id', activeAccountId)
    }

    const { data: members } = await query.limit(1)
    const member = members?.[0] ?? null

    if (!member) return null

    return {
      userId: user.id,
      accountId: member.account_id,
      role: member.role as Role,
      email: user.email ?? null,
      displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    }
  } catch {
    return null
  }
})

// Use in server components and actions that require authentication.
// Redirects to /login if the user has no session or no account membership.
export async function requireAuth(): Promise<UserAccount> {
  const account = await getUserAccount()
  if (!account) redirect('/login')
  return account
}

// Use in server actions that require a minimum role level.
// Throws an error (rather than redirecting) so the client can show it.
export async function requireRole(minRole: Role): Promise<UserAccount> {
  const account = await requireAuth()
  if (ROLE_RANK[account.role] < ROLE_RANK[minRole]) {
    throw new Error(`This action requires the ${minRole} role or higher.`)
  }
  return account
}
