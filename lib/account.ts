import { cookies } from 'next/headers'

export async function getActiveAccountId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('pep_account_id')?.value ?? null
}
