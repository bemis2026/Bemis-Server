"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { RiCpuLine, RiMedalLine, RiGlobeLine, RiLeafLine } from "react-icons/ri";

const ICONS = [RiCpuLine, RiMedalLine, RiGlobeLine, RiLeafLine];

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { technology } = useContent();
  const d = theme === "dark";
  const features = technology.features.map((f, i) => ({ ...f, icon: ICONS[i % ICONS.length] }));
  const certs = technology.certs;

  const bg = d ? "#181818" : "#f8f8fb";
  const cardBg = d ? "rgba(255,255,255,0.035)" : "#ffffff";
  const cardBorder = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const certBg = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const certBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <section id="technology" style={{ background: bg }} className="py-12 lg:py-16 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: textMuted }}
          >
            {technology.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: textPrimary }}
          >
            {technology.heading}
          </motion.h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.07 }}
              className="rounded-2xl p-5"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: d ? "none" : "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25` }}
              >
                <f.icon style={{ fontSize: 20, color: f.accent }} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5" style={{ color: textPrimary }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cert strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {certs.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: certBg, border: `1px solid ${certBorder}`, color: textMuted }}
            >
              {c}
            </span>
          ))}
          <img
            src="/badges/tse.webp"
            alt="TSE"
            className="h-6 w-auto object-contain"
            style={{ filter: d ? "invert(1) brightness(0.85)" : "none", opacity: d ? 0.65 : 0.55 }}
          />
          <img
            src="/badges/yerli-uretim.jpg"
            alt="Yerli Üretim"
            className="h-6 w-auto object-contain"
            style={{ filter: d ? "invert(1) brightness(0.85)" : "none", opacity: d ? 0.65 : 0.55 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
