import { supabase } from '@/lib/supabase'
import { getActiveAccountId } from '@/lib/account'
import { PlayersClient } from './players-client'

export default async function PlayersPage() {
  const accountId = await getActiveAccountId()

  const playerQ = supabase
    .from('players')
    .select('id, first_name, last_name, group_id, status, player_level_id, groups(name), player_levels(name, color)')
    .order('last_name')
  const groupQ = supabase.from('groups').select('id, name').order('name')
  const levelQ = supabase.from('player_levels').select('id, name, rank, color').order('rank')

  const [{ data: players }, { data: groups }, { data: playerLevels }] = await Promise.all([
    accountId ? playerQ.eq('account_id', accountId) : playerQ,
    accountId ? groupQ.eq('account_id', accountId)  : groupQ,
    accountId ? levelQ.eq('account_id', accountId)  : levelQ,
  ])

  return (
    <PlayersClient
      players={players ?? []}
      groups={groups ?? []}
      playerLevels={playerLevels ?? []}
    />
  )
}
