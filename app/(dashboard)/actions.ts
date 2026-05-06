'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserAccount } from '@/lib/auth'

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
