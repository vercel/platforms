'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireSystemAdmin } from '@/lib/auth'

// ── Account management ────────────────────────────────────────────────────

export async function createAccount(formData: FormData) {
  await requireSystemAdmin()
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  const { error } = await supabase.from('accounts').insert({ name })
  if (error) throw new Error(error.message)
  revalidatePath('/pep')
}

export async function switchAccount(formData: FormData) {
  await requireSystemAdmin()
  const accountId = formData.get('accountId') as string
  if (!accountId) return
  const cookieStore = await cookies()
  cookieStore.set('pep_account_id', accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })
  redirect('/')
}

export async function exitAccount() {
  const cookieStore = await cookies()
  cookieStore.delete('pep_account_id')
  redirect('/pep')
}

// ── System admin management ───────────────────────────────────────────────

export async function addSystemAdmin(formData: FormData) {
  await requireSystemAdmin()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const name = (formData.get('name') as string)?.trim() || null
  if (!email) return
  const { error } = await supabase.from('system_admins').insert({ email, name })
  if (error) {
    if (error.code === '23505') throw new Error('That email is already a system admin.')
    throw new Error(error.message)
  }
  revalidatePath('/pep')
}

export async function updateSystemAdminName(formData: FormData) {
  await requireSystemAdmin()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim() || null
  if (!id) return
  const { error } = await supabase.from('system_admins').update({ name }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/pep')
}

export async function removeSystemAdmin(formData: FormData) {
  await requireSystemAdmin()
  const id = formData.get('id') as string
  if (!id) return

  // Lockout protection: never remove the last remaining system admin.
  const { count } = await supabase
    .from('system_admins')
    .select('id', { count: 'exact', head: true })
  if ((count ?? 0) <= 1) {
    throw new Error('Cannot remove the last system admin.')
  }

  const { error } = await supabase.from('system_admins').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/pep')
}
