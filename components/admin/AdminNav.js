"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  Package,
  Tags,
  Settings,
  Users,
  UserCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const ALL_NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",       Icon: LayoutDashboard },
  { href: "/admin/setup",      label: "Setup Wizard",    Icon: Compass },
  { href: "/admin/products",   label: "Produk",          Icon: Package },
  { href: "/admin/categories", label: "Kategori",        Icon: Tags },
  { href: "/admin/settings",   label: "Pengaturan",      Icon: Settings },
  { href: "/admin/users",      label: "Users",           Icon: Users, superadminOnly: true },
  { href: "/admin/account",    label: "Akun Saya",       Icon: UserCircle },
];

export default function AdminNav({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = ALL_NAV_ITEMS.filter(
    (item) => !item.superadminOnly || user?.role === "superadmin"
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-[#E5E5E5] min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-[#E5E5E5]">
          <p className="heading-display text-lg text-[#171717]">Admin</p>
          <p className="text-[10px] text-[#737373] tracking-widest uppercase mt-1">
            Control Panel
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[var(--brand)]/10 text-brand font-semibold"
                    : "text-[#737373] hover:bg-[#FAFAF8] hover:text-[#171717]"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.75} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E5E5] space-y-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[var(--brand)]/10 text-brand text-xs font-semibold hover:bg-[var(--brand)]/15"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="flex-1">Lihat Website</span>
          </Link>

          <div className="pt-2">
            <p className="text-xs font-semibold text-[#171717] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#737373] truncate mb-2">{user?.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
            >
              <LogOut className="w-3 h-3" strokeWidth={2} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E5E5E5] px-4 h-14 flex items-center justify-between">
        <p className="heading-display text-base text-[#171717]">Admin</p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F5F5F4] hover:bg-[#E5E5E5]"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative bg-white w-64 h-full p-4 space-y-1 overflow-y-auto animate-slide-in-right shadow-2xl">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const isActive = href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    isActive
                      ? "bg-[var(--brand)]/10 text-brand font-semibold"
                      : "text-[#737373] hover:bg-[#FAFAF8]"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 mt-3 border-t border-[#E5E5E5] space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--brand)]/10 text-brand text-xs font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat Website
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center gap-1.5 text-xs text-red-500 px-3 py-2"
              >
                <LogOut className="w-3 h-3" />
                Keluar
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
