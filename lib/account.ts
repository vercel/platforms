import { cookies } from 'next/headers'
import { getUserAccount, getSystemAdmin } from './auth'

// Returns the active account ID for data filtering.
// Pep impersonation (pep_account_id cookie) takes precedence — but only when the
// current user is a verified system admin, so a forged cookie can't leak data.
export async function getActiveAccountId(): Promise<string | null> {
  const cookieStore = await cookies()
  const pepAccountId = cookieStore.get('pep_account_id')?.value
  if (pepAccountId) {
    const admin = await getSystemAdmin()
    if (admin) return pepAccountId
  }

  const account = await getUserAccount()
  return account?.accountId ?? null
}
