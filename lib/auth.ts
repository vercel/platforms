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
  role: Role        // actual role from DB
  activeRole: Role  // currently viewed role (may be lower than role)
  coachId: string | null
  email: string | null
  displayName: string | null
  canEditGames: boolean
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
      .select('account_id, role, can_edit_games')
      .eq('user_id', user.id)

    if (activeAccountId) {
      query = query.eq('account_id', activeAccountId)
    }

    // Run member lookup and coach lookup in parallel
    const [{ data: members }, { data: coachRows }] = await Promise.all([
      query.limit(1),
      user.email
        ? adminClient.from('coaches').select('id, account_id').eq('email', user.email)
        : Promise.resolve({ data: [] as { id: string; account_id: string }[] }),
    ])

    const member = members?.[0] ?? null
    if (!member) return null

    const actualRole = member.role as Role
    const coachId = (coachRows ?? []).find(c => c.account_id === member.account_id)?.id ?? null

    // Respect active_view_role cookie if it's a valid downgrade from actual role
    const viewRoleCookie = cookieStore.get('active_view_role')?.value as Role | undefined
    const activeRole = (
      viewRoleCookie &&
      ROLE_RANK[viewRoleCookie] !== undefined &&
      ROLE_RANK[viewRoleCookie] <= ROLE_RANK[actualRole]
    ) ? viewRoleCookie : actualRole

    return {
      userId: user.id,
      accountId: member.account_id,
      role: actualRole,
      activeRole,
      coachId,
      email: user.email ?? null,
      displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      canEditGames: member.can_edit_games ?? false,
    }
  } catch {
    return null
  }
})

export interface SystemAdmin {
  id: string
  email: string
  name: string | null
}

// Returns the system_admins row for the logged-in user, or null.
// Cached per-request. System admins are matched by email (like coach auto-link).
export const getSystemAdmin = cache(async (): Promise<SystemAdmin | null> => {
  try {
    const client = await createSupabaseServer()
    const { data: { user } } = await client.auth.getUser()
    if (!user?.email) return null

    // Stored emails are lowercased on insert; match case-insensitively.
    const { data } = await adminClient
      .from('system_admins')
      .select('id, email, name')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()

    return data ?? null
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

// Use in /pep server components and pep server actions.
// Redirects non-admins away rather than throwing, so the panel stays hidden.
export async function requireSystemAdmin(): Promise<SystemAdmin> {
  const admin = await getSystemAdmin()
  if (!admin) redirect('/game-day')
  return admin
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

// Use in server actions that require game-edit permission (admin+ or coach with can_edit_games).
export async function requireEditGame(): Promise<UserAccount> {
  const account = await requireAuth()
  const isAdmin = ROLE_RANK[account.role] >= ROLE_RANK['admin']
  const isCoachWithPerm = account.role === 'coach' && account.canEditGames
  if (!isAdmin && !isCoachWithPerm) {
    throw new Error('You do not have permission to edit games.')
  }
  return account
}
