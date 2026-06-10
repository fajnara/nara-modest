"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, X, Terminal, UserCog } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

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
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[10px] text-brand font-semibold hover:underline"
              >
                Lupa password?
              </button>
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

      {/* Forgot password modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}

function ForgotPasswordModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] p-7 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#737373]"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="mb-5 pr-8">
          <h2 className="heading-display text-xl text-[#171717] mb-1">Lupa Password?</h2>
          <p className="text-xs text-[#737373] leading-relaxed">
            Ada dua cara untuk reset password admin.
          </p>
        </div>

        <div className="space-y-3">
          {/* Option 1 — Ask superadmin */}
          <div className="rounded-2xl border border-[#E5E5E5] p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                <UserCog className="w-4 h-4 text-brand" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#171717]">
                  Hubungi Superadmin
                </p>
                <p className="text-xs text-[#737373] leading-relaxed mt-1">
                  Minta superadmin lain untuk reset password kamu dari menu{" "}
                  <span className="font-mono text-[11px] bg-[#F5F5F4] px-1 py-0.5 rounded">
                    /admin/users
                  </span>
                  . Cara paling cepat.
                </p>
              </div>
            </div>
          </div>

          {/* Option 2 — CLI */}
          <div className="rounded-2xl border border-[#E5E5E5] p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4 text-brand" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#171717]">
                  Reset via Terminal
                </p>
                <p className="text-xs text-[#737373] leading-relaxed mt-1 mb-2">
                  Untuk pemilik server / developer. Jalankan di terminal project:
                </p>
                <pre className="text-[11px] bg-[#171717] text-[#F3F0EA] px-3 py-2.5 rounded-lg overflow-x-auto leading-relaxed">
{`ADMIN_EMAIL=email@toko.com \\
ADMIN_PASSWORD="passwordBaru123" \\
npm run reset-password`}
                </pre>
                <p className="text-[10px] text-[#A8A29E] mt-2 leading-relaxed">
                  Password baru: min 10 karakter, ada huruf & angka, tidak sama dengan email.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#737373] text-sm font-medium"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
