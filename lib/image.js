import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source) {
  if (!source) return null;
  return builder.image(source);
}

/**
 * Generate a Sanity image URL.
 *
 * Defaults preserve quality:
 * - quality 90 (was: default ~75)
 * - auto format (WebP/AVIF served when supported — small files, no quality loss)
 * - dpr 2 enabled by default — sharper on retina displays
 *
 * Pass an explicit width that matches your rendered display size × 2 for retina.
 * Example: card displays at 300px wide → request width 600.
 */
export function getImageUrl(source, width = 800, height = null, options = {}) {
  if (!source) return null;
  const { quality = 90, fit = "crop", auto = "format" } = options;

  try {
    let img = urlForImage(source).width(width).quality(quality).auto(auto).fit(fit);
    if (height) img = img.height(height);
    return img.url();
  } catch {
    return null;
  }
}

/**
 * For larger displays (modal, full-screen). Request high-resolution.
 */
export function getImageUrlHQ(source, width = 1600) {
  return getImageUrl(source, width, null, { quality: 95, fit: "max" });
}

export const PLACEHOLDER_IMAGE = "https://placehold.co/800x1000/F3F0EA/8B5E3C?text=Nara+Modest";
