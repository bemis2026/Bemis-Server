"use client";

import { useEffect, useState } from "react";

// Custom cursor follower — a soft blue dot trails the pointer with a small
// lag, swelling on links/buttons. Hidden on touch devices (no hover) to
// avoid drawing a stranded dot. The native cursor stays visible underneath
// so accessibility and click affordance aren't compromised.
export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Bail on coarse pointers (touch). Once a pointer is coarse it usually
    // stays coarse for the session — we don't need to re-evaluate.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const onMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const t = e.target as Element | null;
      const interactive = !!t?.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hot]');
      setHot(interactive);
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!visible) return null;

  const size = hot ? 38 : 14;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[59]"
      style={{
        transform: `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`,
        width: size,
        height: size,
        borderRadius: "50%",
        // Soft tinted dot — uses mix-blend-mode so it stays legible on any bg.
        background: hot
          ? "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.18) 60%, transparent 80%)"
          : "rgba(59,130,246,0.55)",
        border: hot ? "1px solid rgba(59,130,246,0.55)" : "none",
        boxShadow: hot ? "0 0 16px rgba(59,130,246,0.55)" : "0 0 8px rgba(59,130,246,0.45)",
        mixBlendMode: "screen",
        transition: "width 0.18s ease-out, height 0.18s ease-out, background 0.18s ease-out, box-shadow 0.18s",
        willChange: "transform",
      }}
    />
  );
}
