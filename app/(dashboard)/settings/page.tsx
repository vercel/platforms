import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { SettingsClient, type GroupRow } from './settings-client'

export default async function SettingsPage() {
  const accountId = await getActiveAccountId()

  const coachQ    = supabase.from('coaches').select('id, name, email').order('name')
  const groupQ    = supabase.from('groups').select(`
    id, name,
    lead:coaches!groups_lead_coach_id_fkey(id, name),
    group_coaches(coaches(id, name)),
    teams(id, name, archived)
  `).order('name')
  const jerseyQ   = supabase.from('jersey_colors').select('id, name, color').order('name')
  const locationQ = supabase.from('locations').select('id, name, address, alternate_names').order('name')
  const accountQ  = supabase.from('accounts').select('id, name').order('created_at')

  const [
    { data: coaches },
    { data: groupsRaw },
    { data: jerseyColors },
    { data: locations },
    { data: accountData },
  ] = await Promise.all([
    accountId ? coachQ.eq('account_id', accountId)    : coachQ,
    accountId ? groupQ.eq('account_id', accountId)    : groupQ,
    accountId ? jerseyQ.eq('account_id', accountId)   : jerseyQ,
    accountId ? locationQ.eq('account_id', accountId) : locationQ,
    accountId ? accountQ.eq('id', accountId).single() : accountQ.limit(1).single(),
  ])

  const groups: GroupRow[] = (groupsRaw ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    lead: g.lead ?? null,
    assignedCoaches: (g.group_coaches ?? []).map((gc: any) => gc.coaches).filter(Boolean),
    teams: g.teams ?? [],
  }))

  const account = (accountData as any) ?? { id: '', name: '' }

  return (
    <SettingsClient
      account={account}
      coaches={coaches ?? []}
      groups={groups}
      jerseyColors={jerseyColors ?? []}
      locations={locations ?? []}
    />
  )
}
