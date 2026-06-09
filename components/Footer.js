import Image from "next/image";
import { Instagram, MapPin, MessageCircle, Heart } from "lucide-react";
import { getImageUrl } from "@/lib/image";

export default function Footer({ store }) {
  const waNumber = (store?.whatsappNumber || "").replace(/\D/g, "");
  const isWaValid = /^62\d{9,13}$/.test(waNumber);
  const instagramUrl = store?.instagramUrl;
  const instagramUsername =
    store?.instagramUsername ||
    (instagramUrl
      ? instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")
      : null);
  const address = store?.address;
  const storeName = store?.storeName || "Toko Kami";
  const tagline = store?.storeTagline;
  const logoUrl = store?.logo ? getImageUrl(store.logo, 120, 120) : null;
  const waUrl = isWaValid ? `https://wa.me/${waNumber}` : null;

  return (
    <footer className="relative mt-12">
      {/* Decorative top divider — subtle brand accent line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-transparent" />

      <div className="px-6 py-12">
        {/* Brand block — centered, with optional logo */}
        <div className="flex flex-col items-center text-center mb-10">
          {logoUrl && (
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E5E5E5] mb-4">
              <Image src={logoUrl} alt="" fill className="object-cover" sizes="56px" />
            </div>
          )}

          <h2 className="heading-display text-2xl text-[#171717] mb-1">
            {storeName}
          </h2>

          {tagline && (
            <p className="text-xs text-[#737373] tracking-wide uppercase">
              {tagline}
            </p>
          )}

          {/* Brand accent line */}
          <div className="mt-5 w-10 h-px bg-brand opacity-60" />
        </div>

        {/* Contact links — refined typography, lucide icons */}
        <div className="flex flex-col items-center gap-3.5 mb-10">
          {instagramUrl && instagramUsername && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-sm text-[#737373] hover:text-brand"
            >
              <Instagram className="w-4 h-4 stroke-[1.5]" strokeWidth={1.5} />
              <span className="tracking-wide">@{instagramUsername}</span>
            </a>
          )}

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-sm text-[#737373] hover:text-[#25D366]"
            >
              <MessageCircle className="w-4 h-4 stroke-[1.5]" strokeWidth={1.5} />
              <span className="tabular-nums tracking-wide">+{waNumber}</span>
            </a>
          )}

          {address && (
            <div className="flex items-center gap-2.5 text-sm text-[#737373]">
              <MapPin className="w-4 h-4 stroke-[1.5]" strokeWidth={1.5} />
              <span className="tracking-wide">{address}</span>
            </div>
          )}
        </div>

        {/* Bottom row — copyright + made with love + admin link */}
        <div className="pt-6 border-t border-[#E5E5E5] flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-[#A8A29E] tracking-wider uppercase">
            <span>© {new Date().getFullYear()} {storeName}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#A8A29E] tracking-wider uppercase">
            <span>Made with</span>
            <Heart className="w-3 h-3 fill-brand text-brand" strokeWidth={0} />
            <span>in Indonesia</span>
          </div>

          <a
            href="/admin"
            className="text-[10px] text-[#A8A29E] hover:text-brand tracking-wider uppercase"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
