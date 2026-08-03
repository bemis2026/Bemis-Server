"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import E from "./E";

// Binlik ayracı dile göre: 16000 → "16.000" (tr/de/es) · "16,000" (en) · "16 000" (ru).
// ⚠️ Arapça için BİLEREK en-US kullanılıyor: "ar" yerelinde Intl, Arap-Hint
// rakamları (٨٬٠٠٠) üretir; sitenin geri kalanı Latin rakam kullandığı için
// tutarsız görünürdü.
const SAYI_YERELI: Record<string, string> = {
  tr: "tr-TR", de: "de-DE", es: "es-ES", ru: "ru-RU", en: "en-US", ar: "en-US",
};

function CountUp({ value, suffix, prefix, active, lang }: { value: number; suffix: string; prefix?: string; active: boolean; lang: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, step);
    return () => clearInterval(timer);
  }, [active, value]);

  const bicimli = count.toLocaleString(SAYI_YERELI[lang] ?? "en-US");
  return <span>{prefix ?? ""}{bicimli}{suffix}</span>;
}

export default function Stats() {
  const { stats, sectionBgs, statsCertBand } = useContent();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const BLUE = "#3B82F6";
  const sectionBgUrl = sectionBgs?.["stats"] ?? "";

  const sectionBg     = d
    ? "linear-gradient(155deg, #111318 0%, #0d0e12 50%, #131418 100%)"
    : "linear-gradient(155deg, #26262c 0%, #131316 50%, #1e1e23 100%)";
  // ⚠️ ERİŞİLEBİLİRLİK (2026-07-31): kart zemini aydınlık modda BEYAZ %10 idi;
  // mavi gradyanı açtığı için beyaz metnin kontrastı düşüyordu — etiket 4,32:1,
  // açıklama 3,02:1 (AA eşiği 4,5). Zemin SİYAH %20'ye çevrildi: aynı mavi
  // ailesinde kalır ama koyulaşır → etiket 7,24:1, açıklama 4,5:1 üstü.
  // Hover artık AÇAR (siyah %10) — "üstüne gelince aydınlanma" hissi korundu.
  // Karanlık modda açıklama %40 → %55 (3,81:1 → 6,22:1).
  const cardBgDefault  = d ? "linear-gradient(145deg, #111114 0%, #0d0d10 100%)" : "rgba(0,0,0,0.20)";
  const cardBgHover    = d ? "linear-gradient(145deg, #141418 0%, #101014 100%)" : "rgba(0,0,0,0.10)";
  const gridGap        = d ? `${BLUE}20` : "rgba(255,255,255,0.18)";
  const statNumColor   = d ? "#93C5FD" : "#ffffff";
  const labelColor     = d ? "#ffffff" : "#ffffff";
  const descColor      = d ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.78)";
  const eyebrowColor   = d ? "#93C5FD" : "#ffffff";
  // Sertifika bandı metni 11-12px = KÜÇÜK metin → AA 4,5:1 şart.
  // Ölçüldü: karanlıkta beyaz %70 = 9,51:1 · aydınlıkta beyaz %85 = 5,72:1
  // (gradyanın en zor noktası #2563eb üzerinde hesaplandı).
  const bandColor      = d ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.85)";

  return (
    <section
      id="stats"
      className="relative"
      style={{ background: sectionBg }}
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.70)" : "rgba(0,0,0,0.76)" }} />
        </>
      )}
      <div className="section-divider" style={{ background: d ? undefined : "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* ⚠️ 2026-07-31 — bölümün HİÇ başlığı yoktu (13 Tem'de "32 yıllık miras"
            bloğu Hakkımızda ile tekrar ettiği için kaldırılmıştı, geriye çıplak
            sayı ızgarası kalmıştı). Buraya YALNIZ tek satır başlık konuyor;
            o uzun miras anlatısı BİLEREK geri getirilmiyor. */}
        {/* ⚠️ Bilerek KÜÇÜK bir bilgi etiketi — büyük bölüm başlığı DEĞİL
            (kullanıcı isteği 2026-07-31). Semantik olarak yine <h2>: bölümün
            başlığı bu, belge başlık hiyerarşisi bozulmasın. Boyut, sitedeki
            "eyebrow" (üst etiket) ölçüsüyle aynı. */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center text-xs font-bold tracking-[0.18em] mb-4 lg:mb-5"
          style={{ color: eyebrowColor, opacity: d ? 1 : 0.9 }}
        >
          {pickText(lang, "RAKAMLARLA BEMİS", "BEMIS BY THE NUMBERS")}
        </motion.h2>
        {/* ⚠️ TEK KAPSAYICI: 4 kartlık şerit + ALTINDAKİ ince sertifika bandı
            aynı `rounded-2xl overflow-hidden` kutunun içinde. Kutunun zemini
            `gridGap` (ayraç rengi); kartlar `gap-px`, bant ise `mt-px` ile
            yerleşince aradaki 1px çizgi kendiliğinden oluşur → ikisi TEK BÜTÜN
            görünür (kullanıcı isteği: "birleşik bütün olarak"). */}
        <div className="rounded-2xl overflow-hidden" style={{ background: gridGap }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className={`transition-all duration-300 p-6 sm:p-7 lg:p-8 flex flex-col items-center justify-center text-center${
                  // Tek sayıda kart kalırsa sonuncusu mobilde iki sütunu kaplar
                  // (öksüz yarım kart görünmesin).
                  i === stats.length - 1 && stats.length % 2 === 1 ? " col-span-2 lg:col-span-1" : ""
                }`}
                style={{ background: cardBgDefault }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = cardBgHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = cardBgDefault; }}
              >
                {/* value = 0 ve prefix yoksa sayı satırı hiç basılmaz →
                    adminde "Sayı Değeri"ni 0 yapmak = o kartın rakamını gizle. */}
                {(stat.value > 0 || stat.prefix) && (
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1.5 tabular-nums" style={{ color: statNumColor }}>
                    <CountUp value={stat.value} suffix={stat.suffix} prefix={stat.prefix} active={inView} lang={lang} />
                  </div>
                )}
                <div
                  className={
                    stat.value > 0 || stat.prefix
                      ? "font-semibold text-sm sm:text-base mb-0.5"
                      : "font-black text-lg sm:text-xl lg:text-2xl mb-1.5"
                  }
                  style={{ color: labelColor }}
                >
                  <E field={`stats.${i}.label`} tag="span">{stat.label}</E>
                </div>
                <div className="text-xs sm:text-sm" style={{ color: descColor }}>
                  <E field={`stats.${i}.description`} tag="span">{stat.description}</E>
                </div>
              </motion.div>
            ))}
          </div>

          {/* İnce sertifika bandı — yalnız belge adları (kullanıcı kararı).
              Boş bırakılırsa hiç render edilmez. Mobilde sarabilsin diye
              flex-wrap; harfler arası boşlukla "rozet şeridi" hissi verilir. */}
          {statsCertBand?.trim() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: stats.length * 0.09 }}
              className="mt-px px-5 py-3 sm:py-3.5 text-center"
              style={{ background: cardBgDefault }}
            >
              <span
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em]"
                style={{ color: bandColor }}
              >
                <E field="statsCertBand" tag="span">{statsCertBand}</E>
              </span>
            </motion.div>
          )}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
