"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HiStar } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import E from "./E";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <HiStar key={i} className="text-[#F59E0B] text-sm" />
      ))}
    </div>
  );
}

export default function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { reviews, sectionBgs } = useContent();
  const d = theme === "dark";

  const BLUE       = "#3B82F6";
  const surface    = d ? "#0d0d0d"                 : "#ffffff";
  const border     = d ? "#1e1e1e"                 : "#e8e8e8";
  const textPrimary= d ? "#ffffff"                 : "#111111";
  const textMuted  = d ? "rgba(255,255,255,0.38)"  : "rgba(0,0,0,0.38)";
  const textBody   = d ? "rgba(255,255,255,0.60)"  : "rgba(0,0,0,0.62)";

  const items = reviews.items ?? [];

  const sectionBgUrl = sectionBgs?.["reviews"] ?? "";

  return (
    <section
      id="reviews"
      style={{
        background: d
          ? "linear-gradient(180deg, #1b1b1e 0%, #181818 35%, #1a1a1c 70%, #1d1d20 100%)"
          : "linear-gradient(180deg, #f0f0f4 0%, #f5f5f5 40%, #ebebeb 100%)",
      }}
      className="relative py-6 lg:py-8 overflow-hidden"
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="reviews.sectionLabel" tag="span">{reviews.sectionLabel}</E>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2" style={{ color: textPrimary }}
          >
            <E field="reviews.heading">{reviews.heading}</E>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20 mb-4"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.22 }}
            className="text-base max-w-lg mx-auto" style={{ color: textMuted }}
          >
            <E field="reviews.subheading" tag="span">{reviews.subheading}</E>
          </motion.p>

          {/* Platform chips */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-3"
          >
            {Array.from(new Set(items.map((r) => r.platform))).map((p) => {
              const color = items.find((r) => r.platform === p)?.platformColor ?? "#888";
              return (
                <span key={p} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
                  {p}
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* Review grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 3).map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between">
                <Stars count={review.rating} />
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md"
                  style={{ background: `${review.platformColor}14`, color: review.platformColor, border: `1px solid ${review.platformColor}28` }}>
                  {review.platform}
                </span>
              </div>

              <p className="text-sm leading-relaxed flex-1" style={{ color: textBody }}>
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="text-xs font-medium px-3 py-1.5 rounded-lg self-start"
                style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: textMuted, border: d ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)" }}>
                {review.product}
              </div>

              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textMuted }}>
                    {review.author[0]}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: textPrimary }}>{review.author}</span>
                </div>
                <span className="text-sm" style={{ color: textMuted }}>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-5 rounded-2xl p-4 sm:p-5 text-center"
          style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-black" style={{ color: textPrimary }}>{reviews.rating}</span>
            <div className="flex flex-col items-start gap-1">
              <Stars count={5} />
              <E field="reviews.ratingLabel" tag="span" className="text-xs" style={{ color: textMuted }}>{reviews.ratingLabel}</E>
            </div>
          </div>
          <p className="text-sm" style={{ color: textMuted }}>
            <E field="reviews.platformsPrefix" tag="span">{reviews.platformsPrefix}</E>{" "}
            <span style={{ color: textPrimary, fontWeight: 700 }}>{reviews.ratingCount}</span>{" "}
            <E field="reviews.ratingCountSuffix" tag="span">{reviews.ratingCountSuffix}</E>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
