import { adminClient } from "@/lib/sanity-admin";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/actions/admin";

export default async function NewProductPage() {
  const categories = await adminClient.fetch(
    `*[_type == "category"] | order(order asc) { _id, title }`
  );

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Tambah Produk</h1>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
