"use client";

export default function SearchBar({ value, onChange, placeholder = "Cari produk..." }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E] text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[var(--brand)] text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F3F0EA] hover:bg-[#E8E2D9] text-[#737373] text-xs flex items-center justify-center transition-colors"
          aria-label="Hapus pencarian"
        >
          ✕
        </button>
      )}
    </div>
  );
}
