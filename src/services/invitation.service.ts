import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Invitation, GuestMessage, ViewLog } from '@/types'
import { v4 as uuidv4 } from 'uuid'

// Invitation Services
export async function getInvitations() {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Invitation[]
}

export async function getActiveInvitation() {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Invitation | null
}

export async function getInvitationById(id: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Invitation
}

export async function createInvitation(invitation: Omit<Invitation, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('invitations')
    .insert([{ ...invitation, id: uuidv4() }])
    .select()
    .single()

  if (error) throw error
  return data as Invitation
}

export async function updateInvitation(id: string, invitation: Partial<Invitation>) {
  const { data, error } = await supabaseAdmin
    .from('invitations')
    .update({ ...invitation, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Invitation
}

export async function deleteInvitation(id: string) {
  const { error } = await supabaseAdmin
    .from('invitations')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Guest Message Services
export async function getGuestMessages(invitationId: string) {
  const { data, error } = await supabase
    .from('guest_messages')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as GuestMessage[]
}

export async function getAllGuestMessages(invitationId: string) {
  const { data, error } = await supabaseAdmin
    .from('guest_messages')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as GuestMessage[]
}

export async function createGuestMessage(message: Omit<GuestMessage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('guest_messages')
    .insert([{ ...message, id: uuidv4() }])
    .select()
    .single()

  if (error) throw error
  return data as GuestMessage
}

export async function updateGuestMessageVisibility(id: string, isVisible: boolean) {
  const { data, error } = await supabaseAdmin
    .from('guest_messages')
    .update({ is_visible: isVisible })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as GuestMessage
}

export async function deleteGuestMessage(id: string) {
  const { error } = await supabaseAdmin
    .from('guest_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// View Log Services
export async function logView(viewLog: Omit<ViewLog, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('view_logs')
    .insert([{ ...viewLog, id: uuidv4() }])

  if (error) console.error('Error logging view:', error)
}

export async function getViewStats(invitationId: string) {
  const { count, error } = await supabase
    .from('view_logs')
    .select('*', { count: 'exact', head: true })
    .eq('invitation_id', invitationId)

  if (error) throw error
  return count || 0
}

export async function getRecentViews(invitationId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('view_logs')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ViewLog[]
}
