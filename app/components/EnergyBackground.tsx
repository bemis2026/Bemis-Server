"use client";

import { useEffect, useState } from "react";

// Four diagonal gradient streaks slowly drifting across the viewport.
// Sits behind page content (z-index 0; cards / sections paint on top via
// natural DOM order). Honors prefers-reduced-motion. Scoped per-page by
// mounting only where wanted — initially the product detail page.
//
// Why the mount-after-effect dance: SSR can't compute the keyframe
// timing, so we render nothing during hydration, then swap in the
// streaks once we're on the client. Avoids a flash of static lines.
export default function EnergyBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="energy-bg" aria-hidden>
      <span className="energy-streak energy-s1" />
      <span className="energy-streak energy-s2" />
      <span className="energy-streak energy-s3" />
      <span className="energy-streak energy-s4" />
    </div>
  );
}
