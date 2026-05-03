'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function addPlayer(groupId: string, firstName: string, lastName: string) {
  const { error } = await supabase.from('players').insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    group_id: groupId,
    status: 'active',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function archivePlayer(playerId: string) {
  const { error } = await supabase
    .from('players')
    .update({ status: 'archived' })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function restorePlayer(playerId: string) {
  const { error } = await supabase
    .from('players')
    .update({ status: 'active' })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}
