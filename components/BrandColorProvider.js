import { darkenHex } from "@/lib/colorUtils";

/**
 * Injects CSS variables for brand color so child components can use
 * `var(--brand)` and `var(--brand-dark)` and stay adaptive to store settings.
 *
 * Server component — no client JS needed.
 */
export default function BrandColorProvider({ primaryColor, children, className = "" }) {
  const brand = primaryColor || "#8B5E3C";
  const brandDark = darkenHex(brand, 30);

  return (
    <div
      className={className}
      style={{ "--brand": brand, "--brand-dark": brandDark }}
    >
      {children}
    </div>
  );
}
