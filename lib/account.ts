import { cookies } from 'next/headers'
import { getUserAccount } from './auth'

// Returns the active account ID for data filtering.
// Pep impersonation (pep_account_id cookie) takes precedence over real user auth.
export async function getActiveAccountId(): Promise<string | null> {
  const cookieStore = await cookies()
  const pepAccountId = cookieStore.get('pep_account_id')?.value
  if (pepAccountId) return pepAccountId

  const account = await getUserAccount()
  return account?.accountId ?? null
}
