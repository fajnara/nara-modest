import { adminClient } from "@/lib/sanity-admin";
import Link from "next/link";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { toggleProductAvailability, deleteProduct } from "@/actions/admin";
import DeleteButton from "@/components/admin/DeleteButton";
import ToggleButton from "@/components/admin/ToggleButton";

async function getProducts() {
  return adminClient.fetch(
    `*[_type == "product"] | order(sortOrder asc, name asc) {
      _id, name, price, discountPrice, isAvailable, isFeatured, sortOrder,
      image,
      "category": category->title
    }`
  );
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="heading-display text-2xl text-[#171717]">Produk</h1>
          <p className="text-xs text-[#737373] mt-0.5 tracking-wide">
            {products.length} produk terdaftar
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-brand text-sm font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Tambah Produk</span>
          <span className="sm:hidden">Tambah</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] text-center py-16 px-6">
          <p className="text-sm text-[#737373]">
            Belum ada produk.{" "}
            <Link href="/admin/products/new" className="text-brand font-semibold hover:underline">
              Tambah sekarang
            </Link>
          </p>
        </div>
      ) : (
        <>
          {/* ── MOBILE: card list ──────────────────────── */}
          <div className="md:hidden space-y-2.5">
            {products.map((p) => (
              <ProductCardRow key={p._id} product={p} />
            ))}
          </div>

          {/* ── DESKTOP: table ─────────────────────────── */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#737373] uppercase tracking-widest">Produk</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#737373] uppercase tracking-widest">Kategori</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#737373] uppercase tracking-widest">Harga</th>
                  <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#737373] uppercase tracking-widest">Tersedia</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {products.map((p) => {
                  const thumbUrl = p.image ? getImageUrl(p.image, 120, 150) : PLACEHOLDER_IMAGE;
                  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
                  return (
                    <tr key={p._id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#F3F0EA] shrink-0">
                            <Image
                              src={thumbUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized={thumbUrl?.includes("placehold.co")}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#171717] line-clamp-1">{p.name}</p>
                            {p.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-[var(--brand)]/10 text-brand px-1.5 py-0.5 rounded-full mt-1">
                                <Star className="w-2.5 h-2.5 fill-brand" strokeWidth={0} />
                                Unggulan
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#737373]">
                        {p.category || "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {hasDiscount ? (
                          <div>
                            <div className="text-sm font-bold text-[#171717]">
                              {formatCurrencyShort(p.discountPrice)}
                            </div>
                            <div className="text-[10px] text-[#A8A29E] line-through">
                              {formatCurrencyShort(p.price)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-[#171717]">
                            {formatCurrencyShort(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ToggleButton
                          id={p._id}
                          value={p.isAvailable}
                          action={toggleProductAvailability}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/products/${p._id}`}
                            className="text-xs text-brand font-semibold hover:underline">Edit</Link>
                          <DeleteButton id={p._id} action={deleteProduct} label="produk" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* Mobile card row — info-rich, tap-friendly */
function ProductCardRow({ product }) {
  const thumbUrl = product.image ? getImageUrl(product.image, 200, 240) : PLACEHOLDER_IMAGE;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-3 flex gap-3">
      {/* Thumbnail */}
      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F3F0EA] shrink-0">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
          unoptimized={thumbUrl?.includes("placehold.co")}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[#171717] line-clamp-2 leading-snug">
            {product.name}
          </p>
          <ToggleButton
            id={product._id}
            value={product.isAvailable}
            action={toggleProductAvailability}
          />
        </div>

        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-[var(--brand)]/10 text-brand px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-brand" strokeWidth={0} />
              Unggulan
            </span>
          )}
          {product.category && (
            <span className="text-[10px] text-[#737373] bg-[#F3F0EA] px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="tabular-nums">
            {hasDiscount ? (
              <>
                <div className="text-sm font-bold text-brand">
                  {formatCurrencyShort(product.discountPrice)}
                </div>
                <div className="text-[10px] text-[#A8A29E] line-through">
                  {formatCurrencyShort(product.price)}
                </div>
              </>
            ) : (
              <span className="text-sm font-bold text-brand">
                {formatCurrencyShort(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/products/${product._id}`}
              className="text-xs text-brand font-semibold hover:underline"
            >
              Edit
            </Link>
            <DeleteButton id={product._id} action={deleteProduct} label="produk" />
          </div>
        </div>
      </div>
    </div>
  );
}
