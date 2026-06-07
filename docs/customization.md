# Kustomisasi Template

Cara mengganti tampilan dan konten template tanpa harus edit kode (untuk yang non-developer) maupun dengan kode (untuk developer).

---

## 🎨 Ganti via Admin Panel (Recommended)

Sebagian besar kustomisasi bisa langsung di admin tanpa edit kode:

| Yang Bisa Diubah | Lokasi di Admin |
|---|---|
| Nama toko, tagline | Setup Wizard / Pengaturan Toko |
| Logo | Pengaturan Toko → field Logo |
| Warna utama (8 preset + custom) | Pengaturan Toko → Warna Utama |
| Nomor WhatsApp | Pengaturan Toko |
| Instagram, alamat | Pengaturan Toko |
| Hero banner text | Pengaturan Toko |
| SEO title & description | Pengaturan Toko |
| Produk, kategori | Menu Produk & Kategori |

---

## 🛠 Kustomisasi via Kode

### Warna Background

Background outer (luar app container) dan app surface ada di:

- `app/globals.css` — variable `--color-outer-bg`, `--color-app-bg`
- `tailwind.config.js` — `outer-bg`, `app-bg`

### Font

Default: **Plus Jakarta Sans** dari Google Fonts.

Ganti di `app/globals.css` baris import:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

Dan update `tailwind.config.js`:

```js
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],
}
```

### Layout Max Width Desktop

Default: tidak ada max-width (full screen).

Untuk batasi width desktop, edit `components/AppShell.js`:

```jsx
<div className="hidden md:flex min-h-screen w-full max-w-[1200px] mx-auto bg-[#FAFAF8]">
```

### Format Pesan WhatsApp

Edit `lib/whatsapp.js`. Bagian `message` adalah template pesan yang dikirim.

### Cart Storage Key

Default: `nara-modest-cart` (di localStorage).

Ganti di `components/AppShell.js`:

```js
const CART_STORAGE_KEY = "your-store-cart";
```

---

## 🎭 Tambah Field Baru di Sanity

Misal mau tambah field **"YouTube URL"** di Pengaturan Toko:

### 1. Update Schema

Edit `schemas/storeSettings.js`:

```js
{
  name: "youtubeUrl",
  title: "URL YouTube",
  type: "string",
},
```

### 2. Update Query

Edit `lib/queries.js`:

```js
export const STORE_SETTINGS_QUERY = `
  *[_type == "storeSettings"][0] {
    ...,
    youtubeUrl  // ← tambah
  }
`;
```

### 3. Update Server Action

Edit `actions/admin.js` → `updateStoreSettings`:

```js
await adminClient.createOrReplace({
  ...,
  youtubeUrl: data.youtubeUrl,
});
```

### 4. Update Admin Form

Edit `components/admin/SettingsForm.js`, tambah field di array `FIELDS`.

### 5. Pakai di Komponen

```js
{store.youtubeUrl && <a href={store.youtubeUrl}>YouTube</a>}
```

---

## 🌍 Multi-language (Opsional)

Template by default pakai Bahasa Indonesia. Untuk multi-language:

1. Install `next-intl`
2. Buat folder `messages/id.json` dan `messages/en.json`
3. Ikuti [docs next-intl](https://next-intl.dev)

Tidak include di template — fitur opsional yang kompleks.

---

Lanjut ke: [Troubleshooting →](./troubleshooting.md)
