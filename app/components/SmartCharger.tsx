"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RiWifiLine,
  RiBuilding4Line,
  RiCodeSSlashLine,
  RiSmartphoneLine,
  RiArrowRightLine,
  RiSignalWifiLine,
  RiBatteryChargeLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";

const FEATURE_ICONS = [RiWifiLine, RiBuilding4Line, RiCodeSSlashLine];
const FEATURE_ACCENTS = ["#3B82F6", "#10B981", "#818CF8"];

const ACCENT = "#3B82F6";
const ACCENT2 = "#10B981";

export default function SmartCharger() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { smartCharger } = useContent();
  const router = useRouter();
  const d = theme === "dark";

  const bg = d
    ? "linear-gradient(155deg, #101820 0%, #0e0e10 60%, #141414 100%)"
    : "linear-gradient(155deg, #eaf4ff 0%, #f5faff 60%, #f0f8f4 100%)";
  const cardBg = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.52)" : "rgba(26,26,26,0.50)";

  const headingLines = smartCharger.heading.split("\n");

  return (
    <section id="smartcharger" className="relative py-14 lg:py-20 overflow-hidden" style={{ background: bg }}>
      {/* Background glow blobs */}
      <div className="absolute pointer-events-none" style={{ top: "10%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}18 0%, transparent 70%)` }} />
      <div className="absolute pointer-events-none" style={{ bottom: "5%", right: "-6%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT2}14 0%, transparent 70%)` }} />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative" style={{ width: 260 }}>
              {/* Glow under phone */}
              <div className="absolute inset-0 -bottom-8 blur-3xl opacity-30 rounded-[40px]" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }} />

              {/* Phone frame */}
              <div
                className="relative rounded-[36px] overflow-hidden"
                style={{
                  width: 260,
                  height: 530,
                  background: d ? "#0a0a0c" : "#1a1a1e",
                  border: `2px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.18)"}`,
                  boxShadow: `0 32px 64px rgba(0,0,0,${d ? "0.55" : "0.30"}), 0 0 0 1px rgba(255,255,255,0.06)`,
                }}
              >
                {/* Dynamic island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full"
                  style={{ width: 90, height: 22, background: "#050506", border: "1px solid rgba(255,255,255,0.08)" }} />

                {/* Screen content */}
                <div className="absolute inset-0 p-5 pt-14 flex flex-col gap-3"
                  style={{ background: "linear-gradient(180deg, #0d1a2e 0%, #091526 100%)" }}>

                  {/* App header */}
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>BEMİS CHARGE</p>
                      <p className="text-xs font-bold text-white">Şarj Yönetimi</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <RiSignalWifiLine size={12} style={{ color: ACCENT2 }} />
                      <span className="text-[9px] font-semibold" style={{ color: ACCENT2 }}>Bağlı</span>
                    </div>
                  </div>

                  {/* Charging ring */}
                  <div className="flex justify-center my-2">
                    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
                      {/* Outer ring */}
                      <svg width="96" height="96" className="absolute">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                        <motion.circle
                          cx="48" cy="48" r="42" fill="none"
                          stroke={ACCENT} strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray="264"
                          initial={{ strokeDashoffset: 264 }}
                          animate={inView ? { strokeDashoffset: 80 } : { strokeDashoffset: 264 }}
                          transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                          style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <RiBatteryChargeLine size={20} style={{ color: ACCENT }} />
                        <span className="text-lg font-black text-white leading-none">70%</span>
                        <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>Şarj Oluyor</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Güç", value: "7.4 kW" },
                      { label: "Süre", value: "1s 22dk" },
                      { label: "Maliyet", value: "₺18.4" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-2 text-center"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <p className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{s.label}</p>
                        <p className="text-[11px] font-bold text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charger list */}
                  <div className="space-y-1.5 mt-1">
                    <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Üniteler</p>
                    {[
                      { name: "Ünite #1", status: "Şarj Oluyor", color: ACCENT2 },
                      { name: "Ünite #2", status: "Müsait", color: "rgba(255,255,255,0.3)" },
                      { name: "Ünite #3", status: "Müsait", color: "rgba(255,255,255,0.3)" },
                    ].map((u) => (
                      <div key={u.name} className="flex items-center justify-between px-2.5 py-2 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: u.color }} />
                          <span className="text-[10px] font-medium text-white">{u.name}</span>
                        </div>
                        <span className="text-[9px]" style={{ color: u.color }}>{u.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* OCPP badge at bottom */}
                  <div className="mt-auto pt-2">
                    <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl"
                      style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}>
                      <RiSmartphoneLine size={10} style={{ color: ACCENT }} />
                      <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>{smartCharger.ocppBadge}</span>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: 70, height: 3, background: "rgba(255,255,255,0.22)" }} />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute -right-8 top-20 rounded-2xl px-3 py-2 flex items-center gap-2"
                style={{
                  background: d ? "rgba(16,24,20,0.95)" : "rgba(255,255,255,0.96)",
                  border: `1px solid ${ACCENT2}30`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.24)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT2}18` }}>
                  <RiWifiLine size={12} style={{ color: ACCENT2 }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold" style={{ color: textPrimary }}>Bağlantı Aktif</p>
                  <p className="text-[9px]" style={{ color: textMuted }}>OCPP Bağlı</p>
                </div>
              </motion.div>
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
              className="text-sm leading-relaxed mb-6"
              style={{ color: textMuted, maxWidth: 480 }}
            >
              {smartCharger.subheading}
            </motion.p>

            {/* OCPP badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.18 }}
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
                    transition={{ duration: 0.45, delay: 0.22 + i * 0.08 }}
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

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              onClick={() => router.push(smartCharger.ctaHref)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563EB)`, color: "#fff", boxShadow: `0 6px 20px ${ACCENT}40` }}
            >
              {smartCharger.ctaLabel}
              <RiArrowRightLine size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
