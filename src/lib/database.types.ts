export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invitations: {
        Row: {
          id: string
          title: string
          bride_name: string
          groom_name: string
          bride_full_name: string | null
          groom_full_name: string | null
          bride_parents: string | null
          groom_parents: string | null
          event_date: string
          event_time: string
          location: string
          location_address: string | null
          location_map_url: string | null
          story: string | null
          quote: string | null
          cover_image: string | null
          gallery: string[]
          theme: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          bride_name: string
          groom_name: string
          bride_full_name?: string | null
          groom_full_name?: string | null
          bride_parents?: string | null
          groom_parents?: string | null
          event_date: string
          event_time: string
          location: string
          location_address?: string | null
          location_map_url?: string | null
          story?: string | null
          quote?: string | null
          cover_image?: string | null
          gallery?: string[]
          theme?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          bride_name?: string
          groom_name?: string
          bride_full_name?: string | null
          groom_full_name?: string | null
          bride_parents?: string | null
          groom_parents?: string | null
          event_date?: string
          event_time?: string
          location?: string
          location_address?: string | null
          location_map_url?: string | null
          story?: string | null
          quote?: string | null
          cover_image?: string | null
          gallery?: string[]
          theme?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      guest_messages: {
        Row: {
          id: string
          invitation_id: string
          guest_name: string
          message: string
          attendance: string
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          guest_name: string
          message: string
          attendance?: string
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          guest_name?: string
          message?: string
          attendance?: string
          is_visible?: boolean
          created_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          title: string
          artist: string | null
          youtube_url: string
          youtube_id: string
          is_default: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist?: string | null
          youtube_url: string
          youtube_id: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string | null
          youtube_url?: string
          youtube_id?: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          type: string
          name: string
          account_number: string
          account_name: string
          logo_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          name: string
          account_number: string
          account_name: string
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string
          account_number?: string
          account_name?: string
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      template_captions: {
        Row: {
          id: string
          name: string
          template: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          template: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          template?: string
          is_default?: boolean
          created_at?: string
        }
      }
      view_logs: {
        Row: {
          id: string
          invitation_id: string
          visitor_name: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          visitor_name?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          visitor_name?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
