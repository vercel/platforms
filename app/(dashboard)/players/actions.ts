'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export async function addPlayer(poolId: string, firstName: string, lastName: string) {
  const { accountId } = await requireRole('coach')
  const { error } = await supabase.from('players').insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    pool_id: poolId,
    account_id: accountId,
    status: 'active',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function updatePlayer(
  playerId: string,
  firstName: string,
  lastName: string,
  poolId: string,
  levelId?: string
) {
  await requireRole('coach')
  const { error } = await supabase
    .from('players')
    .update({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      pool_id: poolId,
      player_level_id: levelId || null,
    })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function archivePlayer(playerId: string) {
  await requireRole('coach')
  const { error } = await supabase
    .from('players')
    .update({ status: 'archived' })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function setPlayerLevel(playerId: string, levelId: string | null) {
  await requireRole('coach')
  const { error } = await supabase
    .from('players')
    .update({ player_level_id: levelId })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}

export async function restorePlayer(playerId: string) {
  await requireRole('coach')
  const { error } = await supabase
    .from('players')
    .update({ status: 'active' })
    .eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/players')
}
