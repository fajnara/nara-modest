import "./globals.css";

export const metadata = {
  title: "Nara Modest — Modest Wear Catalog",
  description: "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
  openGraph: {
    title: "Nara Modest",
    description: "Belanja koleksi hijab dan modest wear terbaru langsung via WhatsApp.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
