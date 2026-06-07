"use client";

import { useState } from "react";

const PRESETS = [
  { name: "Mocha Brown",    color: "#8B5E3C", desc: "Hangat, klasik — cocok modest/hijab" },
  { name: "Dusty Rose",     color: "#C77B83", desc: "Lembut, feminin — cocok fashion wanita" },
  { name: "Olive Green",    color: "#6B7C3C", desc: "Earthy, natural — cocok organic/herbal" },
  { name: "Navy Blue",      color: "#1E3A5F", desc: "Profesional, premium — cocok formal" },
  { name: "Sage Green",     color: "#87A878", desc: "Tenang, fresh — cocok beauty/wellness" },
  { name: "Charcoal Black", color: "#2D2D2D", desc: "Minimalis, bold — cocok streetwear" },
  { name: "Terracotta",     color: "#C8553D", desc: "Warm, vibrant — cocok craft/handmade" },
  { name: "Royal Purple",   color: "#5B3C7A", desc: "Mewah, elegan — cocok jewelry/luxury" },
];

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export default function ThemePresetPicker({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(
    !PRESETS.some((p) => p.color.toLowerCase() === (value || "").toLowerCase())
  );
  const [customHex, setCustomHex] = useState(value || "#8B5E3C");

  const isCustomValid = HEX_REGEX.test(customHex);

  return (
    <div>
      <p className="text-xs text-[#737373] mb-4">
        Pilih warna utama untuk tombol, badge, dan aksen di seluruh website.
      </p>

      {/* Preset grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {PRESETS.map((preset) => {
          const isActive = value?.toLowerCase() === preset.color.toLowerCase();
          return (
            <button
              key={preset.color}
              type="button"
              onClick={() => {
                onChange(preset.color);
                setShowCustom(false);
              }}
              className={`p-3 rounded-2xl border-2 transition-all text-left ${
                isActive
                  ? "border-[#171717] bg-[#FAFAF8] shadow-sm"
                  : "border-[#E5E5E5] bg-white hover:border-[#A8A29E]"
              }`}
            >
              <div
                className="w-full h-10 rounded-lg mb-2 shadow-inner"
                style={{ backgroundColor: preset.color }}
              />
              <p className="text-xs font-semibold text-[#171717] truncate">
                {preset.name}
              </p>
              <p className="text-[9px] text-[#737373] mt-0.5 leading-tight line-clamp-2">
                {preset.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom color toggle */}
      <button
        type="button"
        onClick={() => setShowCustom((v) => !v)}
        className="text-xs text-[#8B5E3C] font-semibold hover:underline mb-3"
      >
        {showCustom ? "← Kembali ke preset" : "Pilih warna sendiri →"}
      </button>

      {showCustom && (
        <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-2xl p-4">
          <p className="text-xs font-semibold text-[#171717] mb-2">Warna Custom (Hex)</p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isCustomValid ? customHex : "#8B5E3C"}
              onChange={(e) => {
                setCustomHex(e.target.value);
                onChange(e.target.value);
              }}
              className="w-12 h-11 rounded-xl border border-[#E5E5E5] cursor-pointer bg-white"
            />
            <input
              value={customHex}
              onChange={(e) => {
                setCustomHex(e.target.value);
                if (HEX_REGEX.test(e.target.value)) onChange(e.target.value);
              }}
              placeholder="#8B5E3C"
              className={`flex-1 px-3 py-2.5 rounded-xl border text-sm uppercase tabular-nums outline-none ${
                customHex && !isCustomValid
                  ? "border-red-400"
                  : "border-[#E5E5E5] focus:border-[#8B5E3C]"
              }`}
            />
          </div>
          {customHex && !isCustomValid && (
            <p className="text-[10px] text-red-500 mt-2">
              Format harus hex. Contoh: #8B5E3C
            </p>
          )}
        </div>
      )}

      {/* Live preview */}
      <div className="mt-5 bg-[#FAFAF8] border border-[#E5E5E5] rounded-2xl p-4">
        <p className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-widest mb-3">
          Preview
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            style={{ backgroundColor: value }}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm"
          >
            Pesan via WhatsApp
          </button>
          <span
            style={{ backgroundColor: value, color: "white" }}
            className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide"
          >
            BARU
          </span>
          <span
            style={{ color: value, backgroundColor: `${value}15` }}
            className="text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Pashmina
          </span>
        </div>
      </div>
    </div>
  );
}
