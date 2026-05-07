import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { RosterClient, type GroupData, type PlayerInfo, type InitialEntry } from './roster-client'
import { format, parseISO } from 'date-fns'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ group?: string }>
}

function fmtDate(d: string): string {
  return format(parseISO(d), 'MMM d, yyyy')
}

function fmtTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export default async function RosterPage({ params, searchParams }: Props) {
  const { id } = await params
  const { group } = await searchParams

  const [
    { data: gameDay },
    { data: gdgs },
  ] = await Promise.all([
    supabase.from('game_days').select('id, name').eq('id', id).single(),
    supabase
      .from('game_day_groups')
      .select(`
        id, group_id,
        groups(name),
        games(id, game_date, game_time, home_team, away_team, field)
      `)
      .eq('game_day_id', id)
      .order('groups(name)'),
  ])

  if (!gameDay) notFound()

  const groups: GroupData[] = (gdgs ?? []).map((gdg: any) => ({
    id: gdg.id,
    groupName: gdg.groups?.name ?? '',
    groupId: gdg.group_id,
    games: (gdg.games ?? []).map((g: any) => ({
      id: g.id,
      day: g.game_date ? fmtDate(g.game_date) : undefined,
      time: fmtTime(g.game_time),
      homeTeam: g.home_team,
      awayTeam: g.away_team,
      field: g.field ?? '',
    })),
  }))

  // Collect all group_ids and game_ids
  const allGroupIds = groups.map(g => g.groupId)
  const allGameIds = groups.flatMap(g => g.games.map(game => game.id))

  const [{ data: playersRaw }, { data: entriesRaw }] = await Promise.all([
    allGroupIds.length > 0
      ? supabase
          .from('players')
          .select('id, first_name, last_name, group_id, player_level_id, player_levels(id, name, rank, color)')
          .in('group_id', allGroupIds)
          .eq('status', 'active')
          .order('last_name')
      : Promise.resolve({ data: [] }),
    allGameIds.length > 0
      ? supabase
          .from('roster_entries')
          .select('game_id, player_id, notes, is_unavailable')
          .in('game_id', allGameIds)
      : Promise.resolve({ data: [] }),
  ])

  const players: PlayerInfo[] = (playersRaw ?? []) as PlayerInfo[]
  const initialEntries: InitialEntry[] = (entriesRaw ?? []) as InitialEntry[]

  return (
    <RosterClient
      gameDayId={id}
      gameDayName={gameDay.name}
      groups={groups}
      players={players}
      initialEntries={initialEntries}
      initialGroup={group ?? null}
    />
  )
}
