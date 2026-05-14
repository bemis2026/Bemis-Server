"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HiStar } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine, RiYoutubeFill, RiFacebookFill, RiExternalLinkLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import E from "./E";

// Stars fade + scale in one-by-one when the parent card enters the
// viewport — Framer's whileInView triggers each child's stagger via the
// shared parent. Re-mounts on key change so each card animates fresh.
function Stars({ count }: { count: number }) {
  return (
    <motion.div
      className="flex gap-0.5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, scale: 0.4, rotate: -25 },
            visible: { opacity: 1, scale: 1, rotate: 0 },
          }}
          transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ display: "inline-flex" }}
        >
          <HiStar className="text-[#F59E0B] text-sm" />
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { reviews, sectionBgs, social } = useContent();
  const { lang } = useLanguage();
  const d = theme === "dark";

  const BLUE       = "#3B82F6";
  // Dark-mode tonları "bir tık aydınlatıldı" — eski değerler çok karanlık
  // hissediyordu (özellikle review/social kartları): surface #0d0d0d → #181820,
  // border #1e1e1e → #2a2a30, body text alpha 0.60 → 0.72, muted 0.38 → 0.50.
  const surface    = d ? "#181820"                 : "#ffffff";
  const border     = d ? "#2a2a30"                 : "#e8e8e8";
  const textPrimary= d ? "#ffffff"                 : "#111111";
  const textMuted  = d ? "rgba(255,255,255,0.50)"  : "rgba(0,0,0,0.38)";
  const textBody   = d ? "rgba(255,255,255,0.72)"  : "rgba(0,0,0,0.62)";

  const items = reviews.items ?? [];

  const sectionBgUrl = sectionBgs?.["reviews"] ?? "";

  // Localized strings for the side-by-side Social Media block. Pure
  // UI strings (no admin override) since the values themselves —
  // profile URLs — are admin-managed via the "Medya / Social" panel.
  const SOCIAL_T = {
    tr: {
      eyebrow: "Sosyal Medya",
      heading: "Bizi takip edin",
      sub: "Atölyemizden son anlar, ürün lansmanları ve fuar paylaşımları için sosyal medyamıza katılın.",
      linkedinSub: "Kurumsal haberler, kariyer fırsatları ve B2B duyuruları",
      instagramSub: "Atölye fotoğrafları, ürün lansmanları ve etkinlik kareleri",
      youtubeSub: "Ürün tanıtımları, kurulum rehberleri ve fuar videoları",
      facebookSub: "Topluluk paylaşımları, kampanyalar ve duyurular",
      latestPosts: "Son paylaşımlarımız",
      latestVideos: "Son videolarımız",
    },
    en: {
      eyebrow: "Social Media",
      heading: "Follow us",
      sub: "Workshop moments, product launches and trade-show highlights — join us on social.",
      linkedinSub: "Corporate news, careers and B2B announcements",
      instagramSub: "Workshop shots, product launches and event highlights",
      youtubeSub: "Product demos, installation guides and trade-show videos",
      facebookSub: "Community updates, campaigns and announcements",
      latestPosts: "See latest posts",
      latestVideos: "See latest videos",
    },
  } as const;
  const sT = SOCIAL_T[lang];

  // Only render social tiles for the platforms the operator has
  // actually configured. URLs come from admin → Content → social.
  // `recentPost` is the latest post the operator has pinned for this
  // channel (image + caption + link); if absent the tile falls back
  // to the "Bizi takip et" CTA only.
  const recentPosts = social.recentPosts ?? [];
  const findPost = (platform: "linkedin" | "instagram" | "youtube" | "facebook") =>
    recentPosts.find((p) => p.platform === platform && p.image && p.link);

  const socialChannels = [
    social.linkedin ? {
      key: "linkedin" as const,
      label: "LinkedIn",
      url: social.linkedin,
      sub: sT.linkedinSub,
      ctaLabel: sT.latestPosts,
      Icon: RiLinkedinFill,
      brand: "#0A66C2",
      recent: findPost("linkedin"),
    } : null,
    social.instagram ? {
      key: "instagram" as const,
      label: "Instagram",
      url: social.instagram,
      sub: sT.instagramSub,
      ctaLabel: sT.latestPosts,
      Icon: RiInstagramLine,
      brand: "#E1306C",
      recent: findPost("instagram"),
    } : null,
    social.youtube ? {
      key: "youtube" as const,
      label: "YouTube",
      url: social.youtube,
      sub: sT.youtubeSub,
      ctaLabel: sT.latestVideos,
      Icon: RiYoutubeFill,
      brand: "#FF0000",
      recent: findPost("youtube"),
    } : null,
    social.facebook ? {
      key: "facebook" as const,
      label: "Facebook",
      url: social.facebook,
      sub: sT.facebookSub,
      ctaLabel: sT.latestPosts,
      Icon: RiFacebookFill,
      brand: "#1877F2",
      recent: findPost("facebook"),
    } : null,
  ].filter(Boolean) as Array<{
    key: "linkedin" | "instagram" | "youtube" | "facebook"; label: string; url: string; sub: string;
    ctaLabel: string;
    Icon: typeof RiLinkedinFill; brand: string;
    recent?: ReturnType<typeof findPost>;
  }>;

  const showSocialColumn = socialChannels.length > 0;

  return (
    <section
      id="reviews"
      style={{
        background: d
          ? "linear-gradient(135deg, #16161c 0%, #1a1a22 50%, #17171e 100%)"
          : "linear-gradient(135deg, #f6f7fb 0%, #f2f3f7 50%, #f4f5f9 100%)",
      }}
      className="relative py-6 lg:py-8 overflow-hidden"
    >
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(9,13,21,0.75)" : "rgba(245,250,255,0.78)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{
              background: d ? `${BLUE}18` : `${BLUE}10`,
              border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
              color: d ? "#93C5FD" : BLUE,
            }}
          >
            <E field="reviews.sectionLabel" tag="span">{reviews.sectionLabel}</E>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2" style={{ color: textPrimary }}
          >
            <E field="reviews.heading">{reviews.heading}</E>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-px w-20 mb-4"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${BLUE} 50%, transparent 100%)` }}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.22 }}
            className="text-sm max-w-lg mx-auto" style={{ color: textMuted }}
          >
            <E field="reviews.subheading" tag="span">{reviews.subheading}</E>
          </motion.p>

          {/* Platform chips */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-3"
          >
            {Array.from(new Set(items.map((r) => r.platform))).map((p) => {
              const color = items.find((r) => r.platform === p)?.platformColor ?? "#888";
              return (
                <span key={p} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
                  {p}
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* Two-column layout: customer reviews on the left, live social
            channels on the right. On mobile the social block stacks
            below the reviews. The reviews column is taller (col-span-3)
            to keep the long quote cards readable; the social column
            (col-span-2) holds the two brand-coloured tiles compactly. */}
        <div className={showSocialColumn ? "grid lg:grid-cols-5 gap-5" : ""}>
          <div className={showSocialColumn ? "lg:col-span-3" : ""}>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.slice(0, showSocialColumn ? 2 : 3).map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <Stars count={review.rating} />
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md"
                      style={{ background: `${review.platformColor}14`, color: review.platformColor, border: `1px solid ${review.platformColor}28` }}>
                      {review.platform}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed flex-1" style={{ color: textBody }}>
                    &ldquo;{review.text}&rdquo;
                  </p>

                  <div className="text-xs font-medium px-3 py-1.5 rounded-lg self-start"
                    style={{ background: d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: textMuted, border: d ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)" }}>
                    {review.product}
                  </div>

                  <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textMuted }}>
                        {review.author[0]}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: textPrimary }}>{review.author}</span>
                    </div>
                    <span className="text-sm" style={{ color: textMuted }}>{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Aggregate rating — sits below the two review cards in the
                reviews column. Big numeric rating on the left so the
                viewer immediately reads "4.9", smaller platform-count
                summary on the right. Subtle BLUE-tinted background so
                the card feels like a "summary" callout rather than
                another review card. */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-4 rounded-2xl p-5 sm:p-6 flex items-center gap-5 sm:gap-7"
              style={{
                background: d
                  ? `linear-gradient(135deg, ${BLUE}14 0%, rgba(255,255,255,0.03) 100%)`
                  : `linear-gradient(135deg, ${BLUE}10 0%, #ffffff 100%)`,
                border: `1px solid ${d ? `${BLUE}28` : `${BLUE}22`}`,
                boxShadow: d ? "none" : `0 4px 22px ${BLUE}12`,
              }}
            >
              <div className="flex flex-col items-start gap-1 flex-shrink-0">
                <span className="text-5xl sm:text-6xl font-black tabular-nums leading-none" style={{ color: textPrimary }}>
                  {reviews.rating}
                </span>
                <div className="scale-110 origin-left">
                  <Stars count={5} />
                </div>
              </div>
              <div className="min-w-0 flex flex-col gap-1">
                <E field="reviews.ratingLabel" tag="p" className="text-xs sm:text-sm font-bold" style={{ color: textPrimary }}>
                  {reviews.ratingLabel}
                </E>
                <p className="text-xs sm:text-sm leading-snug" style={{ color: textMuted }}>
                  <E field="reviews.platformsPrefix" tag="span">{reviews.platformsPrefix}</E>{" "}
                  <span style={{ color: d ? "#93C5FD" : BLUE, fontWeight: 800 }}>{reviews.ratingCount}</span>{" "}
                  <E field="reviews.ratingCountSuffix" tag="span">{reviews.ratingCountSuffix}</E>
                </p>
              </div>
            </motion.div>
          </div>

          {showSocialColumn && (
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="lg:col-span-2 flex flex-col gap-3"
              aria-label={sT.heading}
            >
              {socialChannels.map((c, i) => (
                <motion.a
                  key={c.key}
                  href={c.recent?.link || c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.08 }}
                  className="relative rounded-2xl overflow-hidden group block transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    // Site-tinted neutral surface (matches review cards),
                    // with a thin brand-coloured left rail so the channel
                    // is still recognisable but the tile no longer reads
                    // as a saturated standalone advert.
                    background: surface,
                    border: `1px solid ${border}`,
                    borderLeft: `3px solid ${c.brand}`,
                    boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2.5 px-3 py-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${c.brand}18`, border: `1px solid ${c.brand}35` }}
                    >
                      <c.Icon style={{ fontSize: 16, color: c.brand }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs leading-tight" style={{ color: textPrimary }}>{c.label}</p>
                      <p className="text-[10px] leading-tight" style={{ color: textMuted }}>
                        {c.recent ? c.ctaLabel : "@bemisevcharge"}
                      </p>
                    </div>
                    <RiExternalLinkLine style={{ fontSize: 13, color: textMuted }} />
                  </div>

                  {/* Pinned-post preview (admin curated) — small image
                      strip + 2-line caption. Fallback: 1-line pitch +
                      compact follow CTA. */}
                  {c.recent ? (
                    <>
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: "16 / 9", background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.recent.image}
                          alt={c.recent.caption || c.label}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="px-3 py-2.5 flex flex-col gap-1">
                        <p
                          className="text-[11px] leading-snug"
                          style={{
                            color: textBody,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {c.recent.caption}
                        </p>
                        {c.recent.date && (
                          <p className="text-[9px]" style={{ color: textMuted }}>
                            {c.recent.date}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="px-3 pb-3 pt-0 flex items-center justify-between gap-2">
                      <p className="text-[11px] leading-snug flex-1" style={{ color: textMuted }}>
                        {c.sub}
                      </p>
                      <div
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 transition-all group-hover:gap-1.5"
                        style={{ background: `${c.brand}14`, color: c.brand, border: `1px solid ${c.brand}30` }}
                      >
                        {c.ctaLabel}
                      </div>
                    </div>
                  )}
                </motion.a>
              ))}
            </motion.aside>
          )}
        </div>
      </div>
    </section>
  );
}
