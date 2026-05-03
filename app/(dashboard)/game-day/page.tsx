import { supabase } from "@/lib/supabase"
import { getActiveAccountId } from "@/lib/account"
import { GameDayClient, type GameDayRow } from "./game-day-client"

export default async function GameDayPage() {
  const accountId = await getActiveAccountId()

  const gdQ = supabase
    .from("game_days")
    .select(`id, name, start_date, end_date, status, locations(name), game_day_groups(games(home_team, away_team))`)
    .order("start_date", { ascending: false })

  const groupQ = supabase
    .from("groups")
    .select("id, name, lead_coach_id, teams(id, name, archived)")
    .order("name")

  const coachQ = supabase.from("coaches").select("id, name").order("name")
  const locationQ = supabase.from("locations").select("id, name, address").order("name")

  const [
    { data: raw },
    { data: groupsRaw },
    { data: coaches },
    { data: locationsRaw },
  ] = await Promise.all([
    accountId ? gdQ.eq("account_id", accountId) : gdQ,
    accountId ? groupQ.eq("account_id", accountId) : groupQ,
    accountId ? coachQ.eq("account_id", accountId) : coachQ,
    accountId ? locationQ.eq("account_id", accountId) : locationQ,
  ])

  const gameDays: GameDayRow[] = (raw ?? []).map((gd: any) => {
    const allGames = (gd.game_day_groups ?? []).flatMap((gdg: any) => gdg.games ?? [])
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

  const groups = (groupsRaw ?? []).map((g: any) => ({
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
      groups={groups}
      coaches={coaches ?? []}
      locations={locations}
      accountId={accountId}
    />
  )
}
