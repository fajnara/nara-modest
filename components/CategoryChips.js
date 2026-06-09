"use client";

export default function CategoryChips({ categories, activeCategory, onCategoryChange }) {
  const allChip = { _id: "all", title: "Semua", slug: "all" };
  const chips = [allChip, ...categories];

  return (
    <div>
      <p className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-widest mb-2.5 px-1">
        Kategori
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {chips.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide
                ${isActive
                  ? "btn-brand shadow-sm"
                  : "bg-[#F3F0EA] text-[#737373] hover:bg-[#E8E2D9] hover:text-[#171717]"
                }
              `}
            >
              {cat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
