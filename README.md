# Nara Modest — WhatsApp Catalog Template

Template website katalog produk untuk UMKM. Pembeli pilih produk → tambah ke keranjang → pesan otomatis ke WhatsApp admin.

**Mobile-first** · **Next.js 15** · **Sanity CMS** · **Vercel-ready**

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local — lihat docs/setup.md

# 3. Buat admin user pertama
npm run create-admin

# 4. Seed demo data (opsional)
npm run seed

# 5. Run dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk website, dan [http://localhost:3000/admin](http://localhost:3000/admin) untuk admin panel.

---

## 📖 Dokumentasi Lengkap

| Topik | Link |
|---|---|
| Setup & Installation | [docs/setup.md](./docs/setup.md) |
| Sanity CMS Configuration | [docs/sanity.md](./docs/sanity.md) |
| Deploy ke Vercel | [docs/vercel.md](./docs/vercel.md) |
| Kustomisasi | [docs/customization.md](./docs/customization.md) |
| Troubleshooting | [docs/troubleshooting.md](./docs/troubleshooting.md) |

---

## ✨ Fitur

**Untuk Pembeli (Website Publik):**
- Katalog produk mobile-first dengan grid responsive
- Filter kategori + search real-time
- Detail produk dengan galeri foto, varian warna/ukuran
- Cart dengan localStorage (persistent)
- Order via WhatsApp dengan pesan terformat
- Harga diskon dengan badge persentase
- Badge "Baru" untuk produk featured

**Untuk Pemilik Toko (Admin Panel):**
- Login per-user dengan NextAuth
- **Setup Wizard** 5-step untuk onboarding
- Dashboard dengan readiness checklist
- CRUD produk, kategori, store settings
- **Upload foto langsung di admin** (tidak perlu Sanity Studio)
- Theme presets (8 warna siap pakai)
- Color picker + live preview
- Toggle availability cepat
- Multi-admin user management

**Untuk Developer:**
- Plain JavaScript (no TypeScript)
- Tailwind CSS dengan CSS variables untuk theming
- Sanity Studio terintegrasi di `/studio`
- Dynamic SEO metadata dari CMS
- ISR untuk auto-update tanpa redeploy

---

## 🚀 Pre-deploy Checklist

Sebelum deploy ke production, pastikan:

- [ ] Isi `NEXT_PUBLIC_SANITY_PROJECT_ID` di env vars Vercel
- [ ] Isi `SANITY_WRITE_TOKEN` (token Developer dari Sanity)
- [ ] Isi `NEXTAUTH_SECRET` (generate dengan `openssl rand -base64 32`)
- [ ] Isi `NEXTAUTH_URL` dengan URL Vercel kamu
- [ ] Tambahkan URL Vercel ke Sanity CORS Origins
- [ ] Buat minimal 1 admin user via `npm run create-admin`
- [ ] Isi data toko lengkap via Setup Wizard di `/admin/setup`
- [ ] Test order flow via WhatsApp

---

## 📂 Struktur Project

```
nara-modest/
├── app/                       # Next.js App Router
│   ├── admin/                 # Admin panel (protected)
│   │   ├── setup/             # Setup wizard
│   │   ├── products/          # CRUD produk
│   │   ├── categories/        # Manage kategori
│   │   ├── settings/          # Pengaturan toko
│   │   ├── users/             # Admin user management
│   │   └── login/             # Login page
│   ├── api/auth/              # NextAuth endpoints
│   ├── studio/                # Sanity Studio (optional fallback)
│   ├── layout.js              # Root layout + dynamic metadata
│   └── page.js                # Homepage (catalog)
│
├── components/
│   ├── admin/                 # Admin-only components
│   └── (others)               # Public catalog components
│
├── actions/                   # Server actions (CRUD + upload)
├── lib/                       # Utilities (Sanity client, queries, etc)
├── schemas/                   # Sanity document schemas
├── scripts/                   # CLI scripts (seed, create-admin)
└── docs/                      # Dokumentasi
```

---

## 📜 License

Lihat [LICENSE](./LICENSE) untuk detail.

Built with ❤️ untuk UMKM Indonesia.
