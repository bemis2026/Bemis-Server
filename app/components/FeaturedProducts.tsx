"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { HiArrowRight, HiStar } from "react-icons/hi";
import E from "./E";

type SpecItem = { label: string; value: string };
type SpecGroup = { group: string; items: SpecItem[] };
type ProductEntry = { id: string; name: string; subtitle: string; badge: string | null; description: string; specs: SpecGroup[]; image?: string };
type CategoryData = { id: string; name: string; tagline: string; accent: string; products: ProductEntry[] };

// Category accent colors — must match Products.tsx
const CATEGORY_ACCENTS: Record<string, string> = {
  "wallbox":           "#3B82F6",
  "portable":          "#10B981",
  "cables":            "#F59E0B",
  "v2l-c2l":           "#818CF8",
  "converters":        "#06B6D4",
  "charger-equipment": "#64748B",
  "accessories":       "#818CF8",
  "dc-units":          "#F97316",
};

export default function FeaturedProducts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { featured, featuredSection, sectionBgs } = useContent();
  const { lang } = useLanguage();
  const router = useRouter();
  const d = theme === "dark";

  const [allProducts, setAllProducts] = useState<CategoryData[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products?lang=${lang}`)
      .then((r) => r.json())
      .then(setAllProducts)
      .catch(() => {});
  }, [lang]);

  const BLUE        = "#3B82F6";
  const sectionBg   = d ? "linear-gradient(140deg, #0c0c0e 0%, #111116 60%, #0e0e12 100%)" : "linear-gradient(140deg, #f7f8fb 0%, #f3f4f8 60%, #f6f7fa 100%)";
  const surface     = d ? "#1e1e1e" : "#ffffff";
  const border      = d ? "#2a2a2a" : "#e5e5e5";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted   = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";
  const textFaint   = d ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";

  const visibleFeatured = featured.filter((f) => f.visible);
  if (visibleFeatured.length === 0) return null;

  // Resolve product data for each featured item
  const resolved = visibleFeatured.map((f) => {
    const cat = allProducts.find((c) => c.id === f.categoryId);
    const prod = cat?.products.find((p) => p.id === f.productId);
    const accent = CATEGORY_ACCENTS[f.categoryId] ?? "#3B82F6";
    return { ...f, cat, prod, accent };
  });

  const sectionBgUrl = sectionBgs?.["featured"] ?? "";

  return (
    <section id="featured" style={{ background: sectionBg }} className="relative py-8 lg:py-12 overflow-hidden">
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="featuredSection.sectionLabel" tag="span">{featuredSection.sectionLabel}</E>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2" style={{ color: textPrimary }}
          >
            <E field="featuredSection.heading">{featuredSection.heading}</E>
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
            <E field="featuredSection.subheading" tag="span">{featuredSection.subheading}</E>
          </motion.p>
        </div>

        {/* Cards — infinite marquee. Items doubled so the -50% transform
            wraps seamlessly. Pauses on hover via CSS animation-play-state. */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
          }}
        >
          <div
            className="flex gap-4 featured-marquee-track"
            style={{
              width: "max-content",
              animation: `featuredMarquee ${Math.max(28, resolved.length * 7)}s linear infinite`,
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
          {[...resolved, ...resolved].map((item, i) => {
            const key = `${item.categoryId}-${item.productId}-${i}`;
            const isHov = hovered === key;

            return (
              <div
                key={key}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/products/${item.categoryId}/${item.productId}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
                style={{
                  width: "clamp(260px, 26vw, 320px)",
                  background: surface,
                  border: `1px solid ${isHov ? item.accent + "50" : border}`,
                  boxShadow: isHov ? `0 8px 40px ${item.accent}20` : d ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
              >
                {/* Top accent bar */}
                <div style={{ height: 3, background: item.accent, opacity: isHov ? 1 : 0.5, transition: "opacity 0.3s" }} />

                {/* Product image — sized so image and text body have similar
                    visual weight inside the marquee card. */}
                <div className="relative overflow-hidden" style={{ height: "clamp(150px, 18vw, 190px)" }}>
                  {item.prod?.image ? (
                    <img
                      src={item.prod.image}
                      alt={item.prod.name}
                      className="w-full h-full object-cover"
                      style={{ transition: "transform 0.4s ease", transform: isHov ? "scale(1.04)" : "scale(1)" }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: d ? `linear-gradient(135deg, ${item.accent}18 0%, rgba(0,0,0,0) 70%)` : `linear-gradient(135deg, ${item.accent}14 0%, transparent 70%)` }}>
                      <div
                        className="flex items-center justify-center rounded-2xl"
                        style={{
                          width: 80, height: 80,
                          background: d ? `${item.accent}12` : `${item.accent}10`,
                          border: `1px solid ${item.accent}25`,
                          transform: isHov ? "scale(1.06)" : "scale(1)",
                          transition: "transform 0.35s ease",
                        }}
                      >
                        <span className="text-3xl font-black" style={{ color: item.accent, opacity: 0.7 }}>
                          {item.prod?.name?.[0] ?? "?"}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${surface}, transparent)` }} />
                </div>

                <div className="p-4">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${item.accent}18`, color: item.accent, border: `1px solid ${item.accent}28` }}
                    >
                      {item.badge}
                    </span>
                    {item.prod?.badge && (
                      <span className="text-[10px] font-semibold" style={{ color: textFaint }}>
                        {item.prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Product name */}
                  <h3 className="text-base font-bold leading-tight mb-0.5" style={{ color: textPrimary }}>
                    {item.prod?.name ?? item.productId}
                  </h3>
                  <p className="text-xs mb-1.5" style={{ color: item.accent }}>
                    {item.cat?.name}
                  </p>

                  {/* Highlight — clamped to 2 lines to keep card height tight */}
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{
                      color: textMuted,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.highlight}
                  </p>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{
                      color: item.accent,
                      transform: isHov ? "translateX(3px)" : "translateX(0)",
                      transition: "transform 0.25s",
                    }}
                  >
                    <E field="featuredSection.ctaLabel" tag="span">{featuredSection.ctaLabel}</E> <HiArrowRight />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

      </div>
      <style jsx>{`
        @keyframes featuredMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .featured-marquee-track:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
