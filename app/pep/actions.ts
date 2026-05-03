'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function pepLogin(formData: FormData) {
  const secret = formData.get('secret') as string
  if (!secret || secret !== process.env.PEP_SECRET) {
    redirect('/pep/login?error=1')
  }
  const cookieStore = await cookies()
  cookieStore.set('pep_auth', process.env.PEP_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/pep')
}

export async function pepLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('pep_auth')
  cookieStore.delete('pep_account_id')
  redirect('/pep/login')
}

export async function createAccount(formData: FormData) {
  const name = (formData.get('name') as string).trim()
  if (!name) return
  const { error } = await supabase.from('accounts').insert({ name })
  if (error) throw new Error(error.message)
  revalidatePath('/pep')
}

export async function switchAccount(formData: FormData) {
  const accountId = formData.get('accountId') as string
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
