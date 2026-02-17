# Digital Invitation - Website Undangan Digital

Website undangan digital berbasis Next.js dengan fitur lengkap untuk membuat dan mengelola undangan pernikahan online.

## Fitur

### Fitur Publik
- **Halaman Undangan**: Tampilan elegan dengan informasi lengkap acara
- **Countdown Timer**: Hitung mundur menuju hari H
- **Galeri Foto**: Tampilan foto-foto mempelai
- **Google Maps**: Integrasi peta lokasi acara
- **Music Player**: Pemutar musik dari YouTube dengan kontrol play/pause
- **Buku Tamu Digital**: Pengunjung dapat mengirim ucapan dan konfirmasi kehadiran
- **Amplop Digital**: Informasi rekening bank dan e-wallet
- **View Tracking**: Pelacakan jumlah pengunjung

### Fitur Admin
- **Dashboard**: Ringkasan statistik undangan
- **CRUD Undangan**: Kelola data undangan (judul, nama, tanggal, lokasi, galeri)
- **CRUD Lagu**: Kelola musik latar dari YouTube
- **CRUD Pembayaran**: Kelola rekening bank dan e-wallet
- **Template Caption**: Generate caption otomatis untuk WhatsApp/Instagram
- **Moderasi Buku Tamu**: Kelola ucapan tamu (tampilkan/sembunyikan/hapus)

## Teknologi

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Icons**: Lucide React

## Struktur Folder

```
digital-invitation/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin pages
│   │   │   ├── (dashboard)/    # Dashboard layout
│   │   │   │   ├── page.tsx    # Dashboard home
│   │   │   │   ├── invitations/# Kelola undangan
│   │   │   │   ├── songs/      # Kelola lagu
│   │   │   │   ├── payments/   # Kelola pembayaran
│   │   │   │   └── templates/  # Kelola template
│   │   │   ├── login/          # Login page
│   │   │   └── layout.tsx      # Admin layout
│   │   ├── page.tsx            # Public invitation page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── Countdown.tsx       # Countdown timer
│   │   ├── MusicPlayer.tsx     # YouTube music player
│   │   ├── Gallery.tsx         # Photo gallery
│   │   ├── GuestbookForm.tsx   # Guestbook form
│   │   ├── GuestbookList.tsx   # Guestbook list
│   │   ├── LocationMap.tsx     # Google Maps
│   │   ├── PaymentMethods.tsx  # Payment info
│   │   └── OpeningModal.tsx    # Opening overlay
│   ├── services/               # API services
│   │   ├── invitation.service.ts
│   │   ├── song.service.ts
│   │   ├── payment.service.ts
│   │   └── template.service.ts
│   ├── lib/                    # Libraries
│   │   ├── supabase.ts         # Supabase client
│   │   └── database.types.ts   # TypeScript types
│   ├── types/                  # Type definitions
│   │   └── index.ts
│   └── utils/                  # Utilities
│       └── cn.ts               # Class name utility
├── public/                     # Static assets
├── supabase-schema.sql         # Database schema
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json
```

## Setup Project

### 1. Clone Repository

```bash
git clone https://github.com/username/digital-invitation.git
cd digital-invitation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Buka SQL Editor
3. Copy dan paste isi file `supabase-schema.sql`
4. Run SQL untuk membuat tabel

### 4. Environment Variables

Copy file `.env.local.example` ke `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi dengan konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Dapatkan credentials dari:
- **Supabase URL & Anon Key**: Project Settings > API
- **Service Role Key**: Project Settings > API > service_role key (jaga kerahasiaan!)

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 6. Login Admin

Buka [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Gunakan credentials dari `.env.local`:
- Email: `admin@example.com`
- Password: `your-secure-password`

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit"

# Tambahkan remote (ganti dengan URL repository Anda)
git remote add origin https://github.com/username/digital-invitation.git

# Push
git push -u origin main
```

### 2. Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "Add New Project"
3. Import repository GitHub Anda
4. Konfigurasi:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`

5. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (isi dengan domain Vercel nanti)

6. Klik "Deploy"

### 3. Update Environment Variables

Setelah deploy berhasil:
1. Copy domain Vercel (contoh: `https://digital-invitation.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` di Vercel Environment Variables
3. Redeploy jika diperlukan

## Konfigurasi Tambahan

### Custom Domain (Opsional)

1. Di Vercel Dashboard, pilih project
2. Buka Settings > Domains
3. Tambahkan custom domain Anda
4. Ikuti instruksi untuk konfigurasi DNS

### SEO & Metadata

Edit file `src/app/layout.tsx` untuk mengubah metadata:

```tsx
export const metadata: Metadata = {
  title: 'Undangan Pernikahan - Nama Mempelai',
  description: 'Undangan pernikahan digital...',
  openGraph: {
    title: 'Undangan Pernikahan',
    description: '...',
    images: ['/og-image.jpg'],
  },
}
```

### Upload Gambar

Untuk upload gambar ke Supabase Storage:

1. Buka Supabase Dashboard > Storage
2. Buat bucket baru (contoh: `invitation-images`)
3. Set policy untuk public read access
4. Upload gambar dan copy URL

## Troubleshooting

### Error: "Failed to fetch"
- Periksa Supabase URL dan Anon Key
- Pastikan tabel sudah dibuat
- Cek RLS policies

### Music tidak autoplay
- Browser memblokir autoplay
- User harus berinteraksi dulu (klik tombol)
- Ini adalah kebijakan browser untuk keamanan

### Gambar tidak muncul
- Pastikan URL gambar valid
- Cek domain di `next.config.mjs` images.remotePatterns
- Untuk Supabase Storage, pastikan bucket public

## License

MIT License - Bebas digunakan untuk personal dan komersial.

## Support

Jika ada pertanyaan atau masalah, silakan buat issue di GitHub.

---

Dibuat dengan ❤️ menggunakan Next.js dan Supabase
