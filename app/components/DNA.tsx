"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import {
  RiBuilding4Line, RiArrowRightLine, RiVolumeUpLine, RiVolumeMuteLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";
import E from "./E";
import EImage from "./EImage";
import { useBackgroundVideo, useNearViewport } from "./useBackgroundVideo";


const BLUE = "#3B82F6";

export default function DNA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const router = useRouter();
  const { dna, products: productSection, dealer: dealerSection, sectionBgs } = useContent();
  const d = theme === "dark";

  // Background video controller. Keeps a black poster over the YouTube
  // player until it is genuinely PLAYING (and re-covers it on tab switch),
  // so the splash / play button never shows on first load or focus changes.
  // Also drives the opt-in sound toggle (autoplays muted; the bottom-right
  // button turns audio on).
  const {
    ref: soundRef, soundOn, toggle: toggleSound,
    covered, onIframeLoad, onVideoPlaying,
  } = useBackgroundVideo();
  // ⚡ YouTube player'ı (≈1MB JS + ≈4MB video) sayfa açılışında İNDİRME:
  // video kutusu viewport'a 600px yaklaşınca mount et. Poster (covered)
  // zaten mount'a kadar siyah kalıyor → görsel akış birebir aynı.
  const { boxRef: videoBoxRef, near: videoNear } = useNearViewport<HTMLDivElement>();

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
                  <>{headingParts[0].trim()}<br /><span style={{ color: d ? "#93C5FD" : BLUE }}>{headingParts.slice(1).join("—").trim()}</span></>
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

            {/* Button + Yerli Üretici linki — ikincisi anasayfa→/uretici
                TARANABİLİR iç link (gerçek <a>, SEO için; "Bemis Dünyasını
                Keşfet" router.push button taranmaz). */}
            {/* Mobilde iki aksiyon KASITLI dikey yığın: birincil buton tam
                genişlik (ortalı), ikincil link altında ortalı — eski flex-wrap
                mobilde linki "kazara alta kaymış" gibi gösteriyordu. sm+ eski
                satır-içi düzen (flex-row wrap) korunur. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3"
            >
              <button
                onClick={() => router.push("/kurumsal")}
                className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all duration-200 w-full sm:w-auto"
                style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
              >
                <E field="dna.ctaLabel" tag="span">{dna.ctaLabel}</E>
                <RiArrowRightLine size={16} />
              </button>
              <Link
                href="/uretici"
                className="flex sm:inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold transition-opacity hover:opacity-70"
                style={{ color: d ? "#93C5FD" : BLUE }}
              >
                Yerli Üretici Hikayemiz <RiArrowRightLine size={15} />
              </Link>
            </motion.div>

          </div>

          {/* Right col — factory video card. Bemis Group brand strip
              moved to /kurumsal (Bemis Dünyasını Keşfet) page. */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div
              ref={videoBoxRef}
              className="relative rounded-2xl overflow-hidden aspect-video"
              style={{
                background: d
                  ? "linear-gradient(135deg, #202020 0%, #262626 50%, #1c1c1c 100%)"
                  : "linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%)",
                border: d ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div className="absolute inset-0" style={{ backgroundImage: d ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)" : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {/* Black poster stays over the player until it is genuinely
                  PLAYING (driven by the IFrame API), and snaps back whenever
                  the tab is backgrounded — so YouTube's thumbnail / play
                  button never flashes on load, tab switches, or refocus. */}
              <div
                aria-hidden
                className="absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: "#0a0a0a", opacity: covered ? 1 : 0 }}
              />
              {/* videoNear false iken player MOUNT EDİLMEZ (null) — üstteki
                  siyah poster kutuyu kaplıyor, yaklaşınca yükleme başlar. */}
              {dna.factoryVideo ? (!videoNear ? null : (() => {
                const yt = dna.factoryVideo!.match(/(?:youtube\.com\/(?:[^/?]+\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                if (yt) {
                  // playsinline=1 + mute=1 are mandatory for mobile autoplay
                  // (iOS Safari + Android Chrome). loading="eager" so the
                  // iframe boots immediately — lazy delay was causing the
                  // browser to skip autoplay on first viewport entry.
                  // controls=0 hides the YouTube control bar; pointer-
                  // events: none on the iframe ensures hover never wakes
                  // up YouTube's overlay UI, so the video plays back like
                  // a passive screen — no scrubber, no related tiles, no
                  // keyboard/mouse interactivity.
                  return (
                    <iframe
                      ref={soundRef}
                      src={`https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${yt[1]}&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&enablejsapi=1`}
                      title="Bemis fabrika videosu"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      onLoad={onIframeLoad}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
                    />
                  );
                }
                return (
                  <video
                    ref={soundRef}
                    src={dna.factoryVideo}
                    autoPlay loop muted playsInline preload="auto"
                    onPlaying={onVideoPlaying}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                );
              })()) : (
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
              {dna.factoryVideo && (
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={soundOn ? "Video sesini kapat" : "Video sesini aç"}
                  aria-pressed={soundOn}
                  className="absolute bottom-3 right-3 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    zIndex: 11,
                    width: 38,
                    height: 38,
                    background: d ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: `1px solid ${BLUE}40`,
                    color: soundOn ? BLUE : d ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)",
                    cursor: "pointer",
                  }}
                >
                  {soundOn ? <RiVolumeUpLine size={18} /> : <RiVolumeMuteLine size={18} />}
                </button>
              )}
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
