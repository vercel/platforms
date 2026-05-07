import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { PlayersClient } from './players-client'

export default async function PlayersPage() {
  const accountId = await getActiveAccountId()

  const playerQ = supabase
    .from('players')
    .select('id, first_name, last_name, group_id, status, player_level_id, groups(name), player_levels(name, color)')
    .order('last_name')
  const groupQ = supabase.from('groups').select('id, name').order('name')
  const levelQ = supabase.from('player_levels').select('id, name, rank, color').order('rank')

  const [{ data: players }, { data: groups }, { data: playerLevels }] = await Promise.all([
    accountId ? playerQ.eq('account_id', accountId) : playerQ,
    accountId ? groupQ.eq('account_id', accountId)  : groupQ,
    accountId ? levelQ.eq('account_id', accountId)  : levelQ,
  ])

  // Build last-rostered-date map: player_id → most recent game_date (active roster entries only)
  const playerIds = (players ?? []).map(p => p.id)
  const lastRosteredMap: Record<string, string> = {}
  if (playerIds.length > 0) {
    const { data: rosterData } = await supabase
      .from('roster_entries')
      .select('player_id, games(game_date)')
      .in('player_id', playerIds)
      .eq('is_unavailable', false)
    for (const entry of (rosterData ?? [])) {
      const gameDate = (entry.games as any)?.game_date as string | undefined
      if (gameDate && (!lastRosteredMap[entry.player_id] || gameDate > lastRosteredMap[entry.player_id])) {
        lastRosteredMap[entry.player_id] = gameDate
      }
    }
  }

  return (
    <PlayersClient
      players={players ?? []}
      groups={groups ?? []}
      playerLevels={playerLevels ?? []}
      lastRosteredMap={lastRosteredMap}
    />
  )
}
