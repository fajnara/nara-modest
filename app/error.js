"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service in production (e.g., Sentry)
    // For now, only log in dev to avoid spamming production logs.
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-[#E5E5E5] p-8 text-center shadow-sm">
        <div className="text-5xl mb-3">⚠️</div>
        <h1 className="text-xl font-bold text-[#171717] mb-1">Terjadi Kesalahan</h1>
        <p className="text-sm text-[#737373] mb-6">
          Maaf, ada masalah saat memuat halaman ini.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#F5F5F4] text-[#737373] text-sm font-medium hover:bg-[#E5E5E5] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
