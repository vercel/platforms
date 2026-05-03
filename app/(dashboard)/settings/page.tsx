import { supabase } from '@/lib/supabase'
import { SettingsClient, type GroupRow } from './settings-client'

export default async function SettingsPage() {
  const [
    { data: coaches },
    { data: groupsRaw },
    { data: jerseyColors },
    { data: locations },
  ] = await Promise.all([
    supabase.from('coaches').select('id, name, email').order('name'),
    supabase.from('groups').select(`
      id, name,
      lead:coaches!groups_lead_coach_id_fkey(id, name),
      group_coaches(coaches(id, name)),
      teams(id, name, archived)
    `).order('name'),
    supabase.from('jersey_colors').select('id, name, color').order('name'),
    supabase.from('locations').select('id, name, address, alternate_names').order('name'),
  ])

  // Normalise the nested Supabase shape into clean props
  const groups: GroupRow[] = (groupsRaw ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    lead: g.lead ?? null,
    assignedCoaches: (g.group_coaches ?? []).map((gc: any) => gc.coaches).filter(Boolean),
    teams: g.teams ?? [],
  }))

  return (
    <SettingsClient
      coaches={coaches ?? []}
      groups={groups}
      jerseyColors={jerseyColors ?? []}
      locations={locations ?? []}
    />
  )
}
