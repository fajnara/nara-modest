export default function robots() {
  const baseUrl =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/studio", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
