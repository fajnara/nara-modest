import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15";

// Public read client — uses Sanity CDN for fast page loads.
// Admin updates trigger revalidatePath() so changes are still near-instant.
// Combined with ISR (revalidate=30), staleness is bounded to 30 seconds.
export const sanityClient = createClient({
  projectId: projectId || "demo",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export const isSanityConfigured = Boolean(
  projectId && projectId !== "demo" && projectId !== ""
);
