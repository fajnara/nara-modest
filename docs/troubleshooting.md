# Troubleshooting

Solusi untuk masalah umum saat setup atau penggunaan template.

---

## 🔴 Build & Install

### `Cannot find module 'caniuse-lite/dist/unpacker/agents'`

```bash
npm install caniuse-lite --save-dev
npm run build
```

### `Vulnerable version of Next.js detected`

Update Next.js:

```bash
npm install next@latest eslint-config-next@latest
```

### `Module not found: Can't resolve 'prismjs/components/prism-core'`

Install peer dependency Sanity:

```bash
npm install prismjs
```

---

## 🔴 Sanity

### `transaction failed: Insufficient permissions; permission "create" required`

Token Sanity yang dipakai punya permission terlalu rendah.

**Fix:** Buat token baru dengan permission **Developer** di Sanity dashboard → API → Tokens.

### Produk yang diupdate di admin tidak muncul di website

Penyebab: dua dokumen storeSettings di Sanity, atau cache CDN.

**Fix:**
1. Buka Sanity Studio (`/studio`)
2. Cek apakah ada **lebih dari 1 dokumen** storeSettings → hapus yang duplikat
3. Refresh website. Kalau di production, tunggu max 60 detik (ISR) atau redeploy.

### CORS error di console browser

Tambahkan URL kamu (localhost dan/atau Vercel) di Sanity dashboard → API → CORS origins. Centang **Allow credentials**.

---

## 🔴 Admin Panel

### Login gagal terus padahal password benar

1. Cek `NEXTAUTH_SECRET` di env vars — harus sama persis antara dev dan production
2. Cek `NEXTAUTH_URL` — tidak boleh ada trailing slash
3. Coba buat admin user baru via `npm run create-admin`

### "Invalid URL" error di `/admin`

`NEXTAUTH_URL` kosong atau salah format.

**Fix:** Set `NEXTAUTH_URL=http://localhost:3000` (untuk dev) atau URL Vercel kamu (untuk production). Restart dev server.

### Setup wizard tidak bisa save

Cek `SANITY_WRITE_TOKEN` — harus permission **Developer**. Token Editor tidak cukup.

---

## 🔴 WhatsApp Order

### Tombol "Pesan via WhatsApp" disabled

Nomor WhatsApp belum dikonfigurasi atau format salah.

**Fix:** Buka admin → Pengaturan Toko → isi nomor format `62xxxxxxxxxx` (tanpa + atau spasi).

### Pesan WhatsApp tidak terbuka

User mungkin block popup. Atau nomor WA tidak terdaftar di WhatsApp.

**Fix:** Test nomor manual di `https://wa.me/62xxxxxxxxxx`.

---

## 🔴 Image Upload

### Upload gagal dengan "Payload too large"

File terlalu besar (lebih dari 5MB) atau body size limit Vercel terlampaui.

**Fix:**
1. Compress image dulu (max 5MB)
2. Cek `next.config.js` punya `serverActions.bodySizeLimit: "6mb"`

### Foto tidak muncul setelah upload

Cek CORS Sanity sudah include domain Vercel kamu. Refresh hard (Ctrl+Shift+R).

---

## 🔴 Deployment

### Build gagal di Vercel tapi sukses di lokal

Biasanya env vars belum diset di Vercel.

**Fix:** Vercel dashboard → Settings → Environment Variables → tambahkan semua var dari `.env.example`.

### Website menampilkan dummy data padahal Sanity sudah punya data

Penyebab: `NEXT_PUBLIC_SANITY_PROJECT_ID` kosong atau salah.

**Fix:** Pastikan env var benar dan ada prefix `NEXT_PUBLIC_` (penting!).

---

## Masih stuck?

1. Cek terminal output saat `npm run dev` — biasanya ada error spesifik
2. Cek browser console (F12) untuk error frontend
3. Cek Vercel deployment logs untuk error production

Kalau masih buntu, buat issue di GitHub repo template ini.
