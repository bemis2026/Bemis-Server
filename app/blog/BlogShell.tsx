"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import ContactBar from "../components/ContactBar";
import SearchOverlay from "../components/SearchOverlay";
import { HiArrowLeft, HiArrowRight, HiClock, HiCalendar } from "react-icons/hi";
import { RiExternalLinkLine } from "react-icons/ri";
import type { BlogPost, BlogSection } from "./posts";
import { allPress, type PressItem } from "./press";

const BLUE = "#3B82F6";

const PRESS_META: Record<PressItem["type"], { label: string; color: string }> = {
  news:   { label: "Haber",  color: "#3B82F6" },
  fair:   { label: "Fuar",   color: "#F59E0B" },
  social: { label: "Sosyal", color: "#E1306C" },
};

export default function BlogShell({ post, posts }: { post?: BlogPost; posts?: BlogPost[] }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const { lang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);

  const bg          = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint   = d ? "rgba(240,240,244,0.40)" : "rgba(26,26,26,0.45)";

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : "tr-TR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {post ? (
        <Article post={post} d={d} surface={surface} border={border} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint} fmtDate={fmtDate} />
      ) : (
        <Listing posts={posts ?? []} surface={surface} border={border} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint} fmtDate={fmtDate} />
      )}

      <ContactBar />
    </div>
  );
}

// ── Liste görünümü ──────────────────────────────────────────────────────────
function Listing({ posts, surface, border, textPrimary, textMuted, textFaint, fmtDate }: {
  posts: BlogPost[]; surface: string; border: string; textPrimary: string; textMuted: string; textFaint: string; fmtDate: (s: string) => string;
}) {
  const press = allPress();
  return (
    <div className="pt-28 pb-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>Bemis E-V Charge · Blog</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: textPrimary }}>EV Şarj Rehberleri & Teknik Yazılar</h1>
        <p className="text-sm sm:text-base mb-10 max-w-2xl" style={{ color: textMuted }}>
          Elektrikli araç şarjı, V2L, kablo ve adaptör seçimi, kurulum ve yerli üretim üzerine pratik rehberler.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {posts.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <Link href={`/blog/${p.slug}`} className="block rounded-2xl overflow-hidden h-full transition-transform hover:-translate-y-0.5"
                style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="p-5 flex flex-col h-full">
                  <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-md mb-3" style={{ background: `${BLUE}18`, color: BLUE }}>{p.category}</span>
                  <h2 className="text-lg font-bold leading-snug mb-2" style={{ color: textPrimary }}>{p.title}</h2>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: textMuted }}>{p.excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: textFaint }}>
                    <span className="flex items-center gap-1"><HiCalendar size={12} />{fmtDate(p.datePublished)}</span>
                    <span className="flex items-center gap-1"><HiClock size={12} />{p.readingMinutes} dk</span>
                    <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: BLUE }}>Oku <HiArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Haberler & Fuarlar — Bemis E-V Charge ile ilgili GERÇEK dış basın
            ve fuar linkleri. Harici kaynaklara yeni sekmede açılır. */}
        {press.length > 0 && (
          <div className="mt-14 pt-10" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>Basında Biz</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: textPrimary }}>Haberler &amp; Fuarlar</h2>
            <p className="text-sm mb-6 max-w-2xl" style={{ color: textMuted }}>
              Bemis E-V Charge&apos;ın basında yer aldığı haberler ve katıldığı uluslararası fuarlar.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {press.map((it) => {
                const meta = PRESS_META[it.type];
                return (
                  <a
                    key={it.id}
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl p-5 flex flex-col h-full transition-transform hover:-translate-y-0.5"
                    style={{ background: surface, border: `1px solid ${border}` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: textMuted }}>{it.source}</span>
                      {it.date && <span className="text-[11px] ml-auto" style={{ color: textFaint }}>{fmtDate(it.date)}</span>}
                    </div>
                    <h3 className="text-base font-bold leading-snug mb-2" style={{ color: textPrimary }}>{it.title}</h3>
                    <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: textMuted }}>{it.summary}</p>
                    <span className="text-[12px] font-semibold inline-flex items-center gap-1" style={{ color: BLUE }}>
                      Haberi oku <RiExternalLinkLine size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Makale görünümü ─────────────────────────────────────────────────────────
function Article({ post, d, surface, border, textPrimary, textMuted, textFaint, fmtDate }: {
  post: BlogPost; d: boolean; surface: string; border: string; textPrimary: string; textMuted: string; textFaint: string; fmtDate: (s: string) => string;
}) {
  return (
    <article className="pt-28 pb-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 mb-6 text-sm font-medium group" style={{ color: textMuted }}>
          <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Blog
        </Link>

        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-3" style={{ background: `${BLUE}18`, color: BLUE }}>{post.category}</span>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: textPrimary }}>{post.title}</h1>
        <div className="flex items-center gap-4 text-xs mb-8 pb-6" style={{ color: textFaint, borderBottom: `1px solid ${border}` }}>
          <span className="flex items-center gap-1.5"><HiCalendar size={13} />{fmtDate(post.datePublished)}</span>
          <span className="flex items-center gap-1.5"><HiClock size={13} />{post.readingMinutes} dakika okuma</span>
        </div>

        {/* Gövde */}
        <div className="space-y-5">
          {post.body.map((s, i) => <Section key={i} s={s} d={d} textPrimary={textPrimary} textMuted={textMuted} />)}
        </div>

        {/* SSS */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-4" style={{ color: textPrimary }}>Sıkça Sorulan Sorular</h2>
            <div className="space-y-3">
              {post.faq.map((f, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: surface, border: `1px solid ${border}` }}>
                  <p className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İlgili / iç linkler */}
        {post.related && post.related.length > 0 && (
          <div className="mt-12 pt-6" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textFaint }}>İlgili</p>
            <div className="flex flex-wrap gap-2">
              {post.related.map((r) => (
                <Link key={r.href} href={r.href} className="text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors"
                  style={{ background: `${BLUE}14`, color: BLUE, border: `1px solid ${BLUE}30` }}>
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Section({ s, d, textPrimary, textMuted }: { s: BlogSection; d: boolean; textPrimary: string; textMuted: string }) {
  switch (s.type) {
    case "h2":
      return <h2 className="text-2xl font-black pt-4" style={{ color: textPrimary }}>{s.text}</h2>;
    case "h3":
      return <h3 className="text-lg font-bold pt-2" style={{ color: textPrimary }}>{s.text}</h3>;
    case "p":
      return <p className="text-[15px] sm:text-base leading-relaxed" style={{ color: textMuted }}>{s.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2 pl-1">
          {s.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] sm:text-base leading-relaxed" style={{ color: textMuted }}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BLUE }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl px-5 py-4 text-[15px] sm:text-base italic font-medium leading-relaxed"
          style={{ background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.07)", borderLeft: `3px solid ${BLUE}`, color: textPrimary }}>
          {s.text}
        </blockquote>
      );
    case "cta":
      return (
        <div className="rounded-2xl px-5 py-5 my-2" style={{ background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.07)", border: `1px solid ${BLUE}30` }}>
          <p className="text-sm sm:text-base font-semibold mb-3" style={{ color: textPrimary }}>{s.text}</p>
          <Link href={s.href} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: BLUE }}>
            {s.label} <HiArrowRight size={15} />
          </Link>
        </div>
      );
    default:
      return null;
  }
}
