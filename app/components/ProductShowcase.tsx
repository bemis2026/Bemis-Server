"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RiShieldCheckLine,
  RiArrowRightLine,
  RiFlashlightFill,
  RiLeafLine,
  RiWifiLine,
  RiAwardLine,
} from "react-icons/ri";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";

const SPEC_ICONS = [RiFlashlightFill, RiShieldCheckLine, RiWifiLine, RiLeafLine, RiAwardLine];
const ACCENT = "#3B82F6";

export default function ProductShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { productShowcase: ps } = useContent();
  const router = useRouter();
  const d = theme === "dark";

  const bg = d
    ? "linear-gradient(135deg, #0d0d11 0%, #0c0c0e 50%, #111114 100%)"
    : "linear-gradient(135deg, #f4f5f9 0%, #f8f8fb 50%, #f2f3f7 100%)";
  const textPrimary = d ? "#f0f0f4" : "#0f172a";
  const textMuted = d ? "rgba(240,240,244,0.50)" : "rgba(15,23,42,0.50)";
  const specBg = d ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)";
  const specBorder = d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)";

  const specs = ps?.specs ?? [];

  return (
    <section id="productshowcase" className="relative overflow-hidden py-16 lg:py-24" style={{ background: bg }}>
      {/* Background glow */}
      <div className="absolute pointer-events-none" style={{ top: "20%", left: "30%", width: 600, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${ACCENT}0f 0%, transparent 65%)` }} />
      <div className="absolute pointer-events-none" style={{ bottom: 0, right: "10%", width: 400, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)` }} />


      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 blur-3xl opacity-20 rounded-3xl" style={{ background: `radial-gradient(ellipse, ${ACCENT} 0%, transparent 70%)` }} />

            {/* Image card */}
            <div
              className="relative w-full max-w-sm lg:max-w-none rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "4/5",
                background: d
                  ? "linear-gradient(145deg, #131b2e 0%, #0c1525 100%)"
                  : "linear-gradient(145deg, #deeeff 0%, #eaf4ff 100%)",
                border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(59,130,246,0.15)"}`,
                boxShadow: d
                  ? `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`
                  : `0 24px 64px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.08)`,
              }}
            >
              {ps?.image ? (
                <img
                  src={ps.image}
                  alt={ps?.name ?? "Ürün"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <RiFlashlightFill size={64} style={{ color: `${ACCENT}40`, margin: "0 auto 12px" }} />
                    <p className="text-xs font-medium" style={{ color: `${textMuted}` }}>Ürün görseli yükleyin</p>
                  </div>
                </div>
              )}

              {/* Floating spec badge — top right */}
              {specs[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -12, y: 8 }}
                  animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.5 }}
                  className="absolute top-4 right-4 rounded-2xl px-3 py-2"
                  style={{
                    background: "rgba(10,15,30,0.88)",
                    border: `1px solid ${ACCENT}30`,
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
                  }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(240,240,244,0.50)" }}>{specs[0].label}</p>
                  <p className="text-sm font-black text-white">{specs[0].value}</p>
                </motion.div>
              )}

              {/* Floating spec badge — bottom left */}
              {specs[1] && (
                <motion.div
                  initial={{ opacity: 0, x: 12, y: 8 }}
                  animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.65 }}
                  className="absolute bottom-4 left-4 rounded-2xl px-3 py-2 flex items-center gap-2"
                  style={{
                    background: "rgba(10,15,30,0.88)",
                    border: `1px solid rgba(16,185,129,0.30)`,
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
                  }}
                >
                  <RiShieldCheckLine size={16} style={{ color: "#10B981" }} />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(240,240,244,0.50)" }}>{specs[1].label}</p>
                    <p className="text-xs font-bold text-white">{specs[1].value}</p>
                  </div>
                </motion.div>
              )}

              {/* Yerli üretim — çerçevesiz, direkt görsel üzerine */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.75 }}
                className="absolute bottom-4 right-4"
                style={{ width: 72, height: 72 }}
              >
                <Image src="/badges/yerli-uretim.jpg" alt="Yerli Üretim" width={72} height={72} className="w-full h-full object-contain drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right: content ── */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}28` }}
            >
              <RiAwardLine size={12} style={{ color: ACCENT }} />
              <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: ACCENT }}>
                {ps?.badge ?? "Amiral Gemisi Ürün"}
              </span>
            </motion.div>

            {/* Product name */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="font-black leading-none mb-3"
              style={{ color: textPrimary, fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
            >
              {ps?.name ?? "AC Wallbox Smart Charger Pro 2"}
            </motion.h2>

            {/* Tagline */}
            {ps?.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="text-base font-semibold mb-4"
                style={{ color: ACCENT }}
              >
                {ps.tagline}
              </motion.p>
            )}

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.13 }}
              className="text-sm leading-relaxed mb-7"
              style={{ color: textMuted, maxWidth: 480 }}
            >
              {ps?.description ?? ""}
            </motion.p>

            {/* Specs grid */}
            {specs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.17 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8"
              >
                {specs.map((s: { label: string; value: string }, i: number) => {
                  const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
                  return (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl"
                      style={{ background: specBg, border: `1px solid ${specBorder}`, boxShadow: d ? "none" : "0 1px 6px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon size={12} style={{ color: ACCENT, opacity: 0.8 }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: textPrimary }}>{s.value}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.24 }}
            >
              <button
                onClick={() => router.push(ps?.ctaHref ?? "/products/wallbox")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563EB)`, boxShadow: `0 6px 22px ${ACCENT}40` }}
              >
                {ps?.ctaPrimary ?? "Ürünü İncele"}
                <RiArrowRightLine size={16} />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
