import { MapPin, Instagram, WhatsAppIcon } from "./icons";

export default function Footer({ store }) {
  const waNumber = (store?.whatsappNumber || "").replace(/\D/g, "");
  const isWaValid = /^62\d{9,13}$/.test(waNumber);
  const instagramUrl = store?.instagramUrl;
  const instagramUsername =
    store?.instagramUsername ||
    (instagramUrl ? instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "") : null);
  const address = store?.address;
  const storeName = store?.storeName || "Toko Kami";
  const tagline = store?.storeTagline;

  const waUrl = isWaValid ? `https://wa.me/${waNumber}` : null;

  return (
    <footer className="px-5 py-8 border-t border-[#E5E5E5] mt-4">
      <div className="text-center mb-5">
        <p className="text-base font-bold text-[#171717]">{storeName}</p>
        {tagline && (
          <p className="text-xs text-[#737373] mt-0.5">{tagline}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 mb-5">
        {instagramUrl && instagramUsername && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#737373] hover:text-brand transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@{instagramUsername}</span>
          </a>
        )}

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#737373] hover:text-[#25D366] transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>+{waNumber}</span>
          </a>
        )}

        {address && (
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{address}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 mt-1">
        <p className="text-[10px] text-[#A8A29E]">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
        <span className="text-[#E5E5E5]">·</span>
        <a
          href="/admin"
          className="text-[10px] text-[#D4C4B8] hover:text-brand transition-colors"
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
