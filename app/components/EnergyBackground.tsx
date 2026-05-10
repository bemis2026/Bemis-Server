"use client";

import { useEffect, useState } from "react";

// Four short streaks drifting in two directions: two flow top→bottom,
// two flow right→left. Each is half the viewport in its travel axis
// (50vh tall or 50vw wide) so they read as fragments rather than full
// lines. On top of the drift translation, each streak shimmers
// (background-position animates) so the brightness pulses through it.
// Behind page content (z-index -1 inside the wrapper's isolated
// stacking context). Mounted only on the product detail page for now.
export default function EnergyBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="energy-bg" aria-hidden>
      <span className="energy-streak energy-v1" />
      <span className="energy-streak energy-v2" />
      <span className="energy-streak energy-h1" />
      <span className="energy-streak energy-h2" />
    </div>
  );
}
