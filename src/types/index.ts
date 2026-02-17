export interface Invitation {
  id: string;
  title: string;
  bride_name: string;
  groom_name: string;
  bride_full_name?: string;
  groom_full_name?: string;
  bride_parents?: string;
  groom_parents?: string;
  event_date: string;
  event_time: string;
  location: string;
  location_address?: string;
  location_map_url?: string;
  story?: string;
  quote?: string;
  cover_image?: string;
  gallery: string[];
  theme: 'elegant' | 'rustic' | 'modern' | 'traditional';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GuestMessage {
  id: string;
  invitation_id: string;
  guest_name: string;
  message: string;
  attendance: 'attending' | 'not_attending' | 'maybe';
  is_visible: boolean;
  created_at?: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  youtube_url: string;
  youtube_id: string;
  is_default: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'ewallet';
  name: string;
  account_number: string;
  account_name: string;
  logo_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface TemplateCaption {
  id: string;
  name: string;
  template: string;
  is_default: boolean;
  created_at?: string;
}

export interface ViewLog {
  id: string;
  invitation_id: string;
  visitor_name?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at?: string;
}

export interface DashboardStats {
  totalViews: number;
  totalMessages: number;
  visibleMessages: number;
  hiddenMessages: number;
}
