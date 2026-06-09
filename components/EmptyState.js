export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[var(--brand)]/8 flex items-center justify-center mb-5 text-brand">
        {icon || <span className="text-2xl opacity-70">○</span>}
      </div>
      <p className="text-base font-semibold text-[#171717] mb-2 max-w-[280px]">
        {title || "Tidak ada produk"}
      </p>
      {description && (
        <p className="text-sm text-[#737373] leading-relaxed max-w-[320px] mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
