"use client";

import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products, onProductClick, onAddToCart, columns = 2 }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Belum ada produk di kategori ini"
        description="Coba pilih kategori lain atau lihat semua produk."
      />
    );
  }

  const gridClass = columns === 3
    ? "grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
    : "grid grid-cols-2 gap-3 pt-4";

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onCardClick={() => onProductClick(product)}
          onAddToCart={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        />
      ))}
    </div>
  );
}
