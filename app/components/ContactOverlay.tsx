"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { HiX } from "react-icons/hi";
import dynamic from "next/dynamic";
import { useContactOverlay } from "../context/ContactOverlayContext";
import { useTheme } from "../context/ThemeContext";

// Contact is dynamically loaded — the form has its own state machine
// and chunked dependencies, no reason to ship them with the navbar
// until the overlay actually opens.
const Contact = dynamic(() => import("./Contact"), { ssr: false });

export default function ContactOverlay() {
  const { open, closeContact } = useContactOverlay();
  const { theme } = useTheme();
  const d = theme === "dark";

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeContact(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeContact]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeContact}
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center"
          style={{
            background: d ? "rgba(4,6,10,0.75)" : "rgba(20,22,32,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl mx-3 sm:mx-6 my-3 sm:my-6 rounded-2xl overflow-hidden"
            style={{
              maxHeight: "calc(100vh - 24px)",
              background: d ? "#0d0e12" : "#ffffff",
              border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              boxShadow: d ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.18)",
            }}
          >
            {/* Close button — floats over the contact section's own header. */}
            <button
              onClick={closeContact}
              aria-label="Kapat"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: d ? "rgba(20,22,28,0.85)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                color: d ? "#f0f0f4" : "#1a1a2e",
                backdropFilter: "blur(8px)",
              }}
            >
              <HiX size={18} />
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 24px)" }}>
              <Contact />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
