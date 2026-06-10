"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { resetPasswordWithToken } from "@/actions/password-reset";

export default function ResetPasswordForm({ token, email }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithToken({ token, email, newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch (err) {
      setError(err.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5 mx-auto">
          <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={1.75} />
        </div>
        <p className="text-base font-semibold text-[#171717] mb-1">Password Berhasil Diubah</p>
        <p className="text-xs text-[#737373] mb-5">Mengarahkan ke halaman login...</p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold hover:underline"
        >
          Login Sekarang
          <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-2">
          Password Baru
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoFocus
          autoComplete="new-password"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8]"
        />
        <p className="text-[10px] text-[#A8A29E] mt-1.5 leading-relaxed">
          Min 10 karakter, harus ada huruf & angka, tidak boleh sama dengan email.
        </p>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-2">
          Konfirmasi Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8]"
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
        disabled={loading || !newPassword || !confirmPassword}
        className="w-full py-3 rounded-xl btn-brand font-semibold text-sm disabled:opacity-50 active:scale-[0.98] shadow-sm"
      >
        {loading ? "Mengubah Password..." : "Set Password Baru"}
      </button>
    </form>
  );
}
