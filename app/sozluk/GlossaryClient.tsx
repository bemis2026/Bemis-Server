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

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

type Props =
  | { mode: "index"; terms: GlossaryTerm[]; term?: undefined }
  | { mode: "term"; term: GlossaryTerm; terms: GlossaryTerm[] };

export default function GlossaryClient(props: Props) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const accent = d ? "#93C5FD" : BLUE;

  const eyebrow = (
    <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: accent }}>
      <RiBookOpenLine size={14} /> EV Şarj Sözlüğü
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
            <div className="relative max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{eyebrow}</motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}>
                Elektrikli Araç Şarj Terimleri Sözlüğü
              </motion.h1>
              <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }} className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }} className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: textMuted }}>
                Type 2, CCS2, OCPP, AC/DC, kW–kWh, V2L, yük yönetimi (DLM), IP65/IP66 ve daha fazlası — elektrikli araç şarjında en çok merak edilen terimlerin kısa ve net açıklamaları.
              </motion.p>
            </div>
          </section>

          <section className="py-8 px-5 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.terms.map((t, i) => (
                <motion.div key={t.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}>
                  <Link href={`/sozluk/${t.slug}`} className="block rounded-2xl p-5 h-full transition-transform hover:scale-[1.02]" style={{ background: surface, border: `1px solid ${border}` }}>
                    <h2 className="font-black text-lg mb-1.5" style={{ color: accent }}>{t.abbr}</h2>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{t.short}</p>
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
              <RiArrowLeftLine size={15} /> Sözlük
            </Link>
            {eyebrow}
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: textPrimary }}>{props.term.term}</h1>
            <div className="h-px w-24 origin-left mb-6" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
            {/* Doğrudan-cevap bloğu (alıntılanabilir) */}
            <div className="rounded-2xl px-5 py-5 mb-8 text-[15px] sm:text-lg leading-relaxed" style={{ background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.06)", borderLeft: `3px solid ${BLUE}`, color: textPrimary }}>
              {props.term.definition}
            </div>

            {props.term.diagram && (
              <figure className="mb-10">
                <div role="img" aria-label={props.term.diagram.alt} className="rounded-2xl px-4 py-5 overflow-x-auto" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }} dangerouslySetInnerHTML={{ __html: props.term.diagram.svg }} />
                <figcaption className="text-sm mt-2.5 leading-relaxed" style={{ color: textMuted }}>{props.term.diagram.caption}</figcaption>
              </figure>
            )}

            {props.term.faq && props.term.faq.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-black mb-4" style={{ color: textPrimary }}>Sıkça Sorulan Sorular</h2>
                <div className="flex flex-col gap-3">
                  {props.term.faq.map((f, i) => (
                    <div key={i} className="rounded-2xl px-5 py-4" style={{ background: surface, border: `1px solid ${border}` }}>
                      <h3 className="text-[15px] font-bold mb-1.5" style={{ color: textPrimary }}>{f.q}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {props.term.related && props.term.related.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>İlgili içerik</h2>
                <div className="flex flex-wrap gap-2.5">
                  {props.term.related.map((r) => (
                    <Link key={r.href} href={r.href} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                      {r.label} <RiArrowRightLine size={14} style={{ color: accent }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl px-5 py-4 mb-10" style={{ background: d ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)", border: `1px solid ${BLUE}26` }}>
              <p className="text-sm sm:text-base font-semibold mb-3" style={{ color: textPrimary }}>Yerli üretim elektrikli araç şarj çözümleri için ürün gamımızı inceleyin.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: BLUE }}>
                Ürünleri İncele <RiArrowRightLine size={15} />
              </Link>
            </div>

            {(() => {
              const seeAlso = (TERM_SEE_ALSO[props.term.slug] ?? [])
                .map((s) => props.terms.find((t) => t.slug === s))
                .filter((t): t is GlossaryTerm => Boolean(t));
              return seeAlso.length > 0 ? (
                <div className="mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>İlgili Terimler</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {seeAlso.map((t) => (
                      <Link key={t.slug} href={`/sozluk/${t.slug}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                        {t.abbr} <RiArrowRightLine size={14} style={{ color: accent }} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: textMuted }}>Diğer terimler</h2>
            <div className="flex flex-wrap gap-2">
              {props.terms.filter((t) => t.slug !== props.term.slug).map((t) => (
                <Link key={t.slug} href={`/sozluk/${t.slug}`} className="px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-[1.04]" style={{ background: surface, border: `1px solid ${border}`, color: textMuted }}>
                  {t.abbr}
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
