/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide "X-Powered-By: Next.js" header for slight security obscurity
  poweredByHeader: false,
  // Tighter cross-origin policy
  reactStrictMode: true,
  images: {
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
    // Allow Server Actions to receive larger payloads (image uploads up to 5MB)
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
