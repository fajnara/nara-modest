"use client";

import { useState, useTransition } from "react";
import { User, Lock, Shield, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { updateOwnPassword } from "@/actions/admin";

export default function AccountForm({ user }) {
  const [isPending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok dengan password baru");
      return;
    }

    startTransition(async () => {
      try {
        await updateOwnPassword({ currentPassword, newPassword });
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 4000);
      } catch (err) {
        setError(err.message || "Gagal mengganti password");
      }
    });
  }

  const isSuperadmin = user?.role === "superadmin";

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isSuperadmin ? "bg-[var(--brand)]/10 text-brand" : "bg-[#F5F5F4] text-[#737373]"
          }`}>
            {isSuperadmin
              ? <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
              : <Shield className="w-5 h-5" strokeWidth={1.75} />
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-[#171717] truncate">{user?.name}</p>
            <p className="text-xs text-[#737373] truncate">{user?.email}</p>
            <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              isSuperadmin ? "bg-[var(--brand)]/10 text-brand" : "bg-[#F5F5F4] text-[#737373]"
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-[#A8A29E] mt-4 pt-4 border-t border-[#E5E5E5]">
          Untuk ubah nama atau email,{" "}
          {isSuperadmin
            ? "edit dari menu Users"
            : "minta superadmin untuk mengubahnya"}
          .
        </p>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-brand" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-[#171717]">Ganti Password</h2>
        </div>
        <p className="text-xs text-[#737373] mb-4">
          Untuk keamanan, masukkan password lama lalu password baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-1.5">
              Password Lama
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand focus:ring-2 focus:ring-[var(--brand)]/10 text-sm outline-none bg-[#FAFAF8]"
            />
            <p className="text-[10px] text-[#A8A29E] mt-1.5 leading-relaxed">
              Min 10 karakter, harus ada huruf & angka, tidak boleh sama dengan email.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-1.5">
              Konfirmasi Password Baru
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
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              {error}
            </div>
          )}

          {success && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              Password berhasil diubah!
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
            className="w-full mt-2 py-2.5 rounded-xl btn-brand text-sm font-semibold disabled:opacity-50"
          >
            {isPending ? "Mengubah..." : "Ubah Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
