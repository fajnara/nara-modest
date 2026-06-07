import Image from "next/image";
import { getImageUrl } from "@/lib/image";

export default function HeroBanner({ heroTitle, heroSubtitle, heroImage, heroCtaText, promoText, variant = "mobile" }) {
  const title = heroTitle || "Elegan Setiap Hari";
  const subtitle = heroSubtitle || "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.";
  const cta = heroCtaText?.trim() || "Lihat Koleksi";
  const imageUrl = heroImage ? getImageUrl(heroImage, 800, 600) : null;

  const isDesktop = variant === "desktop";

  return (
    <section
      className={`relative ${isDesktop ? "mx-0" : "mx-4"} ${isDesktop ? "mt-2" : "mt-4"} rounded-3xl overflow-hidden`}
    >
      {/* Background — gradient + optional image overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
        }}
      />

      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover opacity-60 mix-blend-multiply"
            sizes={isDesktop ? "1000px" : "480px"}
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10" />
        </>
      )}

      {/* Decorative soft blobs (when no image) */}
      {!imageUrl && (
        <>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        </>
      )}

      {/* Content */}
      <div className={`relative ${isDesktop ? "px-10 py-14 md:py-16 max-w-2xl" : "px-6 py-9"}`}>
        {promoText && (
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F3D5B5] animate-pulse" />
            <span className="text-[11px] font-medium text-white/95">{promoText}</span>
          </div>
        )}

        <h2 className={`font-bold text-white leading-tight mb-3 ${
          isDesktop ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl"
        }`}>
          {title}
        </h2>

        <p className={`text-white/85 leading-relaxed mb-6 ${
          isDesktop ? "text-base md:text-lg max-w-md" : "text-sm max-w-xs"
        }`}>
          {subtitle}
        </p>

        {/* CTA */}
        <a
          href="#products"
          className="inline-flex items-center gap-2 bg-white text-[#171717] hover:bg-[#FAFAF8] font-semibold rounded-full px-5 py-2.5 text-sm transition-colors shadow-sm"
        >
          {cta}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
