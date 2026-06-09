"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
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
    <aside className="hidden md:flex flex-col w-[280px] xl:w-[300px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#E5E5E5] bg-[#FAFAF8] py-8 px-7">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3">
        {logoUrl && (
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#F3F0EA] shrink-0 ring-1 ring-[#E5E5E5]/60">
            <Image src={logoUrl} alt="" fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="heading-display text-xl text-[#171717] leading-tight truncate">
            {storeName}
          </h1>
          {tagline && (
            <p className="text-[10px] text-[#737373] tracking-widest uppercase mt-0.5 truncate">
              {tagline}
            </p>
          )}
        </div>
      </div>

      {/* Cart button */}
      <button
        onClick={onCartOpen}
        className="flex items-center justify-between w-full px-4 py-3 rounded-2xl btn-brand text-sm font-semibold mb-8 shadow-sm active:scale-[0.98]"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
          Keranjang
        </span>
        {totalQty > 0 && (
          <span className="bg-white text-brand text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalQty > 99 ? "99+" : totalQty}
          </span>
        )}
      </button>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-widest mb-3 px-1">
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
                  text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? "bg-[var(--brand)]/10 text-brand font-semibold"
                    : "text-[#737373] hover:bg-[#F3F0EA] hover:text-[#171717]"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {isActive && (
                    <span className="inline-block w-1 h-1 rounded-full bg-brand" />
                  )}
                  <span className={isActive ? "" : "ml-3"}>{cat.title}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Copyright */}
      <div className="mt-auto pt-6">
        <div className="w-8 h-px bg-[#E5E5E5] mb-3" />
        <p className="text-[10px] text-[#A8A29E] tracking-widest uppercase">
          © {new Date().getFullYear()} {storeName}
        </p>
      </div>
    </aside>
  );
}
