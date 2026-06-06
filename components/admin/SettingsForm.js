"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS = [
  { name: "storeName",    label: "Nama Toko",           placeholder: "Nara Modest" },
  { name: "storeTagline", label: "Tagline",              placeholder: "Modest Wear Catalog" },
  { name: "whatsappNumber", label: "Nomor WhatsApp",     placeholder: "628xxx (tanpa + atau spasi)" },
  { name: "instagramUrl", label: "URL Instagram",        placeholder: "https://instagram.com/naramodest" },
  { name: "address",      label: "Alamat / Lokasi",      placeholder: "Sampit, Indonesia" },
  { name: "heroTitle",    label: "Judul Hero Banner",    placeholder: "Elegan Setiap Hari" },
  { name: "promoText",    label: "Teks Promo (kecil)",   placeholder: "Koleksi baru minggu ini sudah tersedia." },
];

export default function SettingsForm({ settings, action }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSaved(false);

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      await action(data);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label className="block text-xs font-semibold text-[#171717] mb-1.5">{f.label}</label>
          <input name={f.name} defaultValue={settings[f.name] || ""} placeholder={f.placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none bg-[#FAFAF8]" />
        </div>
      ))}

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Subjudul Hero Banner</label>
        <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle || ""} rows={3}
          placeholder="Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none bg-[#FAFAF8] resize-none" />
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      {saved && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">✓ Perubahan disimpan</p>}

      <button type="submit" disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
