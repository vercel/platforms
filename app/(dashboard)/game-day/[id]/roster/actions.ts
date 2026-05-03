'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function saveRoster(
  gameDayId: string,
  assignments: { gameId: string; playerId: string; notes?: string }[],
  unavailablePlayerIds: string[]
) {
  // Fetch all game_day_groups for this game day, with their game IDs and group_id
  const { data: gdgs, error: gdgErr } = await supabase
    .from('game_day_groups')
    .select('id, group_id, games(id)')
    .eq('game_day_id', gameDayId)

  if (gdgErr) throw new Error(gdgErr.message)
  if (!gdgs) return

  const groupIdToGameIds: Record<string, string[]> = {}
  const allGameIds: string[] = []

  for (const gdg of gdgs) {
    const gameIds = (gdg.games as { id: string }[]).map(g => g.id)
    groupIdToGameIds[gdg.group_id] = gameIds
    allGameIds.push(...gameIds)
  }

  // For unavailable players, look up their group_id so we know which games to mark them in
  const unavailableEntries: { game_id: string; player_id: string; is_unavailable: boolean; notes: null }[] = []
  if (unavailablePlayerIds.length > 0) {
    const { data: playerGroups } = await supabase
      .from('players')
      .select('id, group_id')
      .in('id', unavailablePlayerIds)

    for (const pg of playerGroups ?? []) {
      const gameIds = groupIdToGameIds[pg.group_id] ?? []
      for (const gameId of gameIds) {
        unavailableEntries.push({ game_id: gameId, player_id: pg.id, is_unavailable: true, notes: null })
      }
    }
  }

  // Delete all existing roster entries for this game day's games, then re-insert
  if (allGameIds.length > 0) {
    await supabase.from('roster_entries').delete().in('game_id', allGameIds)
  }

  const entries = [
    ...assignments.map(a => ({
      game_id: a.gameId,
      player_id: a.playerId,
      is_unavailable: false,
      notes: a.notes ?? null,
    })),
    ...unavailableEntries,
  ]

  if (entries.length > 0) {
    const { error } = await supabase.from('roster_entries').insert(entries)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/game-day')
}
