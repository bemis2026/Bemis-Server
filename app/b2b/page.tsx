"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useUiStrings } from "../../lib/uiStrings";
import {
  RiPlugLine,
  RiShieldCheckLine,
  RiBuilding2Line,
  RiArrowRightLine,
} from "react-icons/ri";
import JsonLd from "../components/JsonLd";
import { serviceSchema } from "../lib/seo";

/* ─── Data types ────────────────────────────────────────────────────────── */
type B2BFeaturedSlot = { categoryId?: string; productId?: string };
type B2BHero = {
  eyebrow: string; heading1: string; heading2: string;
  description: string; sectorTags: string[];
  heroBg?: string;
};
type B2BApplication = { id: string; image: string; title?: string; body?: string };
type B2BData = {
  hero: B2BHero;
  featuredProducts?: B2BFeaturedSlot[];
  applications?: B2BApplication[];
};

type ProductEntry = { id: string; name: string; subtitle?: string; description?: string; image?: string };
type Category = { id: string; name: string; tagline: string; accent: string; products?: ProductEntry[] };

export default function B2BPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { dna } = useContent();
  const t = useUiStrings();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const localizedDefault: B2BData = {
    hero: {
      eyebrow:     t("b2b_default_eyebrow"),
      heading1:    t("b2b_default_h1"),
      heading2:    t("b2b_default_h2"),
      description: t("b2b_default_desc"),
      sectorTags:  [t("b2b_sector_oem"), t("b2b_sector_op"), t("b2b_sector_int"), t("b2b_sector_proj")],
    },
    featuredProducts: [],
  };
  const [b2bData, setB2bData] = useState<B2BData>(localizedDefault);

  const bg        = d ? "#131318" : "#f8f8fb";
  const bgSub     = d ? "#1a1a20" : "#ffffff";
  const card      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border    = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg   = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const text      = d ? "#f0f0f4" : "#1a1a2e";
  const muted     = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint     = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow    = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const AMBER     = "#F59E0B";

  useEffect(() => {
    fetch(`/api/products?lang=${lang}`).then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data: B2BData) => {
      if (data?.hero) setB2bData(data);
    }).catch(() => {});
  }, [lang]);

  // Admin panel live preview — receive postMessage from parent iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "BEMIS_B2B_PREVIEW" || !e.data?.b2bData) return;
      setB2bData(e.data.b2bData);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <JsonLd data={serviceSchema({
        name: "OEM & Üretici Çözümleri",
        description: "EV şarj ürünleri OEM üretimi, white-label etiketleme, toplu sipariş ve özel mühendislik çözümleri. CE & IP65 sertifikalı, 60+ ülkeye ihracat tecrübesi.",
        url: "/b2b",
        offerings: ["OEM Üretim", "White-Label Etiketleme", "Toplu Sipariş", "Özel Mühendislik", "Sertifikalı Üretim"],
      })} />
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
        {b2bData.hero.heroBg && (
          <>
            <Image src={b2bData.hero.heroBg} alt="" fill priority quality={90} sizes="100vw" className="object-cover" />
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
        <div className="relative z-10 max-w-5xl mx-auto wide-content px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiShieldCheckLine style={{ color: AMBER, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: AMBER }}>
                {b2bData.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {b2bData.hero.heading1}<br />
              <span style={{ color: AMBER }}>{b2bData.hero.heading2}</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[2px] w-24 origin-left rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${AMBER} 0%, ${AMBER}66 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${AMBER}45`,
              }}
            />
            <p className="leading-relaxed max-w-xl mb-6" style={{ color: muted, fontSize: "0.9375rem" }}>
              {b2bData.hero.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(b2bData.hero.sectorTags ?? []).map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}28`, color: d ? "#FCD34D" : "#92400E" }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OEM Üreticilerine Sunduğumuz Çözümler — left image / right
          text intro. The image source is dna.factoryImage (managed
          from admin → Hakkımızda / DNA), so the operator can swap it
          without touching B2B-specific admin fields. The legacy
          applications gallery has been retired — what manufacturers
          need on first scroll is a clear "what we do" statement, not
          a wall of case-study tiles. */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        {/* wide-content: geniş ekranda (≥1536px) diğer bölümlerle aynı 1360px'e
            genişler (eskiden max-w-6xl'de sıkışıp görsel dar kalıyordu). */}
        <div className="max-w-6xl mx-auto wide-content px-5 sm:px-8">
          {/* Görsel-ağırlıklı 12'li ızgara (görsel 7/12 ≈ %58, metin 5/12) —
              geniş ekranda görsel belirgin/büyük dursun (50/50 hâlâ küçük
              geliyordu); metin başlık+paragraflar için yeterli genişlikte kalır. */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {dna.factoryImage ? (
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden lg:col-span-7"
                // 16/9: görselin GERÇEK oranı (1600×900) → object-cover ile
                // kırpma OLMADAN çerçeveye tam oturur (sıkışma/bozulma yok).
                style={{ aspectRatio: "16/9", border: `1px solid ${border}`, boxShadow: shadow }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dna.factoryImage}
                  alt="Bemis üretim tesisi"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ) : (
              <div
                className="rounded-3xl flex items-center justify-center lg:col-span-7"
                style={{ aspectRatio: "16/9", background: card, border: `1px dashed ${border}` }}
              >
                <span className="text-xs font-semibold" style={{ color: faint }}>
                  Görsel admin → DNA → Üretim Görseli alanından yüklendiğinde burada görünecek.
                </span>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: AMBER }}>
                Çözüm Ortaklığı
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4" style={{ color: text }}>
                OEM Üreticilerine Sunduğumuz Çözümler
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: muted }}>
                Bemis Teknik Elektrik, 1994&apos;ten bu yana endüstriyel elektrik
                ekipmanı üretimi yapan, 60+ ülkeye ihracat gerçekleştiren bir
                Türkiye üreticisidir. EV şarj cihazı üreten OEM firmalarına
                bileşen ve mühendislik desteği sunuyoruz.
              </p>
              <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: muted }}>
                Type 2 ve CCS2 soketler, AC ve DC şarj kabloları, elektronik
                kontrol kartları ve özel mahfaza tasarımları ile çözüm
                ortağıyız. Ürün geliştirme sürecinin başından sertifikasyona
                kadar mühendislik ekibimiz devreye girer; tedarik zinciri Bursa
                OSB üretim tesisinden tek noktadan yönetilir.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "11.000 m² Üretim Tesisi",
                  "60+ Ülke İhracat",
                  "CE / TSE / TÜV Sertifikalı",
                  "ISO 9001:2015",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: `${AMBER}15`,
                      border: `1px solid ${AMBER}30`,
                      color: AMBER,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OEM Featured Products ── */}
      {(() => {
        const resolved = (b2bData.featuredProducts ?? [])
          .map(slot => {
            if (!slot?.categoryId || !slot?.productId) return null;
            const cat = categories.find(c => c.id === slot.categoryId);
            const prod = cat?.products?.find(p => p.id === slot.productId);
            if (!cat || !prod) return null;
            return { cat, prod };
          })
          .filter((x): x is { cat: Category; prod: ProductEntry } => x !== null);
        if (resolved.length === 0) return null;
        return (
          <section style={{ background: bgSub, borderBottom: `1px solid ${border}`, padding: "56px 0" }}>
            <div className="max-w-5xl mx-auto wide-content px-5 sm:px-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <RiBuilding2Line style={{ color: AMBER, fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: AMBER }}>{t("b2b_oem_eyebrow")}</span>
                </div>
                <h2 className="text-xl font-black mb-1" style={{ color: text }}>{t("b2b_oem_heading")}</h2>
                <p className="text-sm max-w-2xl" style={{ color: muted }}>
                  {t("b2b_oem_sub")}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {resolved.map(({ cat, prod }, i) => {
                  const href = `/products/${cat.id}/${prod.id}`;
                  const desc = (prod.description ?? "").trim();
                  const shortDesc = desc.length > 120 ? desc.slice(0, 117).trimEnd() + "…" : desc;
                  return (
                    <motion.div key={`${cat.id}-${prod.id}`}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.07 * i }}>
                      <Link href={href}
                        className="group block h-full rounded-2xl overflow-hidden transition-all duration-200"
                        style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, textDecoration: "none" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.accent}40`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}>
                        {prod.image ? (
                          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3", background: `${cat.accent}10` }}>
                            <Image src={prod.image} alt={prod.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                              className="object-contain p-3" quality={88} />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: `${cat.accent}10` }}>
                            <RiPlugLine style={{ fontSize: 36, color: cat.accent, opacity: 0.6 }} />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ background: `${cat.accent}15`, color: cat.accent, border: `1px solid ${cat.accent}28` }}>
                            {cat.name}
                          </span>
                          <h3 className="font-bold text-sm mb-0.5" style={{ color: text }}>{prod.name}</h3>
                          {prod.subtitle && <p className="text-xs mb-2" style={{ color: faint }}>{prod.subtitle}</p>}
                          {shortDesc && <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{shortDesc}</p>}
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                            {t("b2b_view_product")}
                            <RiArrowRightLine size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      <ContactBar />
    </div>
  );
}
