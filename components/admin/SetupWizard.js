"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateStoreSettings } from "@/actions/admin";
import ImageUploader from "./ImageUploader";
import ThemePresetPicker from "./ThemePresetPicker";

const STEPS = [
  { id: 1, title: "Nama Toko",     desc: "Identitas dasar toko kamu" },
  { id: 2, title: "Logo & Foto",   desc: "Tampilan visual brand" },
  { id: 3, title: "Kontak",        desc: "Nomor WhatsApp dan sosial media" },
  { id: 4, title: "Warna Brand",   desc: "Pilih warna utama toko" },
  { id: 5, title: "Selesai!",      desc: "Toko siap menerima pesanan" },
];

export default function SetupWizard({ initialStore, initialCategoryCount, initialProductCount }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    storeName:        initialStore.storeName || "",
    storeTagline:     initialStore.storeTagline || "",
    logo:             initialStore.logo || null,
    whatsappNumber:   initialStore.whatsappNumber || "",
    instagramUsername:initialStore.instagramUsername || "",
    instagramUrl:     initialStore.instagramUrl || "",
    address:          initialStore.address || "",
    primaryColor:     initialStore.primaryColor || "#8B5E3C",
    heroTitle:        initialStore.heroTitle || "",
    heroSubtitle:     initialStore.heroSubtitle || "",
    promoText:        initialStore.promoText || "",
    heroImage:        initialStore.heroImage || null,
    heroCtaText:      initialStore.heroCtaText || "",
    seoTitle:         initialStore.seoTitle || "",
    seoDescription:   initialStore.seoDescription || "",
  });

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function saveAndContinue() {
    setSaving(true);
    setError("");
    try {
      await updateStoreSettings(data);
      setStep((s) => s + 1);
      router.refresh();
    } catch (err) {
      setError(err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  function validateStep() {
    if (step === 1) {
      if (!data.storeName.trim()) return "Nama toko wajib diisi";
    }
    if (step === 3) {
      const wa = data.whatsappNumber.replace(/\D/g, "");
      if (!/^62\d{9,13}$/.test(wa)) {
        return "Nomor WhatsApp harus format 62xxxxxxxxxx (tanpa + atau spasi)";
      }
    }
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    saveAndContinue();
  }

  function handlePrev() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="text-xs text-[#737373] hover:text-[#8B5E3C]">
          ← Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-[#171717] mt-2">Setup Wizard</h1>
        <p className="text-sm text-[#737373] mt-0.5">
          Bantu kami siapkan toko kamu dalam 5 langkah singkat.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s.id < step
                    ? "bg-green-500 text-white"
                    : s.id === step
                    ? "bg-[#8B5E3C] text-white ring-4 ring-[#F3F0EA]"
                    : "bg-[#E5E5E5] text-[#A8A29E]"
                }`}
              >
                {s.id < step ? "✓" : s.id}
              </div>
              <span className="text-[10px] text-[#737373] mt-1 text-center hidden sm:block">
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8B5E3C] transition-all duration-300"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-6">
        <h2 className="text-lg font-bold text-[#171717] mb-1">{STEPS[step - 1].title}</h2>
        <p className="text-sm text-[#737373] mb-5">{STEPS[step - 1].desc}</p>

        {/* ── STEP 1: Nama Toko ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <input value={data.storeName} onChange={(e) => update("storeName", e.target.value)}
                placeholder="Contoh: Nara Modest"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Tagline</label>
              <input value={data.storeTagline} onChange={(e) => update("storeTagline", e.target.value)}
                placeholder="Contoh: Modest Wear Catalog"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
              <p className="text-[10px] text-[#A8A29E] mt-1">
                Kalimat singkat di bawah nama toko. Bisa dikosongkan.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Judul Hero Banner</label>
              <input value={data.heroTitle} onChange={(e) => update("heroTitle", e.target.value)}
                placeholder="Contoh: Elegan Setiap Hari"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Subjudul Hero Banner</label>
              <textarea value={data.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} rows={2}
                placeholder="Contoh: Belanja koleksi terbaru langsung via WhatsApp."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Teks Tombol Hero</label>
              <input value={data.heroCtaText} onChange={(e) => update("heroCtaText", e.target.value)}
                placeholder="Contoh: Lihat Koleksi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
          </div>
        )}

        {/* ── STEP 2: Logo ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="max-w-[200px]">
              <ImageUploader
                label="Logo Toko"
                value={data.logo}
                onChange={(v) => update("logo", v)}
              />
              <p className="text-[10px] text-[#A8A29E] mt-1">
                Logo tampil di header, sidebar, dan jadi preview saat link di-share.
              </p>
            </div>
            <div className="max-w-[300px]">
              <ImageUploader
                label="Foto Hero Banner"
                value={data.heroImage}
                onChange={(v) => update("heroImage", v)}
                aspectRatio="wide"
              />
              <p className="text-[10px] text-[#A8A29E] mt-1">
                Foto editorial untuk hero. Opsional — kalau kosong pakai gradient.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3: Kontak ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input value={data.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
              <p className="text-[10px] text-[#A8A29E] mt-1">
                Format: 62xxxxxxxxxx (tanpa + atau spasi). Pesanan akan masuk ke nomor ini.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Username Instagram</label>
              <input value={data.instagramUsername} onChange={(e) => update("instagramUsername", e.target.value)}
                placeholder="naramodest (tanpa @)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">URL Instagram</label>
              <input value={data.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/naramodest"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">Alamat / Lokasi</label>
              <input value={data.address} onChange={(e) => update("address", e.target.value)}
                placeholder="Contoh: Sampit, Indonesia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
            </div>
          </div>
        )}

        {/* ── STEP 4: Warna ── */}
        {step === 4 && (
          <ThemePresetPicker
            value={data.primaryColor}
            onChange={(v) => update("primaryColor", v)}
          />
        )}

        {/* ── STEP 5: Selesai ── */}
        {step === 5 && (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-[#171717] mb-2">Toko kamu siap!</h3>
            <p className="text-sm text-[#737373] mb-6 max-w-md mx-auto">
              Setup awal selesai. Sekarang waktunya tambah kategori, produk, dan mulai jualan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
              <Link href="/admin/categories"
                className="px-4 py-3 rounded-xl bg-[#F5F5F4] text-[#171717] text-sm font-semibold hover:bg-[#E5E5E5] transition-colors">
                {initialCategoryCount > 0 ? "Edit Kategori" : "Tambah Kategori"}
              </Link>
              <Link href="/admin/products/new"
                className="px-4 py-3 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors">
                + Tambah Produk
              </Link>
              <Link href="/admin"
                className="sm:col-span-2 px-4 py-2.5 rounded-xl text-[#737373] text-sm font-medium hover:text-[#171717] transition-colors">
                Kembali ke Dashboard →
              </Link>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1 || saving}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-[#737373] text-sm font-medium hover:border-[#8B5E3C] hover:text-[#171717] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Lanjut →"}
          </button>
        </div>
      )}
    </div>
  );
}
