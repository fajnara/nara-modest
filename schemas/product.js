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
      name: "image",
      title: "Foto Produk",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
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
