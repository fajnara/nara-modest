import { adminClient } from "@/lib/sanity-admin";
import Link from "next/link";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { toggleProductAvailability, deleteProduct } from "@/actions/admin";
import DeleteButton from "@/components/admin/DeleteButton";
import ToggleButton from "@/components/admin/ToggleButton";

async function getProducts() {
  return adminClient.fetch(
    `*[_type == "product"] | order(sortOrder asc, name asc) {
      _id, name, price, isAvailable, isFeatured, sortOrder,
      "category": category->title
    }`
  );
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#171717]">Produk</h1>
          <p className="text-sm text-[#737373] mt-0.5">{products.length} produk</p>
        </div>
        <Link href="/admin/products/new"
          className="px-4 py-2 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors">
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-[#737373] text-sm">
            Belum ada produk. <Link href="/admin/products/new" className="text-[#8B5E3C] font-medium">Tambah sekarang</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F5F5F4]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#737373]">Nama Produk</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#737373] hidden sm:table-cell">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#737373]">Harga</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#737373]">Tersedia</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#171717]">{p.name}</p>
                    {p.isFeatured && (
                      <span className="text-[10px] bg-[#F3F0EA] text-[#8B5E3C] px-1.5 py-0.5 rounded-full">Unggulan</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#737373] hidden sm:table-cell">
                    {p.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-[#171717]">
                    {formatCurrencyShort(p.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ToggleButton
                      id={p._id}
                      value={p.isAvailable}
                      action={toggleProductAvailability}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p._id}`}
                        className="text-xs text-[#8B5E3C] hover:underline">Edit</Link>
                      <DeleteButton id={p._id} action={deleteProduct} label="produk" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
