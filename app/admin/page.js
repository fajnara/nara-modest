import { adminClient } from "@/lib/sanity-admin";
import Link from "next/link";

async function getStats() {
  const [products, categories, settings] = await Promise.all([
    adminClient.fetch(`count(*[_type == "product"])`),
    adminClient.fetch(`count(*[_type == "category"])`),
    adminClient.fetch(`*[_type == "storeSettings"][0]{ storeName, whatsappNumber }`),
  ]);
  return { products, categories, settings };
}

export default async function AdminDashboard() {
  const { products, categories, settings } = await getStats();

  const stats = [
    { label: "Total Produk",   value: products,   href: "/admin/products",   color: "bg-[#F3F0EA] text-[#8B5E3C]" },
    { label: "Kategori",       value: categories, href: "/admin/categories",  color: "bg-blue-50 text-blue-600" },
  ];

  const quickLinks = [
    { label: "Tambah Produk Baru", href: "/admin/products/new",   cta: true },
    { label: "Edit Pengaturan Toko", href: "/admin/settings",     cta: false },
    { label: "Lihat Website",       href: "/",                    cta: false, external: true },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#171717]">Dashboard</h1>
        <p className="text-sm text-[#737373] mt-1">
          Selamat datang di admin panel {settings?.storeName || "Nara Modest"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-[#737373] mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-[#171717]">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-widest mb-3">
          Aksi Cepat
        </p>
        <div className="flex flex-col gap-2">
          {quickLinks.map((l) => (
            <Link key={l.label} href={l.href}
              target={l.external ? "_blank" : undefined}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                l.cta
                  ? "bg-[#8B5E3C] text-white hover:bg-[#5C3A24]"
                  : "bg-[#F5F5F4] text-[#171717] hover:bg-[#E5E5E5]"
              }`}>
              {l.label} {l.external && "↗"}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
