"use client";

import { useEffect, useState } from "react";

// Ten short streaks distributed across the page height — five vertical
// (top→bottom) and five horizontal (right→left) — so as the visitor
// scrolls through the page they keep walking past new pockets of
// motion. The streaks themselves shimmer (the gradient's bright spot
// pulses through) on top of the drift, so each one reads as a living
// flow rather than a rigid line.
//
// The bg layer scrolls with the page (position: absolute, anchored to
// the wrapper) so the effect feels like it lives inside the page, not
// pinned to the viewport. The wrapper's isolation: isolate +
// z-index: -1 on the bg keeps every card painted over it, and inset's
// top: 80px keeps the streaks from drifting through the navbar.
export default function EnergyBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="energy-bg" aria-hidden>
      <span className="energy-streak energy-v1" />
      <span className="energy-streak energy-v2" />
      <span className="energy-streak energy-v3" />
      <span className="energy-streak energy-v4" />
      <span className="energy-streak energy-v5" />
      <span className="energy-streak energy-h1" />
      <span className="energy-streak energy-h2" />
      <span className="energy-streak energy-h3" />
      <span className="energy-streak energy-h4" />
      <span className="energy-streak energy-h5" />
    </div>
  );
}
