"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort, getEffectivePrice, hasDiscount } from "@/lib/formatCurrency";
import { X, Plus } from "./icons";

export default function ProductModal({ product, onClose, onAddToCart }) {
  // Combine main image + gallery into single array
  const allImages = useMemo(() => {
    const list = [];
    if (product.image) list.push(product.image);
    if (Array.isArray(product.gallery)) list.push(...product.gallery);
    return list.length > 0 ? list : [null];
  }, [product]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [variantError, setVariantError] = useState("");

  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const requiresColor = colors.length > 0;
  const requiresSize = sizes.length > 0;

  const activeImage = allImages[activeImageIdx];
  const imageUrl = activeImage ? getImageUrl(activeImage, 600, 600) : null;
  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  const effectivePrice = getEffectivePrice(product);
  const showDiscount = hasDiscount(product);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleAdd() {
    if (requiresColor && !selectedColor) {
      setVariantError("Pilih warna terlebih dahulu");
      return;
    }
    if (requiresSize && !selectedSize) {
      setVariantError("Pilih ukuran terlebih dahulu");
      return;
    }
    setVariantError("");
    onAddToCart({
      ...product,
      _selectedColor: selectedColor,
      _selectedSize: selectedSize,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[480px] md:max-w-[700px] bg-[#FAFAF8] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
          aria-label="Tutup detail produk"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Main image */}
          <div className="relative aspect-square bg-[#F3F0EA]">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="480px"
              unoptimized={displayImage.includes("placehold.co")}
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white/90 text-[#737373] text-sm font-semibold px-4 py-2 rounded-full">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Gallery thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 px-5 pt-3 overflow-x-auto scrollbar-hide">
              {allImages.map((img, i) => {
                const thumbUrl = img ? getImageUrl(img, 80, 80) : PLACEHOLDER_IMAGE;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === activeImageIdx ? "border-brand" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={thumbUrl} alt="" fill className="object-cover" sizes="56px"
                      unoptimized={thumbUrl?.includes("placehold.co")} />
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-5 pb-4">
            {product.category?.title && (
              <span className="text-xs font-medium text-brand bg-[#F3F0EA] px-2.5 py-1 rounded-full">
                {product.category.title}
              </span>
            )}

            <h2 className="mt-3 text-xl font-bold text-[#171717] leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-bold text-brand tabular-nums">
                {formatCurrencyShort(effectivePrice)}
              </p>
              {showDiscount && (
                <p className="text-sm text-[#A8A29E] line-through tabular-nums">
                  {formatCurrencyShort(product.price)}
                </p>
              )}
            </div>

            {product.material && (
              <p className="mt-2 text-xs text-[#737373]">
                <span className="font-semibold">Bahan:</span> {product.material}
              </p>
            )}

            {product.description && (
              <p className="mt-3 text-sm text-[#737373] leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#171717] mb-2">
                  Warna {selectedColor && <span className="text-[#737373] font-normal">· {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setVariantError(""); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? "bg-brand text-white border-[var(--brand)]"
                          : "bg-white text-[#171717] border-[#E5E5E5] hover:border-[var(--brand)]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#171717] mb-2">
                  Ukuran {selectedSize && <span className="text-[#737373] font-normal">· {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setVariantError(""); }}
                      className={`min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? "bg-brand text-white border-[var(--brand)]"
                          : "bg-white text-[#171717] border-[#E5E5E5] hover:border-[var(--brand)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.isAvailable ? "bg-green-500" : "bg-red-400"}`} />
              <span className="text-xs text-[#737373]">
                {product.isAvailable ? "Tersedia" : "Stok Habis"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E5E5E5] bg-[#FAFAF8] space-y-2">
          {variantError && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-center">
              {variantError}
            </p>
          )}
          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-brand font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            {product.isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
}
