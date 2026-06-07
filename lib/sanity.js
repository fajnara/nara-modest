import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15";

export const sanityClient = createClient({
  projectId: projectId || "demo",
  dataset,
  apiVersion,
  // useCdn: false ensures data is always fresh from Sanity API
  // Important for admin panel changes to reflect immediately
  useCdn: false,
});

export const isSanityConfigured = Boolean(
  projectId && projectId !== "demo" && projectId !== ""
);
