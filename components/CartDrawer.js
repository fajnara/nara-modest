"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { formatCurrencyShort } from "@/lib/formatCurrency";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import QuantityControl from "./QuantityControl";
import EmptyState from "./EmptyState";
import { X, Trash, WhatsAppIcon } from "./icons";

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

  // Validate WhatsApp number — must be 62xxxxxxxxxx
  const waNumber = (store?.whatsappNumber || "").replace(/\D/g, "");
  const isWaValid = /^62\d{9,13}$/.test(waNumber);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleOrder() {
    if (!isWaValid) return;
    if (!customerName.trim()) {
      setNameError("Nama wajib diisi sebelum pesan");
      return;
    }
    if (cart.length === 0) return;

    setNameError("");
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
  }

  const isEmpty = cart.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-center md:justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        Drawer:
        - Mobile: bottom sheet (rounded top, slide up from bottom, max-h 85vh)
        - Desktop: right-side drawer (full height, slide in from right, fixed width)
      */}
      <div
        className={`
          relative w-full max-w-[480px] bg-[#FAFAF8] flex flex-col
          rounded-t-3xl max-h-[85vh] animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]
          md:rounded-none md:rounded-l-3xl md:max-h-none md:h-full md:max-w-[420px]
          md:animate-[slideInRight_0.3s_cubic-bezier(0.32,0.72,0,1)] md:shadow-2xl
        `}
      >
        {/* Handle + Header */}
        <div className="px-5 pt-3 pb-3 border-b border-[#E5E5E5] flex-shrink-0">
          {/* Drag handle (mobile only) */}
          <div className="w-10 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-3 md:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#171717]">Keranjang</h2>
              {!isEmpty && (
                <p className="text-xs text-[#737373]">
                  {cart.reduce((s, i) => s + i.qty, 0)} item dipilih
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F3F0EA] hover:bg-[#E8E2D9] transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-4 h-4 text-[#737373]" />
            </button>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <EmptyState
              title="Keranjang masih kosong"
              description="Mulai pilih produk favoritmu, lalu pesan langsung via WhatsApp."
              icon="🛒"
              action={
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl btn-brand text-sm font-semibold transition-colors"
                >
                  Mulai Belanja
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Cart Items — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cart.map((item) => (
                <CartItem
                  key={item.cartKey || item.id}
                  item={item}
                  onIncrease={() => onIncrease(item.cartKey || item.id)}
                  onDecrease={() => onDecrease(item.cartKey || item.id)}
                  onRemove={() => onRemove(item.cartKey || item.id)}
                />
              ))}

              {/* Order form */}
              <div className="pt-2 pb-1 space-y-3">
                <div className="border-t border-[#E5E5E5] pt-4">
                  <label
                    htmlFor="customer-name"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
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
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none transition-colors ${
                      nameError
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E5E5E5] focus:border-[var(--brand)]"
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-500">{nameError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-note"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Catatan / Alamat Singkat
                  </label>
                  <textarea
                    id="customer-note"
                    placeholder="Contoh: Kec. Baamang, Sampit — atau catatan ukuran, warna, dll."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-[var(--brand)] text-sm bg-white placeholder-[#A8A29E] text-[#171717] outline-none resize-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="px-4 pt-3 pb-5 border-t border-[#E5E5E5] bg-[#FAFAF8] flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#737373]">Subtotal</span>
                <span className="text-base font-bold text-[#171717]">
                  {formatCurrencyShort(subtotal)}
                </span>
              </div>

              {!isWaValid && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center">
                  ⚠️ Nomor admin belum dikonfigurasi. Hubungi pemilik toko.
                </div>
              )}

              <button
                onClick={handleOrder}
                disabled={isEmpty || !isWaValid}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ebe5d] transition-colors active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {isWaValid ? "Pesan via WhatsApp" : "Order Belum Tersedia"}
              </button>

              <p className="text-center text-[10px] text-[#A8A29E]">
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
  const imageUrl = item.image
    ? getImageUrl(item.image, 100, 100)
    : PLACEHOLDER_IMAGE;
  const displayImage = imageUrl || PLACEHOLDER_IMAGE;

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#E5E5E5]">
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F0EA]">
        <Image
          src={displayImage}
          alt={item.name}
          fill
          className="object-cover"
          sizes="56px"
          unoptimized={displayImage.includes("placehold.co")}
        />
      </div>

      {/* Info + controls */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#171717] line-clamp-1">{item.name}</p>
        {(item.color || item.size) && (
          <p className="text-[10px] text-[#737373] mt-0.5">
            {[item.color, item.size].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="text-xs text-brand font-medium mt-0.5">
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
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FEF2F2] text-red-400 hover:bg-red-100 transition-colors"
            aria-label={`Hapus ${item.name} dari keranjang`}
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
