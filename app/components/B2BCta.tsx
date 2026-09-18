"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useLanguage, type Lang } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import { useContent } from "../context/ContentContext";
import {
  RiShieldCheckLine, RiBuilding2Line,
  RiStoreLine, RiWifiLine, RiArrowRightLine,
} from "react-icons/ri";

const CHANNEL_META = [
  { href: "/b2b",      icon: RiBuilding2Line, accent: "#3B82F6" },
  { href: "/bayilik",  icon: RiStoreLine,     accent: "#10B981" },
  { href: "/operator", icon: RiWifiLine,      accent: "#818CF8" },
];

type CtaChannel = { href: string; label: string; sub: string };
type CtaData = { eyebrow: string; heading: string; description: string; tags: string[]; channels: CtaChannel[] };

/**
 * İstemci `/api/b2b?lang=` yanıtı gelene kadar basılan yedek.
 *
 * ⚠️ 2026-09-18 — İKİ KUSUR BİRDEN DÜZELTİLDİ:
 * (1) Yedek SAF TÜRKÇEYDİ → 2026-09-18'de açılan /en /de /es /ru /nl
 *     ANASAYFALARININ statik HTML'inde bu bant Türkçe kalıyordu (ölçüldü:
 *     /de içinde 8 Türkçe dize). Artık `pickText` ile 7 dil; çeviriler
 *     UYDURULMADI, `data/b2b-<dil>.json` cta bloğundan `ui.json`'a taşındı
 *     (bkz. scratchpad/_b2bcta_ui.cjs).
 * (2) Yedek metin CANLI VERİYLE AYNI DEĞİLDİ (eski bir yer tutucuydu:
 *     "Üretici veya kurumsal alıcı mısınız?" · "DC şarj üniteleri, şarj
 *     panoları…"). Türk ziyaretçi de ~300 ms boyunca BAŞKA bir metin görüp
 *     sonra sıçramasını izliyordu. TR metni artık `data/b2b.json` cta ile
 *     birebir → sıçrama yok. (Nihai görünen metin DEĞİŞMEDİ; yalnız yer
 *     tutucu gerçeğe hizalandı.)
 *
 * 📌 `channels[].href` ÇEVRİLMEZ: /b2b · /bayilik · /operator sayfalarının
 *    yabancı dil karşılığı yok, bilerek TR'de kalırlar (Footer kuralı).
 */
function varsayilanCta(lang: Lang): CtaData {
  const t = (tr: string, en: string) => pickText(lang, tr, en);
  return {
    eyebrow: t("OEM & Kurumsal Satış", "Enterprise Sales"),
    heading: t("Üreticiler, Operatörler ve Bayiler İçin Özel Çözümler", "Custom Solutions for Manufacturers, Operators and Dealers"),
    description: t(
      "Üreticiler için özel renk ve markalama seçenekleri. Operatör CPO'lar için özel çözümler. Son kullanıcı odaklı ürün portföyü ve birçok avantaj için detaylı bilgi alın.",
      "Custom color and marking options for manufacturers. Tailored solutions for operator CPOs. Get detailed information for an end-user-oriented product portfolio and many benefits."
    ),
    tags: [
      t("OEM Üretici", "OEM Manufacturer"),
      t("Şarj Ağı Operatörü", "Charging Network Operator"),
      t("Distribütör / Bayi", "Distributor / Dealer"),
    ],
    channels: [
      { href: "/b2b",      label: t("OEM & Üreticiler", "OEMs & Manufacturers"),          sub: t("Teknik portföy, özel fiyat, mühendislik desteği", "Technical portfolio, special price, engineering support") },
      { href: "/bayilik",  label: t("Bayilik Başvurusu", "Dealer Application"),           sub: t("Bayi ağımıza katılın, bölge koruması alın", "Join our dealer network, get zone protection") },
      { href: "/operator", label: t("Şarj Ağı Operatörleri", "Charging Network Operators"), sub: t("OCPP uyumlu ekipman, DLM, uzaktan izleme", "OCPP compliant equipment, DLM, remote monitoring") },
    ],
  };
}

export default function B2BCta() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { sectionBgs } = useContent();
  const d = theme === "dark";
  const router = useRouter();
  // ⚠️ Yedek dile BAĞLI → lang değişince yeniden kurulmalı; yoksa dil seçici
  //    ile geçiş yapan ziyaretçi, /api/b2b yanıtı gelene dek ESKİ dilde kalırdı.
  const varsayilan = useMemo(() => varsayilanCta(lang), [lang]);
  const [cta, setCta] = useState<CtaData>(varsayilan);

  // Bölüm arka plan görseli (admin → Bölüm Arka Planları → OEM & Kurumsal Satış).
  // Boşsa bölüm ESKİ tasarımı aynen korur (tam geri-alınabilir). Görsel varken
  // fotoğraf hafif karartılır ve metin/kartlar AÇIK renge geçer (okunurluk için).
  const sectionBgUrl = sectionBgs?.["b2bcta"] ?? "";
  const hasBg = !!sectionBgUrl;

  useEffect(() => {
    // ⚠️ BAYAT YANIT KORUMASI — bkz. operator/page.tsx notu (2026-09-13).
    let iptal = false;
    setCta(varsayilan); // dil değişti → önce o dilin yedeği, sonra CMS yanıtı
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then(data => {
      if (iptal) return;
      if (data?.cta) setCta(data.cta);
    }).catch(() => {});
    return () => { iptal = true; };
  }, [lang, varsayilan]);

  const channels = (cta.channels ?? varsayilan.channels).map((ch, i) => ({
    ...ch,
    ...CHANNEL_META[i % CHANNEL_META.length],
    href: ch.href || CHANNEL_META[i % CHANNEL_META.length].href,
  }));

  const BLUE = "#3B82F6";
  const bg = d
    ? "linear-gradient(135deg, #0d1117 0%, #111318 50%, #0c0f14 100%)"
    : "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #eef2ff 100%)";
  const textPrimary = hasBg ? "#ffffff"                : d ? "#f0f0f4"                  : "#1a1a2e";
  const textMuted   = hasBg ? "rgba(255,255,255,0.80)" : d ? "rgba(240,240,244,0.55)"   : "rgba(26,26,46,0.55)";
  const border      = d ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.18)";
  const cardBg      = hasBg ? "rgba(13,17,25,0.55)"    : d ? "rgba(255,255,255,0.04)"   : "rgba(255,255,255,0.70)";
  const cardBorder  = hasBg ? "rgba(255,255,255,0.18)" : d ? "rgba(255,255,255,0.08)"   : "rgba(0,0,0,0.07)";
  // Fotoğraf varken eyebrow/tag/kart-hover DAİMA koyu-üstü-açık davransın (tema'dan bağımsız okunurluk).
  const lightOnDark = hasBg || d;

  return (
    <section
      id="b2bcta"
      className="relative overflow-hidden py-14 sm:py-16"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      {/* Bölüm arka plan görseli + hafif karartma (YALNIZ görsel yüklüyse; boşsa
          bölüm eski tasarımı aynen korur). Karartma sola daha koyu (başlık okunur),
          sağa daha açık (fotoğraf görünür). Boyut/yerleşim değişmez. */}
      {hasBg && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(100deg, rgba(9,12,18,0.86) 0%, rgba(9,12,18,0.62) 52%, rgba(9,12,18,0.44) 100%)" }} />
        </>
      )}

      <div className="absolute inset-0 pointer-events-none" style={{
        background: d
          ? "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)",
      }} />

      <div className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* Left */}
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
              style={{
                background: lightOnDark ? `${BLUE}18` : `${BLUE}10`,
                border: lightOnDark ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
                color: lightOnDark ? "#93C5FD" : BLUE,
              }}
            >
              <RiShieldCheckLine style={{ fontSize: 13 }} />
              {cta.eyebrow}
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 leading-tight" style={{ color: textPrimary }}>
              {cta.heading}
            </h2>

            <div
              className="h-px w-24 origin-left mb-4"
              style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
            />

            <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
              {cta.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {(cta.tags ?? []).map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${BLUE}${hasBg ? "26" : "12"}`, border: `1px solid ${BLUE}${hasBg ? "45" : "25"}`, color: lightOnDark ? "#93C5FD" : BLUE }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — 3 equal channel cards */}
          <div className="flex flex-col gap-3 lg:min-w-[320px]">
            {channels.map(ch => (
              <button
                key={ch.href}
                onClick={() => router.push(ch.href)}
                className="group flex items-center gap-4 px-5 py-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: (hasBg || d) ? "none" : "0 2px 12px rgba(0,0,0,0.07)",
                  backdropFilter: hasBg ? "blur(6px)" : undefined,
                  WebkitBackdropFilter: hasBg ? "blur(6px)" : undefined,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${ch.accent}55`;
                  (e.currentTarget as HTMLElement).style.background = hasBg
                    ? "rgba(30,36,48,0.72)"
                    : d
                    ? `rgba(255,255,255,0.07)`
                    : "rgba(255,255,255,0.97)";
                  (e.currentTarget as HTMLElement).style.boxShadow = (hasBg || d)
                    ? `0 0 0 1px ${ch.accent}25, 0 8px 24px rgba(0,0,0,0.28)`
                    : `0 4px 20px ${ch.accent}18, 0 0 0 1px ${ch.accent}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardBorder;
                  (e.currentTarget as HTMLElement).style.background = cardBg;
                  (e.currentTarget as HTMLElement).style.boxShadow = (hasBg || d) ? "none" : "0 2px 12px rgba(0,0,0,0.07)";
                }}
              >
                {/* W3C: <button> içinde yalnız phrasing content geçerli → div/p
                    yerine span (block/flex sınıfları aynı görünümü verir). */}
                <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: `${ch.accent}18`, border: `1px solid ${ch.accent}30` }}>
                  <ch.icon style={{ fontSize: 22, color: ch.accent }} />
                </span>
                <span className="block flex-1 min-w-0">
                  <span className="block text-base font-bold leading-tight" style={{ color: textPrimary }}>{ch.label}</span>
                  <span className="block text-xs leading-snug mt-1" style={{ color: textMuted }}>{ch.sub}</span>
                </span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:translate-x-0.5"
                  style={{ background: `${ch.accent}12` }}>
                  <RiArrowRightLine size={16} style={{ color: ch.accent }} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
