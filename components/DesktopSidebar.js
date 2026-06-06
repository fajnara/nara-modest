"use client";

export default function DesktopSidebar({
  store,
  categories,
  activeCategory,
  onCategoryChange,
  totalQty,
  onCartOpen,
}) {
  return (
    <aside className="hidden md:flex flex-col w-[260px] xl:w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#E5E5E5] bg-[#FAFAF8] py-6 px-6">
      {/* Brand */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#171717] leading-tight">
          {store?.storeName || "Nara Modest"}
        </h1>
        <p className="text-xs text-[#737373] mt-0.5">
          {store?.storeTagline || "Modest Wear Catalog"}
        </p>
      </div>

      {/* Cart button */}
      <button
        onClick={onCartOpen}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors mb-6"
      >
        <span>Keranjang</span>
        {totalQty > 0 && (
          <span className="bg-white text-[#8B5E3C] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
                    ? "bg-[#F3F0EA] text-[#8B5E3C] font-semibold"
                    : "text-[#737373] hover:bg-[#F3F0EA] hover:text-[#171717]"
                  }
                `}
              >
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B5E3C] mr-2 align-middle" />
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
          © {new Date().getFullYear()} {store?.storeName || "Nara Modest"}
        </p>
      </div>
    </aside>
  );
}
