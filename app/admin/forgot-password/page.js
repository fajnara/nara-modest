"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "@/actions/password-reset";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E5E5] p-8 animate-fade-in text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5 mx-auto">
            <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={1.75} />
          </div>
          <h1 className="heading-display text-xl text-[#171717] mb-2">Email Terkirim</h1>
          <p className="text-sm text-[#737373] leading-relaxed mb-6">
            Kalau email tersebut terdaftar sebagai admin, kami sudah mengirim link reset password ke{" "}
            <strong className="text-[#171717]">{email}</strong>.
            Link berlaku 30 menit. Cek inbox (dan folder spam) ya.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold hover:underline"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2.5} />
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E5E5] p-8 animate-fade-in">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center mb-4">
            <Mail className="w-5 h-5 text-brand" strokeWidth={1.75} />
          </div>
          <h1 className="heading-display text-2xl text-[#171717]">Reset Password</h1>
          <p className="text-xs text-[#737373] mt-2 leading-relaxed max-w-[260px]">
            Masukkan email akun admin kamu. Kami akan kirim link untuk membuat password baru.
          </p>
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
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8] transition-all"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-brand font-semibold text-sm disabled:opacity-50 active:scale-[0.98] shadow-sm"
          >
            {loading ? "Mengirim email..." : "Kirim Link Reset"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-brand"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2.5} />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
