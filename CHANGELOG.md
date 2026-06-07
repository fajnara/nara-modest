# Changelog

All notable changes to this template.

## [1.2.0] — 2026-06 — Session & Password Hardening

### Security
- **No more stale JWT bypass**: `requireAdmin()` now re-fetches user from
  Sanity on every server action call. Deactivated users are kicked out
  immediately, even if their JWT hasn't expired.
- **AdminLayout also verifies isActive**: page-level guard now re-fetches
  user from DB; deactivated users redirect to login.
- **Fresh role from DB**: server actions now use latest role from Sanity,
  not stale JWT — promoting/demoting takes effect on next action.
- **Stronger password policy**:
  - Minimum 10 characters (was 8)
  - Must contain at least one letter AND one number
  - Cannot equal the email address
  - Applied to: create-admin script, admin UI form, server validation

### Changed
- `lib/validators.js`: extracted `validatePassword(password, email)` helper
- `create-admin.js`: enforces all 4 password rules with clear error messages
- UserManager: password input now shows policy hint
- UserManager: cleaned up unused `currentUserRole` prop

## [1.1.0] — 2026-06 — Security Hardening

### Security
- **Server actions now require authentication** via `requireAdmin()` / `requireSuperAdmin()`
  guards. Previously only middleware protected `/admin/*` routes — actions themselves
  were callable from anywhere.
- `/admin/users` page now redirects non-superadmin to `/admin`
- Non-superadmin no longer sees "Users" menu in sidebar
- `createAdminUser`, `updateAdminUser`, `deleteAdminUser` require superadmin role
- Server prevents deleting current user (no more lockout)
- Server prevents deleting/deactivating/downgrading the last active superadmin
- `uploadImage` action now requires authentication

### Added
- `lib/adminAuth.js` — `requireAdmin()`, `requireSuperAdmin()`, `isSuperAdmin()` helpers
- `lib/validators.js` — server-side input validation for all entities
- Slug uniqueness: products & categories auto-append `-2`, `-3` if duplicate
- Product slug updates when name changes
- CategoryManager & UserManager now display server errors inline
- Admin pages metadata: `robots: { index: false }` to prevent indexing

### Changed
- `create-admin.js`: no more hardcoded password. Reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
  `ADMIN_NAME`, `ADMIN_ROLE` from environment. Validates email format + password length (min 8).
- Admin layout metadata: dynamic store name from Sanity (no more "Nara Modest" hardcoded)

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
