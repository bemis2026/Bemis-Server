"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import E from "./E";

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { gallerySection: section, sectionBgs } = useContent();
  const d = theme === "dark";

  const items = section.items ?? [];
  // Lightbox state — index of the open photo, or null when closed.
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (openIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((n) => (n === null ? null : (n + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIdx((n) => (n === null ? null : (n - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openIdx, items.length]);

  if (items.length === 0) return null;

  const BLUE        = "#3B82F6";
  const sectionBg   = d ? "linear-gradient(140deg, #0d0d11 0%, #111116 60%, #0e0e12 100%)" : "linear-gradient(140deg, #f7f8fb 0%, #f3f4f8 60%, #f5f6fa 100%)";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted   = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";
  const sectionBgUrl = sectionBgs?.["gallery"] ?? "";

  // Map aspect labels to grid spans for a masonry-ish layout.
  const aspectSpan = (a?: string) => {
    if (a === "tall") return "row-span-2";
    if (a === "wide") return "col-span-2";
    return "";
  };
  const aspectRatio = (a?: string) => {
    if (a === "tall") return "3 / 4";
    if (a === "wide") return "16 / 9";
    return "1 / 1";
  };

  return (
    <section id="gallery" style={{ background: sectionBg }} className="relative py-8 lg:py-12 overflow-hidden">
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="gallerySection.sectionLabel" tag="span">{section.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2" style={{ color: textPrimary }}
          >
            <E field="gallerySection.heading">{section.heading}</E>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20 mb-3"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.22 }}
            className="text-sm" style={{ color: textMuted }}
          >
            <E field="gallerySection.subheading" tag="span">{section.subheading}</E>
          </motion.p>
        </div>

        {/* Masonry grid — 4 columns on desktop, 2 on mobile, with `tall` and
            `wide` items spanning extra rows/columns for visual rhythm. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
          {items.map((item, i) => {
            return (
              <motion.button
                key={item.id}
                onClick={() => setOpenIdx(i)}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.06 * (i % 8) }}
                className={`relative group overflow-hidden rounded-2xl ${aspectSpan(item.aspect)}`}
                style={{
                  aspectRatio: item.aspect ? undefined : aspectRatio(item.aspect),
                  height: "100%",
                  width: "100%",
                  background: d ? "#1a1a1c" : "#e8e8ec",
                  border: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  cursor: "zoom-in",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.caption ?? "Bemis E-V Charge galeri"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                {/* Hover overlay + caption */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
                  }}
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-semibold leading-tight">{item.caption}</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openIdx !== null && items[openIdx] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
            onClick={() => setOpenIdx(null)}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
              aria-label="Kapat"
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", color: "#ffffff" }}
            >
              <HiX size={20} />
            </button>
            {/* Prev */}
            {items.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIdx((n) => (n === null ? null : (n - 1 + items.length) % items.length)); }}
                aria-label="Önceki"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/15"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff" }}
              >
                <HiChevronLeft size={26} />
              </button>
            )}
            {/* Next */}
            {items.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIdx((n) => (n === null ? null : (n + 1) % items.length)); }}
                aria-label="Sonraki"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/15"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff" }}
              >
                <HiChevronRight size={26} />
              </button>
            )}
            {/* Image */}
            <motion.div
              key={items[openIdx].id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[openIdx].image}
                alt={items[openIdx].caption ?? "Bemis E-V Charge galeri"}
                className="rounded-xl object-contain"
                style={{ maxWidth: "92vw", maxHeight: "82vh" }}
                loading="eager"
              />
              {items[openIdx].caption && (
                <p className="text-white text-sm mt-3 max-w-[80%] text-center" style={{ opacity: 0.85 }}>
                  {items[openIdx].caption}
                </p>
              )}
              <p className="text-[11px] text-white/45 mt-1.5 tracking-wider">
                {openIdx + 1} / {items.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
