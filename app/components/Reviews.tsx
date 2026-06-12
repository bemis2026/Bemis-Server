"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HiStar } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine, RiYoutubeFill, RiFacebookFill, RiExternalLinkLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { allPosts } from "../blog/posts";
import { allPress } from "../blog/press";
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
  const AMBER      = "#F59E0B";
  // Dark-mode tonları "bir tık aydınlatıldı".
  const surface    = d ? "#181820"                 : "#ffffff";
  const border     = d ? "#2a2a30"                 : "#e8e8e8";
  const textPrimary= d ? "#ffffff"                 : "#111111";
  const textMuted  = d ? "rgba(255,255,255,0.50)"  : "rgba(0,0,0,0.38)";
  const textBody   = d ? "rgba(255,255,255,0.72)"  : "rgba(0,0,0,0.62)";

  const items = reviews.items ?? [];

  // Haberler (anasayfa SAĞ kolon, büyük) — yorum+sosyal SOL'da küçültüldü,
  // haber alanı büyütüldü (toplam boy korunur). Sosyal tipini hariç tut.
  const latestNews = allPress().filter((p) => p.type !== "social").slice(0, 3);
  const latestPosts = allPosts().slice(0, 3);
  const blogSurface = d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";

  const sectionBgUrl = sectionBgs?.["reviews"] ?? "";

  // Sosyal kanal verisi (admin → Content → social). Artık kompakt ikon
  // çipleri olarak SOL kolonda gösterilir (eski büyük kartlar kaldırıldı).
  const socialChannels = [
    social.linkedin  ? { key: "linkedin"  as const, label: "LinkedIn",  url: social.linkedin,  Icon: RiLinkedinFill,  brand: "#0A66C2" } : null,
    social.instagram ? { key: "instagram" as const, label: "Instagram", url: social.instagram, Icon: RiInstagramLine, brand: "#E1306C" } : null,
    social.youtube   ? { key: "youtube"   as const, label: "YouTube",   url: social.youtube,   Icon: RiYoutubeFill,   brand: "#FF0000" } : null,
    social.facebook  ? { key: "facebook"  as const, label: "Facebook",  url: social.facebook,  Icon: RiFacebookFill,  brand: "#1877F2" } : null,
  ].filter(Boolean) as Array<{ key: string; label: string; url: string; Icon: typeof RiLinkedinFill; brand: string }>;

  const fairLabel = lang === "en" ? "Fair" : "Fuar";
  const newsLabel = lang === "en" ? "News" : "Haber";

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

      {/* Dekoratif accent glow blob'lar (sadece desktop). */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block" aria-hidden>
        <div className="absolute" style={{ top: "-10%", left: "-8%", width: "55%", height: "70%", background: `radial-gradient(circle, ${BLUE}${d ? "22" : "14"} 0%, transparent 60%)`, filter: "blur(40px)" }} />
        <div className="absolute" style={{ top: "10%", right: "-10%", width: "50%", height: "60%", background: `radial-gradient(circle, ${d ? "#E1306C26" : "#E1306C14"} 0%, transparent 60%)`, filter: "blur(50px)" }} />
        <div className="absolute" style={{ bottom: "-15%", left: "20%", width: "60%", height: "55%", background: `radial-gradient(circle, ${d ? "#8B5CF624" : "#8B5CF612"} 0%, transparent 65%)`, filter: "blur(60px)" }} />
      </div>

      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: d ? `${BLUE}18` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`, color: d ? "#93C5FD" : BLUE }}
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
        </div>

        {/* Ana grid: SOL kompakt (yorum + sosyal), SAĞ büyük (haberler).
            Kullanıcı isteği: haber alanı büyük, yorum+sosyal küçük, boy sabit. */}
        <div className="grid lg:grid-cols-5 gap-5 items-start">

          {/* ── SOL: müşteri yorumları (kompakt) + sosyal çipler ── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black" style={{ color: textPrimary }}>
                {lang === "en" ? "Customer Reviews" : "Müşteri Yorumları"}
              </h3>
              {/* Kompakt puan rozeti */}
              <div className="inline-flex items-center gap-1.5">
                <HiStar className="text-[#F59E0B] text-sm" />
                <span className="text-sm font-black tabular-nums" style={{ color: textPrimary }}>{reviews.rating}</span>
                <span className="text-xs" style={{ color: textMuted }}>· {reviews.ratingCount}</span>
              </div>
            </div>

            {items.slice(0, 2).map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.12 + i * 0.07 }}
                className="rounded-xl p-3.5 flex flex-col gap-2"
                style={{ background: surface, border: `1px solid ${border}`, boxShadow: d ? "none" : "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-between">
                  <Stars count={review.rating} />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${review.platformColor}14`, color: review.platformColor, border: `1px solid ${review.platformColor}28` }}>
                    {review.platform}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: textBody, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-auto pt-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textMuted }}>
                    {review.author[0]}
                  </div>
                  <span className="text-xs font-semibold truncate" style={{ color: textPrimary }}>{review.author}</span>
                  <span className="text-[11px] ml-auto flex-shrink-0" style={{ color: textMuted }}>{review.date}</span>
                </div>
              </motion.div>
            ))}

            {/* Sosyal — kompakt ikon çipleri (eski büyük kartlar kaldırıldı) */}
            {socialChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {socialChannels.map((c) => (
                  <a
                    key={c.key}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: `${c.brand}14`, color: c.brand, border: `1px solid ${c.brand}33` }}
                  >
                    <c.Icon style={{ fontSize: 14 }} /> {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── SAĞ: Haberler & Basında (BÜYÜK) ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black" style={{ color: textPrimary }}>
                {lang === "en" ? "News & Press" : "Haberler & Basında"}
              </h3>
              <a href="/blog#haberler" className="text-xs font-semibold inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: d ? "#93C5FD" : BLUE }}>
                {lang === "en" ? "All news" : "Tüm haberler"} →
              </a>
            </div>

            {/* Kompakt YATAY kartlar (thumbnail sol + metin sağ) — sol kolonla
                boyca dengeli, alanı şişirmez, görseller korunur. */}
            <div className="flex flex-col gap-2.5">
              {latestNews.map((n, i) => {
                const isFair = n.type === "fair";
                const c = isFair ? AMBER : BLUE;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                    className="flex rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: blogSurface, border: `1px solid ${border}` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${c}66`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = border; }}
                  >
                    {/* Thumbnail (görsel veya markalı placeholder) */}
                    <div className="relative flex-shrink-0 w-24 sm:w-28" style={{ background: `${c}12` }}>
                      {n.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={n.image} alt={n.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c, opacity: 0.8 }}>{n.source}</span>
                        </div>
                      )}
                    </div>
                    {/* Metin */}
                    <div className="flex-1 min-w-0 p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${c}1f`, color: c, border: `1px solid ${c}45` }}>
                          {isFair ? fairLabel : newsLabel}
                        </span>
                        <span className="text-[11px] font-semibold truncate" style={{ color: textMuted }}>{n.source}</span>
                        {n.date && <span className="text-[11px] ml-auto flex-shrink-0" style={{ color: textMuted }}>{n.date}</span>}
                      </div>
                      <p className="text-[15px] font-bold leading-snug mb-1.5 flex-1" style={{ color: textPrimary, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-3">
                        <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: c }}>
                          {lang === "en" ? "Read" : "Haberi Oku"} <RiExternalLinkLine size={10} />
                        </a>
                        <a href={`/blog/haber/${n.id}`} className="text-[11px] font-bold inline-flex items-center gap-1 ml-auto transition-opacity hover:opacity-70" style={{ color: d ? "#93C5FD" : BLUE }}>
                          {lang === "en" ? "Summary" : "Özet İncele"} →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rehberler — kompakt mini-liste (haberlerin altında, ilave; bölümü büyütmez) */}
            {latestPosts.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: textMuted }}>{lang === "en" ? "Guides" : "Rehberler"}</span>
                  <a href="/blog#rehberler" className="text-[11px] font-semibold transition-opacity hover:opacity-70" style={{ color: d ? "#93C5FD" : BLUE }}>{lang === "en" ? "All" : "Tümü"} →</a>
                </div>
                <div className="flex flex-col gap-1">
                  {latestPosts.map((p) => (
                    <a key={p.slug} href={`/blog/${p.slug}`} className="text-xs inline-flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: textMuted }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: BLUE }} />
                      <span className="truncate">{p.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
