"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "../context/ContentContext";

export default function Hero() {
  const { hero } = useContent();
  const { layout } = hero;

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #222222 0%, #181818 50%, #1e1e1e 100%)" }}
    >
      {/* Background photo */}
      {hero.heroBg && (
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${hero.heroBg}')` }} />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.75) 50%, rgba(5,5,8,0.55) 100%)" }} />

      {/* Ground fade — deeper for smoother section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.7) 50%, transparent 100%)" }} />

      {/* ── MOBILE layout (normal document flow) ── */}
      <div className="lg:hidden relative z-20 w-full pt-28 pb-24 px-5 sm:px-6 flex flex-col justify-center min-h-screen">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-7">
            {/* Logo + divider + headline as one unified block */}
            <Image src="/logo-white.png" alt="Bemis E-V Charge" width={380} height={120}
              className="h-20 sm:h-24 w-auto object-contain" priority />
            <div className="mt-5 mb-5 h-px w-12" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.18] text-white">
              {hero.headline1}<br />
              {hero.headline2}<br />
              <span className="text-white/50">{hero.headline3}</span>
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/45 text-base leading-relaxed max-w-lg mb-9">
            {hero.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <button onClick={() => scrollTo("#products")} className="btn-primary text-white font-bold px-8 py-4 rounded-xl text-sm">
              {hero.ctaPrimary}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── DESKTOP layout (absolutely positioned, editor-controlled) ── */}
      <div className="hidden lg:block absolute inset-0 z-20">

        {/* Logo + headline + subtitle — unified block, positioned via layout.logo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="absolute"
          style={{ left: `${layout.logo.x}%`, top: `${layout.logo.y}%`, maxWidth: "48%" }}
        >
          {/* Logo */}
          <Image src="/logo-white.png" alt="Bemis E-V Charge" width={380} height={120}
            className="h-28 xl:h-32 w-auto object-contain" priority />

          {/* Thin separator */}
          <div className="my-6 h-px w-14" style={{ background: "rgba(255,255,255,0.15)" }} />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[1.18] text-white mb-5"
          >
            {hero.headline1}<br />
            {hero.headline2}<br />
            <span className="text-white/50">{hero.headline3}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="text-white/45 text-lg leading-relaxed mb-8"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA Button — flows with text block */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
            <button onClick={() => scrollTo("#products")} className="btn-primary text-white font-bold px-8 py-4 rounded-xl text-sm">
              {hero.ctaPrimary}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-white/25">Keşfet</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="w-1 h-2 rounded-full bg-white/25" />
        </motion.div>
      </div>
    </section>
  );
}
