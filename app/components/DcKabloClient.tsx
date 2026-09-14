"use client";

// /dc-sarj-kablosu iniş sayfasının görünümü.
//
// ⚠️ GÖRÜNEN HER METİN `app/lib/dcKablo.ts`'ten gelir — JSX içine ham Türkçe
//    yazılmaz. Sebep: (a) `npm run check:i18n` 5. sınıfı (ham JSX metin düğümü)
//    bu dosyada yanlış alarm vermesin, dosya muafiyeti gerekmesin; (b) SSS
//    metni şema ile aynı kaynaktan gelsin (ayrışamaz).
//
// Tasarım dili şehir iniş sayfalarıyla (CityLandingClient) aynı: aynı renk
// jetonları, aynı `whileInView` deseni, aynı accent çizgi ve akordeon.

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import {
  RiPlugLine, RiScissorsCutLine, RiFlashlightLine, RiArrowRightLine,
  RiBuilding4Line, RiBattery2ChargeLine, RiToolsLine, RiAlertLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import { DC_KABLO, DC_KABLO_SSS, DC_KABLO_TABLOSU, DC_KABLO_URUN_TABANI } from "../lib/dcKablo";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

const NEDIR_IKONLARI = [RiPlugLine, RiScissorsCutLine, RiFlashlightLine];
const KIM_IKONLARI = [RiBuilding4Line, RiBattery2ChargeLine, RiToolsLine];

export default function DcKabloClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint = d ? "rgba(240,240,244,0.42)" : "rgba(26,26,26,0.45)";
  const accentInk = d ? "#93C5FD" : BLUE;

  const accentLine = (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="h-px w-24 origin-left mb-7"
      style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
    />
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.span
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-[0.18em] mb-5"
            style={{
              color: accentInk,
              background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.08)",
              border: `1px solid ${BLUE}28`,
            }}
          >
            {DC_KABLO.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl font-black leading-tight mb-3"
            style={{ color: textPrimary }}
          >
            {DC_KABLO.h1}
          </motion.h1>

          <motion.p
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base font-semibold mb-4"
            style={{ color: accentInk }}
          >
            {DC_KABLO.tagline}
          </motion.p>

          <motion.p
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="text-sm sm:text-base leading-relaxed max-w-3xl mb-7"
            style={{ color: textMuted }}
          >
            {DC_KABLO.giris}
          </motion.p>

          <motion.div
            initial={{ y: 12 }}
            whileInView={{ y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Link
              href={DC_KABLO.ctaBirincilHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ background: BLUE, color: "#ffffff" }}
            >
              {DC_KABLO.ctaBirincilEtiket}
              <RiArrowRightLine size={16} />
            </Link>
            <Link
              href={DC_KABLO.ctaIkincilHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-opacity hover:opacity-75"
              style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
            >
              {DC_KABLO.ctaIkincilEtiket}
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2"
          >
            {DC_KABLO.rozetler.map((r) => (
              <span
                key={r}
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={{ color: textMuted, background: surface, border: `1px solid ${border}` }}
              >
                {r}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── "Bir ucu açık" nedir ─────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3"
            style={{ color: textPrimary }}
          >
            {DC_KABLO.nedirBaslik}
          </motion.h2>
          {accentLine}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DC_KABLO.nedirMaddeler.map((m, i) => {
              const Ikon = NEDIR_IKONLARI[i] ?? RiPlugLine;
              return (
                <motion.div
                  key={m.baslik}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                    style={{ background: `${BLUE}14`, color: accentInk }}
                  >
                    <Ikon size={20} />
                  </span>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: textPrimary }}>
                    {m.baslik}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                    {m.metin}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Seçim tablosu ────────────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3"
            style={{ color: textPrimary }}
          >
            {DC_KABLO.tabloBaslik}
          </motion.h2>
          {accentLine}
          <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
            {DC_KABLO.tabloAciklama}
          </p>

          {/* ⚠️ Geniş içerik kendi kabında yatay kayar — sayfa gövdesi taşmaz. */}
          <div className="rounded-2xl overflow-hidden" style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                    <th className="text-start font-bold px-4 py-3" style={{ color: textPrimary }}>
                      {DC_KABLO.tabloBasliklari.akim}
                    </th>
                    <th className="text-start font-bold px-4 py-3" style={{ color: textPrimary }}>
                      {DC_KABLO.tabloBasliklari.uzunluk}
                    </th>
                    <th className="text-start font-bold px-4 py-3" style={{ color: textPrimary }}>
                      {DC_KABLO.tabloBasliklari.kod}
                    </th>
                    <th className="text-start font-bold px-4 py-3" style={{ color: textPrimary }}>
                      {DC_KABLO.tabloBasliklari.link}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DC_KABLO_TABLOSU.map((s) => (
                    <tr key={s.slug} style={{ borderTop: `1px solid ${border}` }}>
                      <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: textPrimary }}>
                        {s.akim}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: textMuted }}>
                        {s.uzunluk}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: textFaint }}>
                        {s.kod}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`${DC_KABLO_URUN_TABANI}/${s.slug}`}
                          className="inline-flex items-center gap-1 font-bold cursor-pointer transition-opacity hover:opacity-70"
                          style={{ color: accentInk }}
                        >
                          {DC_KABLO.tabloLinkEtiket}
                          <RiArrowRightLine size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kimler için ──────────────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3"
            style={{ color: textPrimary }}
          >
            {DC_KABLO.kimBaslik}
          </motion.h2>
          {accentLine}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DC_KABLO.kimKartlar.map((k, i) => {
              const Ikon = KIM_IKONLARI[i] ?? RiBuilding4Line;
              return (
                <motion.div
                  key={k.baslik}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                    style={{ background: `${BLUE}14`, color: accentInk }}
                  >
                    <Ikon size={20} />
                  </span>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: textPrimary }}>
                    {k.baslik}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                    {k.metin}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Saha senaryosu ───────────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5 }}
                className="text-2xl font-black mb-3"
                style={{ color: textPrimary }}
              >
                {DC_KABLO.sahaBaslik}
              </motion.h2>
              {accentLine}
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: textMuted }}>
                {DC_KABLO.sahaMetin}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-2xl p-5"
              style={{ background: surface, border: `1px solid ${border}` }}
            >
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                style={{ background: `${BLUE}14`, color: accentInk }}
              >
                <RiAlertLine size={20} />
              </span>
              <ul className="space-y-2.5">
                {DC_KABLO.sahaMaddeler.map((m) => (
                  <li key={m} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: textMuted }}>
                    <span aria-hidden className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BLUE }} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SSS ──────────────────────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3"
            style={{ color: textPrimary }}
          >
            {DC_KABLO.sssBaslik}
          </motion.h2>
          {accentLine}
          <div className="space-y-3">
            {DC_KABLO_SSS.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: surface, border: `1px solid ${open ? `${BLUE}40` : border}`, transition: "border-color 0.25s" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 text-left p-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{f.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 inline-flex"
                      style={{ color: accentInk }}
                    >
                      <HiChevronDown size={18} />
                    </motion.span>
                  </button>
                  {/* ⚠️ SEO/GEO: cevap DAİMA DOM'da (koşullu mount DEĞİL) — yalnız
                      yüksekliği animasyonla kapanır. Koşullu mount edilseydi kapalı
                      cevaplar Google'ın gövde metnine ve YZ tarayıcılarına HİÇ
                      görünmezdi (şehir sayfalarında yaşanan kusurun aynısı). */}
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: "hidden" }}
                    aria-hidden={!open}
                  >
                    <p className="text-sm leading-relaxed px-4 pb-4" style={{ color: textMuted }}>{f.a}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Kapanış ──────────────────────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 sm:p-8"
            style={{
              background: d ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.06)",
              border: `1px solid ${BLUE}28`,
            }}
          >
            <h2 className="text-2xl font-black mb-2" style={{ color: textPrimary }}>
              {DC_KABLO.kapanisBaslik}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl mb-5" style={{ color: textMuted }}>
              {DC_KABLO.kapanisMetin}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={DC_KABLO.kapanisBirincilHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{ background: BLUE, color: "#ffffff" }}
              >
                {DC_KABLO.kapanisBirincilEtiket}
                <RiArrowRightLine size={16} />
              </Link>
              <Link
                href={DC_KABLO.kapanisIkincilHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-opacity hover:opacity-75"
                style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
              >
                {DC_KABLO.kapanisIkincilEtiket}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── İlgili sayfalar (iç link) ────────────────────────────────── */}
      <section className="pb-10 px-5 sm:px-6 lg:px-8">
        <div
          className="max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-xs"
          style={{ color: textFaint }}
        >
          <span className="font-semibold uppercase tracking-wider">{DC_KABLO.ilgiliBaslik}</span>
          {DC_KABLO.ilgiliLinkler.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-bold transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: accentInk }}
            >
              {l.etiket}
            </Link>
          ))}
        </div>
      </section>

      <div className="pb-6" />
      <ContactBar />
    </div>
  );
}
