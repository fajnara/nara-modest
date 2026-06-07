/**
 * Create the first admin user.
 *
 * Usage:
 *   ADMIN_NAME="Your Name" \
 *   ADMIN_EMAIL=admin@toko.com \
 *   ADMIN_PASSWORD="strong-password" \
 *   ADMIN_ROLE=superadmin \
 *   npm run create-admin
 *
 * Or set these in .env.local and run `npm run create-admin`.
 *
 * Requirements:
 *   - ADMIN_EMAIL: valid email
 *   - ADMIN_PASSWORD: minimum 8 characters
 *   - ADMIN_ROLE: "superadmin" or "admin" (defaults to "superadmin")
 */

const { createClient } = require("@sanity/client");
const bcrypt = require("bcryptjs");

const ADMIN_NAME     = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_ROLE     = process.env.ADMIN_ROLE || "superadmin";

const writeToken = process.env.SANITY_WRITE_TOKEN;
const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// ── Validation ────────────────────────────────────────

if (!writeToken) {
  console.error("❌ SANITY_WRITE_TOKEN belum diset di .env.local");
  process.exit(1);
}
if (!projectId) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID belum diset di .env.local");
  process.exit(1);
}
if (!ADMIN_EMAIL) {
  console.error("❌ ADMIN_EMAIL wajib diisi.");
  console.error('   Contoh: ADMIN_EMAIL=admin@toko.com ADMIN_PASSWORD="..." npm run create-admin');
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)) {
  console.error("❌ Format ADMIN_EMAIL tidak valid:", ADMIN_EMAIL);
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD wajib diisi.");
  console.error('   Contoh: ADMIN_EMAIL=admin@toko.com ADMIN_PASSWORD="rahasia-banget" npm run create-admin');
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 10) {
  console.error("❌ ADMIN_PASSWORD minimal 10 karakter (sekarang", ADMIN_PASSWORD.length, "karakter)");
  process.exit(1);
}
if (!/[a-zA-Z]/.test(ADMIN_PASSWORD)) {
  console.error("❌ ADMIN_PASSWORD harus mengandung minimal 1 huruf");
  process.exit(1);
}
if (!/\d/.test(ADMIN_PASSWORD)) {
  console.error("❌ ADMIN_PASSWORD harus mengandung minimal 1 angka");
  process.exit(1);
}
if (ADMIN_PASSWORD.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
  console.error("❌ ADMIN_PASSWORD tidak boleh sama dengan ADMIN_EMAIL");
  process.exit(1);
}
if (!["admin", "superadmin"].includes(ADMIN_ROLE)) {
  console.error('❌ ADMIN_ROLE harus "admin" atau "superadmin"');
  process.exit(1);
}

// ── Run ───────────────────────────────────────────────

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: writeToken,
  useCdn: false,
});

async function main() {
  console.log(`\n👤 Membuat admin user: ${ADMIN_EMAIL} (${ADMIN_ROLE})\n`);

  const existing = await client.fetch(
    `*[_type == "adminUser" && email == $email][0]._id`,
    { email: ADMIN_EMAIL }
  );

  if (existing) {
    console.log("⚠️  Email sudah terdaftar. Hapus dulu dari /admin/users atau Sanity Studio.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await client.create({
    _type: "adminUser",
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: ADMIN_ROLE,
    isActive: true,
  });

  console.log("✅ Admin user berhasil dibuat!");
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Role    : ${ADMIN_ROLE}`);
  console.log(`\n🔒 Login di /admin/login dengan password yang sudah kamu set.\n`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
