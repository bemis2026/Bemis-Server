"use client";

import { useTheme } from "../context/ThemeContext";

/**
 * Single skeleton card matching the real product-card geometry on
 * /products and /products/[id]:
 *   - 180-px image area (sm:aspect-square in the catalog grid)
 *   - 2-line title placeholder
 *   - 2-chip spec placeholder
 *   - 1-line CTA placeholder
 *
 * Shimmer is pure CSS (Tailwind's `animate-pulse`) — no Framer Motion,
 * no JS work per card. The shimmer + card border-radius matches the
 * production card so the swap to the real grid lands without a layout
 * shift.
 */
export function ProductCardSkeleton() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const surface = d ? "#141416" : "#ffffff";
  const surfaceBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const block = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col animate-pulse"
      style={{ background: surface, border: `1px solid ${surfaceBorder}`, minHeight: 320 }}
      aria-hidden
    >
      <div style={{ height: 180, background: block }} />
      <div className="px-3 py-3 flex flex-col flex-1 gap-2">
        <div className="h-3 rounded" style={{ background: block, width: "75%" }} />
        <div className="h-2.5 rounded" style={{ background: block, width: "55%" }} />
        <div className="flex gap-1.5 mt-1">
          <div className="h-4 w-10 rounded-md" style={{ background: block }} />
          <div className="h-4 w-14 rounded-md" style={{ background: block }} />
        </div>
        <div className="flex-1" />
        <div className="h-2.5 rounded self-end" style={{ background: block, width: "30%" }} />
      </div>
    </div>
  );
}

/**
 * Grid of N skeleton cards — same column counts as the real catalog
 * grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`)
 * so the loading state is visually identical to the real listing.
 */
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
