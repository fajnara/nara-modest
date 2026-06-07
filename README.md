# Nara Modest — WA Catalog Website

Website katalog produk mobile-first untuk UMKM modest fashion. Pembeli bisa pilih produk, tambah ke keranjang, lalu kirim pesanan otomatis ke WhatsApp admin.

## Tech Stack

- **Next.js 15** (App Router, plain JavaScript)
- **Tailwind CSS** — styling manual tanpa UI library berat
- **Sanity CMS** — backend untuk produk, kategori, pengaturan toko
- **next-sanity + @sanity/image-url** — integrasi Sanity ke Next.js
- Cart: `useState` + `localStorage` (tanpa Redux/Zustand)

---

## Cara Install

```bash
# Clone / masuk ke folder project
cd nara-modest

# Install dependencies
npm install

# Buat file .env.local dari contoh
cp .env.example .env.local
# lalu isi NEXT_PUBLIC_SANITY_PROJECT_ID (lihat bagian Setup Sanity)

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

> **Catatan:** Kalau `.env.local` belum diisi, website tetap berjalan dengan data dummy produk bawaan.

---

## Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-15
```

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID dari dashboard Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version Sanity |

---

## Cara Setup Sanity

### 1. Buat akun dan project Sanity

1. Buka [sanity.io](https://sanity.io) dan daftar akun
2. Buat project baru (pilih "Create new project")
3. Catat **Project ID** dari dashboard

### 2. Isi .env.local

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
```

### 3. Jalankan Sanity Studio

Studio sudah terintegrasi di `/studio`. Akses via:

```
http://localhost:3000/studio
```

### 4. Tambahkan CORS origin di Sanity

Di [sanity.io/manage](https://sanity.io/manage) → project → **API** → **CORS Origins**:
- Tambahkan `http://localhost:3000`
- Tambahkan URL Vercel kamu saat deploy (misal `https://nara-modest.vercel.app`)

---

## Cara Tambah Produk di Sanity

1. Buka `http://localhost:3000/studio`
2. Login dengan akun Sanity kamu
3. Buat **Kategori** dulu (menu "Kategori"):
   - Isi nama, slug akan otomatis
   - Isi urutan tampil (angka kecil = tampil duluan)
4. Tambah **Produk** (menu "Produk"):
   - Isi nama, pilih kategori, harga, foto
   - Centang "Tersedia" agar produk bisa dibeli
5. Isi **Pengaturan Toko** (menu "Pengaturan Toko"):
   - Isi nama toko, nomor WhatsApp, tagline, dll.

---

## Cara Ganti Nomor WhatsApp

**Opsi 1 — via Sanity Studio (direkomendasikan):**
1. Buka Studio → Pengaturan Toko
2. Isi field "Nomor WhatsApp" dengan format `628xxxxxxxxx` (tanpa + atau spasi)
3. Publish

**Opsi 2 — via kode (fallback):**
Buka `lib/dummy.js` dan edit:
```js
export const DUMMY_STORE = {
  whatsappNumber: "6281234567890", // ganti di sini
  ...
};
```

Buka juga `lib/whatsapp.js`:
```js
const FALLBACK_WA_NUMBER = "6281234567890"; // ganti di sini
```

---

## Deploy ke Vercel

### Cara cepat:

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import Repository
3. Tambahkan **Environment Variables**:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2026-05-15`
4. Deploy!

### Tambahkan domain Vercel ke Sanity CORS:
Di Sanity manage → API → CORS Origins, tambahkan URL deployment Vercel kamu.

---

## Fitur MVP yang Sudah Selesai

- [x] Halaman katalog mobile-first (max 480px di desktop)
- [x] Sticky header dengan cart badge
- [x] Hero banner dengan data dari Sanity
- [x] Filter produk by kategori (chips horizontal scroll)
- [x] Product grid 2 kolom dengan gambar dominan
- [x] Product detail modal/bottom sheet
- [x] Add to cart langsung dari card atau modal
- [x] Cart bottom sheet dengan quantity control (+ / - / hapus)
- [x] Cart persist ke localStorage
- [x] Form nama pemesan + catatan/alamat
- [x] Validasi nama wajib diisi sebelum pesan
- [x] Generate URL WhatsApp dengan format pesan otomatis
- [x] Fallback ke dummy data jika Sanity belum dikonfigurasi
- [x] Sanity Studio terintegrasi di `/studio`
- [x] Schema Sanity: product, category, storeSettings
- [x] Image dari Sanity ditampilkan via `@sanity/image-url`
- [x] Responsive, clean warm design
- [x] Desktop sidebar layout (>=768px), mobile bottom-sheet (<768px)
- [x] Admin panel `/admin` dengan NextAuth login (per-user)
- [x] CRUD lengkap: produk, kategori, store settings, admin users
- [x] Dynamic branding — semua dari Sanity (no hardcoded)
- [x] Primary color dari CMS via CSS variable
- [x] Validasi nomor WhatsApp (format 62xxxxxxxxxx)
- [x] Disable order CTA jika WA belum dikonfigurasi
- [x] SEO metadata dinamis dari CMS
- [x] **Varian produk: warna + ukuran**
- [x] **Harga diskon dengan badge persentase**
- [x] **Galeri foto produk (multiple images)**
- [x] **Search produk real-time**
- [x] **Cart aware varian (same product + different variant = separate entries)**
- [x] **Cart auto-sync dengan harga terbaru saat load**
- [x] `npm run build` berhasil

---

## Fitur yang Sengaja Belum Dibuat

Sesuai scope MVP:

- ❌ Sistem login / akun pembeli
- ❌ Payment gateway (Midtrans, Stripe, dll.)
- ❌ Kalkulasi ongkos kirim otomatis
- ❌ Dashboard admin custom (pakai Sanity Studio)
- ❌ Invoice / bukti pembayaran PDF
- ❌ Multi-store / multi-tenant
- ❌ Manajemen stok real-time
- ❌ Notifikasi push
- ❌ Wishlist / saved items
- ❌ Review / rating produk
- ❌ Search produk

---

## Struktur Folder

```
├── app/
│   ├── layout.js          # Root layout + metadata
│   ├── page.js            # Server component, fetch data dari Sanity
│   ├── globals.css        # Global styles + Tailwind
│   └── studio/
│       └── [[...tool]]/
│           └── page.js    # Sanity Studio route
│
├── components/
│   ├── AppShell.js        # Client root: state cart, filter, modal
│   ├── Header.js          # Sticky header + cart button
│   ├── HeroBanner.js      # Hero/promo section
│   ├── CategoryChips.js   # Horizontal filter chips
│   ├── ProductGrid.js     # Grid 2 kolom
│   ├── ProductCard.js     # Card individu + add to cart
│   ├── ProductModal.js    # Detail produk bottom sheet
│   ├── CartDrawer.js      # Cart bottom drawer + WA order
│   ├── QuantityControl.js # Tombol +/- quantity
│   ├── EmptyState.js      # Empty state component
│   ├── Footer.js          # Footer dengan links
│   └── icons.js           # SVG icon set minimal
│
├── lib/
│   ├── sanity.js          # Sanity client
│   ├── queries.js         # GROQ queries
│   ├── image.js           # Image URL builder
│   ├── formatCurrency.js  # Format Rupiah
│   ├── whatsapp.js        # Generate WA order URL
│   └── dummy.js           # Fallback dummy data
│
├── schemas/
│   ├── category.js        # Sanity schema kategori
│   ├── product.js         # Sanity schema produk
│   ├── storeSettings.js   # Sanity schema pengaturan toko
│   └── index.js           # Export semua schemas
│
├── sanity.config.js       # Sanity Studio config
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind design tokens
├── .env.example           # Template env variables
└── README.md
```
