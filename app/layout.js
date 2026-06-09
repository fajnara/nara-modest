import "./globals.css";
import { cache } from "react";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { sanityClient, isSanityConfigured } from "@/lib/sanity";
import { STORE_SETTINGS_QUERY } from "@/lib/queries";
import { DUMMY_STORE } from "@/lib/dummy";
import { getImageUrl } from "@/lib/image";

// Body font — clean, modern sans-serif
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

// Display font — elegant serif for headlines, store name, hero
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

// React cache() dedupes identical calls within a single render
// (e.g., generateMetadata + generateViewport + RootLayout all calling getStore
//  results in ONE Sanity fetch, not three).
const getStore = cache(async () => {
  if (!isSanityConfigured) return DUMMY_STORE;
  try {
    return (await sanityClient.fetch(STORE_SETTINGS_QUERY)) || DUMMY_STORE;
  } catch {
    return DUMMY_STORE;
  }
});

export async function generateMetadata() {
  const store = await getStore();

  const title = store.seoTitle || store.storeName || "Katalog Online";
  const description =
    store.seoDescription ||
    store.heroSubtitle ||
    "Belanja produk pilihan langsung via WhatsApp.";
  const tagline = store.storeTagline || "Katalog Online";

  const logoUrl = store.logo ? getImageUrl(store.logo, 1200, 630) : null;

  return {
    title: `${title} — ${tagline}`,
    description,
    keywords: ["katalog online", "belanja whatsapp", store.storeName].filter(Boolean),
    authors: [{ name: store.storeName }],
    icons: logoUrl ? { icon: logoUrl } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "id_ID",
      siteName: store.storeName,
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: logoUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: logoUrl ? [logoUrl] : undefined,
    },
  };
}

export async function generateViewport() {
  const store = await getStore();
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: store.primaryColor || "#8B5E3C",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${cormorant.variable}`}>
      <body className="bg-[#F3F0EA] min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
