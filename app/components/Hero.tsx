"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";

export default function Hero() {
  const { hero } = useContent();
  const { layout } = hero;
  const { theme } = useTheme();
  const d = theme === "dark";

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionBg  = d
    ? "linear-gradient(160deg, #222222 0%, #181818 50%, #1e1e1e 100%)"
    : "linear-gradient(160deg, #f0f0f0 0%, #e8e8e8 50%, #eeeeee 100%)";

  const overlay    = d
    ? "linear-gradient(135deg, rgba(5,5,8,0.72) 0%, rgba(5,5,8,0.50) 50%, rgba(5,5,8,0.30) 100%)"
    : "linear-gradient(135deg, rgba(240,240,240,0.70) 0%, rgba(240,240,240,0.45) 50%, rgba(240,240,240,0.15) 100%)";

  const groundFade = d
    ? "linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.7) 50%, transparent 100%)"
    : "linear-gradient(to top, #efefef 0%, rgba(238,238,238,0.7) 50%, transparent 100%)";

  const dividerColor   = d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const scrollBorder   = d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
  const scrollDot      = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)";
  const scrollLabel    = d ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)";

  const headlineClass  = d ? "text-white" : "text-[#111111]";
  const subtitleClass  = d ? "text-white/45" : "text-black/50";
  const sub3rdClass    = d ? "text-white/50" : "text-black/30";
  const logoSrc        = d ? "/logo-white.png" : "/logo-black.png";
  const logoStyle      = {};

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: sectionBg }}
    >
      {/* Background photo */}
      {hero.heroBg && (
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${hero.heroBg}')` }} />
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
              className="h-20 sm:h-24 w-auto object-contain" style={logoStyle} priority />
            <div className="mt-5 mb-5 h-px w-12" style={{ background: dividerColor }} />
            <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-[1.18] ${headlineClass}`}>
              <E field="hero.headline1">{hero.headline1}</E><br />
              <E field="hero.headline2">{hero.headline2}</E><br />
              <span className={sub3rdClass}><E field="hero.headline3">{hero.headline3}</E></span>
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className={`${subtitleClass} text-base leading-relaxed max-w-lg mb-9`}>
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
          >
            <E field="hero.headline1">{hero.headline1}</E><br />
            <E field="hero.headline2">{hero.headline2}</E><br />
            <span className={sub3rdClass}><E field="hero.headline3">{hero.headline3}</E></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className={`${subtitleClass} text-lg leading-relaxed mb-8`}
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
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: scrollLabel }}>Keşfet</span>
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
