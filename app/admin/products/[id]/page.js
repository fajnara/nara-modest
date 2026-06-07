import { adminClient } from "@/lib/sanity-admin";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/actions/admin";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    adminClient.fetch(
      `*[_type == "product" && _id == $id][0]{
        _id, name, price, discountPrice, description, material,
        colors, sizes, isAvailable, isFeatured, sortOrder,
        image, gallery,
        "category": category->{ _id, title }
      }`,
      { id }
    ),
    adminClient.fetch(`*[_type == "category"] | order(order asc) { _id, title }`),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Edit Produk</h1>
        <p className="text-sm text-[#737373] mt-0.5">{product.name}</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <ProductForm product={product} categories={categories} action={updateProduct} />
      </div>
    </div>
  );
}
