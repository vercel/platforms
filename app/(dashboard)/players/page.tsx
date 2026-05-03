import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { PlayersClient } from './players-client'

export default async function PlayersPage() {
  const accountId = await getActiveAccountId()

  const playerQ = supabase.from('players').select('id, first_name, last_name, group_id, status, groups(name)').order('last_name')
  const groupQ  = supabase.from('groups').select('id, name').order('name')

  const [{ data: players }, { data: groups }] = await Promise.all([
    accountId ? playerQ.eq('account_id', accountId) : playerQ,
    accountId ? groupQ.eq('account_id', accountId)  : groupQ,
  ])

  return <PlayersClient players={players ?? []} groups={groups ?? []} />
}
