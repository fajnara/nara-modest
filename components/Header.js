"use client";

import { ShoppingBag } from "./icons";

export default function Header({ storeName, storeTagline, totalQty, onCartOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="flex items-center justify-between px-4 h-14">
        <div>
          <h1 className="text-base font-bold text-[#171717] leading-tight tracking-tight">
            {storeName || "Nara Modest"}
          </h1>
          {storeTagline && (
            <p className="text-[10px] text-[#737373] leading-none mt-0.5">
              {storeTagline}
            </p>
          )}
        </div>

        <button
          onClick={onCartOpen}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#F3F0EA] hover:bg-[#E8E2D9] transition-colors"
          aria-label={`Buka keranjang belanja${totalQty > 0 ? `, ${totalQty} item` : ""}`}
        >
          <ShoppingBag className="w-5 h-5 text-[#8B5E3C]" />
          {totalQty > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B5E3C] text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
