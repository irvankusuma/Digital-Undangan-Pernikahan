-- Digital Invitation Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Invitations Table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  bride_full_name TEXT,
  groom_full_name TEXT,
  bride_parents TEXT,
  groom_parents TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  location_address TEXT,
  location_map_url TEXT,
  story TEXT,
  quote TEXT,
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  theme TEXT DEFAULT 'elegant' CHECK (theme IN ('elegant', 'rustic', 'modern', 'traditional')),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest Messages Table
CREATE TABLE guest_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  attendance TEXT DEFAULT 'attending' CHECK (attendance IN ('attending', 'not_attending', 'maybe')),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs Table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Methods Table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('bank', 'ewallet')),
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template Captions Table
CREATE TABLE template_captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View Logs Table
CREATE TABLE view_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  visitor_name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invitations_is_active ON invitations(is_active);
CREATE INDEX idx_guest_messages_invitation_id ON guest_messages(invitation_id);
CREATE INDEX idx_guest_messages_is_visible ON guest_messages(is_visible);
CREATE INDEX idx_songs_is_active ON songs(is_active);
CREATE INDEX idx_songs_is_default ON songs(is_default);
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);
CREATE INDEX idx_view_logs_invitation_id ON view_logs(invitation_id);
CREATE INDEX idx_view_logs_created_at ON view_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Allow public read active invitations" 
  ON invitations FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow public read visible messages" 
  ON guest_messages FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Allow public read active songs" 
  ON songs FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow public read active payment methods" 
  ON payment_methods FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow public read template captions" 
  ON template_captions FOR SELECT 
  TO PUBLIC;

-- Create policies for public insert (guestbook, view logs)
CREATE POLICY "Allow public insert guest messages" 
  ON guest_messages FOR INSERT 
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Allow public insert view logs" 
  ON view_logs FOR INSERT 
  TO PUBLIC
  WITH CHECK (true);

-- Create policies for admin access (full access)
-- Note: Admin access should be controlled via service role key
CREATE POLICY "Allow admin full access invitations" 
  ON invitations FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access guest messages" 
  ON guest_messages FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access songs" 
  ON songs FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access payment methods" 
  ON payment_methods FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access template captions" 
  ON template_captions FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access view logs" 
  ON view_logs FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invitations
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Uncomment below to insert sample data

/*
-- Sample invitation
INSERT INTO invitations (
  title, bride_name, groom_name, bride_full_name, groom_full_name,
  event_date, event_time, location, location_address, quote, theme, is_active
) VALUES (
  'Pernikahan Sarah & Ahmad',
  'Sarah',
  'Ahmad',
  'Sarah Putri Wijaya',
  'Ahmad Fauzi',
  '2024-12-31',
  '10:00',
  'Gedung Serbaguna Mawar',
  'Jl. Mawar No. 123, Jakarta',
  'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya. (Ar-Rum: 21)',
  'elegant',
  true
);

-- Sample songs
INSERT INTO songs (title, artist, youtube_url, youtube_id, is_default, is_active) VALUES
('Perfect', 'Ed Sheeran', 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', '2Vv-BfVoq4g', true, true),
('A Thousand Years', 'Christina Perri', 'https://www.youtube.com/watch?v=rtOvBOTyX00', 'rtOvBOTyX00', false, true);

-- Sample template
INSERT INTO template_captions (name, template, is_default) VALUES
('Template WhatsApp', 
'*Undangan Pernikahan*

_Assalamu''alaikum Warahmatullahi Wabarakatuh_

Dengan memohon ridha dan rahmat Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:

*{{bride_full_name}}*
&
*{{groom_full_name}}*

📅 *Hari/Tanggal:* {{event_date}}
🕐 *Waktu:* {{event_time}}
📍 *Tempat:* {{location}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

_Wassalamu''alaikum Warahmatullahi Wabarakatuh_', 
true);
*/
