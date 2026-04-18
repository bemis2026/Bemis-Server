"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import {
  RiShieldCheckLine, RiBuilding2Line,
  RiStoreLine, RiWifiLine, RiArrowRightLine,
} from "react-icons/ri";

const TAGS = ["OEM Üretici", "Şarj Ağı Operatörü", "Distribütör / Bayi"];

const CHANNELS = [
  {
    href: "/b2b",
    icon: RiBuilding2Line,
    accent: "#3B82F6",
    label: "OEM & Üreticiler",
    sub: "Teknik portföy, özel fiyat, mühendislik desteği",
  },
  {
    href: "/bayilik",
    icon: RiStoreLine,
    accent: "#10B981",
    label: "Bayilik Başvurusu",
    sub: "Bayi ağımıza katılın, bölge koruması alın",
  },
  {
    href: "/operator",
    icon: RiWifiLine,
    accent: "#818CF8",
    label: "Şarj Ağı Operatörleri",
    sub: "OCPP uyumlu ekipman, DLM, uzaktan izleme",
  },
];

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
  const border      = d ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.18)";
  const cardBg      = d ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.70)";
  const cardBorder  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-16"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: d
          ? "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)",
      }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* Left */}
          <div className="max-w-lg">
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

          {/* Right — 3 equal channel cards */}
          <div className="flex flex-col gap-2.5 lg:min-w-[260px]">
            {CHANNELS.map(ch => (
              <button
                key={ch.href}
                onClick={() => router.push(ch.href)}
                className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-all duration-200 hover:scale-[1.015]"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: d ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ch.accent}40`;
                  (e.currentTarget as HTMLElement).style.background = d
                    ? `rgba(255,255,255,0.07)`
                    : "rgba(255,255,255,0.95)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardBorder;
                  (e.currentTarget as HTMLElement).style.background = cardBg;
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: `${ch.accent}15`, border: `1px solid ${ch.accent}25` }}>
                  <ch.icon style={{ fontSize: 17, color: ch.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight" style={{ color: textPrimary }}>{ch.label}</p>
                  <p className="text-[11px] leading-tight mt-0.5 truncate" style={{ color: textMuted }}>{ch.sub}</p>
                </div>
                <RiArrowRightLine size={14} style={{ color: textMuted, flexShrink: 0 }}
                  className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
