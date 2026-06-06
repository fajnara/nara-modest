"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      setError("Email atau password salah.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#171717]">Nara Modest</h1>
          <p className="text-sm text-[#737373] mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@naramodest.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none bg-[#FAFAF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none bg-[#FAFAF8]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#8B5E3C] text-white font-semibold text-sm hover:bg-[#5C3A24] transition-colors disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
