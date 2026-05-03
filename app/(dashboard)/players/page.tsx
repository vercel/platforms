import { supabase } from '@/lib/supabase'
import { PlayersClient } from './players-client'

export default async function PlayersPage() {
  const [{ data: players }, { data: groups }] = await Promise.all([
    supabase
      .from('players')
      .select('id, first_name, last_name, group_id, status, groups(name)')
      .order('last_name'),
    supabase
      .from('groups')
      .select('id, name')
      .order('name'),
  ])

  return <PlayersClient players={players ?? []} groups={groups ?? []} />
}
