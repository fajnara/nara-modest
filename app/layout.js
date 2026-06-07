import "./globals.css";
import { sanityClient, isSanityConfigured } from "@/lib/sanity";
import { STORE_SETTINGS_QUERY } from "@/lib/queries";
import { DUMMY_STORE } from "@/lib/dummy";
import { getImageUrl } from "@/lib/image";

async function getStore() {
  if (!isSanityConfigured) return DUMMY_STORE;
  try {
    return await sanityClient.fetch(STORE_SETTINGS_QUERY) || DUMMY_STORE;
  } catch {
    return DUMMY_STORE;
  }
}

export async function generateMetadata() {
  const store = await getStore();

  const title = store.seoTitle || store.storeName || "Katalog Online";
  const description =
    store.seoDescription ||
    store.heroSubtitle ||
    "Belanja produk pilihan langsung via WhatsApp.";
  const tagline = store.storeTagline || "Katalog Online";

  // Dynamic OG image from logo if available
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8B5E3C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#F3F0EA] min-h-screen">
        {children}
      </body>
    </html>
  );
}
