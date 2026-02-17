import { supabase, supabaseAdmin } from '@/lib/supabase'
import { TemplateCaption, Invitation } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function getTemplateCaptions() {
  const { data, error } = await supabaseAdmin
    .from('template_captions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TemplateCaption[]
}

export async function getDefaultTemplate() {
  const { data, error } = await supabase
    .from('template_captions')
    .select('*')
    .eq('is_default', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as TemplateCaption | null
}

export async function createTemplateCaption(template: Omit<TemplateCaption, 'id' | 'created_at'>) {
  // If setting as default, unset other defaults first
  if (template.is_default) {
    await supabaseAdmin
      .from('template_captions')
      .update({ is_default: false })
      .eq('is_default', true)
  }

  const { data, error } = await supabaseAdmin
    .from('template_captions')
    .insert([{ ...template, id: uuidv4() }])
    .select()
    .single()

  if (error) throw error
  return data as TemplateCaption
}

export async function updateTemplateCaption(id: string, template: Partial<TemplateCaption>) {
  // If setting as default, unset other defaults first
  if (template.is_default) {
    await supabaseAdmin
      .from('template_captions')
      .update({ is_default: false })
      .eq('is_default', true)
  }

  const { data, error } = await supabaseAdmin
    .from('template_captions')
    .update(template)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TemplateCaption
}

export async function deleteTemplateCaption(id: string) {
  const { error } = await supabaseAdmin
    .from('template_captions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Generate caption from template
export function generateCaption(template: string, invitation: Invitation): string {
  return template
    .replace(/{{bride_name}}/g, invitation.bride_name)
    .replace(/{{groom_name}}/g, invitation.groom_name)
    .replace(/{{bride_full_name}}/g, invitation.bride_full_name || invitation.bride_name)
    .replace(/{{groom_full_name}}/g, invitation.groom_full_name || invitation.groom_name)
    .replace(/{{event_date}}/g, new Date(invitation.event_date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
    .replace(/{{event_time}}/g, invitation.event_time)
    .replace(/{{location}}/g, invitation.location)
    .replace(/{{location_address}}/g, invitation.location_address || invitation.location)
    .replace(/{{title}}/g, invitation.title)
}
