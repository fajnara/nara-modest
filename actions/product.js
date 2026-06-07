"use server";

import { sanityClient } from "@/lib/sanity";

/**
 * Fetch gallery images for a single product on-demand.
 * Called when product modal opens — keeps homepage payload light.
 */
export async function getProductGallery(productId) {
  if (!productId) return [];

  try {
    const product = await sanityClient.fetch(
      `*[_type == "product" && _id == $id][0].gallery`,
      { id: productId }
    );
    return Array.isArray(product) ? product : [];
  } catch {
    return [];
  }
}
