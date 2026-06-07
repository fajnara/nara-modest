"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/upload";
import { getImageUrl } from "@/lib/image";

/**
 * Multiple image uploader. Manages an array of Sanity image references.
 *
 * Props:
 *   - value: array of image refs (or null/empty)
 *   - onChange: (newArray) => void
 *   - label: optional field label
 *   - max: maximum number of images (default 6)
 */
export default function GalleryUploader({ value, onChange, label, max = 6 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const images = Array.isArray(value) ? value : [];
  const canAddMore = images.length < max;

  async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, max - images.length);

    setError("");
    setUploading(true);

    try {
      const newRefs = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const ref = await uploadImage(formData);
        // Each gallery item needs a unique key for Sanity arrays
        newRefs.push({ ...ref, _key: crypto.randomUUID() });
      }
      onChange([...images, ...newRefs]);
    } catch (err) {
      setError(err.message || "Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">
          {label}
          <span className="text-[#A8A29E] font-normal ml-1">
            ({images.length}/{max})
          </span>
        </label>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, i) => {
          const url = getImageUrl(img, 200, 200);
          return (
            <div key={img._key || i} className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F3F0EA]">
              {url && (
                <Image src={url} alt={`Galeri ${i + 1}`} fill className="object-cover" sizes="200px" />
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white text-xs flex items-center justify-center transition-colors"
                aria-label={`Hapus foto galeri ${i + 1}`}
              >
                ✕
              </button>
            </div>
          );
        })}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-[#E5E5E5] hover:border-[#8B5E3C] hover:bg-[#F3F0EA] flex flex-col items-center justify-center gap-1 text-[#737373] hover:text-[#8B5E3C] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-2xl">+</span>
                <span className="text-[10px]">Tambah</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}
