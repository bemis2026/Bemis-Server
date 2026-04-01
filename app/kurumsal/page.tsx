"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import Image from "next/image";
import {
  RiShieldCheckLine, RiGlobalLine, RiLeafLine, RiAwardLine,
  RiCpuLine, RiMedalLine, RiGlobeLine, RiBuilding4Line, RiArrowLeftLine,
  RiToolsLine, RiCodeLine, RiStackLine, RiCheckboxCircleLine, RiImageAddLine,
} from "react-icons/ri";

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

const certs = [
  { label: "CE",        sub: "Avrupa Uygunluk"        },
  { label: "IP65",      sub: "Toz & Su Koruması"      },
  { label: "IEC 61851", sub: "EV Şarj Sistemi Std."   },
  { label: "IEC 62196", sub: "EV Konektör Std."        },
  { label: "OCPP 2.0",  sub: "Açık Şarj Protokolü"   },
  { label: "ISO 9001",  sub: "Kalite Yönetim Sistemi" },
  { label: "TSE",       sub: "Türk Standartları"       },
];

const PRODUCTION_STEPS = [
  { icon: RiCpuLine,            label: "PCB Tasarımı"      },
  { icon: RiToolsLine,          label: "Elektronik İmalat"  },
  { icon: RiCodeLine,           label: "Yazılım"            },
  { icon: RiStackLine,          label: "Cihaz Tasarımı"    },
  { icon: RiCheckboxCircleLine, label: "Test & Kalite"     },
];

const timeline = [
  { year: "1994", title: "Kuruluş", desc: "Bursa'da Bemis Teknik Elektrik A.Ş. kuruldu." },
  { year: "2000", title: "İhracat", desc: "Ürünler ilk kez uluslararası pazarlara çıktı." },
  { year: "2010", title: "Büyüme",  desc: "Bursa OSB'de 11.000 m² modern tesis açıldı."  },
  { year: "2020", title: "EV Dönüşümü", desc: "Bemis E-V Charge markasıyla EV şarj pazarına girildi." },
  { year: "2024", title: "Bugün",   desc: "60+ ülkeye ihracat, 6000+ ürün çeşidi."        },
];

export default function KurumsalPage() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();
  const { dna } = useContent();
  const [searchOpen, setSearchOpen] = useState(false);

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
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-8 group"
              style={{ color: textFaint }}
            >
              <RiArrowLeftLine size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </motion.button>

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
                  className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5"
                  style={{ color: textPrimary }}
                >
                  {dna.brandHeading.split("\n").map((line, i, arr) => (
                    <span key={i} style={i === arr.length - 1 ? { color: BLUE } : {}}>
                      {line}{i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </motion.h1>

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
                  <img src={dna.factoryImage} alt="Bemis Fabrika" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <RiBuilding4Line style={{ fontSize: 72, color: d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", marginBottom: 12 }} />
                    <span className="text-sm font-medium" style={{ color: textFaint }}>Fabrika Fotoğrafı</span>
                    <span className="text-xs mt-1" style={{ color: textFaint }}>Admin panelinden yükleyebilirsiniz</span>
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: d ? "linear-gradient(to top, rgba(12,12,14,0.9) 0%, transparent 100%)" : "linear-gradient(to top, rgba(235,235,235,0.9) 0%, transparent 100%)" }}
                />
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <div>
                    <div className="text-2xl font-black" style={{
                      background: d
                        ? "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%)"
                        : "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{dna.yearLabel}</div>
                    <div className="text-[9px] font-medium" style={{ color: d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>EST. · Bursa · Türkiye</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Timeline + Production ── */}
        <div className="py-14 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

              {/* Timeline — left col */}
              <div>
                <h2 className="text-xl font-bold mb-8" style={{ color: textPrimary }}>Tarihçe</h2>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: divider }} />
                  <div className="space-y-8 pl-8">
                    {timeline.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="relative"
                      >
                        <div
                          className="absolute -left-8 top-1 w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
                          style={{ background: i === timeline.length - 1 ? BLUE : (d ? "#333" : "#ccc"), borderColor: i === timeline.length - 1 ? BLUE : (d ? "#555" : "#aaa") }}
                        />
                        <div className="text-xs font-bold mb-0.5" style={{ color: d ? "#93C5FD" : BLUE }}>{item.year}</div>
                        <div className="font-semibold text-sm mb-0.5" style={{ color: textPrimary }}>{item.title}</div>
                        <div className="text-sm" style={{ color: textFaint }}>{item.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Production — right col, image card grid */}
              <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
              >
                {/* Heading row */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold" style={{ color: textPrimary }}>Üretim Süreci</h2>
                  <span
                    className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(220,38,38,0.10)", color: "#EF4444", border: "1px solid rgba(220,38,38,0.22)" }}
                  >
                    🇹🇷 Yerli Üretim
                  </span>
                </div>

                {/* 3-column card grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[...PRODUCTION_STEPS, { icon: null as any, label: "Son Ürün" }].map((step, i) => {
                    const imgSrc = dna.productionStepImages?.[i];
                    const isFinal = i === PRODUCTION_STEPS.length;
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
                            ? "1px solid rgba(220,38,38,0.32)"
                            : `1px solid ${border}`,
                          background: isFinal
                            ? "rgba(220,38,38,0.05)"
                            : surface,
                        }}
                      >
                        {/* Image area */}
                        <div
                          className="relative w-full overflow-hidden"
                          style={{ aspectRatio: "4/3", background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}
                        >
                          {imgSrc ? (
                            <img src={imgSrc} alt={step.label} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                              <RiImageAddLine style={{ fontSize: 22, color: isFinal ? "rgba(239,68,68,0.28)" : (d ? `${BLUE}44` : `${BLUE}35`) }} />
                              <span
                                className="text-[8px] font-medium text-center px-1 leading-tight"
                                style={{ color: isFinal ? "rgba(239,68,68,0.35)" : textFaint }}
                              >
                                Görsel ekle
                              </span>
                            </div>
                          )}

                          {/* Step number badge */}
                          <div
                            className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: isFinal ? "rgba(220,38,38,0.82)" : (d ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.88)"),
                              color: isFinal ? "#fff" : (d ? "#93C5FD" : BLUE),
                              backdropFilter: "blur(6px)",
                            }}
                          >
                            {isFinal ? "🇹🇷" : `0${i + 1}`}
                          </div>
                        </div>

                        {/* Label row */}
                        <div className="flex items-center gap-1.5 px-2.5 py-2">
                          {!isFinal && StepIcon && (
                            <StepIcon style={{ fontSize: 11, color: d ? "#93C5FD" : BLUE, flexShrink: 0 }} />
                          )}
                          <span
                            className="text-[10px] font-semibold truncate"
                            style={{ color: isFinal ? "#EF4444" : textPrimary }}
                          >
                            {step.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* "Admin panelden ekleyebilirsiniz" hint */}
                {!dna.productionStepImages?.some(Boolean) && (
                  <p className="text-[10px] mt-3 text-center" style={{ color: textFaint }}>
                    Görseller admin paneli → Kurumsal bölümünden eklenebilir
                  </p>
                )}
              </motion.div>

            </div>
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
                Değerlerimiz & Teknoloji
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

            {/* Quote */}
            <div className="mt-12 mb-12 text-center max-w-2xl mx-auto">
              <p className="text-lg font-semibold italic mb-2" style={{ color: textPrimary }}>
                &ldquo;{dna.quote}&rdquo;
              </p>
              <p className="text-xs" style={{ color: textFaint }}>— {dna.quoteAttr}</p>
            </div>

            {/* Sertifikalar — inline strip */}
            <div style={{ borderTop: `1px solid ${divider}`, paddingTop: 32 }}>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase block mb-5" style={{ color: textFaint }}>
                Sertifikalar & Standartlar
              </span>
              <div className="flex flex-wrap gap-5">
                {certs.map((c, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{c.label}</span>
                    <span className="text-xs" style={{ color: textFaint }}>{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
      <ContactBar />
    </div>
  );
}
