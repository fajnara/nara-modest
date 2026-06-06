export const categorySchema = {
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nama Kategori",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "order",
      title: "Urutan",
      type: "number",
    },
  ],
  orderings: [
    {
      title: "Urutan",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
};
