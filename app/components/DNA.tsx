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
          ? "linear-gradient(135deg, #0e0e12 0%, #111116 60%, #0f0f13 100%)"
          : "linear-gradient(135deg, #f6f7fb 0%, #f9fafb 60%, #f3f4f8 100%)",
      }}
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(9,13,21,0.75)" : "rgba(240,246,255,0.78)" }} />
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
                className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all duration-200"
                style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
              >
                <E field="dna.ctaLabel" tag="span">{dna.ctaLabel}</E>
                <RiArrowRightLine size={16} />
              </button>
            </motion.div>

          </div>

          {/* Right col — video on top (~half height), Bemis Group brand
              card stacked underneath with the 3 sister-brand logos. */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 flex flex-col gap-4"
          >
            {/* Video card */}
            <div
              className="relative rounded-2xl overflow-hidden aspect-video"
              style={{
                background: d
                  ? "linear-gradient(135deg, #202020 0%, #262626 50%, #1c1c1c 100%)"
                  : "linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)",
                border: d ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div className="absolute inset-0" style={{ backgroundImage: d ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)" : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {dna.factoryVideo ? (() => {
                const yt = dna.factoryVideo!.match(/(?:youtube\.com\/(?:[^/?]+\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                if (yt) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=1&modestbranding=1&rel=0&vq=hd1080`}
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  );
                }
                return (
                  <video
                    src={dna.factoryVideo}
                    autoPlay loop muted playsInline
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
              <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: d ? "linear-gradient(to top, rgba(12,12,14,0.90) 0%, transparent 100%)" : "linear-gradient(to top, rgba(235,235,235,0.90) 0%, transparent 100%)" }} />
              <div className="absolute bottom-3 left-4 flex items-center gap-2" style={{ zIndex: 10 }}>
                <div className="text-2xl font-black" style={{ backgroundImage: d ? "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%)" : "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  <E field="dna.yearLabel" tag="span">{dna.yearLabel}</E>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-wider" style={{ color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)" }}>EST.</div>
                  <div className="text-[9px] font-medium" style={{ color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)" }}>Bursa · Türkiye</div>
                </div>
              </div>
            </div>

            {/* Bemis Group brands card */}
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: d ? `linear-gradient(135deg, ${BLUE}10 0%, rgba(255,255,255,0.02) 100%)` : `linear-gradient(135deg, ${BLUE}0d 0%, rgba(0,0,0,0.01) 100%)`,
                border: d ? `1px solid ${BLUE}28` : `1px solid ${BLUE}22`,
              }}
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: d ? "#93C5FD" : BLUE }}>
                <E field="dna.groupBrandsTitle" tag="span">{dna.groupBrandsTitle ?? "Bemis Grup Markaları"}</E>
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: d ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.58)" }}>
                <E field="dna.groupBrandsBody" tag="span">{dna.groupBrandsBody ?? ""}</E>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {(dna.groupBrands ?? []).map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{
                      background: d ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
                      border: d ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
                      minHeight: 48,
                    }}
                  >
                    {b.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.logo}
                        alt={b.name}
                        style={{ height: 28, width: "auto", maxWidth: 100, objectFit: "contain" }}
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="inline-flex items-center justify-center rounded-lg text-[10px] font-black"
                        style={{
                          width: 28, height: 28,
                          background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                          border: d ? "1px dashed rgba(255,255,255,0.18)" : "1px dashed rgba(0,0,0,0.18)",
                          color: d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)",
                        }}
                      >
                        {b.name?.[0] ?? "?"}
                      </span>
                    )}
                    <span className="text-xs font-bold" style={{ color: d ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)" }}>
                      {b.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
