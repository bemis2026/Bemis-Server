"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
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

// Dile göre basın tipi etiketi (PRESS_META.color sabit kalir).
const pressLabel = (type: PressItem["type"], lang: string) =>
  type === "fair" ? (lang === "en" ? "Fair" : "Fuar")
    : type === "social" ? (lang === "en" ? "Social" : "Sosyal")
      : (lang === "en" ? "News" : "Haber");

export default function BlogShell({ post, posts, pressItem }: { post?: BlogPost; posts?: BlogPost[]; pressItem?: PressItem }) {
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
      ) : pressItem ? (
        <PressArticle item={pressItem} d={d} surface={surface} border={border} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint} fmtDate={fmtDate} />
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
  const { lang } = useLanguage();
  const { categories } = useContent();
  // Tüm kategorilerin SSS'lerini topla (kaynak: admin → kategori meta `faq`).
  const faqGroups = Object.entries((categories ?? {}) as Record<string, { name?: string; faq?: { q: string; a: string }[] }>)
    .map(([id, c]) => ({ id, name: c.name ?? id, faq: (c.faq ?? []).filter((f) => f && f.q && f.a) }))
    .filter((g) => g.faq.length > 0);
  const faqCount = faqGroups.reduce((n, g) => n + g.faq.length, 0);

  // Varsayılan: Haberler. #rehberler / #sss hash'i ile ilgili sekme açılır.
  const [tab, setTab] = useState<"rehberler" | "haberler" | "sss">("haberler");
  // Hash'i reaktif izle: /blog'dayken Rehber menüsünden #sss/#rehberler'e
  // gecince (remount yok) sekme yine de degissin.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const h = window.location.hash;
      setTab(h === "#rehberler" ? "rehberler" : h === "#sss" ? "sss" : "haberler");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const tabs: { k: "rehberler" | "haberler" | "sss"; label: string; count: number }[] = [
    { k: "haberler", label: lang === "en" ? "News & Fairs" : "Haberler & Fuarlar", count: press.length },
    { k: "rehberler", label: lang === "en" ? "Guides" : "Rehberler", count: posts.length },
    { k: "sss", label: lang === "en" ? "FAQ" : "SSS", count: faqCount },
  ];

  return (
    <div className="pt-28 pb-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: BLUE }}>Bemis E-V Charge · Blog</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: textPrimary }}>{lang === "en" ? "Blog & News" : "Blog & Haberler"}</h1>
        <p className="text-sm sm:text-base mb-6 max-w-2xl" style={{ color: textMuted }}>
          {lang === "en"
            ? "Practical EV-charging guides plus the latest Bemis E-V Charge news and trade-show updates."
            : "EV şarjı üzerine pratik rehberler ile Bemis E-V Charge hakkında güncel haberler ve fuar paylaşımları."}
        </p>

        {/* Sekmeler — Rehberler / Haberler & Fuarlar */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist">
          {tabs.map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(t.k);
                  if (typeof window !== "undefined") history.replaceState(null, "", "#" + t.k);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={active
                  ? { background: BLUE, color: "#fff", border: `1px solid ${BLUE}` }
                  : { background: surface, color: textMuted, border: `1px solid ${border}` }}
              >
                {t.label} <span style={{ opacity: 0.7 }}>({t.count})</span>
              </button>
            );
          })}
        </div>

        {tab === "rehberler" ? (
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
                      <span className="flex items-center gap-1"><HiClock size={12} />{p.readingMinutes} {lang === "en" ? "min" : "dk"}</span>
                      <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: BLUE }}>{lang === "en" ? "Read" : "Oku"} <HiArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : tab === "sss" ? (
          faqGroups.length > 0 ? (
            <div className="space-y-8">
              {faqGroups.map((g) => (
                <div key={g.id}>
                  <h2 className="text-lg font-black mb-3" style={{ color: textPrimary }}>{g.name}</h2>
                  <div className="space-y-2.5">
                    {g.faq.map((f, i) => (
                      <div key={i} className="rounded-2xl p-5" style={{ background: surface, border: `1px solid ${border}` }}>
                        <p className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{f.q}</p>
                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: textMuted }}>{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm py-10" style={{ color: textMuted }}>{lang === "en" ? "No questions yet." : "Henüz soru-cevap eklenmemiş."}</p>
          )
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {press.map((it) => {
              const meta = PRESS_META[it.type];
              return (
                <Link
                  key={it.id}
                  href={`/blog/haber/${it.id}`}
                  className="group rounded-2xl overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-0.5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  {it.image && (
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9", background: surface }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                        {pressLabel(it.type, lang)}
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: textMuted }}>{it.source}</span>
                      {it.date && <span className="text-[11px] ml-auto" style={{ color: textFaint }}>{fmtDate(it.date)}</span>}
                    </div>
                    <h3 className="text-base font-bold leading-snug mb-2" style={{ color: textPrimary }}>{it.title}</h3>
                    <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: textMuted }}>{it.summary}</p>
                    <span className="text-[12px] font-semibold inline-flex items-center gap-1" style={{ color: BLUE }}>
                      {lang === "en" ? "Read Summary" : "Özet İncele"} <HiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
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
  const { lang } = useLanguage();
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
          <span className="flex items-center gap-1.5"><HiClock size={13} />{post.readingMinutes} {lang === "en" ? "min read" : "dakika okuma"}</span>
        </div>

        {/* Gövde */}
        <div className="space-y-5">
          {post.body.map((s, i) => <Section key={i} s={s} d={d} textPrimary={textPrimary} textMuted={textMuted} />)}
        </div>

        {/* SSS */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-4" style={{ color: textPrimary }}>{lang === "en" ? "Frequently Asked Questions" : "Sıkça Sorulan Sorular"}</h2>
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
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textFaint }}>{lang === "en" ? "Related" : "İlgili"}</p>
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

// ── Haber/Basın iç özet görünümü ───────────────────────────────────────────
function PressArticle({ item, d, surface, border, textPrimary, textMuted, textFaint, fmtDate }: {
  item: PressItem; d: boolean; surface: string; border: string; textPrimary: string; textMuted: string; textFaint: string; fmtDate: (s: string) => string;
}) {
  const { lang } = useLanguage();
  const meta = PRESS_META[item.type];
  const paras = item.body && item.body.length ? item.body : [item.summary];
  const others = allPress().filter((p) => p.id !== item.id).slice(0, 4);
  return (
    <article className="pt-28 pb-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 mb-6 text-sm font-medium group" style={{ color: textMuted }}>
          <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Blog
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md" style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>{pressLabel(item.type, lang)}</span>
          <span className="text-xs font-semibold" style={{ color: textMuted }}>{item.source}</span>
          {item.date && <span className="text-xs ml-auto" style={{ color: textFaint }}>{fmtDate(item.date)}</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-6" style={{ color: textPrimary }}>{item.title}</h1>

        {item.image && (
          <div className="relative w-full overflow-hidden rounded-2xl mb-7" style={{ aspectRatio: "16 / 9", background: surface, border: `1px solid ${border}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        )}

        <div className="space-y-5">
          {paras.map((p, i) => (
            <p key={i} className="text-[15px] sm:text-base leading-relaxed" style={{ color: textMuted }}>{p}</p>
          ))}
        </div>

        {/* Kaynak — linklemeye devam */}
        <div className="mt-8 rounded-2xl px-5 py-5" style={{ background: d ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.07)", border: `1px solid ${BLUE}30` }}>
          <p className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>{lang === "en" ? "This is a curated summary. Read the full story at the source:" : "Bu içerik bir derleme özetidir. Haberin tamamı için kaynağa gidin:"}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: BLUE }}>
            {lang === "en" ? "Read source" : "Kaynağı Oku"}: {item.source} <RiExternalLinkLine size={15} />
          </a>
        </div>

        {/* Diğer haberler — iç linkleme */}
        {others.length > 0 && (
          <div className="mt-12 pt-6" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: textFaint }}>{lang === "en" ? "Other News" : "Diğer Haberler"}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {others.map((o) => (
                <Link key={o.id} href={`/blog/haber/${o.id}`} className="rounded-xl p-3.5 transition-transform hover:-translate-y-0.5" style={{ background: surface, border: `1px solid ${border}` }}>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: PRESS_META[o.type].color }}>{pressLabel(o.type, lang)} · {o.source}</p>
                  <p className="text-sm font-semibold leading-snug" style={{ color: textPrimary }}>{o.title}</p>
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
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl my-2" style={{ border: `1px solid ${d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}` }}>
          <table className="w-full text-left text-[13px] sm:text-sm border-collapse">
            {s.caption && (
              <caption className="text-xs px-4 pt-3 pb-1 text-left" style={{ color: textMuted, captionSide: "top" }}>{s.caption}</caption>
            )}
            <thead>
              <tr>
                {s.headers.map((h, i) => (
                  <th key={i} scope="col" className="px-3 py-2.5 font-bold align-bottom"
                    style={{ color: textPrimary, background: d ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)", borderBottom: `1px solid ${BLUE}55` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 ? (d ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2.5 align-top"
                      style={{ color: ci === 0 ? textPrimary : textMuted, fontWeight: ci === 0 ? 600 : 400, borderTop: `1px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "figure":
      return (
        <figure className="my-2">
          <div
            role="img"
            aria-label={s.alt}
            className="rounded-2xl p-4 overflow-x-auto flex justify-center"
            style={{ background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${d ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`, color: textPrimary }}
            dangerouslySetInnerHTML={{ __html: s.svg }}
          />
          {s.caption && (
            <figcaption className="text-xs mt-2 text-center" style={{ color: textMuted }}>{s.caption}</figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}
