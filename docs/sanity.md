# Sanity CMS — Detail Configuration

Panduan lebih detail tentang setup dan penggunaan Sanity di template ini.

---

## Document Types

Template ini punya 4 document types di Sanity:

### 1. `storeSettings` — Singleton

Pengaturan toko (hanya 1 dokumen). Field:

- `storeName`, `storeTagline`
- `logo` (image with hotspot)
- `whatsappNumber` — divalidasi format `62xxxxxxxxxx`
- `instagramUsername`, `instagramUrl`
- `address`
- `heroTitle`, `heroSubtitle`, `promoText`
- `primaryColor` — hex validation
- `seoTitle`, `seoDescription`

### 2. `category`

- `title`, `slug`
- `order` (untuk urutan tampil di sidebar/chip)

### 3. `product`

- `name`, `slug`
- `category` (reference)
- `price`, `discountPrice`
- `image` (main, with hotspot)
- `gallery` (array of images)
- `description`
- `colors` (array of strings)
- `sizes` (array of strings)
- `material`
- `isFeatured`, `isAvailable`
- `sortOrder`

### 4. `adminUser`

- `name`, `email`
- `passwordHash` — bcrypt hashed
- `role` — "superadmin" atau "admin"
- `isActive`

---

## Update Schema

Schema ada di folder `schemas/`. Kalau edit schema:

1. Restart dev server agar perubahan ter-detect
2. Sanity Studio (`/studio`) akan refresh otomatis
3. Existing documents tetap aman — Sanity tidak hapus data lama

---

## GROQ Queries

Semua query di `lib/queries.js`. Pattern umum:

```groq
*[_type == "product"] | order(sortOrder asc, name asc) {
  _id,
  name,
  "slug": slug.current,        // unwrap slug
  "category": category-> {     // dereference
    title,
    "slug": slug.current
  },
  price,
  ...
}
```

---

## API Tokens

| Tipe | Permission | Untuk Apa |
|---|---|---|
| **Editor** | Read + Write existing types | Cukup untuk seed script |
| **Developer** | Read + Write + Create types | **Wajib untuk admin panel** |

Developer permission diperlukan karena admin panel bisa create document type baru (adminUser, dll.) via API.

---

## Sanity Studio vs Admin Panel

Template menyediakan **dua interface** untuk manage data:

| | Sanity Studio (`/studio`) | Admin Panel (`/admin`) |
|---|---|---|
| Audience | Developer / power user | Pemilik toko (UMKM) |
| Login | Akun Sanity (Google/email) | Email + password kustom |
| Feature lengkap | ✅ Semua field | ⚠️ Field utama saja |
| Image upload | ✅ Native | ✅ Native |
| Validasi visual | ✅ Real-time | ✅ Form-based |
| Branded | ❌ (Sanity branding) | ✅ Custom |

**Rekomendasi:** Untuk klien UMKM, kasih akses `/admin` saja. Sanity Studio cukup untuk maintenance developer.

---

## Dataset Management

Default dataset: `production`.

Untuk staging/testing, bisa buat dataset baru:

```bash
npx sanity dataset create staging
```

Lalu set `NEXT_PUBLIC_SANITY_DATASET=staging` di `.env.local`.

---

## Backup Data

Sanity menyimpan history otomatis (Time Machine — fitur paid plan).

Untuk export manual:

```bash
npx sanity dataset export production backup.tar.gz
```

Import balik:

```bash
npx sanity dataset import backup.tar.gz production
```

---

## Webhooks (Instant Revalidation)

Untuk update website **langsung** (<1 detik) setiap kali publish di Sanity Studio:

### 1. Generate secret

```bash
# macOS / Linux
openssl rand -hex 32

# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Set env variable

Tambahkan ke `.env.local` (dan Vercel env vars):

```env
SANITY_REVALIDATE_SECRET=hasil_secret_dari_step_1
```

### 3. Konfigurasi webhook di Sanity

1. Buka [sanity.io/manage](https://sanity.io/manage) → project kamu → **API** → **Webhooks**
2. Klik **Create webhook**
3. Isi:
   - **Name**: `Revalidate Next.js`
   - **URL**: `https://your-site.vercel.app/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: ✓ Create, ✓ Update, ✓ Delete
   - **Filter** (opsional): `_type in ["product", "category", "storeSettings"]`
   - **HTTP method**: `POST`
   - **API version**: `v2021-03-25` atau lebih baru
   - **Secret**: paste secret yang sama dari step 1
4. **Save**

### 4. Test

Edit produk apapun di Sanity Studio → publish. Cek website max 1-2 detik update sudah muncul.

Kalau pakai webhook ini, kamu bisa naikkan `revalidate` di `app/page.js` ke nilai lebih tinggi (misal 3600 = 1 jam) karena webhook sudah handle invalidation. Tapi 30 detik default juga aman sebagai fallback kalau webhook gagal.
