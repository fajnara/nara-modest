import { createClient } from "@sanity/client";

// Server-only client with write token — never expose to browser
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
