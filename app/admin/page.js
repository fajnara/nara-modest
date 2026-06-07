import { adminClient } from "@/lib/sanity-admin";
import Link from "next/link";
import { checkStoreReadiness } from "@/lib/storeReadiness";

async function getStats() {
  const [products, categories, store] = await Promise.all([
    adminClient.fetch(`count(*[_type == "product"])`),
    adminClient.fetch(`count(*[_type == "category"])`),
    adminClient.fetch(`*[_type == "storeSettings"][0]{
      storeName, whatsappNumber, logo, primaryColor, heroTitle
    }`),
  ]);
  return { products, categories, store: store || {} };
}

export default async function AdminDashboard() {
  const { products, categories, store } = await getStats();

  const issues = checkStoreReadiness({
    store,
    productCount: products,
    categoryCount: categories,
  });

  const criticalIssues = issues.filter((i) => i.level !== "warning");
  const isReady = criticalIssues.length === 0;

  const stats = [
    { label: "Total Produk",   value: products,   href: "/admin/products" },
    { label: "Kategori",       value: categories, href: "/admin/categories" },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Dashboard</h1>
        <p className="text-sm text-[#737373] mt-1">
          Selamat datang di admin panel {store.storeName || "toko kamu"}
        </p>
      </div>

      {/* Readiness checklist */}
      {issues.length > 0 ? (
        <div className={`rounded-2xl p-5 mb-6 border ${
          isReady
            ? "bg-amber-50 border-amber-200"
            : "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl leading-none">
              {isReady ? "⚠️" : "🚧"}
            </span>
            <div>
              <p className="text-sm font-bold text-[#171717]">
                {isReady
                  ? "Toko hampir siap"
                  : "Toko belum siap dipublish"}
              </p>
              <p className="text-xs text-[#737373] mt-0.5">
                {isReady
                  ? "Beberapa hal opsional masih bisa diisi:"
                  : `${criticalIssues.length} hal wajib diselesaikan dulu:`}
              </p>
            </div>
          </div>
          <ul className="space-y-1.5 ml-9">
            {issues.map((issue) => (
              <li key={issue.key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#171717] flex items-center gap-2">
                  <span className={issue.level === "warning" ? "text-amber-500" : "text-red-500"}>
                    {issue.level === "warning" ? "○" : "✕"}
                  </span>
                  {issue.label}
                </span>
                <Link href={issue.fix} className="text-[10px] text-brand font-semibold hover:underline whitespace-nowrap">
                  Perbaiki →
                </Link>
              </li>
            ))}
          </ul>
          {!isReady && (
            <Link
              href="/admin/setup"
              className="inline-flex items-center gap-1 mt-4 ml-9 px-3 py-1.5 rounded-lg bg-[#8B5E3C] text-white text-xs font-semibold hover:bg-[#5C3A24] transition-colors"
            >
              Mulai Setup Wizard →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none">✓</span>
            <div>
              <p className="text-sm font-bold text-[#171717]">Toko sudah siap dipublish!</p>
              <p className="text-xs text-[#737373] mt-0.5">
                Semua hal wajib sudah lengkap. Yuk mulai jualan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:shadow-sm transition-shadow">
            <p className="text-sm text-[#737373] mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-[#171717]">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-widest mb-3">
          Aksi Cepat
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-medium hover:bg-[#5C3A24] transition-colors">
            + Tambah Produk Baru
          </Link>
          <Link href="/admin/settings"
            className="px-4 py-2.5 rounded-xl bg-[#F5F5F4] text-[#171717] text-sm font-medium hover:bg-[#E5E5E5] transition-colors">
            Edit Pengaturan Toko
          </Link>
          <Link href="/" target="_blank"
            className="px-4 py-2.5 rounded-xl bg-[#F5F5F4] text-[#171717] text-sm font-medium hover:bg-[#E5E5E5] transition-colors">
            Lihat Website ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
