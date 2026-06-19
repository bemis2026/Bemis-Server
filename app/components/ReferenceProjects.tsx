"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { HiLocationMarker, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useMarqueeScroll } from "../../lib/useMarqueeScroll";
import E from "./E";

export default function ReferenceProjects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { referenceProjectsSection: section, sectionBgs } = useContent();
  const d = theme === "dark";

  const items = section.items ?? [];
  // Hide the section entirely if no projects have been uploaded yet — keeps
  // the homepage tidy until the operator populates the band from admin.
  if (items.length === 0) return null;

  const BLUE        = "#3B82F6";
  const sectionBg   = d ? "linear-gradient(140deg, #0e0e12 0%, #111116 60%, #0d0d11 100%)" : "linear-gradient(140deg, #f3f4f8 0%, #f7f8fb 60%, #f3f4f8 100%)";
  const surface     = d ? "#1a1a1c" : "#ffffff";
  const border      = d ? "#2a2a2a" : "#e5e5e5";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted   = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";

  // Native scroll + auto-scroll: 2× duplicate yeterli, scroll loop reset
  // scrollWidth/2'de yapılır. Eski 8-20× tile artık gereksiz.
  const repeatedItems = [...items, ...items];
  const sectionBgUrl = sectionBgs?.["referenceProjects"] ?? "";
  const { scrollRef, handlers, scrollByAmount } = useMarqueeScroll();

  return (
    <section id="referenceprojects" style={{ background: sectionBg }} className="relative py-8 lg:py-12 overflow-hidden">
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1]">
        {/* Header — kept inside the standard width wrapper */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="referenceProjectsSection.sectionLabel" tag="span">{section.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2" style={{ color: textPrimary }}
          >
            <E field="referenceProjectsSection.heading">{section.heading}</E>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20 mb-3"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.22 }}
            className="text-sm" style={{ color: textMuted }}
          >
            <E field="referenceProjectsSection.subheading" tag="span">{section.subheading}</E>
          </motion.p>
        </div>

        {/* Native horizontal scroll: drag + parmak + RAF auto-scroll loop +
            sol/sağ button'lar. Mouse hover ile auto pause. */}
        <div className="relative">
          {/* Sol kaydırma butonu */}
          <button
            type="button"
            onClick={() => scrollByAmount(-360)}
            aria-label="Önceki projeler"
            className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: d ? "rgba(20,20,24,0.88)" : "rgba(255,255,255,0.92)",
              border: `1px solid ${border}`,
              boxShadow: d ? "0 4px 16px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <HiChevronLeft size={20} style={{ color: textPrimary }} />
          </button>
          {/* Sağ kaydırma butonu */}
          <button
            type="button"
            onClick={() => scrollByAmount(360)}
            aria-label="Sonraki projeler"
            className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: d ? "rgba(20,20,24,0.88)" : "rgba(255,255,255,0.92)",
              border: `1px solid ${border}`,
              boxShadow: d ? "0 4px 16px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <HiChevronRight size={20} style={{ color: textPrimary }} />
          </button>

          <div
            ref={scrollRef}
            {...handlers}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            style={{
              maskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
            }}
          >
            <div className="flex gap-4 px-4 sm:px-6" style={{ width: "max-content" }}>
              {repeatedItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="relative rounded-2xl overflow-hidden flex-shrink-0"
                  style={{
                    width: "clamp(280px, 30vw, 380px)",
                    height: "clamp(190px, 22vw, 260px)",
                    background: surface,
                    border: `1px solid ${border}`,
                    boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* SABİT 3:2 çerçeve + object-cover (kenarda boşluk bırakmadan doldurur).
                      objectPosition = adminden seçilen odak noktası (imagePos); seçilmezse
                      "center". Operatör admin'den her görselin çerçevede görünen yerini ayarlar.
                      ⚠️ Kullanıcı kararı: bu hale (cover+imagePos) DÖNÜLDÜ, manuel odakla yönetilecek. */}
                  <img
                    src={item.image}
                    alt={item.title ?? "Bemis E-V Charge referans projesi"}
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition: item.imagePos || "center" }}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  {(item.title || item.location) && (
                    <div
                      className="absolute inset-x-0 bottom-0 px-4 pt-10 pb-3 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)",
                      }}
                    >
                      {item.title && (
                        <p className="text-base font-bold leading-tight" style={{ color: "#ffffff" }}>
                          {item.title}
                        </p>
                      )}
                      {item.location && (
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "rgba(255,255,255,0.78)" }}>
                          <HiLocationMarker size={11} className="flex-shrink-0" />
                          {item.location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
