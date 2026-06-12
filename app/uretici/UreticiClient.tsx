"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { allPress } from "../blog/press";
import {
  RiShieldCheckLine, RiToolsLine, RiGlobalLine, RiCpuLine,
  RiPriceTag3Line, RiCustomerService2Line, RiArrowRightLine, RiCheckboxCircleLine, RiExternalLinkLine,
} from "react-icons/ri";

const BLUE = "#3B82F6";

const BENEFITS = [
  { icon: RiCpuLine,            title: "Yerli mühendislik & yazılım", text: "Donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştirilir — ithal değil, yerli üretim." },
  { icon: RiCustomerService2Line, title: "Hızlı destek & yedek parça", text: "Üretici doğrudan yanınızda; servis ve yedek parça için aracı/ithalatçı beklemezsiniz." },
  { icon: RiShieldCheckLine,    title: "Sertifikalı kalite",          text: "CE, IP65/IP66, IEC 61851 ve OCPP uyumu — uluslararası standartlarda güvenli cihazlar." },
  { icon: RiGlobalLine,         title: "İhracat tecrübesi",           text: "60+ ülkeye ihracat yapan bir üretim altyapısının güvenilirliği." },
  { icon: RiPriceTag3Line,      title: "Uygun maliyet",               text: "Üreticiden doğrudan tedarik; aradaki ithalat marjı olmadan rekabetçi fiyat." },
  { icon: RiToolsLine,          title: "OEM & özel üretim",           text: "White-label, özel etiket ve toplu siparişlerde esnek üretim kapasitesi." },
];

const PRODUCTS = [
  { name: "AC Wallbox Şarj İstasyonları", href: "/products/wallbox",  note: "Ev & iş yeri · 7,4–22 kW" },
  { name: "Taşınabilir Şarj Cihazları",   href: "/products/portable", note: "Mobil / seyyar şarj" },
  { name: "Type 2 Şarj Kabloları",        href: "/products/cables",   note: "Yerli şarj kablosu üretimi" },
  { name: "V2L / C2L Adaptörler",         href: "/products/v2l-c2l",  note: "Araçtan elektrik çözümleri" },
  { name: "Aksesuarlar",                  href: "/products/accessories", note: "Tutucu, adaptör, ekipman" },
];

const CERTS = ["CE", "IP65 / IP66", "IEC 61851", "IEC 62196", "OCPP 1.6J", "RCD / MID"];

export default function UreticiClient({ faq }: { faq: { q: string; a: string }[] }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const { dna } = useContent();
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

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero */}
      <section className="pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: BLUE }}>
            Yerli Üretim · Bursa, Türkiye
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}>
            Türkiye'nin Yerli Elektrikli Araç Şarj Cihazı Üreticisi
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
            className="text-base sm:text-lg leading-relaxed max-w-3xl mb-7" style={{ color: textMuted }}>
            Bemis E-V Charge, 1994'ten gelen Bemis Teknik tecrübesiyle Bursa Organize Sanayi Bölgesi'ndeki
            16.000 m² tesisinde elektrikli araç şarj ekipmanları üretir. AC Wallbox, taşınabilir şarj cihazları,
            Type 2 şarj kabloları, V2L/C2L adaptörler ve aksesuarlar — donanımdan yazılıma yerli üretim.
          </motion.p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ background: BLUE }}>
              Ürünleri İncele <RiArrowRightLine size={16} />
            </Link>
            <Link href="/b2b" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold" style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}>
              OEM & Özel Üretim
            </Link>
          </div>
        </div>
      </section>

      {/* Fabrika görseli (/kurumsal ile aynı kaynak: dna.factoryImage) — hero
          video alanı gibi büyük çerçeve + 32 yıllık Bemis Teknik mirası +
          bemis.com.tr linki/alıntısı. */}
      <section className="pt-2 pb-2 px-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {dna.factoryImage && (
            <div className="relative rounded-3xl overflow-hidden mb-4" style={{ border: `1px solid ${border}`, aspectRatio: "16 / 7", boxShadow: d ? "0 20px 60px rgba(0,0,0,0.45)" : "0 16px 48px rgba(0,0,0,0.10)" }}>
              <Image src={dna.factoryImage} alt="Bemis üretim tesisi — Bursa OSB" fill priority sizes="(max-width:768px) 100vw, 1024px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }}>
                <p className="text-white text-sm sm:text-base font-bold">Bursa OSB · 16.000 m² üretim tesisi · 1994&apos;ten beri</p>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-2xl p-4" style={{ background: surface, border: `1px solid ${border}` }}>
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
              Bemis E-V Charge, <strong style={{ color: textPrimary, fontWeight: 700 }}>1994&apos;ten beri üreten Bemis Teknik Elektrik A.Ş.</strong>&apos;nin elektrikli araç şarj markasıdır — 32 yıllık endüstriyel üretim mirası.
            </p>
            <a href="https://www.bemis.com.tr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0" style={{ color: textPrimary, background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}` }}>
              Bemis Teknik · bemis.com.tr <RiExternalLinkLine size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Neden yerli üretici */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: textPrimary }}>Neden yerli üreticiden almalısınız?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-2xl p-5" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}25` }}>
                  <b.icon size={20} style={{ color: BLUE }} />
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
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-2" style={{ color: textPrimary }}>Ne üretiyoruz?</h2>
          <p className="text-sm mb-6" style={{ color: textMuted }}>Eviniz, iş yeriniz ve filolarınız için eksiksiz bir EV şarj ürün ailesi.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p, i) => (
              <Link key={i} href={p.href} className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5 block" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold" style={{ color: textPrimary }}>{p.name}</h3>
                  <RiArrowRightLine size={16} style={{ color: BLUE }} />
                </div>
                <p className="text-xs" style={{ color: textFaint }}>{p.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Üretim & Kalite */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl p-7" style={{ background: surface, border: `1px solid ${border}` }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: textPrimary }}>Üretim & Kalite</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-5 max-w-3xl" style={{ color: textMuted }}>
            PCB tasarımından gömülü yazılıma, mekanik tasarımdan son test ve kalite kontrolüne kadar üretim süreci
            kendi tesisimizde yürütülür. Cihazlarımız uluslararası standartlara uygun olarak üretilir ve test edilir.
          </p>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: `${BLUE}12`, color: d ? "#93C5FD" : BLUE, border: `1px solid ${BLUE}25` }}>
                <RiCheckboxCircleLine size={13} /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — basınca açılır akordeon */}
      {faq.length > 0 && (
        <section className="py-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black mb-5" style={{ color: textPrimary }}>Sıkça Sorulan Sorular</h2>
            <div className="space-y-3">
              {faq.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: surface, border: `1px solid ${open ? `${BLUE}40` : border}` }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-3 text-left p-4 cursor-pointer"
                    >
                      <span className="text-sm font-bold" style={{ color: textPrimary }}>{f.q}</span>
                      <HiChevronDown
                        size={18}
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{ color: d ? "#93C5FD" : BLUE, transform: open ? "rotate(180deg)" : "none" }}
                      />
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
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bemis basın & haberler — minik şerit (anasayfa Reviews ile aynı kaynak) */}
      {press.length > 0 && (
        <section className="py-8 px-5 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${border}` }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="text-lg font-black" style={{ color: textPrimary }}>Bemis Basında & Haberler</h2>
              <a href="https://www.bemis.com.tr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: d ? "#93C5FD" : BLUE }}>
                bemis.com.tr <RiExternalLinkLine size={13} />
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {press.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl p-4 transition-transform hover:-translate-y-0.5" style={{ background: surface, border: `1px solid ${border}` }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: d ? "#93C5FD" : BLUE }}>{p.source}</span>
                  <p className="text-xs font-bold leading-snug mt-1.5 line-clamp-3" style={{ color: textPrimary }}>{p.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pb-6" />
      <ContactBar />
    </div>
  );
}
