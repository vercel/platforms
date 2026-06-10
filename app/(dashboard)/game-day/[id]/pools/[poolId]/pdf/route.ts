import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { supabase } from '@/lib/supabase'
import { getUserAccount } from '@/lib/auth'
import { RosterPDF, type PDFGame } from '@/components/pdf/roster-pdf'
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; poolId: string }> },
) {
  const userAccount = await getUserAccount()
  if (!userAccount) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id: gameDayId, poolId } = await params

  const [{ data: gameDay }, { data: gdp }] = await Promise.all([
    supabase
      .from('game_days')
      .select('name, accounts(name, logo_url)')
      .eq('id', gameDayId)
      .eq('account_id', userAccount.accountId)
      .single(),
    supabase
      .from('game_day_pools')
      .select(`
        id,
        pools(name),
        lead_coach:coaches!game_day_pools_lead_coach_id_fkey(name),
        games(id, game_date, game_time, home_team, away_team, field, locations(name))
      `)
      .eq('id', poolId)
      .eq('game_day_id', gameDayId)
      .single(),
  ])

  if (!gameDay || !gdp) {
    return new NextResponse('Not found', { status: 404 })
  }

  const account = (gameDay as any).accounts as { name: string; logo_url: string | null } | null
  const rawGames = ((gdp as any).games ?? []) as any[]
  const gameIds = rawGames.map((g: any) => g.id as string)

  const { data: entriesRaw } = gameIds.length > 0
    ? await supabase
        .from('roster_entries')
        .select('game_id, notes, players(first_name, last_name)')
        .in('game_id', gameIds)
        .eq('is_unavailable', false)
    : { data: [] as any[] }

  const playersByGame = new Map<string, { name: string; notes: string | null }[]>()
  for (const entry of (entriesRaw ?? [])) {
    const e = entry as any
    if (!e.players) continue
    const list = playersByGame.get(e.game_id) ?? []
    list.push({
      name: `${e.players.last_name}, ${e.players.first_name}`,
      notes: e.notes ?? null,
    })
    playersByGame.set(e.game_id, list)
  }

  const games: PDFGame[] = rawGames.map((g: any, i: number) => ({
    id: g.id as string,
    index: i + 1,
    date: g.game_date ? fmtDate(g.game_date as string) : null,
    time: g.game_time ? fmtTime(g.game_time as string) : null,
    homeTeam: g.home_team as string,
    awayTeam: g.away_team as string,
    field: (g.field as string | null) ?? null,
    location: ((g.locations as { name: string } | null)?.name) ?? null,
    players: (playersByGame.get(g.id) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  }))

  const poolName = ((gdp as any).pools as { name: string } | null)?.name ?? ''
  const leadCoach = ((gdp as any).lead_coach as { name: string } | null)?.name ?? null
  const gameDayName = (gameDay as any).name as string

  const buffer = await renderToBuffer(
    createElement(RosterPDF, {
      academyName: account?.name ?? 'Academy',
      logoUrl: account?.logo_url ?? null,
      gameDayName,
      groupName: poolName,
      leadCoach,
      games,
    })
  )

  const safeName = `${gameDayName} - ${poolName || 'Roster'}`.replace(/[^\w\s-]/g, '')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safeName}.pdf"`,
    },
  })
}
