import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source) {
  if (!source) return null;
  return builder.image(source);
}

export function getImageUrl(source, width = 400, height = 500) {
  if (!source) return null;
  try {
    return urlForImage(source).width(width).height(height).fit("crop").url();
  } catch {
    return null;
  }
}

export const PLACEHOLDER_IMAGE = "https://placehold.co/400x500/F3F0EA/8B5E3C?text=Nara+Modest";
