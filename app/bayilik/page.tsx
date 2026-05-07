"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  RiShieldCheckLine, RiMapPinLine, RiHandCoinLine, RiCustomerService2Line,
  RiCheckLine, RiStoreLine, RiArrowRightLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";
import { useEffect } from "react";

const BENEFIT_ICONS = [RiHandCoinLine, RiShieldCheckLine, RiCustomerService2Line, RiMapPinLine, RiStoreLine, RiArrowRightLine];
const BENEFIT_COLORS = ["#10B981", "#818CF8", "#F59E0B", "#3B82F6", "#F97316", "#EC4899"];

type InfoRow = { label: string; value: string };
type Benefit = { title: string; body: string };
type BayilikContent = { heading1: string; heading2: string; description: string; infoTable: InfoRow[]; benefits: Benefit[]; criteria: string[]; heroBg?: string };

const DEFAULT: BayilikContent = {
  heading1: "Bemis E-V Charge", heading2: "Bayisi Olun",
  description: "Türkiye genelinde büyüyen bayi ağımıza katılın; EV şarj altyapısı pazarındaki hızlı büyümeden birlikte yararlanın.",
  infoTable: [],
  benefits: [
    { title: "Rekabetçi Bayi Fiyatları",  body: "Hacme göre kademeli iskonto yapısı; küçük başlayıp büyüyebilirsiniz." },
    { title: "Stok & Tedarik Güvencesi",  body: "Öncelikli sipariş kuyruğu ve garantili teslimat takvimi." },
    { title: "Teknik Destek",              body: "Kurulum, arıza ve müşteri sorularında doğrudan teknik hat." },
    { title: "Bölge Koruması",             body: "Anlaşmalı bayilere bölgesel münhasırlık imkânı." },
    { title: "Pazarlama Desteği",          body: "Ürün görselleri, kataloglar, demo ürün ve showroom materyalleri." },
    { title: "Hızlı Başlangıç",           body: "Minimum stok yükümlülüğüyle bayiliğe başlayın, büyüdükçe artırın." },
  ],
  criteria: [
    "Elektrik, enerji veya otomotiv sektöründe faaliyet",
    "Yetkili satış & servis kapasitesi",
    "Bölgesel müşteri portföyü veya bayi ağı",
    "Temel teknik kurulum bilgisi (veya ekip)",
  ],
};

export default function BayilikPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [cms, setCms] = useState<BayilikContent>(DEFAULT);

  useEffect(() => {
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data) => {
      if (data?.bayilik) setCms(data.bayilik);
    }).catch(() => {});
  }, [lang]);

  const bg      = d ? "#0c0c0e" : "#f8f8fb";
  const bgSub   = d ? "#111114" : "#ffffff";
  const card    = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const text    = d ? "#f0f0f4" : "#1a1a2e";
  const muted   = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow  = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const GREEN   = "#10B981";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: bgSub,
          borderBottom: `1px solid ${border}`,
          paddingTop: 112,
          paddingBottom: 56,
        }}
      >
        {cms.heroBg && (
          <>
            <Image src={cms.heroBg} alt="" fill priority quality={90} sizes="100vw" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: d
                  ? "linear-gradient(135deg, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.62) 55%, rgba(8,8,12,0.38) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.30) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} className="flex items-center gap-2 mb-10 group"
            style={{ color: faint, fontSize: "0.875rem" }}>
            <HiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Geri
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiStoreLine style={{ color: GREEN, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: GREEN }}>Bayi Ağı</span>
            </div>
            <h1 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {cms.heading1}<br />
              <span style={{ color: GREEN }}>{cms.heading2}</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[2px] w-24 origin-left rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN}66 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${GREEN}45`,
              }}
            />
            <p className="leading-relaxed max-w-xl" style={{ color: muted, fontSize: "0.9375rem" }}>
              {cms.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits — single card with bullet list ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>Bayi Avantajları</p>
            <h2 className="text-xl font-black" style={{ color: text }}>Neden Bemis Bayisi Olunur?</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
          >
            <div className="flex flex-col gap-5">
              {(cms.benefits ?? DEFAULT.benefits).map((b, i, arr) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                const color = BENEFIT_COLORS[i % BENEFIT_COLORS.length];
                return (
                  <motion.div key={b.title}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 * i }}
                    className="flex items-start gap-4 pb-5"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${border}` : "none" }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon style={{ fontSize: 18, color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base mb-1" style={{ color: text }}>{b.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: muted }}>{b.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Criteria + Info ── */}
      <section style={{ background: bgSub, padding: "52px 0", borderBottom: `1px solid ${border}` }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>Başvuru Koşulları</p>
              <h2 className="text-xl font-black mb-4" style={{ color: text }}>Aranan Kriterler</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: muted }}>
                Elektrik, enerji veya otomotiv sektöründe faaliyet gösteren, bölgesine değer katmak
                isteyen her kuruma kapımız açık.
              </p>
              <ul className="space-y-3">
                {(cms.criteria ?? DEFAULT.criteria).map(c => (
                  <li key={c} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
                      <RiCheckLine style={{ fontSize: 11, color: GREEN }} />
                    </div>
                    <span className="text-sm" style={{ color: muted }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-4" style={{ color: faint }}>Hızlı Bilgi</p>
              <div className="space-y-3">
                {(cms.infoTable ?? []).map(row => (
                  <div key={row.label} className="flex justify-between gap-4 pb-3" style={{ borderBottom: `1px solid ${border}` }}>
                    <span className="text-xs" style={{ color: faint }}>{row.label}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: text }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBar />
    </div>
  );
}
