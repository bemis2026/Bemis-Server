"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import Image from "next/image";
import {
  RiShieldCheckLine, RiGlobalLine, RiLeafLine, RiAwardLine,
  RiCpuLine, RiMedalLine, RiGlobeLine, RiBuilding4Line, RiArrowLeftLine,
  RiToolsLine, RiCodeLine, RiStackLine, RiCheckboxCircleLine,
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

        {/* ── Timeline + Production Widget ── */}
        <div className="py-14 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">

              {/* Timeline — left 2 cols */}
              <div className="lg:col-span-2">
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

              {/* Production flow widget — right 1 col */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>Üretim Süreci</h2>
                <div
                  className="rounded-2xl px-4 py-3.5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: textFaint }}>Uçtan Uca</span>
                    <div className="flex-1 h-px" style={{ background: divider }} />
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(220,38,38,0.10)", color: "#EF4444", border: "1px solid rgba(220,38,38,0.22)" }}
                    >🇹🇷 Yerli</span>
                  </div>

                  {/* Steps */}
                  <div className="flex flex-col">
                    {PRODUCTION_STEPS.map((step, i) => {
                      const imgSrc = dna.productionStepImages?.[i];
                      const isLast = i === PRODUCTION_STEPS.length - 1;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          {/* Icon + connector */}
                          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: d ? `${BLUE}12` : `${BLUE}0d`, border: `1px solid ${BLUE}28` }}
                            >
                              <step.icon style={{ fontSize: 13, color: d ? "#93C5FD" : BLUE }} />
                            </div>
                            <div style={{ width: 1, height: isLast ? 10 : 14, background: isLast ? "rgba(220,38,38,0.18)" : d ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.12)", margin: "2px 0" }} />
                          </div>
                          {/* Label */}
                          <div className="flex-1 py-0.5">
                            <span className="text-xs font-medium" style={{ color: textPrimary }}>{step.label}</span>
                          </div>
                          {/* Circular image slot */}
                          <div
                            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                            style={{ border: `1px dashed ${d ? `${BLUE}28` : `${BLUE}24`}`, background: d ? `${BLUE}07` : `${BLUE}05` }}
                          >
                            {imgSrc
                              ? <img src={imgSrc} alt={step.label} className="w-full h-full object-cover" />
                              : <div style={{ width: 8, height: 8, borderRadius: "50%", background: d ? `${BLUE}22` : `${BLUE}1a` }} />
                            }
                          </div>
                        </div>
                      );
                    })}

                    {/* Son Ürün */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0" style={{ width: 28 }}>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.24)" }}
                        >🇹🇷</div>
                      </div>
                      <div className="flex-1 py-0.5">
                        <span className="text-xs font-bold" style={{ color: "#EF4444" }}>Son Ürün</span>
                      </div>
                      <div
                        className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ border: "1px dashed rgba(220,38,38,0.24)", background: "rgba(220,38,38,0.05)" }}
                      >
                        {dna.productionStepImages?.[5]
                          ? <img src={dna.productionStepImages[5]} alt="Son Ürün" className="w-full h-full object-cover" />
                          : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(239,68,68,0.20)" }} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── Highlights ── */}
        <div className="py-10 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>Öne Çıkanlar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: d ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <item.icon style={{ fontSize: 16, color: d ? item.accent : "rgba(0,0,0,0.50)" }} />
                  </div>
                  <h4 className="font-semibold text-xs mb-1" style={{ color: textPrimary }}>{item.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: textFaint }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="py-10 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>Teknoloji & Kalite</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: d ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <f.icon style={{ fontSize: 20, color: d ? f.accent : "rgba(0,0,0,0.50)" }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: textPrimary }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quote ── */}
        <div className="py-10 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl font-semibold italic mb-3" style={{ color: textPrimary }}>
              &ldquo;{dna.quote}&rdquo;
            </p>
            <p className="text-sm" style={{ color: textFaint }}>— {dna.quoteAttr}</p>
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="py-10 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>Sertifikalar & Standartlar</h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {certs.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 rounded-2xl py-4 px-2 text-center"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <span className="text-xs font-bold" style={{ color: textPrimary }}>{c.label}</span>
                  <span className="text-[8px] leading-tight" style={{ color: textFaint }}>{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="py-14 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="max-w-7xl mx-auto text-center">
            <Image src="/logo-white.png" alt="Bemis E-V Charge" width={180} height={56}
              className="h-12 w-auto object-contain mx-auto mb-5"
              style={{ filter: d ? "none" : "invert(1)" }}
            />
            <p className="text-sm mb-6" style={{ color: textMuted }}>
              Ürünlerimiz, bayilik başvurusu veya iş ortaklığı hakkında bizimle iletişime geçin.
            </p>
            <button
              onClick={() => { router.push("/"); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 300); }}
              className="px-8 py-3.5 rounded-xl text-sm font-bold"
              style={{ background: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)", color: textPrimary, border: `1px solid ${border}` }}
            >
              İletişime Geç
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
