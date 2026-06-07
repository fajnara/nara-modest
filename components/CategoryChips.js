"use client";

export default function CategoryChips({ categories, activeCategory, onCategoryChange }) {
  const allChip = { _id: "all", title: "Semua", slug: "all" };
  const chips = [allChip, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {chips.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat._id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`
              flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150
              ${isActive
                ? "btn-brand shadow-sm"
                : "bg-white text-[#737373] border border-[#E5E5E5] hover:border-[var(--brand)] hover:text-brand"
              }
            `}
          >
            {cat.title}
          </button>
        );
      })}
    </div>
  );
}
