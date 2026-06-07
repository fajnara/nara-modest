/**
 * Check whether the store is "ready to publish".
 * Returns an array of issues (empty array = fully ready).
 */
export function checkStoreReadiness({ store, productCount, categoryCount }) {
  const issues = [];

  if (!store?.storeName?.trim()) {
    issues.push({
      key: "storeName",
      label: "Nama toko belum diisi",
      fix: "/admin/setup",
    });
  }

  const waNumber = (store?.whatsappNumber || "").replace(/\D/g, "");
  if (!/^62\d{9,13}$/.test(waNumber)) {
    issues.push({
      key: "whatsapp",
      label: "Nomor WhatsApp belum valid (format: 62xxx)",
      fix: "/admin/settings",
    });
  }

  if (!store?.logo) {
    issues.push({
      key: "logo",
      label: "Logo toko belum diupload",
      fix: "/admin/settings",
      level: "warning", // not critical
    });
  }

  if (!categoryCount || categoryCount === 0) {
    issues.push({
      key: "categories",
      label: "Belum ada kategori produk",
      fix: "/admin/categories",
    });
  }

  if (!productCount || productCount === 0) {
    issues.push({
      key: "products",
      label: "Belum ada produk",
      fix: "/admin/products/new",
    });
  }

  return issues;
}
