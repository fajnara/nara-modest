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

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID dari Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-05-15` |
| `SANITY_WRITE_TOKEN` | Token Developer dari Sanity |
| `NEXTAUTH_SECRET` | Random string 32 karakter |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

## Step 4: Deploy

Klik **Deploy** dan tunggu build selesai (~2 menit).

## Step 5: Update Sanity CORS

Setelah dapat URL Vercel:

1. Buka [sanity.io/manage](https://sanity.io/manage) → project kamu → **API** → **CORS origins**
2. Tambah URL Vercel: `https://your-project.vercel.app`
3. Centang **Allow credentials** → Save

## Step 6: Test Production

- Website: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
- Sanity Studio: `https://your-project.vercel.app/studio`

## Custom Domain (Opsional)

1. Vercel project → **Settings** → **Domains**
2. Add domain → ikuti instruksi DNS
3. Jangan lupa update `NEXTAUTH_URL` dan Sanity CORS dengan domain custom

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
