"use client";

import { Plus, Minus } from "./icons";

export default function QuantityControl({ qty, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F3F0EA] hover:bg-[#E8E2D9] text-[#171717] transition-colors active:scale-90"
        aria-label="Kurangi jumlah"
      >
        <Minus className="w-3 h-3" />
      </button>

      <span className="text-sm font-semibold text-[#171717] min-w-[20px] text-center tabular-nums">
        {qty}
      </span>

      <button
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center rounded-lg btn-brand transition-colors active:scale-90"
        aria-label="Tambah jumlah"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
