"use client";

import { motion, useInView, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RiShieldCheckLine,
  RiArrowRightLine,
  RiFlashlightFill,
  RiLeafLine,
  RiWifiLine,
  RiAwardLine,
  RiSmartphoneLine,
  RiCalendarCheckLine,
  RiTeamLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

const SPEC_ICONS = [RiFlashlightFill, RiShieldCheckLine, RiWifiLine, RiLeafLine, RiAwardLine];
const ACCENT = "#3B82F6";

export default function ProductShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { productShowcase: ps } = useContent();
  const { lang } = useLanguage();
  const router = useRouter();
  const d = theme === "dark";
  // Honor OS-level / browser reduce-motion preference; turns off the
  // Ken Burns zoom/pan loop on the gallery image.
  const reduceMotion = useReducedMotion();

  const bg = d
    ? "linear-gradient(135deg, #0d0d11 0%, #0c0c0e 50%, #111114 100%)"
    : "linear-gradient(135deg, #f4f5f9 0%, #f8f8fb 50%, #f2f3f7 100%)";
  const textPrimary = d ? "#f0f0f4" : "#0f172a";
  const textMuted = d ? "rgba(240,240,244,0.50)" : "rgba(15,23,42,0.50)";
  const specBg = d ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)";
  const specBorder = d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)";

  // Showcase slides = ana ürün (ps.*) + products[] (admin'in eklediği ek
  // vitrin ürünleri). Önceden products[] dolduğunda ana ürün tamamen
  // gizleniyordu, kullanıcı "ilk tanıtılan ürün gitti" diye yakındı. Şimdi
  // ana ürün her zaman ilk slide; eklenen ürünler arkasından sıralanır,
  // hepsi yandan kaydırma butonlarıyla dönüşümlü gezilir.
  type Slide = {
    badge?: string; name?: string; tagline?: string; description?: string;
    image?: string; specs?: { label: string; value: string }[];
    ctaPrimary?: string; ctaHref?: string;
    overlayFeatures?: string[];
  };

  const mainSlide: Slide | null = (ps?.image || ps?.name || ps?.badge)
    ? {
        badge: ps?.badge,
        name: ps?.name,
        tagline: ps?.tagline,
        description: ps?.description,
        image: ps?.image,
        specs: ps?.specs,
        ctaPrimary: ps?.ctaPrimary,
        ctaHref: ps?.ctaHref,
        overlayFeatures: ps?.overlayFeatures,
      }
    : null;
  const extraSlides: Slide[] = (ps?.products ?? []).filter(p => p && (p.image || p.name));
  const slides: Slide[] = mainSlide ? [mainSlide, ...extraSlides] : extraSlides;

  const galleryImages: string[] = slides.length > 0
    ? slides.map(s => s.image ?? "").filter(Boolean)
    : (ps?.images && ps.images.length > 0 ? ps.images.filter(Boolean) : []);
  const galleryCount = Math.max(galleryImages.length, slides.length);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (index >= galleryCount && galleryCount > 0) setIndex(0);
  }, [galleryCount, index]);

  // Active slide — content (badge, name, description, specs, cta) buradan
  // gelir. Slides boşsa ps.* fallback'ine düşer.
  const active = slides.length > 0 ? slides[Math.min(index, slides.length - 1)] : null;
  const badgeText       = active?.badge       ?? ps?.badge       ?? "Amiral Gemisi Ürün";
  const nameText        = active?.name        ?? ps?.name        ?? "AC Wallbox Smart Charger Pro 2";
  const taglineText     = active?.tagline     ?? ps?.tagline;
  const descriptionText = active?.description ?? ps?.description ?? "";
  const specs           = (active?.specs && active.specs.length > 0) ? active.specs : (ps?.specs ?? []);
  const ctaPrimaryText  = active?.ctaPrimary  ?? ps?.ctaPrimary  ?? "Ürünü İncele";
  const ctaPrimaryHref  = active?.ctaHref     ?? ps?.ctaHref     ?? "/products/wallbox";

  const goTo = (next: number) => {
    if (galleryCount === 0) return;
    const wrapped = ((next % galleryCount) + galleryCount) % galleryCount;
    setDirection(wrapped > index ? 1 : -1);
    setIndex(wrapped);
  };
  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const SWIPE = 60;
    if (info.offset.x < -SWIPE) goNext();
    else if (info.offset.x > SWIPE) goPrev();
  };

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ?  60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -60 :  60, opacity: 0 }),
  };

  return (
    <section id="productshowcase" className="relative overflow-hidden py-16 lg:py-24" style={{ background: bg }}>
      {/* Background glow */}
      <div className="absolute pointer-events-none" style={{ top: "20%", left: "30%", width: 600, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${ACCENT}0f 0%, transparent 65%)` }} />
      <div className="absolute pointer-events-none" style={{ bottom: 0, right: "10%", width: 400, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)` }} />


      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Sabit bölüm başlığı — admin'den yönetilmez, hep "Amiral Gemisi
            Ürünler" (TR) / "Flagship Products" (EN). Diğer ana sayfa
            bölümlerindeki eyebrow + heading + gradient line pattern'iyle
            uyumlu. */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${ACCENT}18` : `${ACCENT}10`,
              border: d ? `1px solid ${ACCENT}35` : `1px solid ${ACCENT}25`,
              color: d ? "#93C5FD" : ACCENT,
            }}
          >
            {lang === "en" ? "Flagship" : "Amiral Gemisi"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2"
            style={{ color: textPrimary }}
          >
            {lang === "en" ? "Flagship Products" : "Amiral Gemisi Ürünler"}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)` }}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">

          {/* ── Left: image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative flex items-center justify-center order-1 lg:order-1 lg:col-span-2"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 blur-3xl opacity-20 rounded-3xl" style={{ background: `radial-gradient(ellipse, ${ACCENT} 0%, transparent 70%)` }} />

            {/* Image card */}
            <div
              className="relative w-full max-w-sm lg:max-w-none rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "3/4",
                background: d
                  ? "linear-gradient(145deg, #131b2e 0%, #0c1525 100%)"
                  : "linear-gradient(145deg, #deeeff 0%, #eaf4ff 100%)",
                border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(59,130,246,0.15)"}`,
                boxShadow: d
                  ? `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`
                  : `0 24px 64px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.08)`,
              }}
            >
              {galleryCount > 0 ? (
                <div className="relative w-full h-full group select-none">
                  {/* Ken Burns wrapper — slow continuous zoom + pan on the
                      active image so the showcase doesn't sit still. The
                      inner AnimatePresence still handles slide-on-swap.
                      reduceMotion turns it into a still frame for users
                      who opt out (or for OS-level reduce-motion). */}
                  <motion.div
                    className="absolute inset-0"
                    animate={reduceMotion ? undefined : { scale: [1, 1.07, 1.04, 1.07, 1], x: ["0%", "-1.5%", "1%", "-0.8%", "0%"], y: ["0%", "1%", "-0.8%", "0.6%", "0%"] }}
                    transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    <AnimatePresence custom={direction} initial={false} mode="popLayout">
                      <motion.img
                        key={`${index}-${galleryImages[index]}`}
                        src={galleryImages[index]}
                        alt={nameText}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 320, damping: 32 }, opacity: { duration: 0.18 } }}
                        drag={galleryCount > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.18}
                        onDragEnd={handleDragEnd}
                        style={{ touchAction: galleryCount > 1 ? "pan-y" : "auto" }}
                      />
                    </AnimatePresence>
                  </motion.div>

                  {galleryCount > 1 && (
                    <>
                      {/* Prev/Next — her zaman görünür (hover-only değil),
                          kullanıcının vitrin ürünleri arasında kaydırma
                          tuşları olduğunu net görmesi için. */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        aria-label="Önceki vitrin ürünü"
                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
                        style={{ background: "rgba(8,12,24,0.85)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
                      >
                        <RiArrowLeftSLine size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        aria-label="Sonraki vitrin ürünü"
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
                        style={{ background: "rgba(8,12,24,0.85)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
                      >
                        <RiArrowRightSLine size={22} />
                      </button>

                      {/* Dots — at the very bottom of the image */}
                      <div
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                        style={{
                          background: "rgba(8,12,24,0.55)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        {galleryImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); goTo(i); }}
                            aria-label={`Görsel ${i + 1}`}
                            className="rounded-full transition-all"
                            style={{
                              width: i === index ? 18 : 6,
                              height: 6,
                              background: i === index ? ACCENT : "rgba(255,255,255,0.45)",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <RiFlashlightFill size={64} style={{ color: `${ACCENT}40`, margin: "0 auto 12px" }} />
                    <p className="text-xs font-medium" style={{ color: `${textMuted}` }}>Ürün görseli yükleyin</p>
                  </div>
                </div>
              )}

              {/* Product name overlay — sağ üst köşede (re-mounts on slide change to animate) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`overlay-${index}-${nameText}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 flex justify-end"
                  style={{ maxWidth: "calc(100% - 32px)" }}
                >
                  <div
                    className="inline-flex flex-col px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl items-end text-right"
                    data-keep-white="true"
                    style={{
                      // Daha opak ve daha koyu — light mode'da kutu beyaz
                      // pakajın üzerinde net duruyor olsun. Önceki 0.82
                      // opacity bazı görsellerde mavimsi karışım yapıyordu.
                      background: "rgba(6,10,22,0.92)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 6px 22px rgba(0,0,0,0.30)",
                    }}
                  >
                    <span
                      className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest"
                      style={{ color: "#93C5FD", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {badgeText}
                    </span>
                    <span
                      className="text-[10px] sm:text-xs font-black text-white leading-tight mt-0.5"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {nameText}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Feature badges — sits above the dots row. Values come from the
                  admin-editable overlayFeatures[]; first entry falls back to specs[1]. */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.55 }}
                className="absolute left-4 grid grid-cols-2 gap-1.5"
                style={{ bottom: "calc(0.75rem + 24px + 10px)", maxWidth: "calc(100% - 96px)" }}
              >
                {(() => {
                  // Slide-spesifik overlayFeatures önceliklidir; eksik
                  // slot'lar ps.overlayFeatures global fallback'inden gelir.
                  const slideOv = active?.overlayFeatures ?? [];
                  const globalOv = ps?.overlayFeatures ?? [];
                  const v = (i: number, fb: string) => {
                    const s = slideOv[i]?.trim();
                    if (s) return s;
                    const g = globalOv[i]?.trim();
                    if (g) return g;
                    return fb;
                  };
                  return [
                    { icon: RiShieldCheckLine,    color: "#10B981", value: v(0, specs[1]?.value ?? "IP 65") },
                    { icon: RiCalendarCheckLine,  color: ACCENT,    value: v(1, "Planlı Şarj") },
                    { icon: RiTeamLine,           color: "#818CF8", value: v(2, "Ortak Kullanım") },
                    { icon: RiSmartphoneLine,     color: "#F59E0B", value: v(3, "Mobil Uygulama") },
                  ];
                })().map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
                    data-keep-white="true"
                    style={{
                      background: "rgba(8,12,24,0.92)",
                      border: `1px solid ${b.color}55`,
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
                    }}
                  >
                    <b.icon size={12} style={{ color: b.color, flexShrink: 0 }} />
                    <p
                      className="text-[10px] sm:text-[9px] font-bold text-white leading-tight"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {b.value}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </motion.div>

          {/* ── Right: content ── */}
          <div className="order-2 lg:order-2 lg:col-span-3">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}28` }}
            >
              <RiAwardLine size={12} style={{ color: ACCENT }} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`badge-${index}-${badgeText}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  className="text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: ACCENT }}
                >
                  {badgeText}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Product name */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={`name-${index}-${nameText}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-3"
                style={{ color: textPrimary }}
              >
                {nameText}
              </motion.h2>
            </AnimatePresence>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="h-px w-24 origin-left mb-4"
              style={{ background: `linear-gradient(90deg, ${ACCENT} 0%, transparent 100%)` }}
            />

            {/* Tagline */}
            {taglineText && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`tagline-${index}-${taglineText}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-base font-semibold mb-4"
                  style={{ color: ACCENT }}
                >
                  {taglineText}
                </motion.p>
              </AnimatePresence>
            )}

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, delay: 0.06 }}
                className="text-sm leading-relaxed mb-7"
                style={{ color: textMuted, maxWidth: 480 }}
              >
                {descriptionText}
              </motion.p>
            </AnimatePresence>

            {/* Specs grid */}
            {specs.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`specs-${index}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, delay: 0.08 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8"
                >
                  {specs.map((s: { label: string; value: string }, i: number) => {
                    const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
                    const isYerli = (s.label ?? "").toLowerCase().includes("yerli");
                    return (
                      <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl"
                        style={{ background: specBg, border: `1px solid ${specBorder}`, boxShadow: d ? "none" : "0 1px 6px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isYerli ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src="https://flagcdn.com/w20/tr.png" alt="Türkiye" width={14} height={10} className="rounded-sm" loading="lazy" decoding="async" />
                          ) : (
                            <Icon size={12} style={{ color: ACCENT, opacity: 0.8 }} />
                          )}
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: textPrimary }}>{s.value}</span>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.24 }}
            >
              <button
                onClick={() => router.push(ctaPrimaryHref)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95"
                style={{
                  background: d
                    ? `linear-gradient(135deg, ${ACCENT}, #2563EB)`
                    : `linear-gradient(135deg, #60A5FA, #3B82F6)`,
                  boxShadow: d ? `0 6px 22px ${ACCENT}40` : `0 6px 22px #60A5FA60`,
                }}
              >
                {ctaPrimaryText}
                <RiArrowRightLine size={16} />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
