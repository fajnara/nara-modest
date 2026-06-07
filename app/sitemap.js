export default function sitemap() {
  const baseUrl =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "https://example.com";

  // For MVP, only homepage is a public route worth indexing.
  // When product detail pages (/products/[slug]) are added, list them here.
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
