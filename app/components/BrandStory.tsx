"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { RiShieldCheckLine, RiGlobalLine, RiLeafLine, RiAwardLine } from "react-icons/ri";

const highlights = [
  {
    icon: RiAwardLine,
    title: "30+ Yıl Deneyim",
    desc: "1994'ten bu yana kesintisiz üretim kalitesi.",
    accent: "#3B82F6",
  },
  {
    icon: RiShieldCheckLine,
    title: "Sertifikalı Kalite",
    desc: "CE, IP65 ve uluslararası EV şarj standartları.",
    accent: "#10B981",
  },
  {
    icon: RiGlobalLine,
    title: "60+ Ülke İhracatı",
    desc: "Türk mühendisliğini dünyaya taşıyoruz.",
    accent: "#F59E0B",
  },
  {
    icon: RiLeafLine,
    title: "Temiz Mobilite",
    desc: "Sürdürülebilir geleceğe katkı, her şarjda.",
    accent: "#818CF8",
  },
];

export default function BrandStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { theme } = useTheme();
  const d = theme === "dark";

  const bg = d ? "#0A0A0A" : "#f8f8fb";
  const cardBg = d ? "rgba(255,255,255,0.035)" : "#ffffff";
  const cardBorder = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const visualBg = d ? "rgba(255,255,255,0.03)" : "#ffffff";
  const visualBorder = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <section id="brand-story" style={{ background: bg }} className="py-12 lg:py-16 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: textMuted }}
            >
              Hakkımızda
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-2xl sm:text-3xl font-bold leading-snug mb-4"
              style={{ color: textPrimary }}
            >
              Bemis kalitesiyle<br />
              yerli EV şarj çözümleri
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm leading-relaxed mb-3"
              style={{ color: textMuted }}
            >
              1994 yılında Bursa&apos;da kurulan Bemis Teknik Elektrik A.Ş., üç dekadı aşan
              tecrübesiyle Türkiye&apos;nin önde gelen elektrik ekipmanları üreticilerinden biri
              haline geldi. Bemis E-V Charge, bu köklü altyapının üzerine inşa edilmiş EV şarj
              alt markamızdır.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm leading-relaxed mb-6"
              style={{ color: textFaint }}
            >
              Bursa OSB&apos;deki tesisimizde elektronik kart tasarımından yazılıma, kablo
              üretiminden son montaja kadar her aşamayı kendimiz gerçekleştiriyoruz.
              60&apos;ı aşkın ülkeye ihraç ettiğimiz ürünler, yerli mühendisliğin küresel
              arenada nasıl yarışabileceğini kanıtlıyor.
            </motion.p>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="rounded-2xl px-5 py-4"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: d ? "none" : "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <p className="text-sm italic leading-relaxed mb-2" style={{ color: textMuted }}>
                &ldquo;Kalite, saygının ifadesidir.&rdquo;
              </p>
              <p className="text-xs font-medium" style={{ color: textFaint }}>
                Bemis E-V Charge Ekibi · Bursa OSB, Türkiye
              </p>
            </motion.div>
          </div>

          {/* Right — Highlights */}
          <div>
            {/* Visual banner */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
              style={{
                background: visualBg,
                border: `1px solid ${visualBorder}`,
                height: 100,
                boxShadow: d ? "none" : "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="text-center select-none">
                <div className="text-4xl font-black" style={{ color: textFaint }}>1994</div>
                <div className="text-xs font-semibold tracking-widest uppercase mt-1" style={{ color: textMuted }}>
                  Bursa · Türkiye · Yerli Üretim
                </div>
              </div>
            </motion.div>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: d ? "none" : "0 1px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}25` }}
                  >
                    <item.icon style={{ fontSize: 16, color: item.accent }} />
                  </div>
                  <h4 className="font-semibold text-xs mb-1" style={{ color: textPrimary }}>
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: textFaint }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
