"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Cari produk..." }) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none"
        strokeWidth={1.75}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F3F0EA] hover:bg-[#E8E2D9] text-[#737373] flex items-center justify-center"
          aria-label="Hapus pencarian"
        >
          <X className="w-3 h-3" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
