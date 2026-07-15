"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import {
  RiCpuLine, RiCustomerService2Line, RiShieldCheckLine, RiMapPin2Line,
  RiToolsLine, RiPriceTag3Line, RiArrowRightLine, RiStore2Line,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import type { CityPage } from "../lib/cities";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

const PRODUCTS = [
  { name: "AC Wallbox Şarj İstasyonları", href: "/products/wallbox",  note: "Ev & iş yeri · 7,4–22 kW" },
  { name: "Taşınabilir Şarj Cihazları",   href: "/products/portable", note: "Mobil / seyyar şarj" },
  { name: "Type 2 Şarj Kabloları",        href: "/products/cables",   note: "Yerli şarj kablosu üretimi" },
  { name: "V2L / C2L Adaptörler",         href: "/products/v2l-c2l",  note: "Araçtan elektrik çözümleri" },
  { name: "Aksesuarlar",                  href: "/products/accessories", note: "Tutucu, adaptör, ekipman" },
];

export default function CityLandingClient({ city }: { city: CityPage }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const bg          = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint   = d ? "rgba(240,240,244,0.42)" : "rgba(26,26,26,0.45)";

  // Yerel açıyla genel faydalar (şehir adı dinamik yerleştirilir).
  const BENEFITS = [
    { icon: RiMapPin2Line,          title: `${city.city} merkezli üretici`, text: `${city.loc} doğrudan üreticisinden tedarik — aracı/ithalatçı yok, en hızlı destek ve yedek parça.` },
    { icon: RiCpuLine,              title: "Yerli mühendislik & yazılım",  text: "Donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştirilir." },
    { icon: RiShieldCheckLine,      title: "Sertifikalı kalite",           text: "CE, IP65/IP66, IEC 61851 ve OCPP uyumu — güvenli, standartlara uygun cihazlar." },
    { icon: RiCustomerService2Line, title: "Hızlı kurulum desteği",        text: "Ev, site ve iş yeri için elektrik altyapısı ve kurulum yönlendirmesi." },
    { icon: RiPriceTag3Line,        title: "Uygun maliyet",                text: "Üreticiden doğrudan tedarik; aradaki ithalat marjı olmadan rekabetçi fiyat." },
    { icon: RiToolsLine,            title: "OEM & filo çözümleri",         text: "İş yeri, AVM, otel ve filolar için çoklu kurulum + OEM/özel üretim." },
  ];

  const accentLine = (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="h-px w-24 origin-left mb-7"
      style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
    />
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="relative max-w-7xl mx-auto wide-content">
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: d ? "#93C5FD" : BLUE }}
          >
            <RiMapPin2Line size={14} /> {city.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}
          >
            {city.h1}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed max-w-3xl mb-7" style={{ color: textMuted }}
          >
            {city.intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95"
              style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}
            >
              Ürünleri İncele <RiArrowRightLine size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#dealer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
            >
              <RiStore2Line size={16} /> Bayi Bul
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Neden Bemis */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto wide-content">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            {city.city}&apos;da neden Bemis E-V Charge?
          </motion.h2>
          {accentLine}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }} whileHover={{ y: -4 }}
                className="group rounded-2xl p-5"
                style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}25` }}>
                  <b.icon size={20} style={{ color: BLUE }} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto wide-content">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-2" style={{ color: textPrimary }}
          >
            {city.city}&apos;da hangi şarj ürünlerini bulabilirsiniz?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-sm mb-3" style={{ color: textMuted }}
          >
            Ev, iş yeri ve filolarınız için eksiksiz bir EV şarj ürün ailesi.
          </motion.p>
          {accentLine}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }} whileHover={{ y: -4 }}
              >
                <Link
                  href={p.href}
                  className="group rounded-2xl p-5 block h-full"
                  style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold" style={{ color: textPrimary }}>{p.name}</h3>
                    <RiArrowRightLine size={16} style={{ color: BLUE }} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs" style={{ color: textFaint }}>{p.note}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — basınca açılır akordeon */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            {city.city} · Sıkça Sorulan Sorular
          </motion.h2>
          {accentLine}
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: textMuted }}
          >
            {city.localPitch}
          </motion.p>
          <div className="space-y-3">
            {city.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: surface, border: `1px solid ${open ? `${BLUE}40` : border}`, transition: "border-color 0.25s" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 text-left p-4 cursor-pointer"
                    onMouseEnter={(e) => { if (!open) (e.currentTarget.parentElement as HTMLElement).style.borderColor = `${BLUE}30`; }}
                    onMouseLeave={(e) => { if (!open) (e.currentTarget.parentElement as HTMLElement).style.borderColor = border; }}
                  >
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{f.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
                      className="flex-shrink-0 inline-flex" style={{ color: d ? "#93C5FD" : BLUE }}
                    >
                      <HiChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="text-sm leading-relaxed px-4 pb-4" style={{ color: textMuted }}>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pb-6" />
      <ContactBar />
    </div>
  );
}
