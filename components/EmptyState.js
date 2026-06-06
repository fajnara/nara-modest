export default function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F3F0EA] flex items-center justify-center mb-4 text-3xl">
        {icon || "🛍️"}
      </div>
      <p className="text-sm font-semibold text-[#171717] mb-1">
        {title || "Tidak ada produk"}
      </p>
      {description && (
        <p className="text-xs text-[#737373] leading-relaxed max-w-[200px]">
          {description}
        </p>
      )}
    </div>
  );
}
