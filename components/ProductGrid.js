"use client";

import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products, onProductClick, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Belum ada produk di kategori ini"
        description="Coba pilih kategori lain atau lihat semua produk."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 pt-4">
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
