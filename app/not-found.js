import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-[#E5E5E5] p-8 text-center shadow-sm">
        <div className="text-5xl mb-3">🛍️</div>
        <h1 className="text-xl font-bold text-[#171717] mb-1">Halaman tidak ditemukan</h1>
        <p className="text-sm text-[#737373] mb-6">
          Halaman yang kamu cari mungkin sudah dipindahkan atau dihapus.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
