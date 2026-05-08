"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin gradient bar fixed at the very top — width tracks document scroll
// progress 0→100%. Spring smooths the motion so it doesn't jitter on
// trackpads. Sits above Navbar (z-50 navbar; we use z-[60] here).
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0% 50%",
      }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
    >
      <div
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)",
          boxShadow: "0 0 10px rgba(59,130,246,0.55)",
        }}
      />
    </motion.div>
  );
}
