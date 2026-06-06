"use client";

import { useEffect } from "react";
import Image from "next/image";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { X, Plus } from "./icons";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const imageUrl = product.image
    ? getImageUrl(product.image, 600, 600)
    : PLACEHOLDER_IMAGE;

  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal sheet */}
      <div className="relative w-full max-w-[480px] bg-[#FAFAF8] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
          aria-label="Tutup detail produk"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Product Image */}
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

          {/* Product Details */}
          <div className="p-5 pb-4">
            {product.category?.title && (
              <span className="text-xs font-medium text-[#8B5E3C] bg-[#F3F0EA] px-2.5 py-1 rounded-full">
                {product.category.title}
              </span>
            )}

            <h2 className="mt-3 text-xl font-bold text-[#171717] leading-snug">
              {product.name}
            </h2>

            <p className="mt-1 text-xl font-bold text-[#8B5E3C]">
              {formatCurrencyShort(product.price)}
            </p>

            {product.description && (
              <p className="mt-3 text-sm text-[#737373] leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${product.isAvailable ? "bg-green-500" : "bg-red-400"}`}
              />
              <span className="text-xs text-[#737373]">
                {product.isAvailable ? "Tersedia" : "Stok Habis"}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="p-4 border-t border-[#E5E5E5] bg-[#FAFAF8]">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.isAvailable}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#8B5E3C] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5C3A24] transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            {product.isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
}
