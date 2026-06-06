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
      description: "Tanpa tanda + atau spasi. Contoh: 6281234567890",
    },
    {
      name: "instagramUrl",
      title: "URL Instagram",
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
      name: "promoText",
      title: "Teks Promo",
      type: "string",
    },
    {
      name: "primaryColor",
      title: "Warna Utama (hex)",
      type: "string",
      description: "Contoh: #8B5E3C",
    },
  ],
};
