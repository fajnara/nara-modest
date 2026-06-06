"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",       icon: "⊞" },
  { href: "/admin/products",   label: "Produk",          icon: "📦" },
  { href: "/admin/categories", label: "Kategori",        icon: "🏷️"  },
  { href: "/admin/settings",   label: "Pengaturan Toko", icon: "⚙️"  },
  { href: "/admin/users",      label: "Users",           icon: "👤" },
];

export default function AdminNav({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-[#E5E5E5] min-h-screen sticky top-0 h-screen">
        <div className="p-5 border-b border-[#E5E5E5]">
          <p className="font-bold text-[#171717] text-sm">Nara Modest</p>
          <p className="text-[10px] text-[#737373] mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-[#F3F0EA] text-[#8B5E3C] font-semibold"
                    : "text-[#737373] hover:bg-[#F5F5F4] hover:text-[#171717]"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E5E5]">
          <p className="text-xs font-semibold text-[#171717] truncate">{user?.name}</p>
          <p className="text-[10px] text-[#737373] truncate mb-2">{user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full text-left text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5] px-4 h-14 flex items-center justify-between">
        <p className="font-bold text-sm text-[#171717]">Admin Panel</p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F4]"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <nav className="relative bg-white w-56 h-full p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-[#F3F0EA] text-[#8B5E3C] font-semibold"
                      : "text-[#737373] hover:bg-[#F5F5F4]"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-3 border-t border-[#E5E5E5]">
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="text-xs text-red-500 px-3"
              >
                Keluar
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
