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

  // Quick-add button opens modal for variant selection if product has variants,
  // otherwise adds directly to cart. Reflect that intent in the aria-label.
  const hasVariants =
    (product.colors?.length || 0) > 0 || (product.sizes?.length || 0) > 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99]"
      onClick={onCardClick}
    >
      {/* Image — dominant, larger ratio for fashion */}
      <div className="relative aspect-[4/5] bg-[#F3F0EA] overflow-hidden rounded-2xl">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 240px"
          quality={70}
          loading="lazy"
          unoptimized={displayImage.includes("placehold.co")}
        />

        {/* Badges — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {showDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && product.isAvailable && !showDiscount && (
            <span className="bg-white/95 backdrop-blur text-[#171717] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Baru
            </span>
          )}
        </div>

        {/* Quick-add button — always visible on mobile, hover-reveal on desktop */}
        <button
          onClick={onAddToCart}
          disabled={!product.isAvailable}
          className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full btn-brand shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
          aria-label={
            hasVariants
              ? `Pilih varian ${product.name}`
              : `Tambah ${product.name} ke keranjang`
          }
        >
          <Plus className="w-4 h-4" />
        </button>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/95 text-[#171717] text-xs font-semibold px-3 py-1.5 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Info — minimal, more breathing room */}
      <div className="pt-3 pb-1 px-1">
        <p className="text-xs sm:text-sm font-medium text-[#171717] line-clamp-2 leading-snug min-h-[2.6em]">
          {product.name}
        </p>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-bold text-brand tabular-nums">
            {formatCurrencyShort(effectivePrice)}
          </span>
          {showDiscount && (
            <span className="text-[10px] text-[#A8A29E] line-through tabular-nums">
              {formatCurrencyShort(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
