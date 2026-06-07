"use server";

import { adminClient } from "@/lib/sanity-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload an image File to Sanity assets.
 * Returns the Sanity image reference object you can save to any document.
 *
 * Pattern:
 *   const ref = await uploadImage(file);
 *   await adminClient.patch(productId).set({ image: ref }).commit();
 */
export async function uploadImage(formData) {
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    throw new Error("File tidak ditemukan");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format harus JPG, PNG, WEBP, atau GIF");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file maksimal 5 MB (sekarang ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const asset = await adminClient.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  // Return the reference object Sanity expects on document fields
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}
