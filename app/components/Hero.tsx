"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import E from "./E";

const ACCENT = "#3B82F6";

export default function Hero() {
  const { hero, logos } = useContent();
  const { layout } = hero;
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";

  // Scroll to whichever section sits right under the hero — preserves
  // the page's natural reading order regardless of the configured
  // sectionOrder. Falls back to a viewport-height scroll on the rare
  // case the hero has no following sibling.
  const scrollToNextSection = () => {
    const hero = document.getElementById("hero");
    const next = hero?.nextElementSibling as HTMLElement | null;
    if (next) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollBy({ top: window.innerHeight - 72, behavior: "smooth" });
    }
  };

  const sectionBg  = d
    ? "linear-gradient(160deg, #222222 0%, #181818 50%, #1e1e1e 100%)"
    : "linear-gradient(160deg, #f0f0f0 0%, #e8e8e8 50%, #eeeeee 100%)";

  const overlay    = d
    ? "linear-gradient(135deg, rgba(5,5,8,0.55) 0%, rgba(5,5,8,0.38) 50%, rgba(5,5,8,0.18) 100%)"
    : "linear-gradient(135deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.10) 100%)";

  const groundFade = d
    ? "linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.7) 50%, transparent 100%)"
    : "linear-gradient(to top, rgba(238,238,238,0.80) 0%, rgba(238,238,238,0.35) 50%, transparent 100%)";

  const scrollBorder   = d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.30)";
  const scrollDot      = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.45)";
  const scrollLabel    = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.55)";

  const headlineClass  = d ? "text-white" : "text-white";
  const subtitleClass  = d ? "text-white/45" : "text-white/80";
  const textShadow     = d ? undefined : "0 2px 16px rgba(0,0,0,0.70), 0 1px 4px rgba(0,0,0,0.50)";
  const logoSrc        = logos?.dark || "/logo-white.png";
  const logoStyle      = d ? {} : { filter: "brightness(0)" };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: sectionBg }}
    >
      {/* Background photo */}
      {hero.heroBg && (
        <Image
          src={hero.heroBg}
          alt=""
          fill
          priority
          quality={90}
          className="object-cover"
          style={{ objectPosition: hero.heroBgPos ?? "75% 50%" }}
          sizes="100vw"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: overlay }} />

      {/* Ground fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: groundFade }} />

      {/* ── MOBILE layout ── */}
      <div className="lg:hidden relative z-20 w-full pt-28 pb-24 px-5 sm:px-6 flex flex-col justify-center min-h-screen">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-7">
            <Image src={logoSrc} alt="Bemis E-V Charge" width={380} height={120}
              className="h-14 xs:h-16 sm:h-20 w-auto max-w-[180px] sm:max-w-[260px] object-contain" style={logoStyle} priority />
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 mb-4 h-[2px] w-24 origin-left rounded-full"
              style={{
                background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT}AA 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${ACCENT}60`,
              }}
            />
            <h1 className={`text-3xl xs:text-4xl sm:text-5xl font-black tracking-tight leading-[1.18] ${headlineClass}`} style={{ textShadow }}>
              <E field="hero.headline1">{hero.headline1}</E><br />
              <E field="hero.headline2">{hero.headline2}</E><br />
              <span
                style={{
                  backgroundImage: d
                    ? "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)"
                    : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <E field="hero.headline3">{hero.headline3}</E>
              </span>
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={`${subtitleClass} text-sm sm:text-base leading-relaxed max-w-lg mb-8`} style={{ textShadow }}>
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <button
              onClick={scrollToNextSection}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: `${ACCENT}1A`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${ACCENT}45`,
                boxShadow: `0 8px 28px ${ACCENT}25, inset 0 1px 0 rgba(255,255,255,0.10)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${ACCENT}2C`;
                e.currentTarget.style.borderColor = `${ACCENT}80`;
                e.currentTarget.style.boxShadow = `0 10px 32px ${ACCENT}40, inset 0 1px 0 rgba(255,255,255,0.14)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${ACCENT}1A`;
                e.currentTarget.style.borderColor = `${ACCENT}45`;
                e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}25, inset 0 1px 0 rgba(255,255,255,0.10)`;
              }}
            >
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
              <HiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: ACCENT }} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden lg:block absolute inset-0 z-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="absolute"
          style={{ left: `${layout.logo.x}%`, top: `${layout.logo.y}%`, maxWidth: "48%" }}
        >
          <Image src={logoSrc} alt="Bemis E-V Charge" width={380} height={120}
            className="h-28 xl:h-32 w-auto object-contain" style={logoStyle} priority />

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.32 }}
            className="my-6 h-[2px] w-28 origin-left rounded-full"
            style={{
              background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT}AA 60%, transparent 100%)`,
              boxShadow: `0 0 12px ${ACCENT}60`,
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[1.18] ${headlineClass} mb-5`}
            style={{ textShadow }}
          >
            <E field="hero.headline1">{hero.headline1}</E><br />
            <E field="hero.headline2">{hero.headline2}</E><br />
            <span
              style={{
                backgroundImage: d
                  ? "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)"
                  : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <E field="hero.headline3">{hero.headline3}</E>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className={`${subtitleClass} text-lg leading-relaxed mb-8`}
            style={{ textShadow }}
          >
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
            <button
              onClick={scrollToNextSection}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                background: `${ACCENT}1A`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${ACCENT}45`,
                boxShadow: `0 8px 28px ${ACCENT}25, inset 0 1px 0 rgba(255,255,255,0.10)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${ACCENT}2C`;
                e.currentTarget.style.borderColor = `${ACCENT}80`;
                e.currentTarget.style.boxShadow = `0 10px 32px ${ACCENT}40, inset 0 1px 0 rgba(255,255,255,0.14)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${ACCENT}1A`;
                e.currentTarget.style.borderColor = `${ACCENT}45`;
                e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}25, inset 0 1px 0 rgba(255,255,255,0.10)`;
              }}
            >
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
              <HiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: ACCENT }} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: scrollLabel }}>{lang === "en" ? "Explore" : "Keşfet"}</span>
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
