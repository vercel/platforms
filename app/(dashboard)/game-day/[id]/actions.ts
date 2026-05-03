'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function updateGameCoach(gameId: string, coachId: string) {
  const { error } = await supabase
    .from('games')
    .update({ coach_id: coachId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}

export async function updateGameJersey(gameId: string, jerseyColorId: string) {
  const { error } = await supabase
    .from('games')
    .update({ jersey_color_id: jerseyColorId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}

export async function updateGameGroup(gameId: string, gameDayGroupId: string) {
  const { error } = await supabase
    .from('games')
    .update({ game_day_group_id: gameDayGroupId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}
