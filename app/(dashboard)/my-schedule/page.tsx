import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { FileDown, FileText, Users, CalendarDays } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { getActiveAccountId } from '@/lib/account'
import { format, parseISO } from 'date-fns'

function fmtDate(d: string) {
  return format(parseISO(d), 'EEE, MMM d, yyyy')
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

function dateLabel(start: string, end: string | null) {
  if (!end || end === start) return fmtDate(start)
  return `${fmtDate(start)} – ${fmtDate(end)}`
}

type ScheduleGame = {
  id: string
  date: string | null
  time: string | null
  homeTeam: string
  awayTeam: string
  field: string | null
  location: string | null
}

type ScheduleGroup = {
  gdgId: string
  groupName: string
  rosterStatus: 'draft' | 'published'
  publishedAt: string | null
  isLead: boolean
  games: ScheduleGame[]
}

type ScheduleDay = {
  gameDayId: string
  gameDayName: string
  startDate: string
  endDate: string | null
  groups: Map<string, ScheduleGroup>
}

export default async function MySchedulePage() {
  const user = await requireAuth()
  const accountId = await getActiveAccountId()
  const today = new Date().toISOString().slice(0, 10)

  // Find the coach record linked to this user's email
  const { data: coachRecord } = await supabase
    .from('coaches')
    .select('id, name')
    .eq('email', user.email ?? '')
    .eq('account_id', accountId)
    .maybeSingle()

  if (!coachRecord) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">Your upcoming game day responsibilities</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <CalendarDays className="size-10 text-muted-foreground/40" />
            <p className="font-medium">No coach profile linked</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Your account ({user.email}) hasn&apos;t been matched to a coach profile yet.
              Ask your academy admin to check that your email matches a coach record in Settings.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch groups where I'm the lead coach + games where I'm the assigned coach
  const [{ data: leadGroupsRaw }, { data: assignedGamesRaw }] = await Promise.all([
    supabase
      .from('game_day_groups')
      .select(`
        id, roster_status, published_at, group_id,
        groups(name),
        game_days(id, name, start_date, end_date),
        games(id, game_date, game_time, home_team, away_team, field, locations(name))
      `)
      .eq('lead_coach_id', coachRecord.id)
      .eq('account_id', accountId),
    supabase
      .from('games')
      .select(`
        id, game_date, game_time, home_team, away_team, field,
        game_day_group_id,
        locations(name),
        game_day_groups(
          id, roster_status, published_at,
          groups(name),
          game_days(id, name, start_date, end_date)
        )
      `)
      .eq('coach_id', coachRecord.id)
      .eq('account_id', accountId),
  ])

  // Build unified timeline by game day
  const dayMap = new Map<string, ScheduleDay>()

  function ensureDay(gameDayId: string, gameDayName: string, startDate: string, endDate: string | null): ScheduleDay {
    if (!dayMap.has(gameDayId)) {
      dayMap.set(gameDayId, { gameDayId, gameDayName, startDate, endDate, groups: new Map() })
    }
    return dayMap.get(gameDayId)!
  }

  // Lead coach groups — add all games for that group
  for (const lg of (leadGroupsRaw ?? [])) {
    const gd = (lg as any).game_days as { id: string; name: string; start_date: string; end_date: string | null } | null
    if (!gd || gd.start_date < today) continue

    const day = ensureDay(gd.id, gd.name, gd.start_date, gd.end_date)
    const groupName = ((lg as any).groups as { name: string } | null)?.name ?? ''
    const gdgId = lg.id as string

    day.groups.set(gdgId, {
      gdgId,
      groupName,
      rosterStatus: (lg.roster_status as 'draft' | 'published') ?? 'draft',
      publishedAt: (lg.published_at as string | null) ?? null,
      isLead: true,
      games: ((lg as any).games ?? []).map((g: any) => ({
        id: g.id,
        date: g.game_date ? fmtDate(g.game_date) : null,
        time: g.game_time ? fmtTime(g.game_time) : null,
        homeTeam: g.home_team,
        awayTeam: g.away_team,
        field: g.field ?? null,
        location: (g.locations as { name: string } | null)?.name ?? null,
      })),
    })
  }

  // Assigned games — add to the group they belong to, skip if group is already a lead group
  for (const ag of (assignedGamesRaw ?? [])) {
    const gdg = (ag as any).game_day_groups as any
    if (!gdg) continue
    const gd = gdg.game_days as { id: string; name: string; start_date: string; end_date: string | null } | null
    if (!gd || gd.start_date < today) continue

    const gdgId = gdg.id as string
    const day = ensureDay(gd.id, gd.name, gd.start_date, gd.end_date)

    if (!day.groups.has(gdgId)) {
      day.groups.set(gdgId, {
        gdgId,
        groupName: (gdg.groups as { name: string } | null)?.name ?? '',
        rosterStatus: (gdg.roster_status as 'draft' | 'published') ?? 'draft',
        publishedAt: (gdg.published_at as string | null) ?? null,
        isLead: false,
        games: [],
      })
    }

    // Only add this game if it's not already in a lead-coach group
    const group = day.groups.get(gdgId)!
    if (!group.isLead && !group.games.find(g => g.id === (ag as any).id)) {
      group.games.push({
        id: (ag as any).id,
        date: (ag as any).game_date ? fmtDate((ag as any).game_date) : null,
        time: (ag as any).game_time ? fmtTime((ag as any).game_time) : null,
        homeTeam: (ag as any).home_team,
        awayTeam: (ag as any).away_team,
        field: (ag as any).field ?? null,
        location: ((ag as any).locations as { name: string } | null)?.name ?? null,
      })
    }
  }

  const days = [...dayMap.values()].sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">Upcoming responsibilities for {coachRecord.name}</p>
        </div>
        {days.length > 0 && (
          <Badge variant="secondary">{days.length} upcoming game {days.length === 1 ? 'day' : 'days'}</Badge>
        )}
      </div>

      {days.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <CalendarDays className="size-10 text-muted-foreground/40" />
            <p className="font-medium">No upcoming responsibilities</p>
            <p className="text-sm text-muted-foreground">
              You&apos;ll see game days here when you&apos;re assigned as a lead coach or game coach.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {days.map(day => (
            <Card key={day.gameDayId}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{day.gameDayName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {dateLabel(day.startDate, day.endDate)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/game-day/${day.gameDayId}`}>View Game Day</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 pt-0">
                {[...day.groups.values()].map(group => (
                  <div key={group.gdgId} className="flex flex-col gap-3">
                    {/* Group header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{group.groupName}</h3>
                        {group.isLead && (
                          <Badge variant="outline" className="text-xs">Lead Coach</Badge>
                        )}
                        <Badge
                          variant={group.rosterStatus === 'published' ? 'default' : 'secondary'}
                          className={group.rosterStatus === 'published' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}
                        >
                          <FileText className="mr-1 size-3" />
                          {group.rosterStatus === 'published' ? 'Roster Published' : 'Roster Draft'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="View Roster" asChild>
                          <Link href={`/game-day/${day.gameDayId}/roster?group=${group.groupName}`}>
                            <Users className="size-4" />
                            <span className="sr-only">View Roster</span>
                          </Link>
                        </Button>
                        {group.rosterStatus === 'published' && (
                          <Button variant="ghost" size="icon" title="Download PDF" asChild>
                            <a
                              href={`/game-day/${day.gameDayId}/groups/${group.gdgId}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileDown className="size-4" />
                              <span className="sr-only">Download PDF</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Games table */}
                    {group.games.length > 0 ? (
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-24">Time</TableHead>
                              <TableHead>Home Team</TableHead>
                              <TableHead>Away Team</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead className="w-24">Field</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.games
                              .slice()
                              .sort((a, b) => {
                                if (a.date && b.date && a.date !== b.date) return a.date.localeCompare(b.date)
                                if (!a.time) return 1
                                if (!b.time) return -1
                                return a.time.localeCompare(b.time)
                              })
                              .map(game => (
                                <TableRow key={game.id}>
                                  <TableCell className="font-medium">{game.time ?? '—'}</TableCell>
                                  <TableCell>{game.homeTeam}</TableCell>
                                  <TableCell>{game.awayTeam}</TableCell>
                                  <TableCell className="text-muted-foreground">{game.location ?? '—'}</TableCell>
                                  <TableCell className="text-muted-foreground">{game.field ?? '—'}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No games scheduled yet</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
