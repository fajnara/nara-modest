"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";

export default function ProductForm({ product, categories, action }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Controlled state for image fields (managed outside form data)
  const [mainImage, setMainImage] = useState(product?.image || null);
  const [gallery, setGallery] = useState(product?.gallery || []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const parseList = (str) =>
      (str || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (!mainImage) {
      setError("Foto utama wajib diisi");
      setLoading(false);
      return;
    }

    const data = {
      name: formData.get("name"),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice"),
      description: formData.get("description"),
      material: formData.get("material"),
      colors: parseList(formData.get("colors")),
      sizes: parseList(formData.get("sizes")),
      isAvailable: formData.get("isAvailable") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      sortOrder: formData.get("sortOrder"),
      image: mainImage,
      gallery: gallery,
    };

    try {
      if (product) {
        await action(product._id, data);
      } else {
        await action(data);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {/* Main Image */}
      <ImageUploader
        label="Foto Utama *"
        value={mainImage}
        onChange={setMainImage}
      />

      {/* Gallery */}
      <GalleryUploader
        label="Galeri Foto Tambahan"
        value={gallery}
        onChange={setGallery}
        max={6}
      />

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input name="name" defaultValue={product?.name} required
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Kategori</label>
        <select name="categoryId" defaultValue={product?.category?._ref || product?.category?._id || ""}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white">
          <option value="">— Tanpa Kategori —</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1.5">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input name="price" type="number" defaultValue={product?.price} required min="0"
            placeholder="75000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1.5">Harga Diskon (Rp)</label>
          <input name="discountPrice" type="number" defaultValue={product?.discountPrice ?? ""} min="0"
            placeholder="Opsional"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Deskripsi</label>
        <textarea name="description" defaultValue={product?.description} rows={4}
          placeholder="Deskripsi produk..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Bahan / Material</label>
        <input name="material" defaultValue={product?.material || ""}
          placeholder="Contoh: Voal Premium, Crepe, Linen"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Pilihan Warna</label>
        <input name="colors" defaultValue={(product?.colors || []).join(", ")}
          placeholder="Pisahkan dengan koma. Contoh: Hitam, Putih, Cream"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
        <p className="text-[10px] text-[#A8A29E] mt-1">Kosongkan jika produk tidak punya pilihan warna.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Pilihan Ukuran</label>
        <input name="sizes" defaultValue={(product?.sizes || []).join(", ")}
          placeholder="Pisahkan dengan koma. Contoh: S, M, L, XL atau All Size"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
        <p className="text-[10px] text-[#A8A29E] mt-1">Kosongkan jika produk tidak punya pilihan ukuran.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Urutan Tampil</label>
        <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 99} min="1"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input name="isAvailable" type="checkbox"
            defaultChecked={product ? product.isAvailable : true}
            className="w-4 h-4 accent-[var(--brand)]" />
          <span className="text-sm text-[#171717]">Tersedia</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input name="isFeatured" type="checkbox"
            defaultChecked={product?.isFeatured ?? false}
            className="w-4 h-4 accent-[var(--brand)]" />
          <span className="text-sm text-[#171717]">Produk Unggulan</span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl btn-brand text-sm font-semibold disabled:opacity-50">
          {loading ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl bg-[#F5F5F4] text-[#737373] text-sm font-medium hover:bg-[#E5E5E5] transition-colors">
          Batal
        </button>
      </div>
    </form>
  );
}
