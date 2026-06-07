/**
 * Color utilities for dynamic brand theming.
 * Owner only sets one color (primaryColor); we derive the darker shade automatically.
 */

/**
 * Darken a hex color by a given percentage (0-100).
 * Returns hex string. Returns input unchanged if hex is invalid.
 */
export function darkenHex(hex, percent = 25) {
  if (!hex || typeof hex !== "string") return hex;

  // Normalize: #abc → #aabbcc
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return hex;

  const num = parseInt(cleaned, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const factor = 1 - percent / 100;
  const dr = Math.max(0, Math.round(r * factor));
  const dg = Math.max(0, Math.round(g * factor));
  const db = Math.max(0, Math.round(b * factor));

  return `#${[dr, dg, db].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
