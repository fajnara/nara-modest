import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getImageUrl } from "@/lib/image";

export default function HeroBanner({
  heroTitle,
  heroSubtitle,
  heroImage,
  heroCtaText,
  promoText,
  variant = "mobile",
  targetId = "products",
}) {
  const title = heroTitle || "Elegan Setiap Hari";
  const subtitle = heroSubtitle || "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.";
  const cta = heroCtaText?.trim() || "Lihat Koleksi";
  const imageUrl = heroImage ? getImageUrl(heroImage, 1200, 800) : null;

  const isDesktop = variant === "desktop";

  return (
    <section
      className={`relative ${isDesktop ? "mx-0" : "mx-4"} ${isDesktop ? "mt-2" : "mt-4"} rounded-3xl overflow-hidden animate-fade-in`}
    >
      {/* Background — gradient or image */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
        }}
      />

      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover opacity-65 mix-blend-multiply"
            sizes={isDesktop ? "1200px" : "480px"}
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
        </>
      )}

      {/* Decorative blobs when no image */}
      {!imageUrl && (
        <>
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-white/30" />
        </>
      )}

      {/* Content */}
      <div className={`relative ${isDesktop ? "px-12 py-16 md:py-20 max-w-2xl" : "px-7 py-10"}`}>
        {promoText && (
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1.5 mb-5 ring-1 ring-white/20 animate-fade-in-up">
            <Sparkles className="w-3 h-3 text-white/90" strokeWidth={2} />
            <span className="text-[11px] font-medium text-white/95 tracking-wide">
              {promoText}
            </span>
          </div>
        )}

        <h2
          className={`heading-display text-white mb-4 animate-fade-in-up ${
            isDesktop ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl"
          }`}
          style={{ animationDelay: "100ms" }}
        >
          {title}
        </h2>

        <p
          className={`text-white/85 leading-relaxed mb-7 animate-fade-in-up ${
            isDesktop ? "text-base md:text-lg max-w-md" : "text-sm max-w-xs"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          {subtitle}
        </p>

        <a
          href={`#${targetId}`}
          className="group inline-flex items-center gap-2 bg-white text-[#171717] hover:bg-[#FAFAF8] font-semibold rounded-full pl-5 pr-2 py-1.5 text-sm shadow-lg shadow-black/10 animate-fade-in-up active:scale-95"
          style={{ animationDelay: "300ms" }}
        >
          <span>{cta}</span>
          <span className="w-7 h-7 rounded-full btn-brand flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        </a>
      </div>
    </section>
  );
}
