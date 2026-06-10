import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { GameDayTabs, type PoolGamesRow, type GameRow } from "@/components/game-day-tabs"
import { getUserAccount } from "@/lib/auth"
import { can } from "@/lib/roles"
import { format, parseISO } from "date-fns"

interface Props {
  params: Promise<{ id: string }>
}

function statusBadge(status: string) {
  switch (status) {
    case "live":
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Live</Badge>
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>
    case "completed":
      return <Badge variant="outline">Completed</Badge>
    default:
      return null
  }
}

function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`
}

function fmtDate(d: string): string {
  return format(parseISO(d), "MMM d, yyyy")
}

export default async function GameDayDetailPage({ params }: Props) {
  const { id } = await params

  const user = await getUserAccount()
  const canEdit = user ? can.editGame(user.role, user.canEditGames) : false

  const [{ data: gameDay }, { data: poolsRaw }, { data: coaches }, { data: jerseyColors }, { data: locations }, { data: gameFormats }] =
    await Promise.all([
      supabase
        .from("game_days")
        .select("id, name, start_date, end_date, status, locations(name)")
        .eq("id", id)
        .single(),
      supabase
        .from("game_day_pools")
        .select(`
          id, roster_status, published_at,
          pools(name, default_game_format_id, pool_coaches(coaches(id, name))),
          lead_coach:coaches!game_day_pools_lead_coach_id_fkey(id, name),
          publisher:coaches!game_day_pools_published_by_fkey(id, name),
          games(
            id, game_date, game_time, home_team, away_team, field, location_id, game_format_id,
            locations(id, name),
            coach:coaches(id, name),
            jersey_color:jersey_colors(id, name, color),
            game_format:game_formats(id, name)
          )
        `)
        .eq("game_day_id", id)
        .order("pools(name)"),
      supabase.from("coaches").select("id, name").order("name"),
      supabase.from("jersey_colors").select("id, name, color").order("name"),
      supabase.from("locations").select("id, name").order("name"),
      supabase.from("game_formats").select("id, name").order("rank"),
    ])

  if (!gameDay) notFound()

  // Fetch rostered player counts per game
  const allGameIds = (poolsRaw ?? []).flatMap((gdp: any) =>
    (gdp.games ?? []).map((g: any) => g.id)
  )
  const { data: rosterEntries } = allGameIds.length > 0
    ? await supabase
        .from("roster_entries")
        .select("game_id")
        .eq("is_unavailable", false)
        .in("game_id", allGameIds)
    : { data: [] }

  const rosterCountByGame: Record<string, number> = {}
  for (const entry of rosterEntries ?? []) {
    const gameId = (entry as any).game_id
    rosterCountByGame[gameId] = (rosterCountByGame[gameId] ?? 0) + 1
  }

  // Transform DB shape into GameDayTabs props
  const poolGames: PoolGamesRow[] = (poolsRaw ?? []).map((gdp: any) => ({
    id: gdp.id,
    poolName: gdp.pools?.name ?? "",
    poolLead: gdp.lead_coach?.name ?? "",
    poolLeadId: gdp.lead_coach?.id ?? "",
    poolCoaches: (gdp.pools?.pool_coaches ?? []).map((gc: any) => gc.coaches).filter(Boolean),
    defaultGameFormatId: gdp.pools?.default_game_format_id ?? null,
    rosterStatus: gdp.roster_status,
    publishedAt: gdp.published_at
      ? format(new Date(gdp.published_at), "MMM d, yyyy 'at' h:mm a")
      : undefined,
    publishedBy: gdp.publisher?.name,
    games: (gdp.games ?? []).map((g: any): GameRow => ({
      id: g.id,
      day: g.game_date ? fmtDate(g.game_date) : undefined,
      time: g.game_time ? fmtTime(g.game_time) : "",
      homeTeam: g.home_team,
      awayTeam: g.away_team,
      location: g.locations?.name ?? "",
      locationId: g.location_id ?? "",
      facility: g.locations?.name ?? "",
      field: g.field ?? "",
      coach: g.coach?.name ?? "",
      coachId: g.coach?.id,
      jersey: g.jersey_color?.name ?? "",
      jerseyColor: g.jersey_color?.color,
      jerseyColorId: g.jersey_color?.id,
      gameFormatId: g.game_format_id ?? "",
      gameFormatName: g.game_format?.name ?? "",
      rosterCount: rosterCountByGame[g.id] ?? 0,
      rawDate: g.game_date ?? "",
      rawTime: g.game_time ? g.game_time.slice(0, 5) : "",
    })),
  }))

  const locationName = (gameDay as any).locations?.name ?? ""
  const dateLabel = gameDay.end_date
    ? `${fmtDate(gameDay.start_date)} – ${fmtDate(gameDay.end_date)}`
    : fmtDate(gameDay.start_date)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/game-day">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to Game Day list</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{gameDay.name}</h1>
            {statusBadge(gameDay.status)}
          </div>
          <p className="text-muted-foreground">
            {dateLabel}
            {locationName && <> &middot; {locationName}</>}
          </p>
        </div>
      </div>

      <GameDayTabs
        gameDayId={gameDay.id}
        gameDayName={gameDay.name}
        poolGames={poolGames}
        coaches={coaches ?? []}
        jerseyColors={jerseyColors ?? []}
        locations={locations ?? []}
        gameFormats={gameFormats ?? []}
        canEdit={canEdit}
      />
    </div>
  )
}
