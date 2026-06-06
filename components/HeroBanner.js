export default function HeroBanner({ heroTitle, heroSubtitle, promoText }) {
  const title = heroTitle || "Elegan Setiap Hari";
  const subtitle = heroSubtitle || "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.";
  const promo = promoText || "Koleksi baru minggu ini sudah tersedia.";

  return (
    <section className="mx-4 mt-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B5E3C] to-[#5C3A24] px-6 py-8">
      {promo && (
        <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F3D5B5] animate-pulse" />
          <span className="text-[11px] font-medium text-white/90">{promo}</span>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white leading-tight mb-2">
        {title}
      </h2>

      <p className="text-sm text-white/80 leading-relaxed mb-5 max-w-xs">
        {subtitle}
      </p>

      <p className="text-xs text-white/60 flex items-center gap-1">
        <span>↓</span>
        <span>Pilih produk favoritmu di bawah</span>
      </p>
    </section>
  );
}
