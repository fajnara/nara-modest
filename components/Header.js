"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/image";

export default function Header({ storeName, storeTagline, logo, totalQty, onCartOpen }) {
  const logoUrl = logo ? getImageUrl(logo, 96, 96) : null;

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/85 backdrop-blur-xl border-b border-[#E5E5E5]/60">
      <div className="flex items-center justify-between px-5 h-16">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F3F0EA] shrink-0 ring-1 ring-[#E5E5E5]/60">
              <Image src={logoUrl} alt="" fill className="object-cover" sizes="40px" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="heading-display text-lg text-[#171717] truncate">
              {storeName || "Toko Kami"}
            </h1>
            {storeTagline && (
              <p className="text-[10px] text-[#737373] leading-tight tracking-widest uppercase mt-0.5 truncate">
                {storeTagline}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onCartOpen}
          className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#F3F0EA]/80 hover:bg-[#E8E2D9] active:scale-95 shrink-0"
          aria-label={`Buka keranjang belanja${totalQty > 0 ? `, ${totalQty} item` : ""}`}
        >
          <ShoppingBag className="w-5 h-5 text-brand" strokeWidth={1.5} />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-[#FAFAF8]">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
