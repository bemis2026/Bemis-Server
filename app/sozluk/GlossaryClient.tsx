"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiBookOpenLine, RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import Footer from "../components/Footer";
import { TERM_SEE_ALSO, type GlossaryTerm } from "../lib/glossary";
import { GLOSSARY_I18N } from "../lib/glossaryI18n";
import { useLanguage } from "../context/LanguageContext";

const BLUE = "#3B82F6";

// Arayüz metinleri — dil başına. Eklenmemiş dil TR'ye düşer.
const UI: Record<string, Record<string, string>> = {
  tr: { eyebrow: "EV Şarj Sözlüğü", indexTitle: "Elektrikli Araç Şarj Terimleri Sözlüğü", intro: "Type 2, CCS2, OCPP, AC/DC, kW–kWh, V2L, yük yönetimi (DLM), IP65/IP66 ve daha fazlası — elektrikli araç şarjında en çok merak edilen terimlerin kısa ve net açıklamaları.", back: "Sözlük", faqHeading: "Sıkça Sorulan Sorular", relatedContent: "İlgili içerik", ctaText: "Yerli üretim elektrikli araç şarj çözümleri için ürün gamımızı inceleyin.", ctaBtn: "Ürünleri İncele", relatedTerms: "İlgili Terimler", otherTerms: "Diğer terimler" },
  en: { eyebrow: "EV Charging Glossary", indexTitle: "Electric Vehicle Charging Glossary", intro: "Type 2, CCS2, OCPP, AC/DC, kW–kWh, V2L, load management (DLM), IP65/IP66 and more — short, clear explanations of the most-asked electric-vehicle charging terms.", back: "Glossary", faqHeading: "Frequently Asked Questions", relatedContent: "Related content", ctaText: "Explore our product range for locally produced electric-vehicle charging solutions.", ctaBtn: "Explore Products", relatedTerms: "Related Terms", otherTerms: "Other terms" },
};
const VIEWPORT = { once: true, margin: "-60px" } as const;

type Props =
  | { mode: "index"; terms: GlossaryTerm[]; term?: undefined }
  | { mode: "term"; term: GlossaryTerm; terms: GlossaryTerm[] };

export default function GlossaryClient(props: Props) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const { lang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);

  // Terimi aktif dile çevir; çevirisi olmayan alan/terim TR kaynağa düşer.
  const tx = (t: GlossaryTerm): GlossaryTerm =>
    lang === "tr" ? t : { ...t, ...(GLOSSARY_I18N[lang]?.[t.slug] ?? {}) };
  const ui = UI[lang] ?? UI.tr;
  const term = props.mode === "term" ? tx(props.term) : null;

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const accent = d ? "#93C5FD" : BLUE;

  const eyebrow = (
    <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: accent }}>
      <RiBookOpenLine size={14} /> {ui.eyebrow}
    </p>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {props.mode === "index" ? (
        <>
          <section className="relative overflow-hidden pt-28 pb-8 px-5 sm:px-6 lg:px-8">
            <div aria-hidden className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full" style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }} />
            {/* Geniş ekran (2026-07-13): hero, altındaki terim grid'iyle aynı hizada
                olsun diye ürün/blog sayfalarıyla aynı desene geçti. İçerideki
                tanıtım metni kendi max-w-3xl'ini korur (okunabilir satır boyu). */}
            <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{eyebrow}</motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}>
                {ui.indexTitle}
              </motion.h1>
              <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }} className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }} className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: textMuted }}>
                {ui.intro}
              </motion.p>
            </div>
          </section>

          <section className="py-8 px-5 sm:px-6 lg:px-8">
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {props.terms.map((t, i) => (
                <motion.div key={t.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}>
                  <Link href={`/sozluk/${t.slug}`} className="block rounded-2xl p-5 h-full transition-transform hover:scale-[1.02]" style={{ background: surface, border: `1px solid ${border}` }}>
                    <h2 className="font-black text-lg mb-1.5" style={{ color: accent }}>{tx(t).abbr}</h2>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{tx(t).short}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <article className="pt-28 pb-12 px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/sozluk" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 hover:opacity-80" style={{ color: accent }}>
              <RiArrowLeftLine size={15} /> {ui.back}
            </Link>
            {eyebrow}
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: textPrimary }}>{term!.term}</h1>
            <div className="h-px w-24 origin-left mb-6" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
            {/* Doğrudan-cevap bloğu (alıntılanabilir) */}
            <div className="rounded-2xl px-5 py-5 mb-8 text-[15px] sm:text-lg leading-relaxed" style={{ background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.06)", borderLeft: `3px solid ${BLUE}`, color: textPrimary }}>
              {term!.definition}
            </div>

            {term!.diagram && (
              <figure className="mb-10">
                <div role="img" aria-label={term!.diagram.alt} className="rounded-2xl px-4 py-5 overflow-x-auto" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }} dangerouslySetInnerHTML={{ __html: term!.diagram.svg }} />
                <figcaption className="text-sm mt-2.5 leading-relaxed" style={{ color: textMuted }}>{term!.diagram.caption}</figcaption>
              </figure>
            )}

            {term!.faq && term!.faq.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-black mb-4" style={{ color: textPrimary }}>{ui.faqHeading}</h2>
                <div className="flex flex-col gap-3">
                  {term!.faq.map((f, i) => (
                    <div key={i} className="rounded-2xl px-5 py-4" style={{ background: surface, border: `1px solid ${border}` }}>
                      <h3 className="text-[15px] font-bold mb-1.5" style={{ color: textPrimary }}>{f.q}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {term!.related && term!.related.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>{ui.relatedContent}</h2>
                <div className="flex flex-wrap gap-2.5">
                  {term!.related.map((r) => (
                    <Link key={r.href} href={r.href} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                      {r.label} <RiArrowRightLine size={14} style={{ color: accent }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl px-5 py-4 mb-10" style={{ background: d ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)", border: `1px solid ${BLUE}26` }}>
              <p className="text-sm sm:text-base font-semibold mb-3" style={{ color: textPrimary }}>{ui.ctaText}</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: BLUE }}>
                {ui.ctaBtn} <RiArrowRightLine size={15} />
              </Link>
            </div>

            {(() => {
              const seeAlso = (TERM_SEE_ALSO[term!.slug] ?? [])
                .map((s) => props.terms.find((t) => t.slug === s))
                .filter((t): t is GlossaryTerm => Boolean(t));
              return seeAlso.length > 0 ? (
                <div className="mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>{ui.relatedTerms}</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {seeAlso.map((t) => (
                      <Link key={t.slug} href={`/sozluk/${t.slug}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                        {tx(t).abbr} <RiArrowRightLine size={14} style={{ color: accent }} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>{ui.otherTerms}</h2>
            <div className="flex flex-wrap gap-2">
              {props.terms.filter((t) => t.slug !== term!.slug).map((t) => (
                <Link key={t.slug} href={`/sozluk/${t.slug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-[1.04]" style={{ background: surface, border: `1px solid ${border}`, color: textMuted }}>
                  {tx(t).abbr}
                </Link>
              ))}
            </div>
          </div>
        </article>
      )}

      <Footer />
    </div>
  );
}
