import { supabase } from "@/lib/supabase"
import { GameDayClient, type GameDayRow } from "./game-day-client"

export default async function GameDayPage() {
  const { data: raw } = await supabase
    .from("game_days")
    .select(`
      id, name, start_date, end_date, status,
      locations(name),
      game_day_groups(games(home_team, away_team))
    `)
    .order("start_date", { ascending: false })

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

  return <GameDayClient gameDays={gameDays} />
}
