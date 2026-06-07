"use client";

import Image from "next/image";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort, getEffectivePrice, hasDiscount } from "@/lib/formatCurrency";
import { Plus } from "./icons";

export default function ProductCard({ product, onCardClick, onAddToCart }) {
  const imageUrl = product.image ? getImageUrl(product.image, 400, 500) : null;
  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  const effectivePrice = getEffectivePrice(product);
  const showDiscount = hasDiscount(product);
  const discountPercent = showDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const hasVariants = (product.colors?.length || 0) > 0 || (product.sizes?.length || 0) > 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-[0_1px_4px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-[0.98]"
      onClick={onCardClick}
    >
      <div className="relative aspect-[4/5] bg-[#F3F0EA] overflow-hidden">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 480px) 50vw, 240px"
          unoptimized={displayImage.includes("placehold.co")}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {showDiscount && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && product.isAvailable && !showDiscount && (
            <span className="bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Baru
            </span>
          )}
        </div>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-[#737373] text-[10px] font-semibold px-2 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5">
        {product.category?.title && (
          <span className="text-[10px] font-medium text-brand bg-[#F3F0EA] px-2 py-0.5 rounded-full">
            {product.category.title}
          </span>
        )}

        <p className="mt-1.5 text-xs font-semibold text-[#171717] line-clamp-2 leading-snug min-h-[2.4em]">
          {product.name}
        </p>

        <div className="flex items-center justify-between mt-2 gap-1">
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#171717] tabular-nums">
              {formatCurrencyShort(effectivePrice)}
            </div>
            {showDiscount && (
              <div className="text-[10px] text-[#A8A29E] line-through tabular-nums">
                {formatCurrencyShort(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={onAddToCart}
            disabled={!product.isAvailable}
            className="flex items-center justify-center w-7 h-7 rounded-lg btn-brand disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 transition-colors"
            aria-label={hasVariants ? `Pilih varian ${product.name}` : `Tambah ${product.name} ke keranjang`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
