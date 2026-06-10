# Deploy ke Vercel

## Step 1: Push Code ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Step 2: Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import repository dari GitHub
3. Framework Preset: **Next.js** (auto-detected)
4. **Jangan klik Deploy dulu** — set env vars dulu

## Step 3: Set Environment Variables

Di Vercel project → **Settings** → **Environment Variables**, tambahkan:

### Wajib

| Name | Value | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID dari Sanity | Public |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Public |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-05-15` | Public |
| `SANITY_WRITE_TOKEN` | Token Developer dari Sanity | Secret |
| `NEXTAUTH_SECRET` | Random string 32 karakter | Secret |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Public |

Generate `NEXTAUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Opsional — Instant Revalidation (Sanity Webhook)

| Name | Value | Keterangan |
|---|---|---|
| `SANITY_REVALIDATE_SECRET` | Random string | Secret |

Generate:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Opsional — Reset Password via Email (Brevo)

| Name | Value | Keterangan |
|---|---|---|
| `BREVO_API_KEY` | API key dari Brevo (`xkeysib-...`) | Secret |
| `BREVO_FROM_EMAIL` | Email yang sudah verified di Brevo | Public |
| `BREVO_FROM_NAME` | Nama pengirim (misal: `Nara Modest`) | Public |

Kalau Brevo tidak dikonfigurasi, fitur **"Lupa password?"** akan disembunyikan otomatis. Admin tetap bisa reset password via:
- Superadmin lain di `/admin/users`
- Self-service di `/admin/account` (setelah login)
- CLI: `npm run reset-password`

## Step 4: Deploy

Klik **Deploy** dan tunggu build selesai (~2 menit).

## Step 5: Update Sanity CORS

Setelah dapat URL Vercel:

1. Buka [sanity.io/manage](https://sanity.io/manage) → project kamu → **API** → **CORS origins**
2. Tambah URL Vercel: `https://your-project.vercel.app`
3. Centang **Allow credentials** → Save

## Step 6: Setup Sanity Webhook (recommended)

Tanpa webhook, perubahan di Sanity Studio butuh ~10 detik untuk tampil di website (via ISR).
Dengan webhook, perubahan tampil **langsung** (<1 detik).

1. Buka [sanity.io/manage](https://sanity.io/manage) → project kamu → **API** → **Webhooks**
2. Klik **Create webhook**, isi:

   | Field | Value |
   |---|---|
   | **Name** | `Revalidate Next.js` |
   | **URL** | `https://your-project.vercel.app/api/revalidate` |
   | **Dataset** | `production` |
   | **Trigger on** | ✓ Create  ✓ Update  ✓ Delete |
   | **Filter** | `_type in ["product", "category", "storeSettings"]` |
   | **HTTP method** | `POST` |
   | **API version** | `v2021-03-25` (default) |
   | **Secret** | Sama dengan `SANITY_REVALIDATE_SECRET` di Vercel |

3. Save.
4. Test: edit produk di Studio → publish → cek website refresh max 1-2 detik.

## Step 7: Test Production

- Website: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
- Sanity Studio: `https://your-project.vercel.app/studio`

## Custom Domain (Opsional)

1. Vercel project → **Settings** → **Domains**
2. Add domain → ikuti instruksi DNS
3. Jangan lupa update:
   - `NEXTAUTH_URL` ke domain custom
   - Sanity CORS origins
   - URL di Sanity webhook (Step 6)

---

## Build Issues?

**Error: `Cannot find module`**

```bash
rm -rf .next node_modules
npm install
npm run build
```

**Error: `Invalid URL` di NextAuth**

Pastikan `NEXTAUTH_URL` tidak ada trailing slash atau spasi.

**Error: `permission required` saat admin update**

Pastikan `SANITY_WRITE_TOKEN` pakai permission **Developer**, bukan Editor.

**Email reset password tidak terkirim**

- Cek `BREVO_API_KEY` benar (start dengan `xkeysib-`)
- Cek `BREVO_FROM_EMAIL` sudah verified di Brevo
- Cek log Brevo: [app.brevo.com/email/list](https://app.brevo.com/email/list)
