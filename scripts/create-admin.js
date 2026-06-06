/**
 * Buat admin user pertama
 * Jalankan: npm run create-admin
 *
 * Edit variabel di bawah sebelum dijalankan.
 */

const { createClient } = require("@sanity/client");
const bcrypt = require("bcryptjs");

// ── Edit ini ──────────────────────────────────────────
const ADMIN_NAME     = "Admin";
const ADMIN_EMAIL    = "admin@naramodest.com";
const ADMIN_PASSWORD = "gantidengansandi123";
const ADMIN_ROLE     = "superadmin"; // "superadmin" atau "admin"
// ─────────────────────────────────────────────────────

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  console.log(`\n👤 Membuat admin user: ${ADMIN_EMAIL}\n`);

  const existing = await client.fetch(
    `*[_type == "adminUser" && email == $email][0]._id`,
    { email: ADMIN_EMAIL }
  );

  if (existing) {
    console.log("⚠️  Email sudah terdaftar. Hapus dulu dari Sanity Studio jika ingin membuat ulang.");
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
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role    : ${ADMIN_ROLE}`);
  console.log(`\n🔒 Segera ganti password setelah login pertama.\n`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
