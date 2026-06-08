'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export async function saveRoster(
  gameDayId: string,
  assignments: { gameId: string; playerId: string; notes?: string }[],
  unavailablePlayerIds: string[]
) {
  const { accountId } = await requireRole('coach')

  // Fetch all game_day_pools for this game day, with their game IDs and pool_id
  const { data: gdps, error: gdpErr } = await supabase
    .from('game_day_pools')
    .select('id, pool_id, games(id)')
    .eq('game_day_id', gameDayId)

  if (gdpErr) throw new Error(gdpErr.message)
  if (!gdps) return

  const poolIdToGameIds: Record<string, string[]> = {}
  const allGameIds: string[] = []

  for (const gdp of gdps) {
    const gameIds = (gdp.games as { id: string }[]).map(g => g.id)
    poolIdToGameIds[gdp.pool_id] = gameIds
    allGameIds.push(...gameIds)
  }

  // For unavailable players, look up their pool_id so we know which games to mark them in
  const unavailableEntries: { game_id: string; player_id: string; is_unavailable: boolean; notes: null }[] = []
  if (unavailablePlayerIds.length > 0) {
    const { data: playerPools } = await supabase
      .from('players')
      .select('id, pool_id')
      .in('id', unavailablePlayerIds)

    for (const pg of playerPools ?? []) {
      const gameIds = poolIdToGameIds[pg.pool_id] ?? []
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
      account_id: accountId,
    })),
    ...unavailableEntries.map(e => ({ ...e, account_id: accountId })),
  ]

  if (entries.length > 0) {
    const { error } = await supabase.from('roster_entries').insert(entries)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/game-day')
}
