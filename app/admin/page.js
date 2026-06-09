import { adminClient } from "@/lib/sanity-admin";
import Link from "next/link";
import {
  Package,
  Tags,
  Plus,
  Settings,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Construction,
  ArrowRight,
} from "lucide-react";
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

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="heading-display text-3xl text-[#171717]">Dashboard</h1>
        <p className="text-sm text-[#737373] mt-1">
          Selamat datang kembali di admin panel {store.storeName || "toko"}
        </p>
      </div>

      {/* Readiness card */}
      {issues.length > 0 ? (
        <div className={`rounded-2xl p-6 mb-6 border ${
          isReady ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-start gap-3 mb-4">
            {isReady ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
            ) : (
              <Construction className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
            )}
            <div>
              <p className="text-sm font-bold text-[#171717]">
                {isReady ? "Toko hampir siap" : "Toko belum siap dipublish"}
              </p>
              <p className="text-xs text-[#737373] mt-0.5">
                {isReady
                  ? "Beberapa hal opsional masih bisa diisi:"
                  : `${criticalIssues.length} hal wajib diselesaikan dulu:`}
              </p>
            </div>
          </div>
          <ul className="space-y-2 ml-8">
            {issues.map((issue) => (
              <li key={issue.key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#171717] flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    issue.level === "warning" ? "bg-amber-500" : "bg-red-500"
                  }`} />
                  {issue.label}
                </span>
                <Link
                  href={issue.fix}
                  className="text-[10px] text-brand font-semibold hover:underline whitespace-nowrap flex items-center gap-1"
                >
                  Perbaiki
                  <ArrowRight className="w-3 h-3" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
          {!isReady && (
            <Link
              href="/admin/setup"
              className="inline-flex items-center gap-1.5 mt-5 ml-8 px-4 py-2 rounded-xl btn-brand text-xs font-semibold"
            >
              Mulai Setup Wizard
              <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-bold text-[#171717]">Toko sudah siap dipublish</p>
              <p className="text-xs text-[#737373] mt-0.5">
                Semua hal wajib sudah lengkap. Yuk mulai jualan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats — refined */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link
          href="/admin/products"
          className="group bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:border-[var(--brand)]/30 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <Package className="w-5 h-5 text-brand" strokeWidth={1.75} />
            <ArrowRight className="w-4 h-4 text-[#A8A29E] group-hover:text-brand group-hover:translate-x-0.5 transition" strokeWidth={1.75} />
          </div>
          <p className="text-3xl font-bold text-[#171717] tabular-nums">{products}</p>
          <p className="text-xs text-[#737373] mt-1 tracking-wide uppercase">Total Produk</p>
        </Link>

        <Link
          href="/admin/categories"
          className="group bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:border-[var(--brand)]/30 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <Tags className="w-5 h-5 text-brand" strokeWidth={1.75} />
            <ArrowRight className="w-4 h-4 text-[#A8A29E] group-hover:text-brand group-hover:translate-x-0.5 transition" strokeWidth={1.75} />
          </div>
          <p className="text-3xl font-bold text-[#171717] tabular-nums">{categories}</p>
          <p className="text-xs text-[#737373] mt-1 tracking-wide uppercase">Kategori</p>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <p className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-widest mb-3">
          Aksi Cepat
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-brand text-sm font-medium"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Tambah Produk Baru
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F4] text-[#171717] text-sm font-medium hover:bg-[#E5E5E5]"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
            Edit Pengaturan Toko
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F4] text-[#171717] text-sm font-medium hover:bg-[#E5E5E5]"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            Lihat Website
          </Link>
        </div>
      </div>
    </div>
  );
}
