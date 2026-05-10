"use client";

import { useEffect, useState } from "react";

// Seven short streaks (4 vertical, 3 horizontal) drifting in two
// directions — top→bottom and right→left. Each is roughly a third of
// the viewport in its travel axis (≈30vh tall verticals, ≈30vw wide
// horizontals). On top of the drift, each streak shimmers
// (background-position animates) so the bright spot pulses through.
//
// Sits at z-index -1 inside the wrapper's isolated stacking context, so
// cards always paint on top, AND the bg layer's `inset: 80px 0 0 0`
// clips out the top navbar zone — vertical streaks emerge from below
// the menu bar instead of slicing through it.
//
// Mounted only on the product detail page for now.
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
      <span className="energy-streak energy-h1" />
      <span className="energy-streak energy-h2" />
      <span className="energy-streak energy-h3" />
    </div>
  );
}
