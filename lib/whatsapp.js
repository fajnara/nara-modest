import { formatCurrencyShort } from "./formatCurrency";

/**
 * Generate WhatsApp order URL.
 * Throws if WhatsApp number is invalid — caller (CartDrawer) must validate first.
 */
export function generateWhatsAppUrl({ whatsappNumber, cartItems, customerName, customerNote, subtotal, storeName }) {
  const number = (whatsappNumber || "").replace(/\D/g, "");

  if (!/^62\d{9,13}$/.test(number)) {
    throw new Error("Nomor WhatsApp tidak valid. Hubungi pemilik toko untuk konfigurasi.");
  }

  const shopName = storeName || "Toko";

  const itemLines = cartItems
    .map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(", ");
      const variantSuffix = variant ? ` (${variant})` : "";
      return `📦 ${item.qty}x ${item.name}${variantSuffix} - ${formatCurrencyShort(item.price * item.qty)}`;
    })
    .join("\n");

  const noteText = customerNote?.trim() ? `\n📍 Catatan/Alamat: ${customerNote.trim()}` : "";

  const message = `Halo Admin ${shopName}, saya ingin memproses pesanan berikut:\n\n${itemLines}\n\n🧾 Subtotal: ${formatCurrencyShort(subtotal)}\n\n👤 Nama: ${customerName.trim()}${noteText}\n\nMohon info total harga beserta ongkos kirimnya ya kak. Terima kasih.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
