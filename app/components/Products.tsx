"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiChargingPile2Line,
  RiBatteryChargeLine,
  RiFlashlightLine,
  RiPlugLine,
  RiCarLine,
  RiToolsLine,
  RiToolsFill,
  RiGasStationLine,
} from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import E from "./E";

const categories = [
  {
    id: "wallbox",
    name: "AC Wallbox",
    subtitle: "Duvar Tipi Şarj İstasyonu",
    modelCount: 3,
    icon: RiChargingPile2Line,
    accent: "#3B82F6",
    accentGlow: "rgba(59,130,246,0.22)",
    edgeGlow: true,
    darkVisualBg: "linear-gradient(155deg, #0b1525 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #deeeff 0%, #f0f6ff 70%)",
    badge: "En Çok Satan",
    comingSoon: false,
  },
  {
    id: "portable",
    name: "AC Mobile Chargers",
    subtitle: "Taşınabilir Şarj Cihazları",
    modelCount: 2,
    icon: RiBatteryChargeLine,
    accent: "#10B981",
    accentGlow: "rgba(16,185,129,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #071a12 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #d6f5eb 0%, #eefaf4 70%)",
    badge: "Yeni",
    comingSoon: false,
  },
  {
    id: "cables",
    name: "AC Şarj Kabloları",
    subtitle: "Type 2 · Mod 2 & Mod 3",
    modelCount: 4,
    icon: RiFlashlightLine,
    accent: "#F59E0B",
    accentGlow: "rgba(245,158,11,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #1a1308 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #fef3cd 0%, #fffbf0 70%)",
    badge: null,
    comingSoon: false,
  },
  {
    id: "v2l-c2l",
    name: "V2L / C2L Adaptörler",
    subtitle: "Vehicle-to-Load & Charger-to-Load",
    modelCount: 3,
    icon: RiCarLine,
    accent: "#818CF8",
    accentGlow: "rgba(129,140,248,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #0d0b1e 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #e5e3ff 0%, #f3f2ff 70%)",
    badge: "İnovatif",
    comingSoon: false,
  },
  {
    id: "converters",
    name: "Uzatma & Kombinasyon",
    subtitle: "Uzatma Kabloları, Dönüştürücüler & Kombinasyon Kutuları",
    modelCount: 4,
    icon: RiToolsLine,
    accent: "#06B6D4",
    accentGlow: "rgba(6,182,212,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #041417 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #cffafe 0%, #f0feff 70%)",
    badge: null,
    comingSoon: false,
  },
  {
    id: "charger-equipment",
    name: "Şarj Ünitesi Ekipmanları",
    subtitle: "Type 2 Soket, Holster & Montaj Ekipmanları",
    modelCount: 5,
    icon: RiToolsFill,
    accent: "#64748B",
    accentGlow: "rgba(100,116,139,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #0d1117 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #f1f5f9 0%, #f8fafc 70%)",
    badge: null,
    comingSoon: false,
  },
  {
    id: "accessories",
    name: "Aksesuarlar",
    subtitle: "V2L/C2L, Montaj & Diğer",
    modelCount: 4,
    icon: RiPlugLine,
    accent: "#818CF8",
    accentGlow: "rgba(129,140,248,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #0d0b1e 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #e5e3ff 0%, #f3f2ff 70%)",
    badge: null,
    comingSoon: false,
  },
  {
    id: "dc-units",
    name: "DC Şarj Üniteleri",
    subtitle: "Hızlı DC Şarj İstasyonları",
    modelCount: 0,
    icon: RiGasStationLine,
    accent: "#F97316",
    accentGlow: "rgba(249,115,22,0.20)",
    edgeGlow: false,
    darkVisualBg: "linear-gradient(155deg, #1a0c04 0%, #0d0d0d 70%)",
    lightVisualBg: "linear-gradient(155deg, #ffedd5 0%, #fff7ed 70%)",
    badge: "Yakında",
    comingSoon: true,
  },
];

export default function Products() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { categories: catMeta, products: productSection, sectionBgs } = useContent();
  const router = useRouter();
  const d = theme === "dark";
  const [hovered, setHovered] = useState<string | null>(null);

  // Merge hardcoded visual design with CMS editable fields
  const mergedCategories = categories.map((cat) => {
    const meta = catMeta[cat.id];
    if (!meta) return { ...cat, image: undefined };
    return { ...cat, name: meta.name, subtitle: meta.subtitle, modelCount: meta.modelCount, badge: meta.badge, comingSoon: meta.comingSoon, image: meta.image };
  });

  const BLUE = "#3B82F6";
  const sectionBg = d ? "linear-gradient(180deg, #232323 0%, #1a1a1a 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)";
  const surface = d ? "#1e1e1e" : "#ffffff";
  const border = d ? "#2a2a2a" : "#e0e0e0";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted = d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)";
  const badgeBg = d ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.85)";
  const badgeColor = d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const badgeBorder = d ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.10)";
  const overlayGrad = d
    ? "linear-gradient(to top, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.55) 55%, transparent 100%)"
    : "linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.60) 55%, transparent 100%)";

  const sectionBgUrl = sectionBgs?.["products"] ?? "";

  return (
    <section id="products" style={{ background: sectionBg, backgroundAttachment: "local" }} className="relative py-8 lg:py-12 overflow-hidden">
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-7 sm:mb-9">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="products.sectionLabel" tag="span">{productSection.sectionLabel}</E>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3"
            style={{ color: textPrimary }}
          >
            <E field="products.heading">{productSection.heading}</E>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20 mb-4"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-base"
            style={{ color: textMuted }}
          >
            <E field="products.subheading" tag="span">{productSection.subheading}</E>
          </motion.p>
        </div>

        {/* ── "Tüm Ürünler" shortcut ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex justify-center mb-4"
        >
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
            style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
          >
            <E field="products.allProductsLabel" tag="span">{productSection.allProductsLabel}</E> <HiArrowRight />
          </button>
        </motion.div>

        {/* ── Category Cards Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {mergedCategories.map((cat, i) => {
            const isHovered = hovered === cat.id;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.07 }}
                onMouseEnter={() => !cat.comingSoon ? setHovered(cat.id) : undefined}
                onMouseLeave={() => setHovered(null)}
                onClick={() => !cat.comingSoon && router.push(`/products/${cat.id}`)}
                className={`relative rounded-2xl overflow-hidden ${cat.comingSoon ? "opacity-65 cursor-default" : "cursor-pointer"}`}
                style={{
                  background: surface,
                  borderTop: `1px solid ${isHovered ? cat.accent + "45" : border}`,
                  borderRight: `1px solid ${isHovered ? cat.accent + "45" : border}`,
                  borderLeft: `1px solid ${isHovered ? cat.accent + "45" : border}`,
                  borderBottom: `3px solid ${cat.accent}`,
                  boxShadow: isHovered
                    ? `0 8px 36px ${cat.accentGlow}, 0 3px 16px ${cat.accentGlow}`
                    : d
                      ? `0 4px 20px ${cat.accentGlow}`
                      : `0 4px 20px ${cat.accentGlow}, 0 2px 10px rgba(0,0,0,0.06)`,
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* ── Visual area ── */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 240,
                    background: d ? cat.darkVisualBg : cat.lightVisualBg,
                  }}
                >
                  {/* Category image (if set) */}
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        opacity: isHovered ? 0.85 : 0.72,
                        transition: "opacity 0.35s ease, transform 0.4s ease",
                        transform: isHovered ? "scale(1.04)" : "scale(1)",
                        zIndex: 0,
                      }}
                    />
                  )}
                  {/* Radial accent glow */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse 70% 65% at 50% 60%, ${cat.accentGlow} 0%, transparent 70%)`,
                      opacity: isHovered ? 0.6 : 0.3,
                      transition: "opacity 0.35s ease",
                    }}
                  />

                  {/* Subtle dot grid */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: d ? 0.04 : 0.06,
                      backgroundImage: `radial-gradient(circle, ${d ? "#fff" : cat.accent} 1px, transparent 1px)`,
                      backgroundSize: "22px 22px",
                    }}
                  />

                  {/* Badge */}
                  {cat.badge && (
                    <div
                      className="absolute top-3 right-3 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: badgeBg, color: badgeColor, border: badgeBorder }}
                    >
                      {cat.badge}
                    </div>
                  )}

                  {/* Icon container — only shown when no category image */}
                  {!cat.image && (
                    <div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      style={{ paddingBottom: 50 }}
                    >
                      <div
                        className="flex items-center justify-center rounded-2xl"
                        style={{
                          width: 96,
                          height: 96,
                          background: d ? `${cat.accent}12` : `${cat.accent}14`,
                          border: `1px solid ${cat.accent}28`,
                          transform: isHovered ? "scale(1.08)" : "scale(1)",
                          transition: "transform 0.35s ease",
                        }}
                      >
                        <cat.icon
                          style={{
                            fontSize: 48,
                            color: d ? "rgba(255,255,255,0.72)" : cat.accent,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom gradient + text overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px 18px 16px",
                      background: overlayGrad,
                      zIndex: 15,
                    }}
                  >
                    <p className="font-bold text-base leading-tight" style={{ color: textPrimary }}>
                      {cat.name}
                    </p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: cat.accent }}>
                      {cat.comingSoon ? "Yakında" : `${cat.modelCount} Model`}
                    </p>
                  </div>
                </div>

                {/* ── Card content below visual ── */}
                <div className="px-4 py-4 flex items-center justify-between">
                  <p className="text-xs" style={{ color: textMuted }}>{cat.subtitle}</p>
                  {!cat.comingSoon && (
                    <div
                      className="flex items-center gap-1 text-xs font-semibold"
                      style={{
                        color: cat.accent,
                        transform: isHovered ? "translateX(2px)" : "translateX(0)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <E field="products.viewLabel" tag="span">{productSection.viewLabel}</E> <HiArrowRight />
                    </div>
                  )}
                </div>

                {/* Bottom accent line on hover */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: cat.accent,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
