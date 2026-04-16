"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import {
  RiBuilding4Line, RiArrowRightLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";
import E from "./E";
import EImage from "./EImage";


const BLUE = "#3B82F6";

export default function DNA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const router = useRouter();
  const { dna, products: productSection, dealer: dealerSection, sectionBgs } = useContent();
  const d = theme === "dark";

  const textPrimary = d ? "#f0f0f4"                 : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.52)"  : "rgba(26,26,26,0.52)";
  const textFaint   = d ? "rgba(240,240,244,0.28)"  : "rgba(26,26,26,0.28)";
  const divider     = d ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.07)";

  // Split sectionHeading on "—" to apply blue accent to second part
  const headingParts = dna.sectionHeading.split("—");
  const hasAccent = headingParts.length >= 2;
  const sectionBgUrl = sectionBgs?.["dna"] ?? "";

  return (
    <section
      id="dna"
      className="relative py-8 lg:py-12 overflow-hidden"
      style={{
        background: d
          ? "linear-gradient(155deg, #111113 0%, #131313 35%, #1a1a1a 100%)"
          : "linear-gradient(155deg, #f2f2f2 0%, #f8f8f8 60%, #f4f4f4 100%)",
      }}
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      {/* ── BEMİS watermark ── */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          right: "-1%", top: "10%",
          fontSize: "clamp(80px, 14vw, 180px)",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          color: d ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.035)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        BEMİS
      </div>

      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ── Main grid: left = heading+content, right = factory image ── */}
        {/* Factory image stretches to match left column height (label → button) */}
        <div className="grid lg:grid-cols-5 gap-5 lg:gap-8" style={{ alignItems: "stretch" }}>

          {/* Left col: label + heading + accent + paragraph + pills + button */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Label */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}>
              <span
                className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
                style={{ background: d ? `${BLUE}18` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`, color: d ? "#93C5FD" : BLUE }}
              >
                <E field="dna.sectionLabel" tag="span">{dna.sectionLabel}</E>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.07 }}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08]" style={{ color: textPrimary }}>
                {hasAccent ? (
                  <>{headingParts[0].trim()}<br /><span style={{ color: BLUE }}>{headingParts.slice(1).join("—").trim()}</span></>
                ) : dna.sectionHeading}
              </h2>
            </motion.div>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.55, delay: 0.18 }}
              className="h-px w-24 origin-left"
              style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
            />

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.12 }}
              className="text-sm leading-relaxed" style={{ color: textMuted }}
            >
              <E field="dna.brandPara1" tag="span">{dna.brandPara1}</E>
            </motion.p>

            {/* Button */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.25 }}>
              <button
                onClick={() => router.push("/kurumsal")}
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
              >
                <E field="dna.ctaLabel" tag="span">{dna.ctaLabel}</E>
                <RiArrowRightLine style={{ fontSize: 14 }} />
              </button>
            </motion.div>

          </div>

          {/* Right col — factory image, stretches to match left column height */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 relative rounded-2xl overflow-hidden"
            style={{
              background: d
                ? "linear-gradient(135deg, #141414 0%, #1c1c1c 50%, #111111 100%)"
                : "linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)",
              border: d ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Texture overlay */}
            <div className="absolute inset-0" style={{ backgroundImage: d ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)" : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            {/* Factory video (öncelikli) veya fotoğraf */}
            {dna.factoryVideo ? (() => {
              const yt = dna.factoryVideo!.match(/(?:youtube\.com\/(?:[^/?]+\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (yt) {
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=1&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      border: "none",
                    }}
                  />
                );
              }
              return (
                <video
                  src={dna.factoryVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              );
            })() : (
              <EImage
                field="dna.factoryImage"
                src={dna.factoryImage ?? ""}
                alt="Bemis Fabrika"
                label="Fabrika Görseli"
                uploadFolder="uploads"
                style={{ position: "absolute", inset: 0 }}
                imgClassName="w-full h-full object-contain block"
              >
                <RiBuilding4Line style={{ fontSize: 56, color: d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)", marginBottom: 8 }} />
                <span className="text-xs font-medium" style={{ color: textFaint }}>Fabrika Fotoğrafı</span>
              </EImage>
            )}

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: d ? "linear-gradient(to top, rgba(12,12,14,0.90) 0%, transparent 100%)" : "linear-gradient(to top, rgba(235,235,235,0.90) 0%, transparent 100%)" }} />

            {/* EST. 1994 badge */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2" style={{ zIndex: 10 }}>
              <div className="text-2xl font-black" style={{ background: d ? "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%)" : "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <E field="dna.yearLabel" tag="span">{dna.yearLabel}</E>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider" style={{ color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)" }}>EST.</div>
                <div className="text-[9px] font-medium" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)" }}>Bursa · Türkiye</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
