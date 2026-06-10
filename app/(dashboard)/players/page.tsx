import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { getUserAccount } from '@/lib/auth'
import { PlayersClient } from './players-client'

export default async function PlayersPage() {
  const accountId = await getActiveAccountId()
  const userAccount = await getUserAccount()
  const isCoachView = userAccount?.activeRole === 'coach'
  const coachId = userAccount?.coachId ?? null

  // In coach view, scope to pools the coach is assigned to
  let coachPoolIds: string[] | null = null
  if (isCoachView && coachId && accountId) {
    const { data: poolCoaches } = await supabase
      .from('pool_coaches')
      .select('pool_id')
      .eq('coach_id', coachId)
      .eq('account_id', accountId)
    coachPoolIds = (poolCoaches ?? []).map(pc => pc.pool_id)
  }

  let playerQ = supabase
    .from('players')
    .select('id, first_name, last_name, pool_id, status, player_level_id, pools(name), player_levels(name, color)')
    .order('last_name')
  let poolQ = supabase.from('pools').select('id, name').order('name')
  const levelQ = supabase.from('player_levels').select('id, name, rank, color').order('rank')

  if (accountId) {
    playerQ = playerQ.eq('account_id', accountId)
    poolQ = poolQ.eq('account_id', accountId)
  }

  if (coachPoolIds !== null) {
    if (coachPoolIds.length > 0) {
      playerQ = playerQ.in('pool_id', coachPoolIds)
      poolQ = poolQ.in('id', coachPoolIds)
    } else {
      // Coach has no assigned pools — return empty results
      return (
        <PlayersClient
          players={[]}
          pools={[]}
          playerLevels={[]}
          lastRosteredMap={{}}
        />
      )
    }
  }

  const [{ data: players }, { data: pools }, { data: playerLevels }] = await Promise.all([
    playerQ,
    poolQ,
    accountId ? levelQ.eq('account_id', accountId) : levelQ,
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
      pools={pools ?? []}
      playerLevels={playerLevels ?? []}
      lastRosteredMap={lastRosteredMap}
    />
  )
}
