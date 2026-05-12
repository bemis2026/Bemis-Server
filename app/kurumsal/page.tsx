"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import Image from "next/image";
import {
  RiShieldCheckLine, RiGlobalLine, RiLeafLine, RiAwardLine,
  RiCpuLine, RiMedalLine, RiGlobeLine, RiBuilding4Line,
  RiToolsLine, RiCodeLine, RiStackLine, RiCheckboxCircleLine, RiImageAddLine,
} from "react-icons/ri";

// Accept any of the common YouTube URL shapes and return the bare video ID.
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  // If the user already pasted a bare 11-character ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

const HIGHLIGHT_META = [
  { icon: RiAwardLine,       accent: "#e0e0e8" },
  { icon: RiShieldCheckLine, accent: "#c8c8d2" },
  { icon: RiGlobalLine,      accent: "#b8b8c4" },
  { icon: RiLeafLine,        accent: "#d0d0da" },
];

const FEATURE_META = [
  { icon: RiCpuLine,   accent: "#d8d8e2" },
  { icon: RiMedalLine, accent: "#c0c0cc" },
  { icon: RiGlobeLine, accent: "#c8c8d4" },
  { icon: RiLeafLine,  accent: "#b0b0bc" },
];

const FALLBACK_CERTS = [
  { label: "CE",        sub: "Avrupa Uygunluk"        },
  { label: "IP65",      sub: "Toz & Su Koruması"      },
  { label: "IEC 61851", sub: "EV Şarj Sistemi Std."   },
  { label: "IEC 62196", sub: "EV Konektör Std."        },
  { label: "OCPP 2.0",  sub: "Açık Şarj Protokolü"   },
  { label: "ISO 9001",  sub: "Kalite Yönetim Sistemi" },
  { label: "TSE",       sub: "Türk Standartları"       },
];

// Icons stay code-side (visual identity), labels live in the CMS.
const PRODUCTION_STEP_ICONS = [
  RiCpuLine,            // PCB
  RiToolsLine,          // Elektronik İmalat
  RiCodeLine,           // Yazılım
  RiStackLine,          // Cihaz Tasarımı
  RiCheckboxCircleLine, // Test & Kalite
];

const FALLBACK_PRODUCTION_LABELS = [
  "PCB Tasarımı",
  "Elektronik İmalat",
  "Yazılım",
  "Cihaz Tasarımı",
  "Test & Kalite",
];

const FALLBACK_TIMELINE = [
  { year: "1994", title: "Kuruluş",     desc: "Bursa'da Bemis Teknik Elektrik A.Ş. kuruldu." },
  { year: "2000", title: "İhracat",     desc: "Ürünler ilk kez uluslararası pazarlara çıktı." },
  { year: "2010", title: "Büyüme",      desc: "Bursa OSB'de 11.000 m² modern tesis açıldı." },
  { year: "2020", title: "EV Dönüşümü", desc: "Bemis E-V Charge markasıyla EV şarj pazarına girildi." },
  { year: "2024", title: "Bugün",       desc: "60+ ülkeye ihracat, 6000+ ürün çeşidi." },
];

export default function KurumsalPage() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const { dna } = useContent();
  const [searchOpen, setSearchOpen] = useState(false);
  const [aboutVideoReady, setAboutVideoReady] = useState(false);

  const bg         = d ? "linear-gradient(180deg, #0c0c0e 0%, #111113 100%)" : "#f8f8fb";
  const surface    = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border     = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary= d ? "#f0f0f4" : "#1a1a1a";
  const textMuted  = d ? "rgba(240,240,244,0.52)" : "rgba(26,26,26,0.52)";
  const textFaint  = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,26,0.28)";
  const divider    = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const BLUE       = "#3B82F6";

  const highlights = (dna.highlights ?? []).map((h, i) => ({ ...HIGHLIGHT_META[i % HIGHLIGHT_META.length], ...h }));
  const features   = (dna.features   ?? []).map((f, i) => ({ ...FEATURE_META[i % FEATURE_META.length],   ...f }));
  const timeline   = (dna.timeline && dna.timeline.length > 0) ? dna.timeline : FALLBACK_TIMELINE;
  const certs      = (dna.certifications && dna.certifications.length > 0) ? dna.certifications : FALLBACK_CERTS;
  const aboutVideoId = extractYouTubeId(dna.aboutVideo ?? "");
  const productionLabels = (() => {
    const src = dna.productionStepLabels;
    if (!src || src.length === 0) return FALLBACK_PRODUCTION_LABELS;
    // Fall back per-slot so a partially-populated bin still renders the
    // remaining step labels with the default copy.
    return FALLBACK_PRODUCTION_LABELS.map((fb, i) => (src[i]?.trim() ? src[i] : fb));
  })();
  const productionFinalLabel = dna.productionFinalLabel?.trim() || "Son Ürün";
  const kLabels = dna.kurumsalLabels ?? {};
  const txtProductionEyebrow = kLabels.productionEyebrow || "Üretim Süreci";
  const txtProductionHeading = kLabels.productionHeading || "Tasarımdan Son Ürüne";
  const txtProductionMadeIn  = kLabels.productionMadeIn  || "🇹🇷 Yerli Üretim";
  const txtTimelineEyebrow   = kLabels.timelineEyebrow   || "Tarihçe";
  const txtTimelineHeading   = kLabels.timelineHeading   || "Bemis Yolculuğu";
  const txtValuesEyebrow     = kLabels.valuesEyebrow     || "Değerlerimiz, Teknoloji & Sertifikalar";
  const GREEN      = "#10B981";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />


      <div className="relative z-10">

        {/* ── Hero section ── */}
        <div
          className="pt-28 pb-14 px-5 sm:px-6 lg:px-8 overflow-hidden"
          style={{
            background: d
              ? "linear-gradient(160deg, #111113 0%, #161618 50%, #0f0f11 100%)"
              : "linear-gradient(160deg, #f2f2f2 0%, #f8f8f8 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
                  style={{
                    background: d ? `${BLUE}18` : `${BLUE}10`,
                    border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
                    color: d ? "#93C5FD" : BLUE,
                  }}
                >
                  {dna.sectionLabel}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.07 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3"
                  style={{ color: textPrimary }}
                >
                  {dna.brandHeading.split("\n").map((line, i, arr) => (
                    <span key={i} style={i === arr.length - 1 ? { color: BLUE } : {}}>
                      {line}{i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="h-[2px] w-24 origin-left rounded-full mb-5"
                  style={{
                    background: `linear-gradient(90deg, ${BLUE} 0%, ${BLUE}66 60%, transparent 100%)`,
                    boxShadow: `0 0 12px ${BLUE}45`,
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="text-base leading-relaxed mb-4"
                  style={{ color: textMuted }}
                >
                  {dna.brandPara1}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="text-sm leading-relaxed"
                  style={{ color: textFaint }}
                >
                  {dna.brandPara2}
                </motion.p>
              </div>

              {/* Factory image or placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  height: 320,
                  background: d
                    ? "linear-gradient(135deg, #141414 0%, #1c1c1c 50%, #111111 100%)"
                    : "linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)",
                  border: d ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: d
                      ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
                      : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                {dna.factoryImage ? (
                  <Image src={dna.factoryImage} alt="Bemis Fabrika" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <RiBuilding4Line style={{ fontSize: 72, color: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)" }} />
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: d ? "linear-gradient(to top, rgba(12,12,14,0.9) 0%, transparent 100%)" : "linear-gradient(to top, rgba(235,235,235,0.9) 0%, transparent 100%)" }}
                />
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <div>
                    <div className="text-2xl font-black" style={{
                      backgroundImage: d
                        ? "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{dna.yearLabel}</div>
                    <div className="text-[9px] font-medium" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>EST. · Bursa · Türkiye</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Featured video + Bemis Group brands strip — two-column on
             desktop so the video sits left and the brand identity card
             reads beside it. Stacks on mobile. */}
        {(aboutVideoId || (dna.groupBrands && dna.groupBrands.length > 0)) && (
          <div className="pt-12 pb-2 px-5 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-6 items-stretch">
              {aboutVideoId && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative group rounded-3xl overflow-hidden lg:col-span-3 transition-transform duration-300 hover:scale-[1.005]"
                  style={{
                    border: `1px solid ${BLUE}25`,
                    background: d ? "#0a0a0c" : "#ffffff",
                    boxShadow: d
                      ? `0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px ${BLUE}10, 0 0 80px ${BLUE}18`
                      : `0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px ${BLUE}10, 0 0 60px ${BLUE}10`,
                  }}
                >
                  <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    {/* Same passive-screen treatment as the homepage DNA
                        video: hide YouTube controls, kill keyboard +
                        fullscreen, block hover with pointer-events: none.
                        Black poster covers the iframe until onLoad +
                        700ms so the YouTube splash never flashes. */}
                    <div
                      aria-hidden
                      className="transition-opacity duration-700 pointer-events-none"
                      style={{ position: "absolute", inset: 0, zIndex: 10, background: "#0a0a0a", opacity: aboutVideoReady ? 0 : 1 }}
                    />
                    <iframe
                      src={
                        `https://www.youtube-nocookie.com/embed/${aboutVideoId}` +
                        `?autoplay=1&mute=1` +
                        `&loop=1&playlist=${aboutVideoId}` +
                        `&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1` +
                        `&iv_load_policy=3&fs=0`
                      }
                      title="Bemis E-V Charge"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      onLoad={() => setTimeout(() => setAboutVideoReady(true), 700)}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, pointerEvents: "none" }}
                    />
                  </div>
                  <div
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full pointer-events-none"
                    style={{
                      background: d ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: `1px solid ${BLUE}35`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BLUE }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: d ? "#93C5FD" : BLUE }}>HD</span>
                  </div>
                </motion.div>
              )}

              {/* Bemis Group brand strip — sits beside the video */}
              {(dna.groupBrandsTitle || dna.groupBrandsBody || (dna.groupBrands && dna.groupBrands.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-3xl p-6 lg:col-span-2 flex flex-col"
                  style={{
                    border: `1px solid ${BLUE}25`,
                    background: d
                      ? `linear-gradient(135deg, ${BLUE}10 0%, rgba(255,255,255,0.02) 100%)`
                      : `linear-gradient(135deg, ${BLUE}0d 0%, rgba(0,0,0,0.01) 100%)`,
                    boxShadow: d ? "none" : "0 8px 28px rgba(0,0,0,0.07)",
                  }}
                >
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: d ? "#93C5FD" : BLUE }}>
                    {dna.groupBrandsTitle ?? "Bemis Grup Markaları"}
                  </p>
                  {dna.groupBrandsBody && (
                    <p className="text-sm leading-relaxed mb-4" style={{ color: textMuted }}>
                      {dna.groupBrandsBody}
                    </p>
                  )}
                  {/* Org-tree sits right under the body paragraph
                      instead of pushed to the bottom of the card —
                      that empty slot at the bottom is now reserved
                      for the brand slogan, which moved here from the
                      standalone quote block below. */}
                  {(() => {
                    const brands = dna.groupBrands ?? [];
                    if (brands.length === 0) return null;
                    const [parent, ...children] = brands;
                    const cardBg     = d ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)";
                    const cardBorder = d ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.07)";
                    const lineColor  = d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.18)";
                    const renderLogo = (b: { name: string; logo?: string }, size: number, maxW: number) => (
                      b.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.logo} alt={b.name} style={{ height: size, width: "auto", maxWidth: maxW, objectFit: "contain" }} loading="lazy" decoding="async" />
                      ) : (
                        <span
                          className="inline-flex items-center justify-center rounded-lg font-black"
                          style={{ width: size, height: size, fontSize: size * 0.4, background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: d ? "1px dashed rgba(255,255,255,0.20)" : "1px dashed rgba(0,0,0,0.20)", color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)" }}
                        >{b.name?.[0] ?? "?"}</span>
                      )
                    );
                    return (
                      <div className="flex flex-col items-center w-full">
                        {/* Parent brand — logo'nun kendisi brand adını
                            içerdiği için (Bemis logosu "bemis®" yazısı
                            ile birlikte geliyor), yan yana metin koymuyoruz.
                            Logo orta, dikey hizalı, height/width-cap
                            daha cömert: wide-format logoyu da kare-format
                            logoyu da rahat barındırır. */}
                        <div
                          className="flex items-center justify-center rounded-2xl px-6 py-4"
                          style={{ background: cardBg, border: cardBorder, minHeight: 96, minWidth: 240 }}
                        >
                          {parent.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={parent.logo}
                              alt={parent.name}
                              style={{ height: 76, width: "auto", maxWidth: 320, objectFit: "contain" }}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span className="text-lg font-black tracking-tight" style={{ color: textPrimary }}>{parent.name}</span>
                          )}
                        </div>
                        {children.length > 0 && (
                          <>
                            <div style={{ width: 1, height: 18, background: lineColor }} />
                            {children.length > 1 && (
                              <div style={{ height: 1, background: lineColor, width: `${Math.min(85, children.length * 42)}%` }} />
                            )}
                            <div className="flex justify-center gap-3 w-full">
                              {children.map((b, i) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div style={{ width: 1, height: 14, background: lineColor }} />
                                  <div
                                    className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3"
                                    style={{ background: cardBg, border: cardBorder, minHeight: 84 }}
                                  >
                                    {renderLogo(b, 44, 150)}
                                    <span className="text-[11px] font-bold text-center leading-tight" style={{ color: textPrimary }}>{b.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                  {/* Slogan / quote — moved from its standalone
                      centered block on the page into the bottom of
                      this card so the brand identity reads as
                      logos+statement together. */}
                  {dna.quote && (
                    <div className="mt-auto pt-6">
                      <p className="text-sm italic font-semibold leading-snug text-center" style={{ color: textPrimary }}>
                        &ldquo;{dna.quote}&rdquo;
                      </p>
                      {dna.quoteAttr && (
                        <p className="text-[11px] mt-1.5 text-center" style={{ color: textFaint }}>
                          — {dna.quoteAttr}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ── Timeline (full-width, horizontal "journey" map) ── */}
        <div className="py-16 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <span
                className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: d ? `${BLUE}18` : `${BLUE}10`,
                  border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
                  color: d ? "#93C5FD" : BLUE,
                }}
              >
                {txtTimelineEyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: textPrimary }}>
                {txtTimelineHeading}
              </h2>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="h-[2px] w-24 origin-left rounded-full mt-3"
                style={{ background: `linear-gradient(90deg, ${BLUE} 0%, ${BLUE}66 60%, transparent 100%)`, boxShadow: `0 0 12px ${BLUE}45` }}
              />
            </div>

            {/* Horizontal journey rail. Connector line runs behind every
                checkpoint; on mobile the layout collapses into a vertical
                stack so the rail rotates 90°. */}
            <div className="relative">
              {/* Horizontal connector — desktop only. Sits behind the cards
                  and runs the full width of the rail. */}
              <div
                className="hidden md:block absolute left-0 right-0 pointer-events-none"
                style={{
                  top: 26,
                  height: 2,
                  background: `linear-gradient(90deg, transparent 0%, ${BLUE}33 5%, ${BLUE}80 50%, ${BLUE}33 95%, transparent 100%)`,
                  boxShadow: `0 0 16px ${BLUE}30`,
                }}
                aria-hidden
              />

              <div
                className="grid gap-4 md:gap-3"
                style={{ gridTemplateColumns: `repeat(${timeline.length}, minmax(0, 1fr))` }}
              >
                {timeline.map((item, i) => {
                  const isLast = i === timeline.length - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.45 }}
                      className="relative flex flex-col items-center text-center"
                    >
                      {/* Year pill (sits on the rail) */}
                      <div
                        className="relative inline-flex items-center justify-center px-3.5 py-2 rounded-full font-black text-sm tabular-nums"
                        style={{
                          background: isLast ? BLUE : (d ? "#1a1a1d" : "#ffffff"),
                          border: `2px solid ${isLast ? BLUE : (d ? `${BLUE}45` : `${BLUE}35`)}`,
                          color: isLast ? "#ffffff" : (d ? "#93C5FD" : BLUE),
                          boxShadow: isLast ? `0 0 24px ${BLUE}55, 0 0 0 4px ${BLUE}18` : `0 4px 12px ${d ? "rgba(0,0,0,0.30)" : "rgba(0,0,0,0.10)"}`,
                          minWidth: 64,
                          zIndex: 2,
                        }}
                      >
                        {item.year}
                      </div>

                      {/* Drop line connecting the year pill to the card */}
                      <div
                        className="w-px"
                        style={{ height: 14, background: d ? `${BLUE}45` : `${BLUE}35` }}
                        aria-hidden
                      />

                      {/* Detail card */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-2xl px-3 py-3 w-full"
                        style={{
                          background: surface,
                          border: `1px solid ${isLast ? `${BLUE}35` : border}`,
                          boxShadow: isLast
                            ? `0 8px 28px ${BLUE}22, 0 0 0 1px ${BLUE}10`
                            : (d ? "0 4px 14px rgba(0,0,0,0.20)" : "0 2px 10px rgba(0,0,0,0.05)"),
                          minHeight: 100,
                        }}
                      >
                        <p
                          className="font-bold text-sm leading-tight mb-1"
                          style={{ color: textPrimary }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="text-[11px] leading-snug"
                          style={{ color: textMuted }}
                        >
                          {item.desc}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Production process ── */}
        <div className="py-12 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
                {/* Section heading — matches the timeline + values
                    sections so the kurumsal page reads as one coherent
                    document. */}
                <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                  <div>
                    <span
                      className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-3"
                      style={{
                        background: d ? `${BLUE}18` : `${BLUE}10`,
                        border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
                        color: d ? "#93C5FD" : BLUE,
                      }}
                    >
                      {txtProductionEyebrow}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black" style={{ color: textPrimary }}>
                      {txtProductionHeading}
                    </h2>
                    <div
                      className="h-[2px] w-24 origin-left rounded-full mt-3"
                      style={{ background: `linear-gradient(90deg, ${BLUE} 0%, ${BLUE}66 60%, transparent 100%)`, boxShadow: `0 0 12px ${BLUE}45` }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-bold px-3 py-1.5 rounded-full self-start"
                    style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}
                  >
                    {txtProductionMadeIn}
                  </span>
                </div>

                {/* Production steps grid — 3 cols on tablet+, 2 on mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {[...PRODUCTION_STEP_ICONS.map((icon, i) => ({ icon, label: productionLabels[i] })), { icon: null as null, label: productionFinalLabel }].map((step, i) => {
                    const imgSrc = dna.productionStepImages?.[i];
                    const isFinal = i === PRODUCTION_STEP_ICONS.length;
                    const StepIcon = step.icon;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 + i * 0.06 }}
                        className="rounded-xl overflow-hidden"
                        style={{
                          border: isFinal
                            ? `1px solid ${GREEN}50`
                            : `1px solid ${border}`,
                          background: isFinal
                            ? `${GREEN}08`
                            : surface,
                        }}
                      >
                        {/* Image area */}
                        <div
                          className="relative w-full overflow-hidden"
                          style={{ aspectRatio: "4/3", background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}
                        >
                          {imgSrc ? (
                            <Image src={imgSrc} alt={step.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {isFinal ? (
                                <RiCheckboxCircleLine style={{ fontSize: 26, color: `${GREEN}50` }} />
                              ) : StepIcon ? (
                                <StepIcon style={{ fontSize: 26, color: d ? `${BLUE}40` : `${BLUE}30` }} />
                              ) : (
                                <RiImageAddLine style={{ fontSize: 22, color: d ? `${BLUE}40` : `${BLUE}30` }} />
                              )}
                            </div>
                          )}

                          {/* Step number badge */}
                          <div
                            className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: isFinal ? GREEN : (d ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.88)"),
                              color: isFinal ? "#fff" : (d ? "#93C5FD" : BLUE),
                              backdropFilter: "blur(6px)",
                            }}
                          >
                            {isFinal ? "✓" : `0${i + 1}`}
                          </div>
                        </div>

                        {/* Label row */}
                        <div className="flex items-center gap-1.5 px-2.5 py-2">
                          {isFinal ? (
                            <RiCheckboxCircleLine style={{ fontSize: 11, color: GREEN, flexShrink: 0 }} />
                          ) : StepIcon ? (
                            <StepIcon style={{ fontSize: 11, color: d ? "#93C5FD" : BLUE, flexShrink: 0 }} />
                          ) : null}
                          <span
                            className="text-[10px] font-semibold truncate"
                            style={{ color: isFinal ? GREEN : textPrimary }}
                          >
                            {step.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

            </motion.div>
          </div>
        </div>

        {/* ── Integrated: Değerlerimiz, Teknoloji & Sertifikalar ── */}
        <div className="py-14 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto">

            {/* Section heading */}
            <div className="mb-10">
              <span
                className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
                style={{ background: d ? `${BLUE}18` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`, color: d ? "#93C5FD" : BLUE }}
              >
                {txtValuesEyebrow}
              </span>
              <div className="h-px w-16 mt-1" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
            </div>

            {/* Two-column editorial list */}
            <div className="grid lg:grid-cols-2 gap-x-16 gap-y-0">

              {/* Left — highlights */}
              <div>
                {highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex gap-4 py-6"
                    style={{ borderBottom: i < highlights.length - 1 ? `1px solid ${divider}` : "none" }}
                  >
                    <item.icon style={{ fontSize: 18, color: d ? "#93C5FD" : BLUE, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: textPrimary }}>{item.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right — features */}
              <div>
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.08 }}
                    className="flex gap-4 py-6"
                    style={{ borderBottom: i < features.length - 1 ? `1px solid ${divider}` : "none" }}
                  >
                    <f.icon style={{ fontSize: 18, color: d ? "#93C5FD" : BLUE, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: textPrimary }}>{f.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sertifikalar — inline strip. No standalone quote
                anymore (moved into the brand-bridge card next to the
                video) and no separate sub-eyebrow ("Sertifikalar &
                Standartlar") — this whole section is "Değerlerimiz,
                Teknoloji & Sertifikalar" already. */}
            <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${divider}` }}>
              <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
                {certs.map((c, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{c.label}</span>
                    <span className="text-xs" style={{ color: textFaint }}>{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bemis Grup Markaları stripi videonun yanına taşındı */}

          </div>
        </div>

      </div>
      <ContactBar />
    </div>
  );
}
