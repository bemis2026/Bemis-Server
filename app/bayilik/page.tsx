"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import EnergyBackground from "../components/EnergyBackground";
import JsonLd from "../components/JsonLd";
import { serviceSchema } from "../lib/seo";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useDealerApplyOverlay } from "../context/DealerApplyOverlayContext";
import {
  RiCheckLine, RiBuilding4Line, RiGlobalLine, RiArrowRightLine,
} from "react-icons/ri";

type InfoRow = { label: string; value: string };
type Benefit = { title: string; body: string };
type MarketingEvent = {
  id: string;
  image: string;
  title?: string;
  location?: string;
  date?: string;
};
type NetworkStat = { value: string; label: string };
type BayilikContent = {
  heading1: string;
  heading2: string;
  description: string;
  infoTable: InfoRow[];
  benefits: Benefit[];
  /** Legacy single-criteria list — old bins still ship this. New
   *  tab-aware lists below; render prefers tr/intl when present. */
  criteria: string[];
  trCriteria?: string[];
  intlCriteria?: string[];
  networkStats?: NetworkStat[];
  heroBg?: string;
  /** Fairs / events / brand-activation visuals — admin-managed. */
  marketingEvents?: MarketingEvent[];
};

// Defaults below are only used as a fallback shape — the page's actual
// copy is hardcoded in the render. We still read `cms.heroBg` from the
// CMS so the operator can swap the hero background without editing
// this file.
const DEFAULT: BayilikContent = {
  heading1: "Bayi & Distribütör",
  heading2: "Programı",
  description: "",
  infoTable: [],
  benefits: [],
  criteria: [],
};

// Fallbacks used only when the CMS hasn't been populated yet — keeps
// freshly seeded bins from showing empty stat strips / criteria lists
// on the first render. Once the operator fills them in from the admin
// panel the CMS values take over.
const FALLBACK_NETWORK_STATS: NetworkStat[] = [
  { value: "30+", label: "Yıl Sektör Tecrübesi" },
  { value: "80+", label: "İlde Yetkili Bayi" },
  { value: "60+", label: "Ülke İhracat" },
  { value: "24/7", label: "Teknik Destek" },
];

const FALLBACK_TR_CRITERIA = [
  "En az 3 yaşında kurumsal şirket (LTD/A.Ş.) — ticaret sicili ile teyit",
  "A-grubu banka üzerinden minimum 1.000.000 ₺ limitli DBS (Doğrudan Borçlandırma Sistemi) hattı",
  "Fiziksel mağaza / satış noktası",
  "SMM belgeli elektrik mühendisi veya MYK belgeli EV şarj kurulum teknisyeni (minimum 1 kişi)",
  "Markalanmış en az 1 adet servis aracı ve bölgesel saha kurulum kapasitesi",
  "Son 2 yıl bilanço pozitif; iflas / konkordato / icra haciz kaydı bulunmaması (Findeks teyitli)",
  "Açılış siparişinde Bemis E-V Charge'ın belirlediği ürün karması üzerinden stok alımı taahhüdü",
  "Münhasır bölge karşılığında minimum yıllık 5.000.000 ₺ ciro taahhüdü",
  "Aylık dijital + saha pazarlama aktivitesi taahhüdü (sosyal medya, B2B ziyaret raporu)",
  "Bemis E-V Charge Akademi teknik + satış sertifikasyon programını 6 ay içinde tamamlama",
];

const FALLBACK_INTL_CRITERIA = [
  "Ülke veya bölge için tek-dağıtıcılık (exclusive) taahhüdü",
  "EV şarj veya elektrik altyapı pazarına hakimiyet",
  "Yerel ürün sertifikasyon yeterliliği (CE, ulusal standartlar)",
  "İthalat lisansı ve gümrük operasyon altyapısı",
  "Bölgesel depo ve lojistik kapasitesi",
  "Minimum yıllık ciro / sipariş hedefi taahhüdü",
  "Satış sonrası servis ve müşteri destek altyapısı",
];

export default function BayilikPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { openDealerApply } = useDealerApplyOverlay();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [cms, setCms] = useState<BayilikContent>(DEFAULT);
  const [tab, setTab] = useState<"tr" | "intl">("tr");

  useEffect(() => {
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data) => {
      if (data?.bayilik) setCms(data.bayilik);
    }).catch(() => {});
  }, [lang]);

  const bg     = d ? "#0c0c0e" : "#f8f8fb";
  const bgSub  = d ? "#111114" : "#ffffff";
  const card   = d ? "rgba(20,20,22,0.55)" : "rgba(255,255,255,0.55)";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const text   = d ? "#f0f0f4" : "#1a1a2e";
  const muted  = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,46,0.55)";
  const faint  = d ? "rgba(240,240,244,0.30)" : "rgba(26,26,46,0.30)";
  const shadow = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const GREEN  = "#10B981";
  const BLUE   = "#3B82F6";

  const trCriteria = (cms.trCriteria?.length ? cms.trCriteria : null) ?? (cms.criteria?.length ? cms.criteria : null) ?? FALLBACK_TR_CRITERIA;
  const intlCriteria = (cms.intlCriteria?.length ? cms.intlCriteria : null) ?? FALLBACK_INTL_CRITERIA;
  const activeCriteria = tab === "tr" ? trCriteria : intlCriteria;
  const networkStats = (cms.networkStats?.length ? cms.networkStats : null) ?? FALLBACK_NETWORK_STATS;

  return (
    <div style={{ background: bg, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <JsonLd data={serviceSchema({
        name: "Bayi & Distribütör Programı",
        description: "Türkiye'de bayi, yurt dışında distribütör programı. 80+ ilde yetkili bayi ağı, 60+ ülkede ihracat tecrübesi. Teknik eğitim, pazarlama desteği ve özel bayi fiyatları.",
        url: "/bayilik",
        offerings: ["Türkiye Bayilik", "Yurtdışı Distribütörlük", "Teknik Eğitim", "Pazarlama Desteği", "Bayi Özel Fiyatları"],
        areaServed: "Worldwide",
      })} />
      <EnergyBackground />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: bgSub,
          borderBottom: `1px solid ${border}`,
          padding: "120px 0 56px",
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
                  : "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.60) 55%, rgba(255,255,255,0.35) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1 h-4 rounded-full" style={{ background: GREEN }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: GREEN }}>
                Bemis Yetkili Satış Ağı
              </span>
            </div>
            <h1 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              Bayi &amp; Distribütör <br />
              <span style={{ color: GREEN }}>Programı</span>
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
            <p className="leading-relaxed max-w-2xl" style={{ color: muted, fontSize: "0.9375rem" }}>
              Bemis Teknik Elektrik A.Ş., 1994&apos;ten bu yana endüstriyel elektrik ekipmanları
              üreten köklü bir Türkiye markasıdır. Bemis E-V Charge ürünlerimizi Türkiye genelinde
              yetkili bayi ağımız ve dünya genelinde distribütörlerimiz aracılığıyla son kullanıcıya
              ulaştırıyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Ağımız Hakkında — kurumsal sayılar + fuar/etkinlik
          görselleri tek bölümde. Stats üstte, fuar galerisi altta;
          her ikisi de aynı "kurumsal güven" mesajını destekliyor. ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>
              Ağımız Hakkında
            </p>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3" style={{ color: text }}>
              Türkiye ve dünyada kurumsal bir satış ağı
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: muted }}>
              Bemis E-V Charge, üretici garantili ürünleri yetkili kanaldan satışa sunar. Bayi
              ağımız 80+ ilde, distribütör ağımız ise 60+ ülkede aktiftir. Kurulum, satış sonrası
              destek ve yedek parça tedariki yetkili noktalar üzerinden tek-zincir takip edilir.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
            {networkStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className="rounded-2xl px-5 py-5 flex flex-col gap-1"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
              >
                <span className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: GREEN }}>
                  {s.value}
                </span>
                <span className="text-xs font-semibold leading-snug" style={{ color: muted }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Fuarlar & Marka Tanıtım — fair gallery folded into the
              same Ağımız Hakkında frame so kurumsal sayılar and the
              proof-in-the-field photos read as one story. */}
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>
              Fuarlar & Marka Tanıtım
            </p>
            <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1" style={{ color: text }}>
              Sahada Bemis E-V Charge
            </h3>
            <p className="text-sm leading-relaxed max-w-3xl" style={{ color: muted }}>
              Katıldığımız sektör fuarları, etkinlikler ve bayi buluşmalarından kareler.
            </p>
          </div>

          {(cms.marketingEvents && cms.marketingEvents.length > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cms.marketingEvents.map((ev, i) => (
                <motion.div
                  key={ev.id ?? i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 * i }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
                >
                  {ev.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={ev.image}
                      alt={ev.title ?? "Bemis etkinlik"}
                      className="w-full object-cover"
                      style={{ height: "clamp(180px, 22vw, 230px)" }}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {(ev.title || ev.location || ev.date) && (
                    <div className="p-4">
                      {ev.title && (
                        <p className="font-bold text-sm mb-1" style={{ color: text }}>{ev.title}</p>
                      )}
                      {(ev.location || ev.date) && (
                        <p className="text-xs" style={{ color: muted }}>
                          {[ev.location, ev.date].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: card, border: `1px dashed ${border}` }}
            >
              <p className="text-sm" style={{ color: muted }}>
                Fuar ve etkinlik görselleri admin panelden yüklendiğinde burada listelenecek.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Aranan Kriterler — tabbed (Türkiye Bayilik / Yurtdışı Distribütörlük) ── */}
      <section style={{ background: bgSub, padding: "52px 0", borderBottom: `1px solid ${border}` }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>
              Başvuru Koşulları
            </p>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: text }}>
              Aranan Kriterler
            </h2>
          </div>

          {/* Tab switcher — Türkiye Bayilik | Yurtdışı Distribütörlük */}
          <div
            className="inline-flex rounded-2xl p-1 mb-6"
            style={{
              background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${border}`,
            }}
          >
            {(["tr", "intl"] as const).map((m) => {
              const active = tab === m;
              const Icon = m === "tr" ? RiBuilding4Line : RiGlobalLine;
              const label = m === "tr" ? "Türkiye Bayilik" : "Yurtdışı Distribütörlük";
              const accent = m === "tr" ? GREEN : BLUE;
              return (
                <button
                  key={m}
                  onClick={() => setTab(m)}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: active ? (d ? `${accent}28` : `${accent}18`) : "transparent",
                    color: active ? (d ? "#ffffff" : accent) : muted,
                    border: active ? `1px solid ${accent}55` : "1px solid transparent",
                  }}
                >
                  <Icon style={{ fontSize: 14, color: active ? accent : muted }} />
                  {label}
                </button>
              );
            })}
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 sm:p-7"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
          >
            <p className="text-sm leading-relaxed mb-5" style={{ color: muted }}>
              {tab === "tr"
                ? "Türkiye sınırları içinde belirli bir ilçe, il veya bölgede Bemis E-V Charge ürünlerinin satış ve kurulumunu üstlenecek yetkili bayi başvurularında aranan temel kriterler:"
                : "Türkiye dışında bir ülke veya bölgede Bemis E-V Charge ürünlerini dağıtacak distribütör başvurularında aranan temel kriterler:"}
            </p>
            <ul className="space-y-3">
              {activeCriteria.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${(tab === "tr" ? GREEN : BLUE)}18`, border: `1px solid ${(tab === "tr" ? GREEN : BLUE)}30` }}>
                    <RiCheckLine style={{ fontSize: 11, color: tab === "tr" ? GREEN : BLUE }} />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: muted }}>{c}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${border}` }}>
              <button
                onClick={() => openDealerApply(tab)}
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
                style={{
                  background: tab === "tr" ? GREEN : BLUE,
                  color: "#ffffff",
                  boxShadow: `0 6px 20px ${(tab === "tr" ? GREEN : BLUE)}40`,
                }}
              >
                {tab === "tr" ? "Bayi Başvurusu" : "Distribütör Başvurusu"}
                <RiArrowRightLine size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div style={{ marginTop: "auto" }}>
        <ContactBar />
      </div>
    </div>
  );
}
