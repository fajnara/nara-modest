"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/upload";
import { getImageUrl } from "@/lib/image";

/**
 * Drag-and-drop image uploader for admin panel.
 *
 * Props:
 *   - value: existing image ref { _type, asset } or null
 *   - onChange: (newRef | null) => void — receives Sanity image reference
 *   - label: optional field label
 *   - aspectRatio: "square" | "wide" — preview shape (default: square)
 */
export default function ImageUploader({ value, onChange, label, aspectRatio = "square" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const previewUrl = value ? getImageUrl(value, 400, 400) : null;
  const aspectClass = aspectRatio === "wide" ? "aspect-video" : "aspect-square";

  async function handleFile(file) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const ref = await uploadImage(formData);
      onChange(ref);
    } catch (err) {
      setError(err.message || "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleRemove() {
    onChange(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">{label}</label>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative ${aspectClass} rounded-2xl border-2 border-dashed
          flex items-center justify-center overflow-hidden bg-[#FAFAF8]
          transition-colors
          ${dragOver ? "border-[#8B5E3C] bg-[#F3F0EA]" : "border-[#E5E5E5]"}
          ${previewUrl ? "border-solid" : ""}
        `}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              sizes="400px"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-[#171717] text-xs font-semibold hover:bg-[#F5F5F4]"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#737373]">Mengunggah...</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-4 py-6 w-full h-full hover:bg-[#F3F0EA] transition-colors"
          >
            <div className="text-3xl">📷</div>
            <p className="text-sm font-medium text-[#171717]">Klik atau drag foto ke sini</p>
            <p className="text-[10px] text-[#A8A29E]">JPG, PNG, WEBP — Maks 5 MB</p>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}
