import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15";

// Public read client — useCdn FALSE so updates from Studio are instant.
// Performance is preserved via Next.js ISR (revalidate=30) which caches
// the rendered page, not the raw Sanity response.
//
// Why not useCdn: true?
//   Sanity's CDN caches responses ~60s. Even after Next.js revalidates,
//   the next fetch may still hit a stale CDN edge, causing 1-2 min delays
//   before publish actually shows up on the live site.
//
// Trade-off: each ISR rebuild fetch is ~100ms slower (non-CDN), but
// happens at most once per revalidate window. End-users always see
// the cached ISR page — they never directly wait on Sanity.
export const sanityClient = createClient({
  projectId: projectId || "demo",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

export const isSanityConfigured = Boolean(
  projectId && projectId !== "demo" && projectId !== ""
);
