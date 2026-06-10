"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error.includes("menit") || res.error.toLowerCase().includes("terlalu banyak")) {
        setError(res.error);
      } else {
        setError("Email atau password salah.");
      }
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E5E5] p-8 animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-brand" strokeWidth={1.75} />
          </div>
          <h1 className="heading-display text-2xl text-[#171717]">Admin Panel</h1>
          <p className="text-xs text-[#737373] mt-1 tracking-widest uppercase">Login Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@toko.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8] transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-semibold text-[#171717] uppercase tracking-widest">
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-[10px] text-brand font-semibold hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8] transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-brand font-semibold text-sm disabled:opacity-50 active:scale-[0.98] shadow-sm"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
