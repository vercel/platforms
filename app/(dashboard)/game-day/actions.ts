'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export interface NewTeamInput {
  poolId: string
  name: string
}

export interface GameInput {
  date: string | null
  time: string | null
  homeTeam: string
  awayTeam: string
  field: string | null
  locationId: string | null
  newLocation: { name: string; address: string } | null
  buildHomeRoster: boolean
  buildAwayRoster: boolean
}

export interface PoolInput {
  poolId: string
  leadCoachId: string | null
  games: GameInput[]
}

export interface CreateGameDayInput {
  name: string
  status: 'draft' | 'active'
  accountId: string | null
  pools: PoolInput[]
  newTeams: NewTeamInput[]
}

export async function createGameDay(input: CreateGameDayInput): Promise<string> {
  await requireRole('admin')
  const { name, status, accountId, pools, newTeams } = input

  // Insert new teams
  if (newTeams.length > 0) {
    const { error } = await supabase.from('teams').insert(
      newTeams.map(t => ({ name: t.name, pool_id: t.poolId, account_id: accountId }))
    )
    if (error) throw new Error(`Failed to create teams: ${error.message}`)
  }

  // Insert new locations and map name → id
  const locationIdMap = new Map<string, string>()
  const allGames = pools.flatMap(g => g.games)
  const newLocs = Array.from(
    new Map(
      allGames
        .filter(g => g.newLocation != null)
        .map(g => [g.newLocation!.name, g.newLocation!])
    ).values()
  )

  if (newLocs.length > 0) {
    const { data, error } = await supabase
      .from('locations')
      .insert(newLocs.map(l => ({ name: l.name, address: l.address || null, account_id: accountId })))
      .select('id, name')
    if (error) throw new Error(`Failed to create locations: ${error.message}`)
    data?.forEach(l => locationIdMap.set(l.name, l.id))
  }

  // Derive start/end dates from game dates
  const dates = allGames.map(g => g.date).filter(Boolean).sort() as string[]
  const startDate = dates[0] ?? new Date().toISOString().slice(0, 10)
  const endDate = dates.length > 1 && dates[dates.length - 1] !== startDate
    ? dates[dates.length - 1]
    : null

  // Insert game_day
  const { data: gameDay, error: gdError } = await supabase
    .from('game_days')
    .insert({ name, status, start_date: startDate, end_date: endDate, account_id: accountId })
    .select('id')
    .single()
  if (gdError) throw new Error(`Failed to create game day: ${gdError.message}`)

  // Insert game_day_pools and games sequentially
  for (const pool of pools) {
    const { data: gdp, error: gdpError } = await supabase
      .from('game_day_pools')
      .insert({
        game_day_id: gameDay.id,
        pool_id: pool.poolId,
        lead_coach_id: pool.leadCoachId || null,
        roster_status: 'draft',
        account_id: accountId,
      })
      .select('id')
      .single()
    if (gdpError) throw new Error(`Failed to create game day pool: ${gdpError.message}`)

    if (pool.games.length > 0) {
      const { error: gError } = await supabase.from('games').insert(
        pool.games.map(game => {
          const locId = game.locationId
            ?? (game.newLocation ? locationIdMap.get(game.newLocation.name) ?? null : null)
          return {
            game_day_pool_id: gdp.id,
            game_date: game.date || null,
            game_time: game.time || null,
            home_team: game.homeTeam,
            away_team: game.awayTeam,
            field: game.field || null,
            location_id: locId,
            build_home_roster: game.buildHomeRoster,
            build_away_roster: game.buildAwayRoster,
            account_id: accountId,
          }
        })
      )
      if (gError) throw new Error(`Failed to create games: ${gError.message}`)
    }
  }

  revalidatePath('/game-day')
  return gameDay.id
}
