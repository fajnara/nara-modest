"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { X, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { getImageUrl, getImageUrlHQ, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort, getEffectivePrice, hasDiscount } from "@/lib/formatCurrency";
import { getProductGallery } from "@/actions/product";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [gallery, setGallery] = useState(
    Array.isArray(product.gallery) ? product.gallery : []
  );
  const [galleryLoading, setGalleryLoading] = useState(
    !Array.isArray(product.gallery)
  );

  const allImages = useMemo(() => {
    const list = [];
    if (product.image) list.push(product.image);
    if (Array.isArray(gallery)) list.push(...gallery);
    return list.length > 0 ? list : [null];
  }, [product.image, gallery]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [variantError, setVariantError] = useState("");

  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const requiresColor = colors.length > 0;
  const requiresSize = sizes.length > 0;

  const activeImage = allImages[activeImageIdx];
  // Modal can show up to 720px wide on desktop, 480 on mobile. Request 1600px
  // wide so it stays sharp on retina (2x) without horizontal cropping.
  const imageUrl = activeImage ? getImageUrlHQ(activeImage, 1600) : null;
  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  const effectivePrice = getEffectivePrice(product);
  const showDiscount = hasDiscount(product);

  // Lazy-load gallery on modal open
  useEffect(() => {
    let cancelled = false;
    if (Array.isArray(product.gallery)) {
      setGalleryLoading(false);
      return;
    }
    setGalleryLoading(true);
    getProductGallery(product._id)
      .then((data) => {
        if (!cancelled) {
          setGallery(Array.isArray(data) ? data : []);
          setGalleryLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setGalleryLoading(false);
      });
    return () => { cancelled = true; };
  }, [product._id, product.gallery]);

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[480px] md:max-w-[720px] bg-[#FAFAF8] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black/25 hover:bg-black/40 backdrop-blur-md rounded-full text-white"
          aria-label="Tutup detail produk"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Main image */}
          <div className="relative aspect-square bg-[#F3F0EA]">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              quality={95}
              unoptimized={displayImage.includes("placehold.co")}
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-white/95 text-[#171717] text-sm font-semibold px-4 py-2 rounded-full tracking-wide">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Gallery thumbnails */}
          {(allImages.length > 1 || galleryLoading) && (
            <div className="flex gap-2.5 px-6 pt-4 overflow-x-auto scrollbar-hide">
              {allImages.map((img, i) => {
                const thumbUrl = img ? getImageUrl(img, 100, 100) : PLACEHOLDER_IMAGE;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === activeImageIdx
                        ? "border-brand opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image src={thumbUrl} alt="" fill className="object-cover" sizes="64px"
                      unoptimized={thumbUrl?.includes("placehold.co")} />
                  </button>
                );
              })}
              {galleryLoading && (
                <div className="flex items-center gap-2 px-2 text-[#A8A29E]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                  <span className="text-[10px]">Memuat...</span>
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="p-6 pb-4">
            {product.category?.title && (
              <span className="inline-block text-[10px] font-semibold text-brand bg-[var(--brand)]/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category.title}
              </span>
            )}

            <h2 className="heading-display mt-4 text-2xl md:text-3xl text-[#171717] leading-tight">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2.5">
              <p className="text-2xl font-bold text-brand tabular-nums tracking-tight">
                {formatCurrencyShort(effectivePrice)}
              </p>
              {showDiscount && (
                <p className="text-sm text-[#A8A29E] line-through tabular-nums">
                  {formatCurrencyShort(product.price)}
                </p>
              )}
            </div>

            {product.material && (
              <p className="mt-4 text-xs text-[#737373] tracking-wide">
                <span className="font-semibold uppercase">Bahan:</span> {product.material}
              </p>
            )}

            {product.description && (
              <p className="mt-4 text-sm text-[#737373] leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-3">
                  Warna {selectedColor && (
                    <span className="text-[#737373] font-normal normal-case tracking-normal ml-1">· {selectedColor}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setVariantError(""); }}
                      className={`px-4 py-2 rounded-full text-xs font-medium border ${
                        selectedColor === color
                          ? "btn-brand border-[var(--brand)]"
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
              <div className="mt-5">
                <p className="text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-3">
                  Ukuran {selectedSize && (
                    <span className="text-[#737373] font-normal normal-case tracking-normal ml-1">· {selectedSize}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setVariantError(""); }}
                      className={`min-w-[52px] px-4 py-2 rounded-xl text-xs font-bold border ${
                        selectedSize === size
                          ? "btn-brand border-[var(--brand)]"
                          : "bg-white text-[#171717] border-[#E5E5E5] hover:border-[var(--brand)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2">
              {product.isAvailable ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
                  <span className="text-xs text-[#737373] tracking-wide">Tersedia</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                  <span className="text-xs text-[#737373] tracking-wide">Stok Habis</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="p-5 border-t border-[#E5E5E5] bg-[#FAFAF8]/95 backdrop-blur space-y-2.5">
          {variantError && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-center">
              {variantError}
            </p>
          )}
          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl btn-brand font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            {product.isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
}
