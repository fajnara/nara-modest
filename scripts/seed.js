/**
 * Sanity Seed Script — Demo data lengkap untuk Nara Modest template
 * Jalankan: npm run seed
 *
 * Generates:
 *   - 5 kategori
 *   - 12 produk dengan variasi:
 *     · harga diskon
 *     · varian warna + ukuran
 *     · produk featured (badge "Baru")
 *     · produk sold out
 *     · produk dengan material info
 *   - 1 store settings
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
  {
    name: "Pashmina Silk Premium", category: "pashmina", price: 95000, discountPrice: 75000,
    material: "Silk Premium", colors: ["Nude", "Mauve", "Sage", "Hitam"],
    desc: "Pashmina silk premium dengan tekstur jatuh dan tidak tembus pandang.", featured: true,
  },
  {
    name: "Pashmina Daily Crinkle", category: "pashmina", price: 65000,
    material: "Crinkle Voal", colors: ["Cream", "Dusty Pink", "Olive"],
    desc: "Pashmina crinkle bahan ringan dan adem. Cocok untuk daily.", featured: false,
  },
  {
    name: "Bergo Maryam Cream", category: "bergo", price: 89000,
    material: "Voal Premium", sizes: ["All Size"],
    desc: "Bergo Maryam warna cream yang versatile. Anti-kusut.", featured: true,
  },
  {
    name: "Bergo Daily Classic", category: "bergo", price: 79000, discountPrice: 65000,
    material: "Jersey Premium", colors: ["Hitam", "Navy", "Maroon"], sizes: ["All Size"],
    desc: "Bergo daily klasik. Praktis dan elegan untuk aktivitas sehari-hari.", featured: false,
  },
  {
    name: "Abaya Basic Hitam", category: "abaya", price: 249000,
    material: "Crepe Premium", sizes: ["S", "M", "L", "XL"],
    desc: "Abaya basic hitam dengan potongan A-line. Jatuh dan elegan.", featured: true,
  },
  {
    name: "Abaya Lebaran Edition", category: "abaya", price: 389000, discountPrice: 299000,
    material: "Premium Crepe + Embroidery", colors: ["Dusty Pink", "Sage Green", "Champagne"],
    sizes: ["S", "M", "L", "XL"],
    desc: "Abaya edisi spesial Lebaran dengan detail bordir di lengan.", featured: true,
  },
  {
    name: "Tunik Linen Almond", category: "abaya", price: 189000,
    material: "Linen Premium", colors: ["Almond", "Sage", "Dusty Rose"], sizes: ["M", "L", "XL"],
    desc: "Tunik linen warna almond yang adem. Cocok kerja maupun santai.", featured: false,
  },
  {
    name: "Inner Ninja Premium", category: "aksesoris", price: 35000,
    material: "Jersey Stretch", colors: ["Hitam", "Putih", "Nude", "Cream"],
    desc: "Inner ninja premium anti-licin. Bahan jersey lembut.", featured: false,
  },
  {
    name: "Scrunchie Satin Set", category: "aksesoris", price: 25000, discountPrice: 19000,
    colors: ["Mix Warna (3 pcs)"],
    desc: "Set 3 scrunchie satin premium dengan warna berbeda.", featured: false,
  },
  {
    name: "Bundling Pashmina 3 Warna", category: "bundling", price: 199000,
    material: "Silk Premium",
    desc: "Paket hemat 3 pashmina silk warna berbeda. Hemat 50rb!", featured: true,
  },
  {
    name: "Paket Daily Modest", category: "bundling", price: 299000,
    desc: "Paket lengkap daily: 1 bergo + 1 inner ninja + 1 scrunchie set.", featured: false,
  },
  {
    name: "Limited Edition Eid Box", category: "bundling", price: 599000, discountPrice: 499000,
    desc: "Paket spesial Idul Fitri: abaya + bergo + pashmina + box exclusive.", featured: true,
    available: false, // Sold out untuk demo
  },
];

const storeSettings = {
  storeName:        "Nara Modest",
  storeTagline:     "Modest Wear Catalog",
  whatsappNumber:   "6281234567890",
  instagramUsername:"naramodest",
  instagramUrl:     "https://instagram.com/naramodest",
  address:          "Sampit, Indonesia",
  heroTitle:        "Elegan Setiap Hari",
  heroSubtitle:     "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
  promoText:        "Koleksi baru minggu ini sudah tersedia.",
  primaryColor:     "#8B5E3C",
  seoTitle:         "",
  seoDescription:   "Belanja modest wear premium langsung via WhatsApp. Pashmina, bergo, abaya, dan aksesoris.",
};

// ── Main ──────────────────────────────────────────────

async function seed() {
  console.log("\n🌱 Mulai seed data demo ke Sanity...\n");

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

    const doc = {
      _id: id,
      _type: "product",
      name: p.name,
      slug:     { _type: "slug", current: slugText },
      category: { _type: "reference", _ref: catIdMap[p.category] },
      price:        p.price,
      description:  p.desc,
      material:     p.material || "",
      colors:       p.colors || [],
      sizes:        p.sizes || [],
      isAvailable:  p.available !== false,
      isFeatured:   p.featured,
      sortOrder:    i + 1,
    };

    if (p.discountPrice) doc.discountPrice = p.discountPrice;

    await client.createOrReplace(doc);

    const tags = [];
    if (p.discountPrice) tags.push("DISKON");
    if (p.featured) tags.push("BARU");
    if (p.available === false) tags.push("HABIS");
    const tagStr = tags.length ? ` [${tags.join(", ")}]` : "";

    console.log(`  ✓ ${p.name} — Rp${p.price.toLocaleString("id-ID")}${tagStr}`);
  }

  // 3. Store Settings
  console.log("\n🏪 Membuat pengaturan toko...");
  await client.createOrReplace({
    _id: "storeSettings-singleton",
    _type: "storeSettings",
    ...storeSettings,
  });
  console.log(`  ✓ ${storeSettings.storeName}`);

  console.log(`\n✅ Seed selesai! ${categories.length} kategori, ${productData.length} produk siap.`);
  console.log("💡 Foto produk masih kosong — upload via admin panel atau Sanity Studio.\n");
}

seed().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
