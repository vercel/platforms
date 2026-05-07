'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireRole, requireEditGame } from '@/lib/auth'

export async function updateGameCoach(gameId: string, coachId: string) {
  await requireRole('coach')
  const { error } = await supabase
    .from('games')
    .update({ coach_id: coachId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}

export async function updateGameJersey(gameId: string, jerseyColorId: string) {
  await requireRole('coach')
  const { error } = await supabase
    .from('games')
    .update({ jersey_color_id: jerseyColorId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}

export async function updateGameGroup(gameId: string, gameDayGroupId: string) {
  await requireRole('coach')
  const { error } = await supabase
    .from('games')
    .update({ game_day_group_id: gameDayGroupId })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath('/game-day')
}

interface GameData {
  gameDate: string
  gameTime: string
  homeTeam: string
  awayTeam: string
  field: string
  locationId: string
  coachId: string
  jerseyColorId: string
  gameFormatId: string
}

export async function addGame(gameDayGroupId: string, gameDayId: string, data: GameData) {
  const { accountId } = await requireEditGame()
  const { error } = await supabase.from('games').insert({
    game_day_group_id: gameDayGroupId,
    account_id: accountId,
    game_date: data.gameDate,
    game_time: data.gameTime,
    home_team: data.homeTeam,
    away_team: data.awayTeam,
    field: data.field || null,
    location_id: data.locationId || null,
    coach_id: data.coachId || null,
    jersey_color_id: data.jerseyColorId || null,
    game_format_id: data.gameFormatId || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/game-day/${gameDayId}`)
}

export async function updateGroupLead(gameDayGroupId: string, gameDayId: string, coachId: string) {
  await requireEditGame()
  const { error } = await supabase
    .from('game_day_groups')
    .update({ lead_coach_id: coachId })
    .eq('id', gameDayGroupId)
  if (error) throw new Error(error.message)
  revalidatePath(`/game-day/${gameDayId}`)
}

export async function updateGame(gameId: string, gameDayId: string, data: GameData) {
  await requireEditGame()
  const { error } = await supabase
    .from('games')
    .update({
      game_date: data.gameDate,
      game_time: data.gameTime,
      home_team: data.homeTeam,
      away_team: data.awayTeam,
      field: data.field || null,
      location_id: data.locationId || null,
      coach_id: data.coachId || null,
      jersey_color_id: data.jerseyColorId || null,
      game_format_id: data.gameFormatId || null,
    })
    .eq('id', gameId)
  if (error) throw new Error(error.message)
  revalidatePath(`/game-day/${gameDayId}`)
}
