import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Song } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function getSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Song[]
}

export async function getAllSongs() {
  const { data, error } = await supabaseAdmin
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Song[]
}

export async function getDefaultSong() {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('is_default', true)
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Song | null
}

export async function createSong(song: Omit<Song, 'id' | 'created_at'>) {
  // If setting as default, unset other defaults first
  if (song.is_default) {
    await supabaseAdmin
      .from('songs')
      .update({ is_default: false })
      .eq('is_default', true)
  }

  const { data, error } = await supabaseAdmin
    .from('songs')
    .insert([{ ...song, id: uuidv4() }])
    .select()
    .single()

  if (error) throw error
  return data as Song
}

export async function updateSong(id: string, song: Partial<Song>) {
  // If setting as default, unset other defaults first
  if (song.is_default) {
    await supabaseAdmin
      .from('songs')
      .update({ is_default: false })
      .eq('is_default', true)
  }

  const { data, error } = await supabaseAdmin
    .from('songs')
    .update(song)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Song
}

export async function deleteSong(id: string) {
  const { error } = await supabaseAdmin
    .from('songs')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Extract YouTube video ID from URL
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
