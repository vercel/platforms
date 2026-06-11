import { getUserAccount } from './auth'

// Returns the active account ID for data filtering.
// getUserAccount() is the single source of truth — it already resolves Pep
// impersonation (for verified system admins) to the impersonated account.
export async function getActiveAccountId(): Promise<string | null> {
  const account = await getUserAccount()
  return account?.accountId ?? null
}
