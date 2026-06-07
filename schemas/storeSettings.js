export const storeSettingsSchema = {
  name: "storeSettings",
  title: "Pengaturan Toko",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "storeName",
      title: "Nama Toko",
      type: "string",
    },
    {
      name: "storeTagline",
      title: "Tagline",
      type: "string",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "whatsappNumber",
      title: "Nomor WhatsApp (format: 628xxx)",
      type: "string",
      description: "Wajib format internasional tanpa + atau spasi. Contoh: 6281234567890",
      validation: (Rule) =>
        Rule.custom((val) => {
          if (!val) return true;
          return /^62\d{9,13}$/.test(val)
            ? true
            : "Format harus 62xxxxxxxxxx (tanpa + atau spasi)";
        }),
    },
    {
      name: "instagramUsername",
      title: "Username Instagram",
      type: "string",
      description: "Tanpa @. Contoh: naramodest",
    },
    {
      name: "instagramUrl",
      title: "URL Instagram (lengkap)",
      type: "string",
    },
    {
      name: "address",
      title: "Alamat / Lokasi",
      type: "string",
    },
    {
      name: "heroTitle",
      title: "Judul Hero Banner",
      type: "string",
    },
    {
      name: "heroSubtitle",
      title: "Subjudul Hero Banner",
      type: "text",
      rows: 3,
    },
    {
      name: "heroImage",
      title: "Foto Hero Banner",
      type: "image",
      options: { hotspot: true },
      description: "Foto editorial untuk hero banner. Opsional — kalau kosong pakai gradient saja.",
    },
    {
      name: "heroCtaText",
      title: "Teks Tombol Hero",
      type: "string",
      description: "Teks tombol hero. Kosongkan untuk memakai default: Lihat Koleksi.",
    },
    {
      name: "promoText",
      title: "Teks Promo",
      type: "string",
    },
    {
      name: "primaryColor",
      title: "Warna Utama (hex)",
      type: "string",
      description: "Contoh: #8B5E3C — warna tombol, aksen, dll.",
      validation: (Rule) =>
        Rule.custom((val) => {
          if (!val) return true;
          return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)
            ? true
            : "Gunakan format hex, contoh: #8B5E3C atau #abc";
        }),
    },
    {
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Judul yang muncul di Google. Kosongkan untuk pakai nama toko.",
    },
    {
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Deskripsi singkat untuk Google & media sosial.",
    },
  ],
};
