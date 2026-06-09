"use client";

import { Search, ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  columns = 2,
  searchQuery = "",
  onClearFilters,
}) {
  if (!products || products.length === 0) {
    const isSearchEmpty = searchQuery.trim().length > 0;

    return (
      <EmptyState
        icon={isSearchEmpty
          ? <Search className="w-7 h-7" strokeWidth={1.5} />
          : <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
        }
        title={
          isSearchEmpty
            ? `Tidak ada hasil untuk "${searchQuery}"`
            : "Belum ada produk di kategori ini"
        }
        description={
          isSearchEmpty
            ? "Coba kata kunci lain atau hapus filter."
            : "Coba pilih kategori lain atau lihat semua produk."
        }
        action={
          onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-5 py-2.5 rounded-xl btn-brand text-xs font-semibold"
            >
              Lihat Semua Produk
            </button>
          )
        }
      />
    );
  }

  const gridClass = columns === 3
    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pt-4 stagger-fade-in"
    : "grid grid-cols-2 gap-3 pt-4 stagger-fade-in";

  return (
    <div className={gridClass}>
      {products.map((product) => {
        const hasVariants =
          (product.colors?.length || 0) > 0 || (product.sizes?.length || 0) > 0;

        return (
          <ProductCard
            key={product._id}
            product={product}
            onCardClick={() => onProductClick(product)}
            onAddToCart={(e) => {
              e.stopPropagation();
              if (hasVariants) {
                onProductClick(product);
                return;
              }
              onAddToCart(product);
            }}
          />
        );
      })}
    </div>
  );
}
