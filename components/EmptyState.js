export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F3F0EA] flex items-center justify-center mb-5 text-2xl text-brand/70">
        {icon || "○"}
      </div>
      <p className="text-base font-semibold text-[#171717] mb-1.5 max-w-[280px]">
        {title || "Tidak ada produk"}
      </p>
      {description && (
        <p className="text-sm text-[#737373] leading-relaxed max-w-[300px] mb-5">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-1">{action}</div>
      )}
    </div>
  );
}
