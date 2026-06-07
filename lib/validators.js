/**
 * Server-side validators for admin actions.
 * Each function throws Error with a user-readable message on invalid input.
 */

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const WA_REGEX  = /^62\d{9,13}$/;

export function validateProductInput(data, { requireImage = true } = {}) {
  if (!data?.name?.trim()) throw new Error("Nama produk wajib diisi");
  if (data.name.length > 200) throw new Error("Nama produk maksimal 200 karakter");

  const price = Number(data.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Harga harus angka >= 0");
  }

  if (data.discountPrice !== undefined && data.discountPrice !== "" && data.discountPrice !== null) {
    const dp = Number(data.discountPrice);
    if (!Number.isFinite(dp) || dp < 0) throw new Error("Harga diskon harus angka >= 0");
    if (dp >= price) throw new Error("Harga diskon harus lebih kecil dari harga normal");
  }

  if (requireImage && !data.image) {
    throw new Error("Foto utama wajib diupload");
  }

  if (data.colors && !Array.isArray(data.colors)) {
    throw new Error("Format warna tidak valid");
  }
  if (Array.isArray(data.colors) && data.colors.length > 20) {
    throw new Error("Maksimal 20 pilihan warna");
  }

  if (data.sizes && !Array.isArray(data.sizes)) {
    throw new Error("Format ukuran tidak valid");
  }
  if (Array.isArray(data.sizes) && data.sizes.length > 20) {
    throw new Error("Maksimal 20 pilihan ukuran");
  }

  if (Array.isArray(data.gallery) && data.gallery.length > 6) {
    throw new Error("Maksimal 6 foto galeri");
  }

  if (data.sortOrder !== undefined && data.sortOrder !== "" && data.sortOrder !== null) {
    const so = Number(data.sortOrder);
    if (!Number.isFinite(so) || so < 0) throw new Error("Urutan tampil harus angka >= 0");
  }
}

export function validateCategoryInput(data) {
  if (!data?.title?.trim()) throw new Error("Nama kategori wajib diisi");
  if (data.title.length > 100) throw new Error("Nama kategori maksimal 100 karakter");

  if (data.order !== undefined && data.order !== "" && data.order !== null) {
    const o = Number(data.order);
    if (!Number.isFinite(o) || o < 0) throw new Error("Urutan harus angka >= 0");
  }
}

export function validateStoreSettings(data) {
  if (!data?.storeName?.trim()) {
    throw new Error("Nama toko wajib diisi");
  }
  if (data.storeName.length > 100) {
    throw new Error("Nama toko maksimal 100 karakter");
  }

  if (data.whatsappNumber) {
    const wa = String(data.whatsappNumber).replace(/\D/g, "");
    if (!WA_REGEX.test(wa)) {
      throw new Error("Nomor WhatsApp harus format 62xxxxxxxxxx");
    }
  }

  if (data.primaryColor && !HEX_REGEX.test(data.primaryColor)) {
    throw new Error("Warna utama harus format hex (contoh: #8B5E3C)");
  }
}

/**
 * Strict password rules:
 * - Min 10 characters
 * - Must contain at least one letter
 * - Must contain at least one number
 * - Cannot be equal to the email (case-insensitive)
 */
export function validatePassword(password, email) {
  if (!password) throw new Error("Password wajib diisi");
  if (password.length < 10) throw new Error("Password minimal 10 karakter");
  if (!/[a-zA-Z]/.test(password)) throw new Error("Password harus mengandung huruf");
  if (!/\d/.test(password)) throw new Error("Password harus mengandung angka");

  if (email && password.trim().toLowerCase() === String(email).trim().toLowerCase()) {
    throw new Error("Password tidak boleh sama dengan email");
  }
}

export function validateAdminUserInput(data, { requirePassword = false } = {}) {
  if (!data?.name?.trim()) throw new Error("Nama wajib diisi");
  if (!data?.email?.trim()) throw new Error("Email wajib diisi");

  const email = String(data.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Format email tidak valid");
  }

  if (requirePassword) {
    validatePassword(data.password, email);
  } else if (data.password) {
    validatePassword(data.password, email);
  }

  if (data.role && !["admin", "superadmin"].includes(data.role)) {
    throw new Error("Role tidak valid");
  }
}
