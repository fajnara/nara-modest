# Changelog

All notable changes to this template.

## [1.0.0] — 2026-06

### Added
- Setup Wizard di `/admin/setup` — 5-step onboarding untuk owner baru
- Theme presets (8 warna siap pakai) di Setup Wizard & Settings
- Dashboard readiness checklist — admin lihat apa yang masih perlu diisi
- Image upload langsung di admin panel (produk + galeri + logo)
- Pre-deploy checklist di README
- Full documentation folder (`/docs`):
  - setup.md, sanity.md, vercel.md, customization.md, troubleshooting.md
- LICENSE file (personal use)
- Demo seed script dengan diskon, varian, sold out variations
- `npm run seed:clean` untuk hapus semua demo data

### Changed
- README di-rewrite jadi lebih ringkas dengan link ke docs/
- Dashboard admin: redesign dengan readiness card + quick actions
- SettingsForm: ganti hex input dengan ThemePresetPicker visual
- Schema product: tambah `discountPrice`, `gallery`, `colors`, `sizes`, `material`
- Schema storeSettings: tambah `instagramUsername`, `seoTitle`, `seoDescription`, validasi WA + hex
- WhatsApp message format: include varian (warna, ukuran) per item

### Fixed
- Tombol + di ProductCard buka modal kalau produk punya varian (tidak silent add)
- WhatsApp generator: hapus fallback dummy, throw error kalau invalid
- Focus ring pakai `var(--brand)` (adaptif ke warna toko)
- ThemeColor browser bar pakai `primaryColor` dari CMS
- Cart auto-sync harga & nama produk dengan data terbaru
- Cart key gabung product ID + variant (same product diff variant = separate entry)

## [0.1.0] — Initial MVP

- Katalog mobile-first dengan Next.js + Tailwind
- Sanity CMS integration
- Cart dengan localStorage
- WhatsApp order generator
- Admin panel dengan NextAuth
