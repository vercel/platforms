import { supabase } from "@/lib/supabase"
import { getActiveAccountId } from "@/lib/account"
import { getUserAccount } from "@/lib/auth"
import { GameDayClient, type GameDayRow } from "./game-day-client"

export default async function GameDayPage() {
  const accountId = await getActiveAccountId()
  const userAccount = await getUserAccount()
  const isCoachView = userAccount?.activeRole === 'coach'
  const coachId = userAccount?.coachId ?? null

  // In coach view, scope game days to those involving the coach's pools
  let coachGameDayIds: string[] | null = null
  if (isCoachView && coachId && accountId) {
    const { data: poolCoaches } = await supabase
      .from('pool_coaches')
      .select('pool_id')
      .eq('coach_id', coachId)
      .eq('account_id', accountId)
    const coachPoolIds = (poolCoaches ?? []).map(pc => pc.pool_id)

    if (coachPoolIds.length > 0) {
      const { data: gdps } = await supabase
        .from('game_day_pools')
        .select('game_day_id')
        .in('pool_id', coachPoolIds)
        .eq('account_id', accountId)
      coachGameDayIds = [...new Set((gdps ?? []).map(gdp => gdp.game_day_id))]
    } else {
      coachGameDayIds = []
    }
  }

  let gdQ = supabase
    .from("game_days")
    .select(`id, name, start_date, end_date, status, locations(name), game_day_pools(games(home_team, away_team))`)
    .order("start_date", { ascending: false })

  const poolQ = supabase
    .from("pools")
    .select("id, name, lead_coach_id, teams(id, name, archived)")
    .order("name")

  const coachQ = supabase.from("coaches").select("id, name").order("name")
  const locationQ = supabase.from("locations").select("id, name, address").order("name")

  if (accountId) {
    gdQ = gdQ.eq("account_id", accountId)
  }

  if (coachGameDayIds !== null) {
    if (coachGameDayIds.length > 0) {
      gdQ = gdQ.in("id", coachGameDayIds)
    } else {
      return (
        <GameDayClient
          gameDays={[]}
          pools={[]}
          coaches={[]}
          locations={[]}
          accountId={accountId}
        />
      )
    }
  }

  const [
    { data: raw },
    { data: poolsRaw },
    { data: coaches },
    { data: locationsRaw },
  ] = await Promise.all([
    gdQ,
    accountId ? poolQ.eq("account_id", accountId) : poolQ,
    accountId ? coachQ.eq("account_id", accountId) : coachQ,
    accountId ? locationQ.eq("account_id", accountId) : locationQ,
  ])

  const gameDays: GameDayRow[] = (raw ?? []).map((gd: any) => {
    const allGames = (gd.game_day_pools ?? []).flatMap((gdp: any) => gdp.games ?? [])
    const teamNames = new Set<string>([
      ...allGames.map((g: any) => g.home_team),
      ...allGames.map((g: any) => g.away_team),
    ])
    return {
      id: gd.id,
      name: gd.name,
      start_date: gd.start_date,
      end_date: gd.end_date,
      status: gd.status,
      locations: gd.locations,
      team_count: teamNames.size,
      player_count: 0,
    }
  })

  const pools = (poolsRaw ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    leadCoachId: g.lead_coach_id ?? null,
    teams: (g.teams ?? [])
      .filter((t: any) => !t.archived)
      .map((t: any) => ({ id: t.id, name: t.name })),
  }))

  const locations = (locationsRaw ?? []).map((l: any) => ({
    id: l.id,
    name: l.name,
    address: l.address ?? null,
  }))

  return (
    <GameDayClient
      gameDays={gameDays}
      pools={pools}
      coaches={coaches ?? []}
      locations={locations}
      accountId={accountId}
    />
  )
}
