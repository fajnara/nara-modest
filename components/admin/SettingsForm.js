"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import ThemePresetPicker from "./ThemePresetPicker";

const FIELDS = [
  { name: "storeName",         label: "Nama Toko",            placeholder: "Nara Modest" },
  { name: "storeTagline",      label: "Tagline",              placeholder: "Modest Wear Catalog" },
  { name: "whatsappNumber",    label: "Nomor WhatsApp",       placeholder: "628xxx (tanpa + atau spasi)", help: "Format wajib 62xxxxxxxxxx. Contoh: 6281234567890" },
  { name: "instagramUsername", label: "Username Instagram",   placeholder: "naramodest (tanpa @)" },
  { name: "instagramUrl",      label: "URL Instagram",        placeholder: "https://instagram.com/naramodest" },
  { name: "address",           label: "Alamat / Lokasi",      placeholder: "Sampit, Indonesia" },
  { name: "heroTitle",         label: "Judul Hero Banner",    placeholder: "Elegan Setiap Hari" },
  { name: "heroCtaText",       label: "Teks Tombol Hero",     placeholder: "Lihat Koleksi" },
  { name: "promoText",         label: "Teks Promo (kecil)",   placeholder: "Koleksi baru minggu ini sudah tersedia." },
  { name: "seoTitle",          label: "SEO Title (Google)",   placeholder: "Kosongkan untuk pakai Nama Toko" },
];

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export default function SettingsForm({ settings, action }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || "#8B5E3C");
  const [logo, setLogo] = useState(settings.logo || null);
  const [heroImage, setHeroImage] = useState(settings.heroImage || null);

  const isColorValid = HEX_REGEX.test(primaryColor);

  async function handleSubmit(e) {
    e.preventDefault();

    if (primaryColor && !isColorValid) {
      setError("Warna utama harus format hex. Contoh: #8B5E3C");
      return;
    }

    setLoading(true); setError(""); setSaved(false);

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.logo = logo; // attach uploaded logo ref
    data.heroImage = heroImage; // attach uploaded hero image ref

    const result = await action(data);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Logo upload */}
      <div className="max-w-[200px]">
        <ImageUploader
          label="Logo Toko"
          value={logo}
          onChange={setLogo}
        />
        <p className="text-[10px] text-[#A8A29E] mt-1">
          Logo tampil di header, sidebar, dan jadi preview saat link di-share.
        </p>
      </div>

      {/* Hero image upload */}
      <div className="max-w-[300px]">
        <ImageUploader
          label="Foto Hero Banner"
          value={heroImage}
          onChange={setHeroImage}
          aspectRatio="wide"
        />
        <p className="text-[10px] text-[#A8A29E] mt-1">
          Foto editorial untuk hero. Opsional — kalau kosong pakai gradient saja.
        </p>
      </div>

      {FIELDS.map((f) => (
        <div key={f.name}>
          <label className="block text-xs font-semibold text-[#171717] mb-1.5">{f.label}</label>
          <input name={f.name} defaultValue={settings[f.name] || ""} placeholder={f.placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-[#FAFAF8]" />
          {f.help && <p className="text-[10px] text-[#A8A29E] mt-1">{f.help}</p>}
        </div>
      ))}

      {/* Primary Color — preset picker + custom */}
      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-2">
          Warna Utama
        </label>
        <input type="hidden" name="primaryColor" value={primaryColor} />
        <ThemePresetPicker
          value={primaryColor}
          onChange={setPrimaryColor}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Subjudul Hero Banner</label>
        <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle || ""} rows={3}
          placeholder="Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-[#FAFAF8] resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">SEO Description</label>
        <textarea name="seoDescription" defaultValue={settings.seoDescription || ""} rows={2}
          placeholder="Deskripsi singkat untuk Google & media sosial."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-[#FAFAF8] resize-none" />
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      {saved && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">✓ Perubahan disimpan</p>}

      <button type="submit" disabled={loading}
        className="px-6 py-2.5 rounded-xl btn-brand text-sm font-semibold disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
