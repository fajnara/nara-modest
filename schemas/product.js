export const productSchema = {
  name: "product",
  title: "Produk",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nama Produk",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "price",
      title: "Harga (Rp)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "discountPrice",
      title: "Harga Diskon (Rp)",
      type: "number",
      description: "Kosongkan jika tidak ada diskon. Harus lebih kecil dari harga normal.",
      validation: (Rule) =>
        Rule.min(0).custom((val, ctx) => {
          if (!val) return true;
          return val < ctx.document.price
            ? true
            : "Harga diskon harus lebih kecil dari harga normal";
        }),
    },
    {
      name: "image",
      title: "Foto Utama",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "gallery",
      title: "Galeri Foto Tambahan",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Foto-foto tambahan untuk produk ini (opsional)",
    },
    {
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
    },
    {
      name: "colors",
      title: "Pilihan Warna",
      type: "array",
      of: [{ type: "string" }],
      description: "Daftar warna yang tersedia. Contoh: Hitam, Putih, Cream. Kosongkan jika tidak ada varian warna.",
      options: { layout: "tags" },
    },
    {
      name: "sizes",
      title: "Pilihan Ukuran",
      type: "array",
      of: [{ type: "string" }],
      description: "Daftar ukuran. Contoh: S, M, L, XL atau All Size. Kosongkan jika tidak ada varian ukuran.",
      options: { layout: "tags" },
    },
    {
      name: "material",
      title: "Bahan / Material",
      type: "string",
      description: "Contoh: Voal Premium, Crepe, Linen, dll.",
    },
    {
      name: "isFeatured",
      title: "Produk Unggulan",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "isAvailable",
      title: "Tersedia",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "sortOrder",
      title: "Urutan Tampil",
      type: "number",
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "price",
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `Rp${subtitle.toLocaleString("id-ID")}` : "",
      };
    },
  },
};
