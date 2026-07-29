"use client";
import { pickText } from "../lib/ui";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState, useRef } from "react";
import E from "./E";
import { smoothScrollToTarget, NAV_OFFSET } from "../lib/smoothScroll";

// Dönen kelime kutusunun genişliğini ölçmek için tek paylaşılan canvas (DOM'a girmez).
let _measureCanvas: HTMLCanvasElement | null = null;

const ACCENT = "#3B82F6";

// Cycles through `words` every 2.5s with a fade-up swap. Falls back to a
// single static word when only one is supplied — keeps the layout stable
// for editors who clear the rotating list.
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [minW, setMinW] = useState<number | undefined>(undefined);
  // ⚠️ LCP KRİTİK: bu kelime H1 içindedir → H1 sitenin mobil LCP öğesi.
  // Eskiden framer `initial={{opacity:0}}` ilk kelimeyi SSR'da GÖRÜNMEZ basıyordu;
  // Lighthouse H1'i "boyandı" saymak için JS hidrasyonunu (~2.2s) bekliyordu →
  // LCP 5.8s. `mounted` false iken (ilk render / SSR) kelime opak-1 başlar,
  // animasyon YALNIZ hidrasyon sonrası kelime GEÇİŞLERİNDE oynar (görünüm aynı,
  // ama ilk boya JS'i beklemez). Hero üst-metnindeki opacity:0'lar 2026-07-02'de
  // zaten bu sebeple kaldırılmıştı — bu, gözden kaçan dönen-kelime kalıntısıydı.
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, [words.length, reduceMotion]);
  // Kutu genişliği = EN UZUN kelimenin GERÇEK piksel genişliği (canvas ile ölçülür).
  // Eski `(maxLen+1)ch` büyük fontta kutuyu aşırı şişiriyordu (48px'te ~375px → kelimeden
  // ~145px geniş boşluk = "satırlar bozuk" görünüyordu). Canvas ölçümü kelimeye TAM oturur:
  // ne kayma ne boşluk. Her dilde aynı davranış (TR referans) — kutu o dilin en uzun kelimesi kadar.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof document === "undefined") return;
    const cs = getComputedStyle(el);
    const canvas = _measureCanvas || (_measureCanvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    let max = 0;
    for (const w of words) max = Math.max(max, ctx.measureText(w).width);
    setMinW(Math.ceil(max) + 2);
  }, [words]);
  if (words.length === 0) return null;
  if (words.length === 1 || reduceMotion) return <span ref={ref}>{words[0]}</span>;
  return (
    <span
      ref={ref}
      className="relative inline-block align-baseline text-left"
      style={{ minWidth: minW ? `${minW}px` : undefined, whiteSpace: "nowrap" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          // ⚠️ İlk render (mounted=false): opak-1 başla → LCP JS beklemez.
          // Hidrasyon sonrası kelime geçişlerinde animasyon aynen oynar.
          initial={mounted ? { y: "0.6em", opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.6em", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const { hero, logos } = useContent();
  const { layout } = hero;
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";

  // Admin "virgülle ayır" alanı ham split sonucu saklar (round-trip için
  // boşluk/virgül koruyor). Render öncesi trim + boş eleman temizliği
  // burada yapılır ki RotatingWord boş yazı flashlemeden geçişleri yapsın.
  const cleanWords = (hero.headline2Words ?? []).map(s => s.trim()).filter(Boolean);

  // Hero arka plan görselleri: ana heroBg + adminden eklenen ilave görseller.
  // Birden fazlaysa 5 sn'de bir, yumuşak/uzun crossfade ile geçer (zoom YOK); tekse statik.
  // ⚠️ Her slide KENDİ odak noktasını taşır. Eskiden tek bir heroBgPos TÜM görsellere
  // uygulanıyordu; ana görsele göre ayarlanan odak (ör. "75% 32%") farklı kompozisyondaki
  // slider görsellerinde boş bölgeyi (cihazın sağındaki zemin / duvar / gökyüzü) kırpıp
  // gösteriyordu — görsel yüklüydü ama "boş arka plan" gibi görünüyordu.
  // İlave görseller heroBgPos'u DEVRALMAZ → varsayılan merkez ("50% 50%").
  // ⚠️ Her slide MASAÜSTÜ + MOBİL için AYRI odak/yakınlaştırma taşır. Mobilde hero
  // çok dar/uzun olduğundan object-cover görselin yalnız ~%20-26'sını gösterir →
  // masaüstüne göre ayarlanan odak mobilde boş bölgeye düşüyordu. Mobil değeri
  // boşsa masaüstü değerine düşer (geriye uyumlu).
  const heroSlides = [
    {
      src: hero.heroBg,
      pos: hero.heroBgPos || "75% 50%",
      posM: hero.heroBgPosMobile || hero.heroBgPos || "75% 50%",
      zoom: hero.heroBgZoom ?? 1,
      zoomM: hero.heroBgZoomMobile ?? hero.heroBgZoom ?? 1,
    },
    ...(hero.heroImages ?? []).map((src, i) => {
      const pos = (hero.heroImagesPos ?? [])[i] || "50% 50%";
      const zoom = (hero.heroImagesZoom ?? [])[i] ?? 1;
      return {
        src,
        pos,
        posM: (hero.heroImagesPosMobile ?? [])[i] || pos,
        zoom,
        zoomM: (hero.heroImagesZoomMobile ?? [])[i] ?? zoom,
      };
    }),
  ]
    .map((s) => ({ ...s, src: (s.src ?? "").trim() }))
    .filter((s) => s.src);
  const [activeHero, setActiveHero] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    // prefers-reduced-motion: slider'ı döndürme — statik ilk görsel kalsın.
    if (reduceMotion || heroSlides.length <= 1) return;
    const t = setInterval(() => setActiveHero((n) => (n + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [heroSlides.length, reduceMotion]);
  const activeHeroIdx = heroSlides.length ? activeHero % heroSlides.length : 0;
  // Çift-tampon: tüm slider görsellerini değil, yalnız aktif + komşu (önceki/
  // sonraki) katmanı DOM'a bas → geçiş anında en fazla ~2-3 tam-ekran görsel
  // canlı kalır (mobil GPU jank biter). Komşu zaten DOM'da olduğu için bir
  // sonraki görsel önceden decode edilir → boş/atlamalı crossfade olmaz.
  const heroVisible = heroSlides.length
    ? new Set<number>([
        activeHeroIdx,
        (activeHeroIdx - 1 + heroSlides.length) % heroSlides.length,
        (activeHeroIdx + 1) % heroSlides.length,
      ])
    : new Set<number>();

  // Hero CTA ("EV Şarj Çözümlerimizi Keşfet") → ÜRÜN KATEGORİLERİ bölümü (#products).
  // ⚠️ Eskiden hero'nun bir SONRAKİ kardeş bölümüne kaydırıyordu (pratikte Hakkımızda) —
  // kullanıcı butonun ürün kategorilerini açmasını istedi (2026-07-27).
  //
  // ⚠️ Kaydırma neden JS'te: `scroll-behavior: smooth` sayfa genelinde KULLANILMIYOR
  // (route değişiminde sayfa alttan açılıp yukarı kayıyordu — bkz. layout.tsx notu).
  //
  // ⚠️ Neden tarayıcının `behavior:"smooth"`u değil: yerleşik yumuşak kaydırma uzun
  // mesafede çok hızlanıyor ve sert duruyor. Burada mesafeyle ölçeklenen süre
  // (900–1700 ms) + easeInOutCubic var = "sakin" his. Kullanıcı arada kendi
  // kaydırırsa (tekerlek/dokunma) animasyon BIRAKILIR, kaydırma kaçırılmaz.
  // ⚠️ Kaydirma mantigi app/lib/smoothScroll.ts dosyasina TASINDI (2026-07-29).
  // Sebep: ayni duzeltmeye ust menunun bolum baglantilarinin da ihtiyaci vardi ama
  // orada yoktu - Hero dogru kaydirirken menu yanlis yere gidiyordu. Tek kaynak
  // olsun ki bir daha ayrismasin. Davranis birebir ayni (fonksiyon oldugu gibi tasindi).
  const scrollToProducts = () => {
    const hedef = document.getElementById("products");
    if (hedef) {
      smoothScrollToTarget(() =>
        Math.max(0, window.scrollY + hedef.getBoundingClientRect().top - NAV_OFFSET),
      );
      return;
    }
    // Ürün bölümü sayfada yoksa (admin bölüm sıralamasından çıkarılmışsa) eski davranış
    const hero = document.getElementById("hero");
    const next = hero?.nextElementSibling as HTMLElement | null;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight - 72, behavior: "smooth" });
  };

  const sectionBg  = d
    ? "linear-gradient(160deg, #222222 0%, #181818 50%, #1e1e1e 100%)"
    : "linear-gradient(160deg, #f0f0f0 0%, #e8e8e8 50%, #eeeeee 100%)";

  const overlay    = d
    ? "linear-gradient(135deg, rgba(5,5,8,0.40) 0%, rgba(5,5,8,0.26) 50%, rgba(5,5,8,0.10) 100%)"
    : "linear-gradient(135deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.06) 100%)";

  const groundFade = d
    ? "linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.7) 50%, transparent 100%)"
    : "linear-gradient(to top, rgba(238,238,238,0.80) 0%, rgba(238,238,238,0.35) 50%, transparent 100%)";

  const scrollBorder   = d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.30)";
  const scrollDot      = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.45)";
  const scrollLabel    = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.55)";

  const headlineClass  = d ? "text-white" : "text-white";
  // Tam beyaz + text-shadow ile her arka planda okunaklı (hero görseli koyu
  // veya açık olabilir). Önceki text-white/45 dark mode'da çok soluktu.
  const subtitleClass  = "text-white";

  // Light mode'da Hero CTA daha açık + beyaz dominant cam efekti; dark
  // mode'da mevcut accent-cam efekti korunur.
  const LIGHT_BLUE = "#60A5FA";
  const heroCtaBg     = d ? `${ACCENT}26` : `rgba(255,255,255,0.22)`;
  const heroCtaBd     = d ? `${ACCENT}55` : `${LIGHT_BLUE}99`;
  const heroCtaSh     = d ? `0 10px 32px ${ACCENT}30, inset 0 1px 0 rgba(255,255,255,0.12)` : `0 10px 32px ${LIGHT_BLUE}45, inset 0 1px 0 rgba(255,255,255,0.45)`;
  const heroCtaBgHv   = d ? `${ACCENT}40` : `rgba(255,255,255,0.35)`;
  const heroCtaBdHv   = d ? `${ACCENT}90` : LIGHT_BLUE;
  const heroCtaShHv   = d ? `0 12px 36px ${ACCENT}50, inset 0 1px 0 rgba(255,255,255,0.16)` : `0 14px 40px ${LIGHT_BLUE}55, inset 0 1px 0 rgba(255,255,255,0.55)`;
  const heroCtaArrow  = d ? ACCENT : "#ffffff";
  const textShadow     = d ? undefined : "0 2px 16px rgba(0,0,0,0.70), 0 1px 4px rgba(0,0,0,0.50)";
  // Üreticisi (headline3) gradyanı tema-bazlı:
  //  • dark  → parlak mavi (#93C5FD→#3B82F6): koyu hero üzerinde harika parlıyor.
  //  • light → BEYAZ (kullanıcı isteği): headline1/2 ile aynı, tüm başlık tek
  //    parça beyaz; karartılmış hero overlay + drop-shadow ile net okunur.
  const headline3Gradient = d
    ? "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)";
  const headline3Filter   = d ? undefined : "drop-shadow(0 2px 10px rgba(0,0,0,0.45))";
  const logoSrc        = logos?.dark || "/logo-white.png";
  // Hero üzerindeki logo: dark mode'da beyaz logo aynen, light mode'da
  // siyah'a invert etmek yerine beyaza çevir + hafif drop-shadow ile her
  // hero görseli üzerinde (açık ya da koyu) okunaklı kalır.
  const logoStyle      = d ? {} : { filter: "brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.45))" };

  return (
    <section
      id="hero"
      className="relative hero-shell overflow-hidden"
      style={{ background: sectionBg }}
    >
      {/* Background photo — yakınlaşma/uzaklaşma (Ken Burns zoom) KALDIRILDI:
          görsel sabit durur, sadece yumuşak + uzun crossfade ile geçer
          (daha temiz/premium görünüm; eski zoom-reset kötü gözüküyordu). */}
      {heroSlides.length > 0 && (
        <div className="absolute inset-0">
          {heroSlides.map((slide, i) => !heroVisible.has(i) ? null : (
            <div
              key={slide.src + i}
              className="absolute inset-0 hero-slide"
              style={{
                opacity: i === activeHeroIdx ? 1 : 0,
                transition: "opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
                // ⚠️ Yalnız -d / -m çiftleri inline verilir; --hp/--hz'yi globals.css
                // medya sorgusu seçer. (Inline stil, stylesheet'i EZER → --hp'yi burada
                // set edersek mobil geçersiz kalırdı.)
                ["--hp-d" as string]: slide.pos,
                ["--hz-d" as string]: String(slide.zoom),
                ["--hp-m" as string]: slide.posM,
                ["--hz-m" as string]: String(slide.zoomM),
              } as React.CSSProperties}
              aria-hidden={i !== activeHeroIdx}
            >
              <Image
                src={slide.src}
                alt="Bemis E-V Charge elektrikli araç şarj istasyonu"
                fill
                priority={i === 0}
                // Hero = markanın ilk izlenimi + tam ekran → en yüksek kademe (95).
                // ⚠️ Değeri değiştirirken next.config `qualities` listesinde OLMALI.
                quality={95}
                className="object-cover"
                // Yakınlaştırma odak noktası MERKEZLİ (transform-origin = odak) →
                // zoom yapınca seçilen nokta yerinde kalır. transform composited.
                style={{
                  objectPosition: "var(--hp)",
                  transform: "scale(var(--hz))",
                  transformOrigin: "var(--hp)",
                }}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: overlay }} />

      {/* Ground fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: groundFade }} />

      {/* ── MOBILE layout ── */}
      <div className="lg:hidden relative z-20 w-full pt-24 pb-16 px-5 sm:px-6 flex flex-col justify-center hero-shell">
        <div className="max-w-2xl">
          <motion.div initial={{ y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6">
            <Image src={logoSrc} alt="Bemis E-V Charge" width={380} height={120} quality={90}
              sizes="(max-width: 1024px) 260px, 380px"
              className="h-12 xs:h-14 sm:h-16 w-auto max-w-[160px] sm:max-w-[220px] object-contain" style={logoStyle} />
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-3 mb-3.5 h-[2px] w-20 origin-left rounded-full"
              style={{
                background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT}AA 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${ACCENT}60`,
              }}
            />
            <h1 className={`text-[30px] xs:text-[34px] sm:text-4xl font-black tracking-tight leading-[1.18] ${headlineClass}`} style={{ textShadow }}>
              <E field="hero.headline1">{hero.headline1}</E>{" "}<br />
              <E field="hero.headline2">{hero.headline2}</E>
              {cleanWords.length > 0 && <> <RotatingWord words={cleanWords} /></>}{" "}
              <br />
              <span
                style={{
                  // Üreticisi (headline3): dark = parlak mavi, light = derin mavi + gölge.
                  backgroundImage: headline3Gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: headline3Filter,
                }}
              >
                <E field="hero.headline3">{hero.headline3}</E>
              </span>
            </h1>
          </motion.div>
          <motion.p initial={{ y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={`${subtitleClass} text-sm sm:text-[15px] leading-[1.55] max-w-lg mb-6`} style={{ textShadow }}>
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>
          <motion.div initial={{ y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <button
              onClick={scrollToProducts}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: heroCtaBg,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${heroCtaBd}`,
                boxShadow: heroCtaSh,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = heroCtaBgHv;
                e.currentTarget.style.borderColor = heroCtaBdHv;
                e.currentTarget.style.boxShadow = heroCtaShHv;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = heroCtaBg;
                e.currentTarget.style.borderColor = heroCtaBd;
                e.currentTarget.style.boxShadow = heroCtaSh;
              }}
            >
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
              <HiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: heroCtaArrow }} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden lg:block absolute inset-0 z-20">
        <motion.div
          initial={{ y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="absolute"
          style={{ left: `${layout.logo.x}%`, top: `${layout.logo.y}%`, maxWidth: "48%" }}
        >
          <Image src={logoSrc} alt="Bemis E-V Charge" width={380} height={120} quality={90}
            sizes="380px"
            className="h-28 xl:h-32 w-auto object-contain" style={logoStyle} />

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.32 }}
            className="my-6 h-[2px] w-28 origin-left rounded-full"
            style={{
              background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT}AA 60%, transparent 100%)`,
              boxShadow: `0 0 12px ${ACCENT}60`,
            }}
          />

          {/* Masaüstü başlık: SEO için TEK H1 mobil layout'ta (satır ~196); bu
              görsel ikiz bir div + aria-level=1 (ekran okuyucu için başlık,
              ama ikinci bir <h1> ETİKETİ değil → sayfada tek h1 kalır). */}
          <motion.div
            role="heading"
            aria-level={1}
            initial={{ y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[1.18] ${headlineClass} mb-5`}
            style={{ textShadow }}
          >
            <E field="hero.headline1">{hero.headline1}</E><br />
            <E field="hero.headline2">{hero.headline2}</E>
            {cleanWords.length > 0 && <> <RotatingWord words={cleanWords} /></>}
            <br />
            <span
              style={{
                // Üreticisi (headline3): dark = parlak mavi, light = derin mavi + gölge.
                backgroundImage: headline3Gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: headline3Filter,
              }}
            >
              <E field="hero.headline3">{hero.headline3}</E>
            </span>
          </motion.div>

          <motion.p
            initial={{ y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className={`${subtitleClass} text-lg leading-relaxed mb-8`}
            style={{ textShadow }}
          >
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
            <button
              onClick={scrollToProducts}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: heroCtaBg,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${heroCtaBd}`,
                boxShadow: heroCtaSh,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = heroCtaBgHv;
                e.currentTarget.style.borderColor = heroCtaBdHv;
                e.currentTarget.style.boxShadow = heroCtaShHv;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = heroCtaBg;
                e.currentTarget.style.borderColor = heroCtaBd;
                e.currentTarget.style.boxShadow = heroCtaSh;
              }}
            >
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
              <HiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: heroCtaArrow }} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: scrollLabel }}>{pickText(lang, "Keşfet", "Explore")}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: `1px solid ${scrollBorder}` }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: scrollDot }} />
        </motion.div>
      </div>
    </section>
  );
}
