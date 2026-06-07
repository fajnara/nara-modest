export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F3F0EA] to-white border border-[#E5E5E5] flex items-center justify-center mb-5 text-4xl shadow-sm">
        {icon || "🛍️"}
      </div>
      <p className="text-base font-semibold text-[#171717] mb-1.5">
        {title || "Tidak ada produk"}
      </p>
      {description && (
        <p className="text-sm text-[#737373] leading-relaxed max-w-[280px] mb-5">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">{action}</div>
      )}
    </div>
  );
}
