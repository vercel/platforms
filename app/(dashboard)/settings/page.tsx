import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { SettingsClient, type GroupRow, type CoachRow } from './settings-client'


export default async function SettingsPage() {
  const accountId = await getActiveAccountId()

  const coachQ    = supabase.from('coaches').select('id, name, email').order('name')
  const levelQ    = supabase.from('player_levels').select('id, name, rank, color').order('rank')
  const groupQ    = supabase.from('groups').select(`
    id, name,
    lead:coaches!groups_lead_coach_id_fkey(id, name),
    group_coaches(coaches(id, name)),
    teams(id, name, archived)
  `).order('name')
  const jerseyQ   = supabase.from('jersey_colors').select('id, name, color').order('name')
  const locationQ = supabase.from('locations').select('id, name, address, alternate_names').order('name')
  const accountQ  = supabase.from('accounts').select('id, name, address, logo_url, brand_color_primary, brand_color_secondary').order('created_at')

  const [
    { data: coaches },
    { data: playerLevels },
    { data: groupsRaw },
    { data: jerseyColors },
    { data: locations },
    { data: accountData },
  ] = await Promise.all([
    accountId ? coachQ.eq('account_id', accountId)    : coachQ,
    accountId ? levelQ.eq('account_id', accountId)    : levelQ,
    accountId ? groupQ.eq('account_id', accountId)    : groupQ,
    accountId ? jerseyQ.eq('account_id', accountId)   : jerseyQ,
    accountId ? locationQ.eq('account_id', accountId) : locationQ,
    accountId ? accountQ.eq('id', accountId).single() : accountQ.limit(1).single(),
  ])

  // Build a map of coach email → { memberId, canEditGames } by joining account_members + auth users
  const coachesWithPerms: CoachRow[] = await (async () => {
    if (!accountId || !coaches?.length) {
      return (coaches ?? []).map((c: any) => ({ ...c, canEditGames: false }))
    }

    const { data: members } = await supabase
      .from('account_members')
      .select('id, user_id, can_edit_games')
      .eq('account_id', accountId)
      .eq('role', 'coach')

    if (!members?.length) {
      return coaches.map((c: any) => ({ ...c, canEditGames: false }))
    }

    // Fetch auth users in bulk to get email-to-userId mapping
    const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const userEmailById = new Map(users.map(u => [u.id, u.email ?? '']))

    const memberByEmail = new Map(
      members.map(m => [
        userEmailById.get(m.user_id) ?? '',
        { memberId: m.id, canEditGames: m.can_edit_games },
      ])
    )

    return coaches.map((c: any) => {
      const perm = memberByEmail.get(c.email)
      return { ...c, memberId: perm?.memberId, canEditGames: perm?.canEditGames ?? false }
    })
  })()

  const groups: GroupRow[] = (groupsRaw ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    lead: g.lead ?? null,
    assignedCoaches: (g.group_coaches ?? []).map((gc: any) => gc.coaches).filter(Boolean),
    teams: g.teams ?? [],
  }))

  const account = (accountData as any) ?? { id: '', name: '', address: null, logo_url: null, brand_color_primary: null, brand_color_secondary: null }

  return (
    <SettingsClient
      account={account}
      coaches={coachesWithPerms}
      groups={groups}
      jerseyColors={jerseyColors ?? []}
      locations={locations ?? []}
      playerLevels={playerLevels ?? []}
    />
  )
}
