"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import QuantityControl from "./QuantityControl";
import EmptyState from "./EmptyState";

// WhatsApp brand icon (lucide doesn't ship WhatsApp; inline SVG for consistency)
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  subtotal,
  onIncrease,
  onDecrease,
  onRemove,
  onClearCart,
  store,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [nameError, setNameError] = useState("");

  const waNumber = (store?.whatsappNumber || "").replace(/\D/g, "");
  const isWaValid = /^62\d{9,13}$/.test(waNumber);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleOrder() {
    if (!isWaValid) return;
    if (!customerName.trim()) {
      setNameError("Nama wajib diisi sebelum pesan");
      return;
    }
    if (cart.length === 0) return;

    setNameError("");
    try {
      const url = generateWhatsAppUrl({
        whatsappNumber: store?.whatsappNumber,
        cartItems: cart,
        customerName,
        customerNote,
        subtotal,
        storeName: store?.storeName,
      });
      window.open(url, "_blank", "noopener,noreferrer");
      onClearCart();
      setCustomerName("");
      setCustomerNote("");
      onClose();
    } catch (err) {
      setNameError(err.message || "Gagal membuat pesanan");
    }
  }

  const isEmpty = cart.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-center md:justify-end animate-fade-in">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`
          relative w-full max-w-[480px] bg-[#FAFAF8] flex flex-col shadow-2xl
          rounded-t-3xl max-h-[88vh] animate-slide-up
          md:rounded-none md:rounded-l-3xl md:max-h-none md:h-full md:max-w-[440px]
          md:animate-slide-in-right
        `}
      >
        {/* Header */}
        <div className="px-6 pt-4 pb-4 border-b border-[#E5E5E5] flex-shrink-0">
          <div className="w-10 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-4 md:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="heading-display text-lg text-[#171717]">Keranjang</h2>
                {!isEmpty && (
                  <p className="text-[10px] text-[#737373] tracking-widest uppercase">
                    {cart.reduce((s, i) => s + i.qty, 0)} item dipilih
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F3F0EA] hover:bg-[#E8E2D9]"
              aria-label="Tutup keranjang"
            >
              <X className="w-4 h-4 text-[#737373]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <EmptyState
              title="Keranjang masih kosong"
              description="Mulai pilih produk favoritmu, lalu pesan langsung via WhatsApp."
              icon={<ShoppingCart className="w-7 h-7" strokeWidth={1.5} />}
              action={
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl btn-brand text-sm font-semibold"
                >
                  Mulai Belanja
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cart.map((item) => (
                <CartItem
                  key={item.cartKey || item.id}
                  item={item}
                  onIncrease={() => onIncrease(item.cartKey || item.id)}
                  onDecrease={() => onDecrease(item.cartKey || item.id)}
                  onRemove={() => onRemove(item.cartKey || item.id)}
                />
              ))}

              <div className="pt-2 pb-1 space-y-4">
                <div className="border-t border-[#E5E5E5] pt-5">
                  <label
                    htmlFor="customer-name"
                    className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-2"
                  >
                    Nama Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Contoh: Sarah Aulia"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (e.target.value.trim()) setNameError("");
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none transition-all focus:ring-2 focus:ring-[var(--brand)]/10 ${
                      nameError
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E5E5E5] focus:border-[var(--brand)]"
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" strokeWidth={2} />
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-note"
                    className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-2"
                  >
                    Catatan / Alamat Singkat
                  </label>
                  <textarea
                    id="customer-note"
                    placeholder="Kec. Baamang, Sampit — atau catatan ukuran, warna, dll."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="px-5 pt-4 pb-6 border-t border-[#E5E5E5] bg-[#FAFAF8]/95 backdrop-blur flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#737373] tracking-widest uppercase">Subtotal</span>
                <span className="text-lg font-bold text-[#171717] tabular-nums">
                  {formatCurrencyShort(subtotal)}
                </span>
              </div>

              {!isWaValid && (
                <div className="px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                  Nomor admin belum dikonfigurasi.
                </div>
              )}

              <button
                onClick={handleOrder}
                disabled={isEmpty || !isWaValid}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ebe5d] active:scale-[0.98] shadow-sm"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {isWaValid ? "Pesan via WhatsApp" : "Order Belum Tersedia"}
              </button>

              <p className="text-center text-[10px] text-[#A8A29E] tracking-wide">
                Ongkos kirim dikonfirmasi admin via WhatsApp
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const imageUrl = item.image ? getImageUrl(item.image, 120, 120) : PLACEHOLDER_IMAGE;
  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E5E5E5]">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F0EA]">
        <Image
          src={displayImage}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
          unoptimized={displayImage.includes("placehold.co")}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#171717] line-clamp-1">{item.name}</p>
        {(item.color || item.size) && (
          <p className="text-[10px] text-[#737373] tracking-wide mt-0.5">
            {[item.color, item.size].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="text-xs text-brand font-bold mt-1 tabular-nums">
          {formatCurrencyShort(item.price)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <QuantityControl
            qty={item.qty}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
          <button
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500"
            aria-label={`Hapus ${item.name} dari keranjang`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
