"use client";

// Projeye/markaya özel üretim tanıtım kartı — PAYLAŞILAN bileşen.
// Kullanım: ürün kategori sayfaları (projectSection içeriğiyle) + /uretici (OEM içeriğiyle).
// Metinler (eyebrow/title/description/cta) çağıran tarafından DİLE ÇÖZÜLMÜŞ gelir;
// panel etiketleri pickText ile yerelleşir. Tema-uyumlu, mobil-duyarlı, semantik.
import { motion } from "framer-motion";
import { RiPaletteLine, RiRulerLine, RiPlugLine, RiArrowRightLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import { accentInk } from "../lib/accentInk";

export type CustomProductionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  swatches?: string[];
  accent?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  /** Dış sarmalayıcı sınıfı (boşluk/genişlik) — sayfaya göre ayarlanır. */
  outerClassName?: string;
};

export default function CustomProductionSection({
  eyebrow, title, description, swatches = [], accent = "#3B82F6",
  ctaPrimaryLabel, ctaPrimaryHref = "/iletisim",
  ctaSecondaryLabel, ctaSecondaryHref = "/#dealer",
  outerClassName = "max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12 w-full",
}: CustomProductionProps) {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const textPrimary   = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted     = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,46,0.55)";
  const surface       = d ? "#1d1d22" : "#ffffff";
  const surfaceBorder = d ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.07)";
  const sw = (swatches ?? []).filter(Boolean).slice(0, 8);
  const ink = accentInk(accent, d); // aydınlıkta metin/ikon için okunur accent

  const attrs = [
    { Icon: RiPaletteLine, label: pickText(lang, "Kablo & soket rengi", "Cable & connector color") },
    { Icon: RiRulerLine,   label: pickText(lang, "İstenen kablo uzunluğu", "Custom cable length") },
    { Icon: RiPlugLine,    label: pickText(lang, "Cihaz rengi & etiket", "Device color & labeling") },
  ];

  return (
    <div className={outerClassName}>
      <motion.section
        aria-label={title}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: d ? "linear-gradient(135deg, #17171c 0%, #121216 100%)" : "linear-gradient(135deg, #f7f9fc 0%, #eef1f7 100%)",
          border: `1px solid ${surfaceBorder}`,
          boxShadow: d ? "0 22px 60px rgba(0,0,0,0.34)" : "0 22px 50px rgba(20,30,60,0.08)",
        }}
      >
        {/* accent parıltısı */}
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)` }} aria-hidden />

        {/* Ölçüler sayfanın KENDİ bölümleriyle hizalı: h2 text-2xl (24px), gövde
            text-sm, kart p-7 — /uretici "Üretim & Kalite" ve kategori SSS bloklarıyla aynı. */}
        <div className="relative z-[1] grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-center p-6 sm:p-7">
          {/* SOL: içerik */}
          <div className="min-w-0">
            {eyebrow && (
              <p className="inline-flex text-[11px] font-bold tracking-[0.16em] uppercase mb-2.5 px-2.5 py-1 rounded-full"
                style={{ color: ink, background: `${accent}14`, border: `1px solid ${accent}2e` }}>
                {eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-black leading-tight mb-2.5" style={{ color: textPrimary }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed mb-5 max-w-xl" style={{ color: textMuted }}>
              {description}
            </p>

            {/* CTA'lar — gerçek <a>, imleç + hover kalk + active bas + ok animasyonu */}
            <div className="flex flex-col sm:flex-row gap-3">
              {ctaPrimaryLabel?.trim() && (
                <a href={ctaPrimaryHref}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  style={{ background: accent, boxShadow: `0 8px 22px ${accent}40` }}>
                  {ctaPrimaryLabel}
                  <RiArrowRightLine className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </a>
              )}
              {ctaSecondaryLabel?.trim() && (
                <a href={ctaSecondaryHref}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ color: textPrimary, border: `1.5px solid ${surfaceBorder}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)" }}>
                  {ctaSecondaryLabel}
                </a>
              )}
            </div>
          </div>

          {/* SAĞ: özelleştirme paneli (site kart diliyle uyumlu çerçeve) */}
          <div className="rounded-2xl p-5" style={{ background: surface, border: `1px solid ${surfaceBorder}` }}>
            {sw.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <RiPaletteLine style={{ color: ink, fontSize: 15 }} aria-hidden />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>
                    {pickText(lang, "İstediğiniz Renkte", "In Your Color")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sw.map((c, i) => (
                    <span key={i} className="w-7 h-7 rounded-full transition-transform duration-200 hover:scale-110"
                      style={{ background: c, border: "1px solid rgba(128,128,128,0.3)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.22)" }}
                      title={c} aria-hidden />
                  ))}
                </div>
              </div>
            )}
            {/* özelleştirilebilir alanlar — semantik liste (SEO/GEO taranabilir) */}
            <ul className="space-y-2.5 list-none m-0 p-0">
              {attrs.map((a, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: textPrimary }}>
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                    style={{ background: `${accent}16`, color: ink }}>
                    <a.Icon size={15} aria-hidden />
                  </span>
                  <span className="font-medium">{a.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
