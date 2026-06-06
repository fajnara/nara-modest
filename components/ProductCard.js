"use client";

import Image from "next/image";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { Plus } from "./icons";

export default function ProductCard({ product, onCardClick, onAddToCart }) {
  const imageUrl = product.image
    ? getImageUrl(product.image, 400, 500)
    : PLACEHOLDER_IMAGE;

  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-[0_1px_4px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.98] transition-transform duration-100"
      onClick={onCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-[#F3F0EA] overflow-hidden">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 50vw, 240px"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          unoptimized={displayImage.includes("placehold.co")}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-[#737373] text-[10px] font-semibold px-2 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2.5">
        {product.category?.title && (
          <span className="text-[10px] font-medium text-[#8B5E3C] bg-[#F3F0EA] px-2 py-0.5 rounded-full">
            {product.category.title}
          </span>
        )}

        <p className="mt-1.5 text-xs font-semibold text-[#171717] line-clamp-2 leading-snug min-h-[2.4em]">
          {product.name}
        </p>

        <div className="flex items-center justify-between mt-2 gap-1">
          <span className="text-sm font-bold text-[#171717]">
            {formatCurrencyShort(product.price)}
          </span>

          <button
            onClick={onAddToCart}
            disabled={!product.isAvailable}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8B5E3C] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5C3A24] transition-colors active:scale-95 flex-shrink-0"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
