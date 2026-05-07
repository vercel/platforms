'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

// Coaches
export async function addCoach(name: string, email: string) {
  const { accountId } = await requireRole('admin')
  const { error } = await supabase
    .from('coaches')
    .insert({ name: name.trim(), email: email.trim().toLowerCase(), account_id: accountId })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeCoach(id: string) {
  await requireRole('admin')
  const { error } = await supabase.from('coaches').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Account
export async function updateAccountName(accountId: string, name: string) {
  await requireRole('admin')
  const { error } = await supabase
    .from('accounts')
    .update({ name: name.trim() })
    .eq('id', accountId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  revalidatePath('/pep')
}

export async function updateAccountAddress(accountId: string, address: string) {
  await requireRole('admin')
  const { error } = await supabase
    .from('accounts')
    .update({ address: address.trim() || null })
    .eq('id', accountId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function updateBrandColors(accountId: string, primary: string | null, secondary: string | null) {
  await requireRole('admin')
  const { error } = await supabase
    .from('accounts')
    .update({
      brand_color_primary: primary?.trim() || null,
      brand_color_secondary: secondary?.trim() || null,
    })
    .eq('id', accountId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function uploadAccountLogo(formData: FormData): Promise<string> {
  const { accountId } = await requireRole('admin')
  const file = formData.get('logo') as File
  if (!file || file.size === 0) throw new Error('No file provided')
  if (file.size > 2 * 1024 * 1024) throw new Error('File must be under 2 MB')

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const path = `logos/${accountId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('academy-assets')
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage.from('academy-assets').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('accounts')
    .update({ logo_url: publicUrl })
    .eq('id', accountId)
  if (updateError) throw new Error(updateError.message)

  revalidatePath('/settings')
  return publicUrl
}

export async function removeAccountLogo(accountId: string) {
  await requireRole('admin')
  const { error } = await supabase
    .from('accounts')
    .update({ logo_url: null })
    .eq('id', accountId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Jersey Colors
export async function addJerseyColor(name: string, color: string) {
  const { accountId } = await requireRole('admin')
  const { error } = await supabase
    .from('jersey_colors')
    .insert({ name: name.trim(), color, account_id: accountId })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeJerseyColor(id: string) {
  await requireRole('admin')
  const { error } = await supabase.from('jersey_colors').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Locations
export async function addLocation(name: string, address: string, alternateNames: string[]) {
  const { accountId } = await requireRole('admin')
  const { error } = await supabase.from('locations').insert({
    name: name.trim(),
    address: address.trim() || null,
    alternate_names: alternateNames,
    account_id: accountId,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeLocation(id: string) {
  await requireRole('admin')
  const { error } = await supabase.from('locations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Player Levels
export async function addPlayerLevel(name: string) {
  const { accountId } = await requireRole('admin')
  const { data: existing } = await supabase
    .from('player_levels')
    .select('rank')
    .eq('account_id', accountId)
    .order('rank', { ascending: false })
    .limit(1)
  const nextRank = (existing?.[0]?.rank ?? 0) + 1
  const { error } = await supabase.from('player_levels').insert({
    name: name.trim(),
    rank: nextRank,
    account_id: accountId,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removePlayerLevel(id: string) {
  await requireRole('admin')
  const { error } = await supabase.from('player_levels').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function updatePlayerLevelColor(id: string, color: string | null) {
  await requireRole('admin')
  const { error } = await supabase.from('player_levels').update({ color }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function movePlayerLevel(id: string, direction: 'up' | 'down') {
  const { accountId } = await requireRole('admin')
  const { data: levels } = await supabase
    .from('player_levels')
    .select('id, rank')
    .eq('account_id', accountId)
    .order('rank')
  if (!levels) return
  const idx = levels.findIndex(l => l.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= levels.length) return
  const [a, b] = [levels[idx], levels[swapIdx]]
  await Promise.all([
    supabase.from('player_levels').update({ rank: b.rank }).eq('id', a.id),
    supabase.from('player_levels').update({ rank: a.rank }).eq('id', b.id),
  ])
  revalidatePath('/settings')
}

// Permissions
export async function updateCoachGameEditPermission(memberId: string, canEditGames: boolean) {
  await requireRole('admin')
  const { error } = await supabase
    .from('account_members')
    .update({ can_edit_games: canEditGames })
    .eq('id', memberId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Game Formats
export async function addGameFormat(name: string) {
  const { accountId } = await requireRole('admin')
  const { data: existing } = await supabase
    .from('game_formats')
    .select('rank')
    .eq('account_id', accountId)
    .order('rank', { ascending: false })
    .limit(1)
  const nextRank = (existing?.[0]?.rank ?? 0) + 1
  const { error } = await supabase.from('game_formats').insert({
    name: name.trim(),
    rank: nextRank,
    account_id: accountId,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeGameFormat(id: string) {
  await requireRole('admin')
  const { error } = await supabase.from('game_formats').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function moveGameFormat(id: string, direction: 'up' | 'down') {
  const { accountId } = await requireRole('admin')
  const { data: formats } = await supabase
    .from('game_formats')
    .select('id, rank')
    .eq('account_id', accountId)
    .order('rank')
  if (!formats) return
  const idx = formats.findIndex(f => f.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= formats.length) return
  const [a, b] = [formats[idx], formats[swapIdx]]
  await Promise.all([
    supabase.from('game_formats').update({ rank: b.rank }).eq('id', a.id),
    supabase.from('game_formats').update({ rank: a.rank }).eq('id', b.id),
  ])
  revalidatePath('/settings')
}

export async function setGroupDefaultFormat(groupId: string, formatId: string | null) {
  await requireRole('admin')
  const { error } = await supabase
    .from('groups')
    .update({ default_game_format_id: formatId })
    .eq('id', groupId)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Groups
export async function addGroup(name: string, leadCoachId: string, teamNames: string[]) {
  const { accountId } = await requireRole('admin')
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ name: name.trim(), lead_coach_id: leadCoachId, account_id: accountId })
    .select('id')
    .single()
  if (groupError) throw new Error(groupError.message)

  const { error: coachError } = await supabase
    .from('group_coaches')
    .insert({ group_id: group.id, coach_id: leadCoachId, account_id: accountId })
  if (coachError) throw new Error(coachError.message)

  if (teamNames.length > 0) {
    const { error: teamsError } = await supabase
      .from('teams')
      .insert(teamNames.map(n => ({ group_id: group.id, name: n.trim(), account_id: accountId })))
    if (teamsError) throw new Error(teamsError.message)
  }

  revalidatePath('/settings')
}
