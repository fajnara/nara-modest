import { adminClient } from "@/lib/sanity-admin";
import { deleteCategory } from "@/actions/admin";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const categories = await adminClient.fetch(
    `*[_type == "category"] | order(order asc) { _id, title, "slug": slug.current, order }`
  );

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Kategori</h1>
        <p className="text-sm text-[#737373] mt-0.5">{categories.length} kategori</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
