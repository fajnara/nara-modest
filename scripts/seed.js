/**
 * Sanity Seed Script — Nara Modest
 * Jalankan: npm run seed
 */

const { createClient } = require("@sanity/client");

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("❌ SANITY_WRITE_TOKEN belum diset di .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token,
  useCdn: false,
});

// ── Data ──────────────────────────────────────────────

const categories = [
  { title: "Pashmina",  slug: "pashmina",  order: 1 },
  { title: "Bergo",     slug: "bergo",     order: 2 },
  { title: "Abaya",     slug: "abaya",     order: 3 },
  { title: "Aksesoris", slug: "aksesoris", order: 4 },
  { title: "Bundling",  slug: "bundling",  order: 5 },
];

const productData = [
  { name: "Pashmina Silk Nude",        category: "pashmina",  price: 75000,  featured: true,  desc: "Pashmina silk premium warna nude elegan. Bahan lembut dan nyaman dipakai seharian." },
  { name: "Pashmina Silk Mauve",       category: "pashmina",  price: 75000,  featured: false, desc: "Pashmina silk warna mauve yang cantik. Cocok untuk tampilan sehari-hari maupun formal." },
  { name: "Bergo Maryam Cream",        category: "bergo",     price: 89000,  featured: true,  desc: "Bergo Maryam warna cream yang versatile. Bahan voal premium anti-kusut." },
  { name: "Bergo Daily Black",         category: "bergo",     price: 79000,  featured: false, desc: "Bergo hitam klasik untuk tampilan daily. Praktis dan elegan." },
  { name: "Abaya Basic Hitam",         category: "abaya",     price: 249000, featured: true,  desc: "Abaya basic hitam potongan A-line. Bahan crepe premium yang jatuh dan elegan." },
  { name: "Tunik Linen Almond",        category: "abaya",     price: 189000, featured: false, desc: "Tunik linen warna almond yang adem dan casual. Cocok untuk aktivitas santai maupun kerja." },
  { name: "Inner Ninja Premium",       category: "aksesoris", price: 35000,  featured: false, desc: "Inner ninja premium anti-licin. Bahan jersey lembut dan stretch." },
  { name: "Scrunchie Premium",         category: "aksesoris", price: 25000,  featured: false, desc: "Scrunchie satin premium. Tersedia dalam berbagai warna pilihan." },
  { name: "Bundling Pashmina 3 Warna", category: "bundling",  price: 199000, featured: true,  desc: "Paket hemat 3 pashmina silk dengan warna berbeda. Lebih hemat dibanding beli satuan." },
  { name: "Paket Daily Modest",        category: "bundling",  price: 299000, featured: false, desc: "Paket lengkap daily modest: 1 bergo + 1 inner ninja + 1 scrunchie." },
];

const storeSettings = {
  storeName:      "Nara Modest",
  storeTagline:   "Modest Wear Catalog",
  whatsappNumber: "6281234567890",
  instagramUrl:   "https://instagram.com/naramodest",
  address:        "Sampit, Indonesia",
  heroTitle:      "Elegan Setiap Hari",
  heroSubtitle:   "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
  promoText:      "Koleksi baru minggu ini sudah tersedia.",
};

// ── Main ──────────────────────────────────────────────

async function seed() {
  console.log("🌱 Mulai seed data ke Sanity...\n");

  // 1. Categories
  console.log("📂 Membuat kategori...");
  const catIdMap = {};

  for (const cat of categories) {
    const id = `category-${cat.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "category",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      order: cat.order,
    });
    catIdMap[cat.slug] = id;
    console.log(`  ✓ ${cat.title}`);
  }

  // 2. Products
  console.log("\n📦 Membuat produk...");
  for (let i = 0; i < productData.length; i++) {
    const p = productData[i];
    const slugText = p.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const id = `product-${slugText}`;

    await client.createOrReplace({
      _id: id,
      _type: "product",
      name: p.name,
      slug:     { _type: "slug", current: slugText },
      category: { _type: "reference", _ref: catIdMap[p.category] },
      price:       p.price,
      description: p.desc,
      isAvailable: true,
      isFeatured:  p.featured,
      sortOrder:   i + 1,
    });
    console.log(`  ✓ ${p.name} — Rp${p.price.toLocaleString("id-ID")}`);
  }

  // 3. Store Settings
  console.log("\n🏪 Membuat pengaturan toko...");
  await client.createOrReplace({
    _id:   "storeSettings-singleton",
    _type: "storeSettings",
    ...storeSettings,
  });
  console.log(`  ✓ ${storeSettings.storeName}`);

  console.log("\n✅ Seed selesai! Buka website untuk melihat hasilnya.");
  console.log("💡 Foto produk masih kosong — upload manual via Studio.");
}

seed().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
