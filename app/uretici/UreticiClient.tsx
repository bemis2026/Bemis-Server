"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { allPress } from "../blog/press";
import { CITY_PAGES } from "../lib/cities";
import {
  RiShieldCheckLine, RiToolsLine, RiGlobalLine, RiCpuLine,
  RiPriceTag3Line, RiCustomerService2Line, RiArrowRightLine, RiCheckboxCircleLine, RiExternalLinkLine,
} from "react-icons/ri";

const BLUE = "#3B82F6";

const BENEFITS = [
  { icon: RiCpuLine,            title: "Yerli mühendislik & yazılım", text: "Donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştirilir; %94 Yerli Malı Belgesi ile belgeli, ithal değil yerli üretim." },
  { icon: RiCustomerService2Line, title: "Hızlı destek & yedek parça", text: "Üretici doğrudan yanınızda; servis ve yedek parça için aracı/ithalatçı beklemezsiniz." },
  { icon: RiShieldCheckLine,    title: "Sertifikalı kalite",          text: "CE, IP65/IP66, IEC 61851 ve OCPP uyumu — uluslararası standartlarda güvenli cihazlar." },
  { icon: RiGlobalLine,         title: "İhracat tecrübesi",           text: "60+ ülkeye ihracat yapan bir üretim altyapısının güvenilirliği." },
  { icon: RiPriceTag3Line,      title: "Uygun maliyet",               text: "Üreticiden doğrudan tedarik; aradaki ithalat marjı olmadan rekabetçi fiyat." },
  { icon: RiToolsLine,          title: "OEM & özel üretim",           text: "White-label, özel etiket ve toplu siparişlerde esnek üretim kapasitesi." },
];

const PRODUCTS = [
  { name: "AC Wallbox Şarj İstasyonları", href: "/products/wallbox",  note: "Ev & iş yeri · 7,4–22 kW" },
  { name: "Taşınabilir Şarj Cihazları",   href: "/products/portable", note: "Mobil / seyyar şarj" },
  { name: "Yerli Type 2 Şarj Kabloları",  href: "/products/cables",   note: "Kendi tesisimizde üretim · 3–10 m" },
  { name: "V2L / C2L Adaptörler",         href: "/products/v2l-c2l",  note: "Araçtan elektrik çözümleri" },
  { name: "Aksesuarlar",                  href: "/products/accessories", note: "Tutucu, adaptör, ekipman" },
];

const CERTS = ["CE", "IP65 / IP66", "IEC 61851", "IEC 62196", "OCPP 1.6J", "RCD / MID"];

// Site geneliyle aynı animasyon dili: whileInView scroll-reveal +
// viewport once:true margin -60px (sayfa-içi tek desen — useInView'a
// karışmaz), stagger delay:0.1+i*0.07, kart hover lift+glow (FeaturedProducts
// deseni), Bemis mavisi #3B82F6 + d?#93C5FD:BLUE ikilisi.
const VIEWPORT = { once: true, margin: "-60px" } as const;

export default function UreticiClient({ faq }: { faq: { q: string; a: string }[] }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const { dna } = useContent();
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Bemis basın/haber alıntıları (anasayfayla aynı kaynak) — sayfa sonunda minik.
  const press = allPress().filter((p) => p.type !== "social").slice(0, 4);

  const bg          = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint   = d ? "rgba(240,240,244,0.42)" : "rgba(26,26,26,0.45)";

  // Başlık altı sol-hizalı accent çizgi — sayfa genelinde TEK varyant (A).
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
        {/* Dekoratif mavi blob — 'beyaz boşlukta yazı' hissini kırar, üst boşluğa derinlik. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="relative max-w-7xl mx-auto wide-content">
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: d ? "#93C5FD" : BLUE }}
          >
            <span aria-hidden className="relative flex h-2 w-2">
              {!reduce && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full" style={{ background: BLUE }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: BLUE }} />
            </span>
            Yerli Üretim · Bursa, Türkiye
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}
          >
            Türkiye&apos;nin Yerli Elektrikli Araç Şarj Cihazı Üreticisi
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed max-w-3xl mb-7" style={{ color: textMuted }}
          >
            Bemis E-V Charge, 1994&apos;ten gelen Bemis Teknik tecrübesiyle Bursa Organize Sanayi Bölgesi&apos;ndeki
            16.000 m² tesisinde elektrikli araç şarj ekipmanları üretir. AC Wallbox, taşınabilir şarj cihazları,
            Type 2 şarj kabloları, V2L/C2L adaptörler ve aksesuarlar — donanımdan yazılıma yerli üretim.
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
              href="/b2b"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
            >
              OEM & Özel Üretim
            </Link>
          </motion.div>

          {/* Yerli Üretim güven rozeti — beyaz çip (siyah rozet iki modda da okunur) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-3 rounded-2xl px-3.5 py-2.5 bg-white shadow-sm"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badges/yerli-uretim.jpg" alt="Yerli Üretim — Made in Türkiye" className="h-9 w-auto" loading="lazy" decoding="async" />
            <span className="text-xs font-bold leading-tight pr-1" style={{ color: "#1a1a1a" }}>%100 Türkiye&apos;de<br />tasarım &amp; üretim</span>
          </motion.div>
        </div>
      </section>

      {/* Fabrika görseli (/kurumsal ile aynı kaynak: dna.factoryImage) — büyük
          çerçeve + çok yavaş Ken Burns + 32 yıllık Bemis Teknik mirası +
          bemis.com.tr linki/alıntısı. */}
      <section className="pt-2 pb-2 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto wide-content">
          {dna.factoryImage && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden mb-4"
              style={{ border: `1px solid ${border}`, aspectRatio: "16 / 7", boxShadow: d ? "0 20px 60px rgba(0,0,0,0.45)" : "0 16px 48px rgba(0,0,0,0.10)" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={reduce ? { scale: 1 } : { scale: 1.06 }}
                transition={reduce ? undefined : { duration: 16, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                style={{ willChange: "transform" }}
              >
                <Image src={dna.factoryImage} alt="Bemis üretim tesisi — Bursa OSB" fill priority sizes="(max-width:768px) 100vw, 1024px" className="object-cover" />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 p-5 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}>
                <motion.p
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-white text-sm sm:text-base font-bold"
                >
                  Bursa OSB · 16.000 m² üretim tesisi · 1994&apos;ten beri
                </motion.p>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-2xl p-4"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <div className="flex items-center gap-4">
              {/* Kırmızı Bemis (ana şirket) logosu */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/bemis-logo.png" alt="Bemis Teknik Elektrik A.Ş." className="h-8 sm:h-9 w-auto flex-shrink-0" loading="lazy" decoding="async" />
              <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                Bemis E-V Charge, <strong style={{ color: textPrimary, fontWeight: 700 }}>1994&apos;ten beri üreten Bemis Teknik Elektrik A.Ş.</strong>&apos;nin elektrikli araç şarj markasıdır — 32 yıllık endüstriyel üretim mirası.
              </p>
            </div>
            <a
              href="https://www.bemis.com.tr" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: textPrimary, background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; }}
            >
              Bemis Teknik · bemis.com.tr <RiExternalLinkLine size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Neden yerli üretici */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto wide-content">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            Neden yerli üreticiden almalısınız?
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

      {/* Ne üretiyoruz */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto wide-content">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-2" style={{ color: textPrimary }}
          >
            Ne üretiyoruz?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-sm mb-3" style={{ color: textMuted }}
          >
            Eviniz, iş yeriniz ve filolarınız için eksiksiz bir EV şarj ürün ailesi.
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

      {/* Üretim & Kalite */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.99 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={VIEWPORT}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-7xl mx-auto wide-content rounded-3xl p-7" style={{ background: surface, border: `1px solid ${border}` }}
        >
          <h2 className="text-2xl font-black mb-3" style={{ color: textPrimary }}>Üretim & Kalite</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-5 max-w-3xl" style={{ color: textMuted }}>
            PCB tasarımından gömülü yazılıma, mekanik tasarımdan son test ve kalite kontrolüne kadar üretim süreci
            kendi tesisimizde yürütülür. Cihazlarımız uluslararası standartlara uygun olarak üretilir ve test edilir.
          </p>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.8, y: 6 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.06, ease: "backOut" }} whileHover={{ scale: 1.06, y: -2 }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-default"
                style={{ background: `${BLUE}12`, color: d ? "#93C5FD" : BLUE, border: `1px solid ${BLUE}25` }}
              >
                <RiCheckboxCircleLine size={13} /> {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ — basınca açılır akordeon */}
      {faq.length > 0 && (
        <section className="py-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
              className="text-2xl font-black mb-3" style={{ color: textPrimary }}
            >
              Sıkça Sorulan Sorular
            </motion.h2>
            {accentLine}
            <div className="space-y-3">
              {faq.map((f, i) => {
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
      )}

      {/* Bemis basın & haberler — minik şerit (anasayfa Reviews ile aynı kaynak) */}
      {press.length > 0 && (
        <section className="py-8 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${border}` }}>
          <div className="max-w-7xl mx-auto wide-content">
            <motion.div
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
              className="flex items-center justify-between gap-3 mb-4 flex-wrap"
            >
              <h2 className="text-lg font-black" style={{ color: textPrimary }}>Bemis Basında & Haberler</h2>
              <a
                href="https://www.bemis.com.tr" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: d ? "#93C5FD" : BLUE }}
              >
                bemis.com.tr <RiExternalLinkLine size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {press.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.05 }} whileHover={{ y: -4 }}
                >
                  <a
                    href={p.url} target="_blank" rel="noopener noreferrer"
                    className="group block rounded-2xl p-4 h-full"
                    style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 10px 26px ${BLUE}1a`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: d ? "#93C5FD" : BLUE }}>{p.source}</span>
                    <p className="text-xs font-bold leading-snug mt-1.5 line-clamp-3" style={{ color: textPrimary }}>{p.title}</p>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bölgesel sayfalar — yerel SEO iç linkleri */}
      {CITY_PAGES.length > 0 && (
        <section className="pb-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto wide-content flex flex-wrap items-center gap-x-3 gap-y-2 text-xs" style={{ color: textFaint }}>
            <span className="font-semibold uppercase tracking-wider">Bölgesel:</span>
            {CITY_PAGES.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="font-bold transition-opacity hover:opacity-70" style={{ color: d ? "#93C5FD" : BLUE }}>
                {c.city} EV Şarj İstasyonu
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="pb-6" />
      <ContactBar />
    </div>
  );
}
