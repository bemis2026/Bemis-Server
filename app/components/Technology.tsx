"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { RiCpuLine, RiMedalLine, RiGlobeLine, RiLeafLine } from "react-icons/ri";

const features = [
  {
    icon: RiCpuLine,
    title: "Akıllı Şarj Yönetimi",
    desc: "OCPP 1.6 / 2.0 protokolü, dinamik yük dengeleme ve bulut tabanlı uzaktan yönetim.",
    accent: "#3B82F6",
  },
  {
    icon: RiMedalLine,
    title: "Yerli Üretim Kalitesi",
    desc: "Bursa OSB tesisimizde IP65, CE ve ISO 9001 standartlarında üretim. Yazılımdan elektroniğe tam yerli.",
    accent: "#10B981",
  },
  {
    icon: RiGlobeLine,
    title: "Evrensel Uyumluluk",
    desc: "Type 2, CCS, CHAdeMO — tüm EV markalarıyla uyumlu, IEC 61851 & IEC 62196 sertifikalı.",
    accent: "#F59E0B",
  },
  {
    icon: RiLeafLine,
    title: "Sürdürülebilir Tasarım",
    desc: "-40°C / +55°C çalışma aralığı, 100.000+ saat ömür. Uzun ömürlü, az atık.",
    accent: "#818CF8",
  },
];

const certs = ["CE", "IP65", "IEC 61851", "IEC 62196", "OCPP 2.0", "ISO 9001", "TSE"];

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const d = theme === "dark";

  const bg = d ? "#0A0A0A" : "#f8f8fb";
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
            Neden Bemis?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: textPrimary }}
          >
            Üretimden yazılıma — her şey yerli
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
        </motion.div>
      </div>
    </section>
  );
}
