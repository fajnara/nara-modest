/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Optimal sizes for catalog cards and modals — covers 1x and 2x retina
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384, 512],
    // Prefer modern formats — browsers auto-negotiate
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // raised — supports higher-res image uploads
    },
  },
};

module.exports = nextConfig;
