"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiWifiLine,
  RiBuilding4Line,
  RiCodeSSlashLine,
  RiSmartphoneLine,
  RiArrowRightLine,
  RiSignalWifiLine,
  RiBatteryChargeLine,
  RiComputerLine,
  RiGlobalLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";

const FEATURE_ICONS = [RiWifiLine, RiBuilding4Line, RiCodeSSlashLine];
const FEATURE_ACCENTS = ["#3B82F6", "#10B981", "#818CF8"];
const ACCENT = "#3B82F6";
const ACCENT2 = "#10B981";

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.76c.35.2.74.24 1.12.14L15.5 12 12 8.5 3.18 23.76zm17.46-11.16c-.38-.22-3.98-2.28-6.44-3.68L10.5 12l3.7 3.7c2.46-1.4 6.06-3.46 6.44-3.68.54-.32.86-.9.86-1.51-.01-.62-.33-1.19-.86-1.51zM2.3.24C2.1.44 2 .73 2 1.06v21.87c0 .34.1.63.3.83L2.44 24l12.22-12.22L2.44.1 2.3.24zm8.2 11.76L2.44 0l-.14.14C2.1.34 2 .63 2 .96v.1L10.5 12z" />
    </svg>
  );
}

export default function SmartCharger() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { smartCharger } = useContent();
  const router = useRouter();
  const d = theme === "dark";

  const bg = d
    ? "linear-gradient(155deg, #111116 0%, #0e0e12 60%, #131315 100%)"
    : "linear-gradient(155deg, #f3f4f8 0%, #f7f8fb 60%, #f5f6fa 100%)";
  const cardBg = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.52)" : "rgba(26,26,26,0.50)";

  const headingLines = smartCharger.heading.split("\n");
  const [mockupIndex, setMockupIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => {
    setDirection(idx > mockupIndex ? 1 : -1);
    setMockupIndex(idx);
  };

  return (
    <section id="smartcharger" className="relative py-14 lg:py-20 overflow-hidden" style={{ background: bg }}>
      <div className="absolute pointer-events-none" style={{ top: "10%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}18 0%, transparent 70%)` }} />
      <div className="absolute pointer-events-none" style={{ bottom: "5%", right: "-6%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT2}14 0%, transparent 70%)` }} />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Mockup carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center lg:items-start order-2 lg:order-1"
          >
            {/* Slide area */}
            <div className="relative" style={{ width: 300, height: 560 }}>
              <AnimatePresence initial={false} mode="wait">
                {mockupIndex === 0 ? (
                  <motion.div
                    key="phone"
                    variants={{
                      enter: { opacity: 0, scale: 0.95 },
                      center: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.95 },
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* ── Phone mockup ── */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="relative rounded-[36px] overflow-hidden"
                        style={{
                          width: 262, height: 534,
                          background: d ? "#0a0a0c" : "#1a1a1e",
                          border: `2.5px solid ${d ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.20)"}`,
                          boxShadow: `0 32px 64px rgba(0,0,0,${d ? "0.65" : "0.35"}), 0 0 0 1px rgba(255,255,255,0.06)`,
                        }}
                      >
                        {/* Dynamic island */}
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 rounded-full"
                          style={{ width: 82, height: 20, background: "#050506", border: "1px solid rgba(255,255,255,0.08)" }} />

                        {/* Screen */}
                        <div className="absolute inset-0 p-4 pt-11 flex flex-col gap-3"
                          style={{ background: "linear-gradient(180deg, #0d1a2e 0%, #091526 100%)" }}>

                          {/* App header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.40)" }}>BEMİS CHARGE</p>
                              <p className="text-[12px] font-bold text-white">Şarj Yönetimi</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <RiSignalWifiLine size={13} style={{ color: ACCENT2 }} />
                              <span className="text-[9px] font-semibold" style={{ color: ACCENT2 }}>Bağlı</span>
                            </div>
                          </div>

                          {/* Charging ring */}
                          <div className="flex justify-center my-1">
                            <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
                              <svg width="96" height="96" className="absolute">
                                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                                <motion.circle
                                  cx="48" cy="48" r="42" fill="none"
                                  stroke={ACCENT} strokeWidth="5"
                                  strokeLinecap="round"
                                  strokeDasharray="264"
                                  initial={{ strokeDashoffset: 264 }}
                                  animate={inView ? { strokeDashoffset: 79 } : { strokeDashoffset: 264 }}
                                  transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                                />
                              </svg>
                              <div className="flex flex-col items-center">
                                <RiBatteryChargeLine size={18} style={{ color: ACCENT }} />
                                <span className="text-lg font-black text-white leading-none">70%</span>
                                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>Şarj Oluyor</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2">
                            {[{ label: "Güç", value: "7.4 kW" }, { label: "Süre", value: "1s 22dk" }, { label: "₺", value: "18.40" }].map(s => (
                              <div key={s.label} className="rounded-xl p-2.5 text-center"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <p className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{s.label}</p>
                                <p className="text-[11px] font-bold text-white">{s.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Charger list */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>Üniteler</p>
                            {[
                              { name: "Ünite #1", status: "Şarj Oluyor", color: ACCENT2 },
                              { name: "Ünite #2", status: "Müsait", color: "rgba(255,255,255,0.28)" },
                              { name: "Ünite #3", status: "Müsait", color: "rgba(255,255,255,0.28)" },
                            ].map(u => (
                              <div key={u.name} className="flex items-center justify-between px-3 py-2 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ background: u.color }} />
                                  <span className="text-[10px] font-medium text-white">{u.name}</span>
                                </div>
                                <span className="text-[9px]" style={{ color: u.color }}>{u.status}</span>
                              </div>
                            ))}
                          </div>

                          {/* OCPP badge */}
                          <div className="mt-auto">
                            <div className="flex items-center justify-center gap-2 py-2 rounded-xl"
                              style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}>
                              <RiSmartphoneLine size={10} style={{ color: ACCENT }} />
                              <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>{smartCharger.ocppBadge}</span>
                            </div>
                          </div>
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full"
                          style={{ width: 64, height: 4, background: "rgba(255,255,255,0.22)" }} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="browser"
                    variants={{
                      enter: { opacity: 0, scale: 0.95 },
                      center: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.95 },
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* ── Web browser mockup ── */}
                    <div>
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          width: 250,
                          background: d ? "#0d1420" : "#f8faff",
                          border: `1.5px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(59,130,246,0.18)"}`,
                          boxShadow: d
                            ? "0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
                            : "0 20px 48px rgba(59,130,246,0.14), 0 0 0 1px rgba(59,130,246,0.08)",
                        }}
                      >
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-3 py-2.5"
                          style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)", borderBottom: `1px solid ${d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
                          </div>
                          <div className="flex-1 mx-1.5 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                            style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>
                            <RiGlobalLine size={9} style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }} />
                            <span className="text-[8px] font-mono truncate" style={{ color: d ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)" }}>app.bemischarge.com</span>
                          </div>
                          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${ACCENT2}20` }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT2 }} />
                          </div>
                        </div>

                        {/* Sidebar + content layout */}
                        <div className="flex" style={{ height: 300 }}>
                          {/* Sidebar */}
                          <div className="flex flex-col gap-1 p-2 flex-shrink-0"
                            style={{ width: 44, background: d ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)", borderRight: `1px solid ${d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                            {[ACCENT, ACCENT2, "#818CF8", "#F59E0B", "#F43F5E"].map((c, i) => (
                              <div key={i} className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto"
                                style={{ background: i === 0 ? `${c}20` : "transparent", border: i === 0 ? `1px solid ${c}30` : "none" }}>
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: i === 0 ? c : `rgba(${d ? "255,255,255" : "0,0,0"},0.15)` }} />
                              </div>
                            ))}
                          </div>

                          {/* Main content */}
                          <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
                            {/* Title + live badge */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold" style={{ color: textPrimary }}>Şarj Yönetim Paneli</span>
                              <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                                style={{ background: `${ACCENT2}18`, color: ACCENT2 }}>
                                <span className="w-1 h-1 rounded-full inline-block" style={{ background: ACCENT2 }} />Canlı
                              </span>
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { label: "Aktif", value: "12", color: ACCENT2 },
                                { label: "Müsait", value: "4", color: ACCENT },
                                { label: "Gelir", value: "₺2.4k", color: "#F59E0B" },
                              ].map(s => (
                                <div key={s.label} className="rounded-xl p-2 text-center"
                                  style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${s.color}20` }}>
                                  <p className="text-[10px] font-black" style={{ color: s.color }}>{s.value}</p>
                                  <p className="text-[7px]" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)" }}>{s.label}</p>
                                </div>
                              ))}
                            </div>

                            {/* Bar chart */}
                            <div className="rounded-xl p-2.5"
                              style={{ background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>
                              <p className="text-[8px] mb-1.5 font-medium" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)" }}>Günlük Kullanım (kWh)</p>
                              <div className="flex items-end gap-1 h-12">
                                {[30, 55, 45, 70, 60, 85, 50].map((h, i) => (
                                  <motion.div
                                    key={i}
                                    className="flex-1 rounded-sm"
                                    style={{ background: i === 5 ? ACCENT : (d ? "rgba(255,255,255,0.10)" : "rgba(59,130,246,0.15)") }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Station list */}
                            <div className="space-y-1">
                              {[
                                { name: "Ünite #1 — Kat -1", color: ACCENT2, status: "Şarj" },
                                { name: "Ünite #2 — Giriş", color: d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.20)", status: "Müsait" },
                                { name: "Ünite #3 — Bahçe", color: d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.20)", status: "Müsait" },
                              ].map(u => (
                                <div key={u.name} className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
                                  style={{ background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: u.color }} />
                                    <span className="text-[8px] font-medium" style={{ color: textPrimary }}>{u.name}</span>
                                  </div>
                                  <span className="text-[7px] font-semibold" style={{ color: u.color }}>{u.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Label */}
                      <div className="mt-2.5 flex items-center justify-center gap-1.5">
                        <RiComputerLine size={12} style={{ color: textMuted }} />
                        <span className="text-[11px] font-medium" style={{ color: textMuted }}>Web Yönetim Paneli</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Carousel indicator ── */}
            <div className="flex items-center gap-3 mt-5">
              {/* Prev */}
              <button
                onClick={() => goTo(Math.max(0, mockupIndex - 1))}
                disabled={mockupIndex === 0}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
                style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", border: `1px solid ${d ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.10)"}` }}
                aria-label="Önceki"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 2L4 6l3.5 4" stroke={d ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {[
                  { idx: 0, icon: <RiSmartphoneLine size={10} />, label: "Mobil" },
                  { idx: 1, icon: <RiComputerLine size={10} />, label: "Web" },
                ].map(({ idx, icon, label }) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      background: mockupIndex === idx
                        ? (idx === 0 ? `${ACCENT}20` : `${ACCENT2}20`)
                        : (d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                      border: `1px solid ${mockupIndex === idx
                        ? (idx === 0 ? `${ACCENT}40` : `${ACCENT2}40`)
                        : (d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)")}`,
                      color: mockupIndex === idx
                        ? (idx === 0 ? ACCENT : ACCENT2)
                        : (d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
                    }}
                  >
                    {icon}
                    <span className="text-[10px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => goTo(Math.min(1, mockupIndex + 1))}
                disabled={mockupIndex === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
                style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", border: `1px solid ${d ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.10)"}` }}
                aria-label="Sonraki"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2L8 6l-3.5 4" stroke={d ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* ── Text content ── */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full"
              style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}
            >
              <RiSmartphoneLine size={12} style={{ color: ACCENT }} />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                {smartCharger.sectionLabel}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-black leading-tight mb-4"
              style={{ color: textPrimary }}
            >
              {headingLines.map((line, i) => (
                <span key={i}>
                  {i === 1 ? <span style={{ color: ACCENT }}>{line}</span> : line}
                  {i < headingLines.length - 1 && <br />}
                </span>
              ))}
            </motion.h2>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="text-sm leading-relaxed mb-5"
              style={{ color: textMuted, maxWidth: 480 }}
            >
              {smartCharger.subheading}
            </motion.p>

            {/* Web + mobile platform vurgu */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.17 }}
              className="flex items-center gap-3 mb-6 p-3.5 rounded-2xl"
              style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.06)", border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(59,130,246,0.14)"}` }}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}15` }}>
                  <RiComputerLine size={16} style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: textPrimary }}>Web Tarayıcı</p>
                  <p className="text-[10px]" style={{ color: textMuted }}>Her cihazdan erişim</p>
                </div>
              </div>
              <div className="w-px h-8 flex-shrink-0" style={{ background: d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT2}15` }}>
                  <RiSmartphoneLine size={16} style={{ color: ACCENT2 }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: textPrimary }}>Mobil Uygulama</p>
                  <p className="text-[10px]" style={{ color: textMuted }}>iOS & Android</p>
                </div>
              </div>
            </motion.div>

            {/* OCPP badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.20 }}
              className="inline-flex items-center gap-2 mb-7 px-3.5 py-2 rounded-xl"
              style={{ background: `${ACCENT2}10`, border: `1px solid ${ACCENT2}22` }}
            >
              <RiCodeSSlashLine size={14} style={{ color: ACCENT2 }} />
              <span className="text-xs font-semibold" style={{ color: ACCENT2 }}>{smartCharger.ocppBadge}</span>
            </motion.div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {(smartCharger.features ?? []).map((f, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                const accent = FEATURE_ACCENTS[i % FEATURE_ACCENTS.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
                    className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: d ? "none" : "0 1px 6px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}14`, border: `1px solid ${accent}22` }}>
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: textPrimary }}>{f.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA + Store buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.52 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={() => router.push(smartCharger.ctaHref)}
                className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563EB)`, color: "#fff", boxShadow: `0 6px 20px ${ACCENT}40` }}
              >
                {smartCharger.ctaLabel}
                <RiArrowRightLine size={16} />
              </button>

              {/* Store badges */}
              <div className="flex flex-wrap gap-2.5">
                <a href="#"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80 active:scale-95"
                  style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", border: `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}` }}
                >
                  <span style={{ color: d ? "#f0f0f4" : "#1a1a1a" }}><AppleIcon size={18} /></span>
                  <div>
                    <p className="text-[9px] leading-none mb-0.5" style={{ color: textMuted }}>App Store&apos;dan İndir</p>
                    <p className="text-xs font-bold leading-none" style={{ color: textPrimary }}>App Store</p>
                  </div>
                </a>
                <a href="#"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80 active:scale-95"
                  style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", border: `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}` }}
                >
                  <span style={{ color: "#4CAF50" }}><GooglePlayIcon size={17} /></span>
                  <div>
                    <p className="text-[9px] leading-none mb-0.5" style={{ color: textMuted }}>Google Play&apos;den İndir</p>
                    <p className="text-xs font-bold leading-none" style={{ color: textPrimary }}>Google Play</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
