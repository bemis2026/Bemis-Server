"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { accentInk } from "../lib/accentInk";
import { useLanguage } from "../context/LanguageContext";
import {
  RiWifiLine, RiBarChartLine, RiShieldCheckLine, RiGlobalLine,
  RiPlugLine, RiCheckLine, RiArrowRightSLine,
} from "react-icons/ri";
import { useEffect } from "react";
import JsonLd from "../components/JsonLd";
import { serviceSchema } from "../lib/seo";

const CAPABILITY_ICONS = [RiWifiLine, RiBarChartLine, RiGlobalLine, RiShieldCheckLine];
const CAPABILITY_COLORS = ["#3B82F6", "#818CF8", "#10B981", "#F59E0B"];

type Capability = { title: string; body: string };
type OperatorFeaturedSlot = { categoryId?: string; productId?: string };
type OperatorContent = {
  heading1: string; heading2: string; description: string;
  capabilities: Capability[]; ocppFeatures: string[];
  heroBg?: string;
  featuresBg?: string;
  featuredProducts?: OperatorFeaturedSlot[];
};

// Catalog types — used to resolve featuredProducts slots on render.
type ProductEntry = { id: string; name: string; subtitle?: string; description?: string; image?: string };
type Category = { id: string; name: string; tagline: string; accent: string; products?: ProductEntry[] };
const DEFAULT_OP: OperatorContent = {
  heading1: "Şarj Ağınızı", heading2: "Bizimle Büyütün",
  description: "OCPP uyumlu DC hızlı şarj üniteleri, akıllı şarj panoları ve entegrasyon hazır kontrol kartlarıyla şarj ağı operatörlerine uçtan uca donanım çözümü sunuyoruz.",
  capabilities: [
    { title: "OCPP 1.6 / 2.0.1",      body: "Tüm büyük yönetim platformlarıyla uyumlu açık protokol desteği." },
    { title: "Dinamik Güç Yönetimi",  body: "Anlık tüketimi izleyerek şarj noktaları arasında yükü dengeler." },
    { title: "Uzaktan İzleme & OTA",  body: "Bulut tabanlı firmware güncellemesi ve gerçek zamanlı arıza uyarısı." },
    { title: "CE & IEC Sertifikası",  body: "Avrupa ihracat standartlarına uygun; sertifika süreçlerinde destek." },
  ],
  ocppFeatures: [
    "Uzaktan başlat / durdur", "RFID kimlik doğrulama",
    "Gerçek zamanlı güç ölçümü", "Çoklu ödeme entegrasyonu",
    "Oturum geçmişi & faturalandırma", "Firmware OTA güncelleme",
    "Hata kodu raporlama", "Dinamik tarife desteği",
  ],
};

export default function OperatorPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [cms, setCms] = useState<OperatorContent>(DEFAULT_OP);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data) => {
      if (data?.operator) setCms(data.operator);
    }).catch(() => {});
    fetch("/api/products").then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, [lang]);

  const bg      = d ? "#131318" : "#f8f8fb";
  const bgSub   = d ? "#1a1a20" : "#ffffff";
  const card    = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const text    = d ? "#f0f0f4" : "#1a1a2e";
  const muted   = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow  = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const PURPLE  = "#818CF8";
  const BLUE    = "#3B82F6";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <JsonLd data={serviceSchema({
        name: "Şarj Ağı Operatörü Çözümleri",
        description: "EV şarj ağı operatörleri için anahtar teslim çözümler: OCPP 1.6J / 2.0.1 uyumlu donanım, ödeme entegrasyonu, RFID, uzaktan izleme ve yönetim yazılımı.",
        url: "/operator",
        offerings: ["OCPP 1.6J / 2.0.1 Uyumlu Donanım", "RFID Kimlik Doğrulama", "Uzaktan İzleme & Yönetim", "Ödeme Entegrasyonu", "API & Yazılım Desteği"],
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
        <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiWifiLine style={{ color: accentInk(PURPLE, d), fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: accentInk(PURPLE, d) }}>
                Şarj Ağı Operatörleri
              </span>
            </div>
            <h1 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {cms.heading1}<br />
              <span style={{ color: accentInk(PURPLE, d) }}>{cms.heading2}</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[2px] w-24 origin-left rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${PURPLE} 0%, ${PURPLE}66 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${PURPLE}45`,
              }}
            />
            <p className="leading-relaxed max-w-xl" style={{ color: muted, fontSize: "0.9375rem" }}>
              {cms.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Operatör Odaklı Özellikler — birleşik bölüm: üst yarı 4 kapasite kartı,
            alt yarı OCPP destekli fonksiyonlar listesi. Tek section, opsiyonel
            arka plan görseli (admin → operator.featuresBg). ── */}
      <section className="relative overflow-hidden" style={{ borderBottom: `1px solid ${border}`, padding: "64px 0" }}>
        {cms.featuresBg ? (
          <>
            <Image src={cms.featuresBg} alt="" fill quality={88} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0" style={{
              background: d
                ? "linear-gradient(135deg, rgba(8,8,12,0.90) 0%, rgba(8,8,12,0.78) 60%, rgba(8,8,12,0.66) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.72) 60%, rgba(255,255,255,0.58) 100%)",
            }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: bg }} />
        )}
        <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: accentInk(PURPLE, d) }}>Teknik Altyapı</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: text }}>Operatör Odaklı Özellikler</h2>
            <p className="text-sm max-w-2xl" style={{ color: muted }}>
              OCPP 1.6J / 2.0.1 uyumlu donanımlar, dinamik güç yönetimi, uzaktan izleme ve sertifikalı altyapıyla şarj ağınız için uçtan uca operatör desteği.
            </p>
          </div>

          {/* Üst yarı: 4 kapasite kartı (eski Operatör Odaklı Özellikler) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl p-6 sm:p-8 mb-6"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, backdropFilter: cms.featuresBg ? "blur(6px)" : "none" }}
          >
            <div className="flex flex-col gap-5">
              {(cms.capabilities ?? DEFAULT_OP.capabilities).map((c, i, arr) => {
                const Icon = CAPABILITY_ICONS[i % CAPABILITY_ICONS.length];
                const color = CAPABILITY_COLORS[i % CAPABILITY_COLORS.length];
                return (
                  <motion.div key={c.title}
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
                      <p className="font-semibold text-base mb-1" style={{ color: text }}>{c.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: muted }}>{c.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Alt yarı: OCPP destekli fonksiyonlar listesi */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, backdropFilter: cms.featuresBg ? "blur(6px)" : "none" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <RiCheckLine style={{ color: accentInk(BLUE, d), fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentInk(BLUE, d) }}>OCPP Destekli Fonksiyonlar</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {(cms.ocppFeatures ?? DEFAULT_OP.ocppFeatures).map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30` }}>
                    <RiCheckLine style={{ fontSize: 10, color: accentInk(BLUE, d) }} />
                  </div>
                  <span className="text-xs" style={{ color: muted }}>{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 text-xs" style={{ borderTop: `1px solid ${border}`, color: faint }}>
              OCPP 1.6J ve 2.0.1 desteği · TLS 1.3 şifreleme · JSON & SOAP
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Operatörlere Özel Ürünler — gerçek katalog kartları,
            b2b sayfasındaki "Üretici Portföyü" pattern'ı ile aynı ── */}
      {(() => {
        const resolved = (cms.featuredProducts ?? [])
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
          <section style={{ background: bgSub, padding: "56px 0", borderBottom: `1px solid ${border}` }}>
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <RiWifiLine style={{ color: accentInk(PURPLE, d), fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentInk(PURPLE, d) }}>Operatör Portföyü</span>
                </div>
                <h2 className="text-xl font-black mb-1" style={{ color: text }}>Operatörlere Özel Ürünler</h2>
                <p className="text-sm max-w-2xl" style={{ color: muted }}>
                  OCPP uyumlu DC hızlı şarj üniteleri, akıllı şarj panoları ve operatör altyapısına yönelik öne çıkan ürünler.
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
                            <RiPlugLine style={{ fontSize: 36, color: accentInk(cat.accent, d), opacity: 0.6 }} />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ background: `${cat.accent}15`, color: accentInk(cat.accent, d), border: `1px solid ${cat.accent}28` }}>
                            {cat.name}
                          </span>
                          <h3 className="font-bold text-sm mb-0.5" style={{ color: text }}>{prod.name}</h3>
                          {prod.subtitle && <p className="text-xs mb-2" style={{ color: faint }}>{prod.subtitle}</p>}
                          {shortDesc && <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{shortDesc}</p>}
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: accentInk(cat.accent, d) }}>
                            Ürünü İncele
                            <RiArrowRightSLine size={14} className="group-hover:translate-x-0.5 transition-transform" />
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
