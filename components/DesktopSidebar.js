"use client";

import { MapPin, Instagram, WhatsAppIcon } from "./icons";

export default function DesktopSidebar({
  store,
  categories,
  activeCategory,
  onCategoryChange,
  totalQty,
  onCartOpen,
}) {
  const waNumber = store?.whatsappNumber || "6281234567890";
  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, "")}`;
  const instagramUrl = store?.instagramUrl || "https://instagram.com/naramodest";

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

      {/* Cart button desktop */}
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
      <div className="mb-6">
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

      {/* Divider */}
      <div className="border-t border-[#E5E5E5] mb-6" />

      {/* Store info */}
      <div className="flex flex-col gap-3">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-xs text-[#737373] hover:text-[#8B5E3C] transition-colors"
        >
          <Instagram className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">@naramodest</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-xs text-[#737373] hover:text-[#25D366] transition-colors"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">WhatsApp Admin</span>
        </a>

        <div className="flex items-center gap-2.5 text-xs text-[#737373]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{store?.address || "Sampit, Indonesia"}</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-auto pt-6">
        <p className="text-[10px] text-[#A8A29E]">
          © {new Date().getFullYear()} {store?.storeName || "Nara Modest"}
        </p>
      </div>
    </aside>
  );
}
