# Setup & Installation

Panduan lengkap setup template Nara Modest dari nol sampai jalan.

## Prasyarat

- **Node.js 20+** (cek dengan `node -v`)
- **npm** atau pnpm
- Akun **Sanity.io** (gratis di [sanity.io](https://sanity.io))
- Akun **Vercel** (gratis di [vercel.com](https://vercel.com)) untuk deploy

---

## Step 1: Install Dependencies

```bash
git clone <your-repo-url>
cd nara-modest
npm install
```

---

## Step 2: Setup Sanity Project

### 2.1 Buat Project di Sanity

1. Login ke [sanity.io/manage](https://sanity.io/manage)
2. Klik **Create new project**
3. Pilih dataset name: `production`
4. Catat **Project ID** dari dashboard (format: `abc123xyz`)

### 2.2 Buat API Token

1. Di Sanity dashboard project → **API** → **Tokens**
2. **Add API token**
3. Name: `nara-modest-admin`
4. Permission: **Developer** (penting — Editor tidak cukup untuk create document baru)
5. Copy token-nya

### 2.3 Setup CORS Origins

Di Sanity dashboard → **API** → **CORS origins**, tambahkan:
- `http://localhost:3000` (untuk development)
- `https://your-domain.vercel.app` (setelah deploy)

Centang **Allow credentials**.

---

## Step 3: Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-15
SANITY_WRITE_TOKEN=your_developer_token

# NextAuth
NEXTAUTH_SECRET=generate_random_secret
NEXTAUTH_URL=http://localhost:3000
```

**Generate `NEXTAUTH_SECRET`:**

```bash
# macOS / Linux
openssl rand -base64 32

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 4: Buat Admin User Pertama

Tidak ada password default — kamu **wajib** set via environment variable.

**Cara A: Via shell (recommended)**

```bash
# Windows PowerShell
$env:ADMIN_NAME="Nama Kamu"; $env:ADMIN_EMAIL="admin@toko.com"; $env:ADMIN_PASSWORD="passwordAman123"; $env:ADMIN_ROLE="superadmin"; npm run create-admin

# macOS / Linux
ADMIN_NAME="Nama Kamu" ADMIN_EMAIL=admin@toko.com ADMIN_PASSWORD="passwordAman123" ADMIN_ROLE=superadmin npm run create-admin
```

> 💡 **Tip:** ganti `passwordAman123` dengan password kamu sendiri yang kuat.
> Aturan: minimal 10 karakter, ada huruf + angka, tidak sama dengan email.

**Cara B: Via .env.local**

Tambahkan ke `.env.local` (jangan commit):

```env
ADMIN_NAME=Nama Kamu
ADMIN_EMAIL=admin@toko.com
ADMIN_PASSWORD=passwordAman123
ADMIN_ROLE=superadmin
```

Lalu:

```bash
npm run create-admin
```

**Aturan password:**
- Minimal **10 karakter**
- Wajib mengandung minimal 1 huruf
- Wajib mengandung minimal 1 angka
- Tidak boleh sama dengan email

Email harus valid. Role hanya `admin` atau `superadmin`.

User pertama sebaiknya **superadmin** karena hanya superadmin yang bisa kelola user lain.

---

## Step 5: Seed Demo Data (Opsional)

Untuk demo / testing, isi data dummy:

```bash
npm run seed
```

Hasilnya: 5 kategori + 12 produk dengan varian, diskon, dan sold out.

**Untuk hapus semua data demo:**

```bash
npm run seed:clean
```

(Admin user TIDAK ikut dihapus.)

---

## Step 6: Jalankan Development Server

```bash
npm run dev
```

- Website publik: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Step 7: Setup Toko via Wizard

1. Login ke `/admin` dengan kredensial admin
2. Buka **Setup Wizard** di sidebar
3. Ikuti 5 langkah: nama toko → logo → kontak → warna → selesai
4. Tambah kategori dan produk pertama

---

## Troubleshooting

Lihat [docs/troubleshooting.md](./troubleshooting.md) untuk error umum.

Lanjut ke: [Deploy ke Vercel →](./vercel.md)
