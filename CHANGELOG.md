# Changelog

All notable changes to this template.

## [1.7.0] — 2026-06 — UI Polish (Premium Catalog Feel)

### Hero Banner
- Optional `heroImage` field in Sanity (with hotspot)
- Optional `heroCtaText` for CTA button (default: "Lihat Koleksi")
- CTA button now visible (anchors to `#products`)
- Decorative soft blobs when no image
- Editorial layout for desktop (wider, larger type, max-w-2xl content)
- Removed generic "↓ Pilih produk favoritmu di bawah" text
- Image overlay with mix-blend-multiply for cohesive brand color

### Product Card
- Image takes the entire card (rounded 2xl), info below outside the surface
- Quick-add button: 40px diameter (was 28px) → easier touch target
- Quick-add button placed bottom-right on image (modern e-commerce pattern)
- Quick-add shows on hover (desktop) / always visible (mobile)
- Removed always-visible category chip from card (cleaner look)
- Price uses `text-brand` color for emphasis
- More breathing room — padding & line-height tuned for fashion feel

### Browsing Section
- Search + Category combined into single white panel with shadow
- "Kategori" label added above chips for hierarchy
- Inactive chips use warm beige (`#F3F0EA`) instead of stark white

### Other
- Header: height 56→64px, logo 32→40px (more brand presence)
- EmptyState: smaller subtle icon (was 80px emoji card), more text breathing room
- Setup Wizard: new heroImage + heroCtaText fields in Steps 1-2

## [1.6.0] — 2026-06 — Lazy Gallery Loading

### Added
- `actions/product.js` → `getProductGallery(productId)` server action
- ProductModal lazy-loads gallery thumbnails when opened
- Loading spinner shown next to thumbnails while gallery fetches
- Once gallery arrives, all thumbnails appear without re-rendering modal

### Performance
- Homepage payload stays minimal (no gallery for every product)
- Modal still shows full gallery — best of both worlds
- Skip fetch if product already has gallery data (e.g., from cache/seed)

## [1.5.0] — 2026-06 — Performance Optimization

### Performance
- **PRODUCTS_QUERY**: removed `gallery` field — homepage was fetching
  all gallery images for every product (potentially 6× per product).
  Saved heavily on initial page payload.
- **PRODUCT_BY_SLUG_QUERY**: new query for future product detail pages
  that *do* need full gallery (lazy-loaded, single product only).
- **ProductCard Image**: `quality={70}` + explicit `loading="lazy"`
  — smaller image transfers without visible quality loss for thumbs.
- **Font loading**: migrated from CSS `@import` (render-blocking) to
  `next/font/google` (self-hosted, preloaded, zero blocking).
- **Tailwind**: `fontFamily.sans` uses `var(--font-sans)` injected
  by next/font.

## [1.4.0] — 2026-06 — Login Rate Limiting

### Security
- **Login brute-force protection**: 5 failed attempts per 15-minute window
  triggers a 15-minute block (per IP and per email)
- New `lib/rateLimit.js` — in-memory token bucket with auto-cleanup
- Tracked by both IP and email: attacker scanning many emails from one IP
  gets blocked; one email under distributed attack also gets blocked
- Counters reset on successful login
- **Session max age reduced**: 7 days (was NextAuth default of 30 days)
- Rate limit error shown to user in login form with remaining minutes

### Notes
- In-memory store: state lost on serverless cold start; raises attack cost
  but not a perfect defense at extreme scale
- For high-traffic apps, swap `lib/rateLimit.js` for Redis or Vercel KV

## [1.3.0] — 2026-06 — Final Polish & SEO

### Added
- `app/loading.js` — global loading state with spinner
- `app/not-found.js` — branded 404 page (Bahasa Indonesia)
- `app/error.js` — branded error boundary with retry + home links
- `app/robots.js` — production-ready robots.txt (disallow /admin, /studio, /api)
- `app/sitemap.js` — sitemap.xml stub (extendable when product detail pages added)

### Verified
- No console.log in production code (only in CLI scripts: seed, create-admin)
- No TODO/FIXME comments tersisa
- All admin server actions guarded with requireAdmin / requireSuperAdmin
- All admin pages re-verify isActive from Sanity (no stale JWT bypass)

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
