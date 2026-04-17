"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import E from "./E";

export default function Hero() {
  const { hero, logos } = useContent();
  const { layout } = hero;
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
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

  const dividerColor   = d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.20)";
  const scrollBorder   = d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.30)";
  const scrollDot      = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.45)";
  const scrollLabel    = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.55)";

  const headlineClass  = d ? "text-white" : "text-white";
  const subtitleClass  = d ? "text-white/45" : "text-white/80";
  const sub3rdClass    = d ? "text-white/50" : "text-white/60";
  const textShadow     = d ? undefined : "0 2px 16px rgba(0,0,0,0.70), 0 1px 4px rgba(0,0,0,0.50)";
  const logoSrc        = logos?.dark || "/logo-white.png";
  const logoStyle      = d ? {} : { filter: "invert(1)" };

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
          className="object-cover object-[65%_center] sm:object-center"
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
            <div className="mt-4 mb-4 h-px w-10" style={{ background: dividerColor }} />
            <h1 className={`text-3xl xs:text-4xl sm:text-5xl font-black tracking-tight leading-[1.18] ${headlineClass}`} style={{ textShadow }}>
              <E field="hero.headline1">{hero.headline1}</E><br />
              <E field="hero.headline2">{hero.headline2}</E><br />
              <span className={sub3rdClass}><E field="hero.headline3">{hero.headline3}</E></span>
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={`${subtitleClass} text-sm sm:text-base leading-relaxed max-w-lg mb-8`} style={{ textShadow }}>
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <button onClick={() => scrollTo("#products")} className="btn-primary font-bold px-8 py-4 rounded-xl text-sm">
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
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

          <div className="my-6 h-px w-14" style={{ background: dividerColor }} />

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[1.18] ${headlineClass} mb-5`}
            style={{ textShadow }}
          >
            <E field="hero.headline1">{hero.headline1}</E><br />
            <E field="hero.headline2">{hero.headline2}</E><br />
            <span className={sub3rdClass}><E field="hero.headline3">{hero.headline3}</E></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className={`${subtitleClass} text-lg leading-relaxed mb-8`}
            style={{ textShadow }}
          >
            <E field="hero.subtitle" tag="span">{hero.subtitle}</E>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
            <button onClick={() => scrollTo("#products")} className="btn-primary font-bold px-8 py-4 rounded-xl text-sm">
              <E field="hero.ctaPrimary" tag="span">{hero.ctaPrimary}</E>
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
