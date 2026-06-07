"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import { ShoppingBag } from "./icons";

export default function Header({ storeName, storeTagline, logo, totalQty, onCartOpen }) {
  const logoUrl = logo ? getImageUrl(logo, 96, 96) : null;

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F3F0EA] shrink-0">
              <Image src={logoUrl} alt="" fill className="object-cover" sizes="40px" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#171717] leading-tight tracking-tight truncate">
              {storeName || "Toko Kami"}
            </h1>
            {storeTagline && (
              <p className="text-[10px] text-[#737373] leading-tight mt-0.5 truncate">
                {storeTagline}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onCartOpen}
          className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#F3F0EA] hover:bg-[#E8E2D9] transition-colors shrink-0"
          aria-label={`Buka keranjang belanja${totalQty > 0 ? `, ${totalQty} item` : ""}`}
        >
          <ShoppingBag className="w-5 h-5 text-brand" />
          {totalQty > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
