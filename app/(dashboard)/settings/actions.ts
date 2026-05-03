'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

// Jersey Colors
export async function addJerseyColor(name: string, color: string) {
  const { error } = await supabase.from('jersey_colors').insert({ name: name.trim(), color })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeJerseyColor(id: string) {
  const { error } = await supabase.from('jersey_colors').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Locations
export async function addLocation(name: string, address: string, alternateNames: string[]) {
  const { error } = await supabase.from('locations').insert({
    name: name.trim(),
    address: address.trim() || null,
    alternate_names: alternateNames,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function removeLocation(id: string) {
  const { error } = await supabase.from('locations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

// Groups
export async function addGroup(name: string, leadCoachId: string, teamNames: string[]) {
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ name: name.trim(), lead_coach_id: leadCoachId })
    .select('id')
    .single()
  if (groupError) throw new Error(groupError.message)

  // Lead coach is also an assigned coach
  const { error: coachError } = await supabase
    .from('group_coaches')
    .insert({ group_id: group.id, coach_id: leadCoachId })
  if (coachError) throw new Error(coachError.message)

  if (teamNames.length > 0) {
    const { error: teamsError } = await supabase
      .from('teams')
      .insert(teamNames.map(n => ({ group_id: group.id, name: n.trim() })))
    if (teamsError) throw new Error(teamsError.message)
  }

  revalidatePath('/settings')
}
