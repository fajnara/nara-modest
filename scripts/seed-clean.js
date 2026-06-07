/**
 * Clean all demo data from Sanity (products, categories, settings).
 * Tidak menghapus admin users.
 *
 * Jalankan: npm run seed:clean
 */

const { createClient } = require("@sanity/client");

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN belum diset");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token,
  useCdn: false,
});

async function clean() {
  console.log("\n🧹 Membersihkan data demo dari Sanity...\n");

  // Delete products
  const products = await client.fetch(`*[_type == "product"]._id`);
  for (const id of products) {
    await client.delete(id);
    console.log(`  ✕ Hapus produk: ${id}`);
  }

  // Delete categories
  const categories = await client.fetch(`*[_type == "category"]._id`);
  for (const id of categories) {
    await client.delete(id);
    console.log(`  ✕ Hapus kategori: ${id}`);
  }

  // Delete store settings (but not adminUser!)
  const settings = await client.fetch(`*[_type == "storeSettings"]._id`);
  for (const id of settings) {
    await client.delete(id);
    console.log(`  ✕ Hapus pengaturan: ${id}`);
  }

  console.log(`\n✅ Bersih! Hapus ${products.length} produk, ${categories.length} kategori, ${settings.length} settings.`);
  console.log("ℹ️  Admin users TIDAK dihapus.\n");
}

clean().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
