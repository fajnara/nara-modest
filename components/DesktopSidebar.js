"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image";

export default function DesktopSidebar({
  store,
  categories,
  activeCategory,
  onCategoryChange,
  totalQty,
  onCartOpen,
}) {
  const storeName = store?.storeName || "Toko Kami";
  const tagline = store?.storeTagline;
  const logoUrl = store?.logo ? getImageUrl(store.logo, 80, 80) : null;

  return (
    <aside className="hidden md:flex flex-col w-[260px] xl:w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#E5E5E5] bg-[#FAFAF8] py-6 px-6">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-3">
        {logoUrl && (
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F3F0EA] shrink-0">
            <Image src={logoUrl} alt="" fill className="object-cover" sizes="40px" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#171717] leading-tight truncate">
            {storeName}
          </h1>
          {tagline && (
            <p className="text-xs text-[#737373] mt-0.5 truncate">{tagline}</p>
          )}
        </div>
      </div>

      {/* Cart button */}
      <button
        onClick={onCartOpen}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl btn-brand text-sm font-semibold transition-colors mb-6"
      >
        <span>Keranjang</span>
        {totalQty > 0 && (
          <span className="bg-white text-brand text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalQty > 99 ? "99+" : totalQty}
          </span>
        )}
      </button>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-widest mb-2 px-1">
          Kategori
        </p>
        <nav className="flex flex-col gap-0.5">
          {[{ _id: "all", title: "Semua", slug: "all" }, ...categories].map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => onCategoryChange(cat.slug)}
                className={`
                  text-left px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-[#F3F0EA] text-brand font-semibold"
                    : "text-[#737373] hover:bg-[#F3F0EA] hover:text-[#171717]"
                  }
                `}
              >
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand mr-2 align-middle" />
                )}
                {cat.title}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Copyright at bottom */}
      <div className="mt-auto pt-6">
        <p className="text-[10px] text-[#A8A29E]">
          © {new Date().getFullYear()} {storeName}
        </p>
      </div>
    </aside>
  );
}
