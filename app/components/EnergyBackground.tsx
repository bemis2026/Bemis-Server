"use client";

import { useEffect, useState } from "react";

// Six diagonal gradient streaks drifting across the page in mixed
// directions and thicknesses. The streak shape itself is a translucent
// gradient bar; on top of the drift translation each streak also
// shimmers (background-position animates) so it reads as a flowing line
// rather than a fixed line being moved. Sits behind page content (z-
// index -1 inside an isolated stacking context, so cards/sections
// always paint on top).
//
// Mounted only on the product detail page for now.
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
      <span className="energy-streak energy-s5" />
      <span className="energy-streak energy-s6" />
    </div>
  );
}
