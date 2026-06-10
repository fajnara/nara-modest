"use server";

import { adminClient } from "@/lib/sanity-admin";
import { requireAdmin } from "@/lib/adminAuth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload an image File to Sanity assets.
 * Returns the Sanity image reference object on success,
 * or { error: "..." } if upload fails. NEVER throws (Next.js production
 * would redact thrown error messages).
 */
export async function uploadImage(formData) {
  try {
    await requireAdmin();

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      throw new Error("File tidak ditemukan");
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Format harus JPG, PNG, WEBP, atau GIF");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Ukuran file maksimal 10 MB (sekarang ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await adminClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    return { error: err?.message || "Upload gagal" };
  }
}
