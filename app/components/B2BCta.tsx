"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { RiShieldCheckLine, RiArrowRightLine, RiPlugLine, RiCpuLine } from "react-icons/ri";

const TAGS = ["OEM Üretici", "Şarj Ağı Operatörü", "Distribütör / Bayi"];

export default function B2BCta() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();

  const BLUE = "#3B82F6";
  const bg = d
    ? "linear-gradient(135deg, #0d1117 0%, #111318 50%, #0c0f14 100%)"
    : "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #eef2ff 100%)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted   = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,46,0.55)";
  const textFaint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const border      = d ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.18)";

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-18"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: d
          ? "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)",
      }} />

      {/* Decorative icons */}
      <RiPlugLine className="absolute right-8 top-8 pointer-events-none"
        style={{ fontSize: 80, color: BLUE, opacity: d ? 0.04 : 0.06 }} />
      <RiCpuLine className="absolute right-24 bottom-6 pointer-events-none"
        style={{ fontSize: 56, color: BLUE, opacity: d ? 0.03 : 0.05 }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <RiShieldCheckLine style={{ color: BLUE, fontSize: 15 }} />
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: BLUE }}>
                OEM & Kurumsal Satış
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight" style={{ color: textPrimary }}>
              Üretici veya kurumsal alıcı mısınız?
            </h2>

            <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
              DC şarj üniteleri, şarj panoları, OEM elektronik kartlar ve profesyonel
              DC kablolar — EV altyapı çözümleri geliştiren şirketler için özel portföy.
            </p>

            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25`, color: d ? "#93C5FD" : BLUE }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-2.5 lg:min-w-[210px]">
            <button
              onClick={() => router.push("/b2b")}
              className="group flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ background: BLUE, color: "#fff", boxShadow: `0 6px 24px ${BLUE}40` }}
            >
              OEM & Üreticiler
              <RiArrowRightLine size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => router.push("/bayilik")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: d ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.08)",
                border: `1px solid ${border}`,
                color: d ? "#93C5FD" : BLUE,
              }}
            >
              Bayilik Başvurusu
            </button>
            <button
              onClick={() => router.push("/operator")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: d ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.08)",
                border: `1px solid ${border}`,
                color: d ? "#93C5FD" : BLUE,
              }}
            >
              Şarj Ağı Operatörleri
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
