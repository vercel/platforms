import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { GameDayTabs, type GroupGamesRow, type GameRow } from "@/components/game-day-tabs"
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

  const [{ data: gameDay }, { data: groupsRaw }, { data: coaches }, { data: jerseyColors }] =
    await Promise.all([
      supabase
        .from("game_days")
        .select("id, name, start_date, end_date, status, locations(name)")
        .eq("id", id)
        .single(),
      supabase
        .from("game_day_groups")
        .select(`
          id, roster_status, published_at,
          groups(name),
          lead_coach:coaches!game_day_groups_lead_coach_id_fkey(id, name),
          publisher:coaches!game_day_groups_published_by_fkey(id, name),
          games(
            id, game_date, game_time, home_team, away_team, field, format,
            locations(name),
            coach:coaches(id, name),
            jersey_color:jersey_colors(id, name, color)
          )
        `)
        .eq("game_day_id", id)
        .order("groups(name)"),
      supabase.from("coaches").select("id, name").order("name"),
      supabase.from("jersey_colors").select("id, name, color").order("name"),
    ])

  if (!gameDay) notFound()

  // Transform DB shape into GameDayTabs props
  const groupGames: GroupGamesRow[] = (groupsRaw ?? []).map((gdg: any) => ({
    id: gdg.id,
    groupName: gdg.groups?.name ?? "",
    groupLead: gdg.lead_coach?.name ?? "",
    rosterStatus: gdg.roster_status,
    publishedAt: gdg.published_at
      ? format(new Date(gdg.published_at), "MMM d, yyyy 'at' h:mm a")
      : undefined,
    publishedBy: gdg.publisher?.name,
    games: (gdg.games ?? []).map((g: any): GameRow => ({
      id: g.id,
      day: g.game_date ? fmtDate(g.game_date) : undefined,
      time: fmtTime(g.game_time),
      homeTeam: g.home_team,
      awayTeam: g.away_team,
      location: g.locations?.name ?? "",
      facility: g.locations?.name ?? "",
      field: g.field ?? "",
      coach: g.coach?.name ?? "",
      coachId: g.coach?.id,
      jersey: g.jersey_color?.name ?? "",
      jerseyColor: g.jersey_color?.color,
      jerseyColorId: g.jersey_color?.id,
      format: g.format ?? "",
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
        groupGames={groupGames}
        coaches={coaches ?? []}
        jerseyColors={jerseyColors ?? []}
      />
    </div>
  )
}
