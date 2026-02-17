# Panduan Deployment Digital Invitation

## Ringkasan Project

Website undangan digital dengan fitur lengkap:
- **Public Page**: Halaman undangan dengan countdown, galeri, musik, buku tamu
- **Admin Panel**: Dashboard untuk mengelola undangan, lagu, pembayaran, template
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (recommended)

## Struktur Folder

```
digital-invitation/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin pages
│   │   │   ├── (dashboard)/    # Dashboard dengan layout
│   │   │   │   ├── page.tsx    # Dashboard home
│   │   │   │   ├── invitations/# CRUD Undangan
│   │   │   │   ├── songs/      # CRUD Lagu
│   │   │   │   ├── payments/   # CRUD Pembayaran
│   │   │   │   └── templates/  # CRUD Template Caption
│   │   │   ├── login/          # Halaman login
│   │   │   └── layout.tsx      # Admin layout
│   │   ├── page.tsx            # Halaman publik undangan
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Komponen React
│   │   ├── Countdown.tsx       # Timer countdown
│   │   ├── MusicPlayer.tsx     # Pemutar musik YouTube
│   │   ├── Gallery.tsx         # Galeri foto
│   │   ├── GuestbookForm.tsx   # Form buku tamu
│   │   ├── GuestbookList.tsx   # Daftar ucapan
│   │   ├── LocationMap.tsx     # Peta Google Maps
│   │   ├── PaymentMethods.tsx  # Info pembayaran
│   │   └── OpeningModal.tsx    # Modal pembuka
│   ├── services/               # Service layer
│   │   ├── invitation.service.ts
│   │   ├── song.service.ts
│   │   ├── payment.service.ts
│   │   └── template.service.ts
│   ├── lib/                    # Library
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

## Langkah Setup

### 1. Setup Supabase Database

1. Buat akun di [Supabase](https://supabase.com)
2. Klik "New Project" dan isi detail project
3. Tunggu project selesai dibuat
4. Buka menu "SQL Editor" di sidebar
5. Klik "New query"
6. Copy isi file `supabase-schema.sql` dan paste ke editor
7. Klik "Run" untuk eksekusi SQL

### 2. Dapatkan Supabase Credentials

1. Di Supabase Dashboard, klik "Project Settings"
2. Pilih tab "API"
3. Copy nilai berikut:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Setup Project Local

```bash
# Clone repository (jika ada)
git clone <repository-url>
cd digital-invitation

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Edit .env.local dengan credentials Anda
```

Isi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka browser:
- Public page: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

### 5. Build Production

```bash
npm run build
```

## Deploy ke Vercel

### Opsi 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### Opsi 2: Deploy via GitHub Integration (Recommended)

1. Push code ke GitHub:

```bash
# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit"

# Buat repository di GitHub (via web atau gh CLI)
# Lalu push
git remote add origin https://github.com/username/digital-invitation.git
git push -u origin main
```

2. Setup Vercel:
   - Buka [vercel.com](https://vercel.com)
   - Login dengan akun GitHub
   - Klik "Add New Project"
   - Import repository `digital-invitation`
   - Framework Preset: Next.js
   - Klik "Deploy"

3. Tambahkan Environment Variables:
   - Di Vercel Dashboard, pilih project
   - Buka "Settings" > "Environment Variables"
   - Tambahkan semua variabel dari `.env.local`
   - Klik "Save"

4. Redeploy:
   - Buka "Deployments" tab
   - Klik "Redeploy" pada deployment terbaru

### Opsi 3: Deploy Manual (Upload File)

1. Build project:

```bash
npm run build
```

2. Install Vercel CLI:

```bash
npm i -g vercel
```

3. Deploy folder `.next`:

```bash
vercel --prod
```

## Konfigurasi Tambahan

### Custom Domain

1. Di Vercel Dashboard, pilih project
2. Buka "Settings" > "Domains"
3. Masukkan domain Anda (contoh: `undangan.example.com`)
4. Ikuti instruksi untuk setup DNS
5. Tunggu propagasi DNS (biasanya 24-48 jam)

### SSL/HTTPS

Vercel otomatis menyediakan SSL certificate untuk semua domain. Tidak perlu konfigurasi manual.

### Environment Variables Production

Pastikan semua environment variables sudah di-set di Vercel:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbG... | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbG... | Yes |
| `NEXT_PUBLIC_ADMIN_EMAIL` | admin@example.com | Yes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | securepassword | Yes |
| `NEXT_PUBLIC_APP_URL` | https://your-domain.vercel.app | Yes |

## Troubleshooting

### Build Error

**Error**: `Module not found`
- Solusi: `rm -rf node_modules && npm install`

**Error**: `TypeScript error`
- Solusi: Periksa `tsconfig.json` dan pastikan semua types terinstall

### Runtime Error

**Error**: `Failed to fetch`
- Periksa Supabase URL dan Anon Key
- Pastikan tabel sudah dibuat di Supabase
- Cek RLS policies

**Error**: `Music tidak autoplay`
- Browser memblokir autoplay sebelum user interaction
- Ini normal, user harus klik tombol play atau buka undangan dulu

**Error**: `Gambar tidak muncul`
- Pastikan URL gambar valid
- Cek domain di `next.config.mjs` > `images.remotePatterns`
- Untuk Supabase Storage, pastikan bucket public

### Database Error

**Error**: `relation does not exist`
- Tabel belum dibuat di Supabase
- Jalankan SQL schema lagi

**Error**: `permission denied`
- RLS policies terlalu ketat
- Periksa policies di Supabase > Authentication > Policies

## Update Project

### Update Dependencies

```bash
# Check updates
npm outdated

# Update all
npm update

# Update specific package
npm update next
```

### Redeploy

Setelah update:

```bash
# Commit changes
git add .
git commit -m "Update dependencies"
git push

# Vercel akan auto-deploy jika connected ke GitHub
# Atau deploy manual:
vercel --prod
```

## Backup & Restore

### Backup Database

1. Di Supabase Dashboard, buka "Database" > "Backups"
2. Klik "Create Backup"
3. Atau gunakan pg_dump:

```bash
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### Restore Database

```bash
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

## Monitoring

### Vercel Analytics

1. Di Vercel Dashboard, pilih project
2. Buka tab "Analytics"
3. Lihat traffic, performance, dan errors

### Supabase Analytics

1. Di Supabase Dashboard, buka "Reports"
2. Lihat database usage, API calls, dll

## Security Checklist

- [ ] Ganti default admin password
- [ ] Enable RLS di semua tabel
- [ ] Set proper RLS policies
- [ ] Jangan expose service_role key di client
- [ ] Gunakan HTTPS di production
- [ ] Set CORS policies di Supabase
- [ ] Regular backup database
- [ ] Monitor logs dan analytics

## Support

Jika mengalami masalah:
1. Cek logs di Vercel Dashboard > Functions
2. Cek error di browser console
3. Periksa Supabase logs
4. Buat issue di GitHub repository

---

Selamat menggunakan Digital Invitation! 🎉
