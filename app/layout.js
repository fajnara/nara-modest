import "./globals.css";

export const metadata = {
  title: "Nara Modest — Modest Wear Catalog",
  description: "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
  keywords: ["hijab", "modest wear", "pashmina", "bergo", "abaya", "katalog online"],
  authors: [{ name: "Nara Modest" }],
  openGraph: {
    title: "Nara Modest — Modest Wear Catalog",
    description: "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
    type: "website",
    locale: "id_ID",
    siteName: "Nara Modest",
  },
  twitter: {
    card: "summary",
    title: "Nara Modest",
    description: "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
  },
};

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
