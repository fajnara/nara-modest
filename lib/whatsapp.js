import { formatCurrencyShort } from "./formatCurrency";

const FALLBACK_WA_NUMBER = "6281234567890";

export function generateWhatsAppUrl({ whatsappNumber, cartItems, customerName, customerNote, subtotal, storeName }) {
  const number = (whatsappNumber || FALLBACK_WA_NUMBER).replace(/\D/g, "");
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
