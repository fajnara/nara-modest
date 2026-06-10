/**
 * Reset password admin user by email — CLI fallback for forgotten passwords.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@toko.com ADMIN_PASSWORD="passwordBaru123" npm run reset-password
 *
 * Pakai ini kalau:
 *   - Admin lupa password
 *   - Tidak ada superadmin lain yang bisa reset dari /admin/users
 *   - Setelah seseorang yang punya akses ke .env / server bisa reset
 *
 * Rules password yang sama dengan create-admin:
 *   - Minimum 10 karakter
 *   - Mengandung huruf DAN angka
 *   - Tidak boleh sama dengan email
 */

const { createClient } = require("@sanity/client");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const writeToken = process.env.SANITY_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

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
  console.error('   Contoh: ADMIN_EMAIL=admin@toko.com ADMIN_PASSWORD="passwordBaru123" npm run reset-password');
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)) {
  console.error("❌ Format ADMIN_EMAIL tidak valid:", ADMIN_EMAIL);
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD wajib diisi (password baru).");
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

// ── Run ───────────────────────────────────────────────

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: writeToken,
  useCdn: false,
});

async function main() {
  console.log(`\n🔑 Mencari user dengan email: ${ADMIN_EMAIL}\n`);

  const user = await client.fetch(
    `*[_type == "adminUser" && email == $email][0]{ _id, name, role, isActive }`,
    { email: ADMIN_EMAIL }
  );

  if (!user) {
    console.error("❌ User tidak ditemukan. Cek email lagi atau buat admin baru via create-admin.");
    process.exit(1);
  }

  if (!user.isActive) {
    console.warn(`⚠️  User ${ADMIN_EMAIL} statusnya NONAKTIF. Password tetap akan direset, tapi`);
    console.warn("   akun perlu diaktifkan ulang via /admin/users (superadmin) sebelum bisa login.\n");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await client.patch(user._id).set({ passwordHash }).commit();

  console.log("✅ Password berhasil direset!");
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Nama : ${user.name}`);
  console.log(`   Role : ${user.role}`);
  console.log(`\n🔒 Login di /admin/login dengan password baru.\n`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
