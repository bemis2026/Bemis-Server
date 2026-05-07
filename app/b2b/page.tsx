"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useUiStrings } from "../../lib/uiStrings";
import {
  RiPlugLine, RiShieldCheckLine,
  RiCheckLine, RiSendPlaneLine, RiBuilding2Line,
  RiToolsLine, RiArrowRightLine,
  RiBarChartLine, RiCustomerService2Line,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";

/* ─── Data types ────────────────────────────────────────────────────────── */
type B2BFeaturedSlot = { categoryId?: string; productId?: string };
type B2BHero = {
  eyebrow: string; heading1: string; heading2: string;
  description: string; sectorTags: string[];
  heroBg?: string;
};
type B2BData = { hero: B2BHero; featuredProducts?: B2BFeaturedSlot[] };

const ADVANTAGE_ICONS = [
  { icon: RiBuilding2Line,        color: "#F59E0B", titleKey: "b2b_adv_made_title",      bodyKey: "b2b_adv_made_body" },
  { icon: RiBarChartLine,         color: "#3B82F6", titleKey: "b2b_adv_serial_title",    bodyKey: "b2b_adv_serial_body" },
  { icon: RiShieldCheckLine,      color: "#10B981", titleKey: "b2b_adv_certs_title",     bodyKey: "b2b_adv_certs_body" },
  { icon: RiToolsLine,            color: "#818CF8", titleKey: "b2b_adv_custom_title",    bodyKey: "b2b_adv_custom_body" },
  { icon: RiSendPlaneLine,        color: "#F97316", titleKey: "b2b_adv_sample_title",    bodyKey: "b2b_adv_sample_body" },
  { icon: RiCustomerService2Line, color: "#EC4899", titleKey: "b2b_adv_aftersale_title", bodyKey: "b2b_adv_aftersale_body" },
] as const;

const SECTOR_KEYS = ["b2b_sec_oem", "b2b_sec_op", "b2b_sec_epc", "b2b_sec_int", "b2b_sec_dist", "b2b_sec_pub", "b2b_sec_other"] as const;
const PRODUCTS_INTEREST_KEYS = ["b2b_int_dc", "b2b_int_panel", "b2b_int_cable", "b2b_int_ecu"] as const;

type FormState = { name: string; company: string; email: string; phone: string; sector: string; interests: string[]; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", sector: "", interests: [], message: "" };
type ProductEntry = { id: string; name: string; subtitle?: string; description?: string; image?: string };
type Category = { id: string; name: string; tagline: string; accent: string; products?: ProductEntry[] };

export default function B2BPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const t = useUiStrings();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const localizedDefault: B2BData = {
    hero: {
      eyebrow:     t("b2b_default_eyebrow"),
      heading1:    t("b2b_default_h1"),
      heading2:    t("b2b_default_h2"),
      description: t("b2b_default_desc"),
      sectorTags:  [t("b2b_sector_oem"), t("b2b_sector_op"), t("b2b_sector_int"), t("b2b_sector_proj")],
    },
    featuredProducts: [],
  };
  const [b2bData, setB2bData] = useState<B2BData>(localizedDefault);
  const SECTORS = SECTOR_KEYS.map(k => t(k));
  const PRODUCTS_INTEREST = PRODUCTS_INTEREST_KEYS.map(k => t(k));
  const advantages = ADVANTAGE_ICONS.map(a => ({ icon: a.icon, color: a.color, title: t(a.titleKey), body: t(a.bodyKey) }));

  const bg        = d ? "#0c0c0e" : "#f8f8fb";
  const bgSub     = d ? "#111114" : "#ffffff";
  const card      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border    = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg   = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const inputBdr  = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const text      = d ? "#f0f0f4" : "#1a1a2e";
  const muted     = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint     = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow    = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const BLUE      = "#3B82F6";
  const AMBER     = "#F59E0B";

  useEffect(() => {
    fetch(`/api/products?lang=${lang}`).then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    if (lang === "tr") {
      fetch("/api/b2b").then(r => r.json()).then((data: B2BData) => {
        if (data?.hero) setB2bData(data);
      }).catch(() => {});
    }
  }, [lang]);

  // Admin panel live preview — receive postMessage from parent iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "BEMIS_B2B_PREVIEW" || !e.data?.b2bData) return;
      setB2bData(e.data.b2bData);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));
  const toggleInterest = (val: string) =>
    setForm(p => ({ ...p, interests: p.interests.includes(val) ? p.interests.filter(i => i !== val) : [...p.interests, val] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = `[B2B BAŞVURU]\n\nSektör: ${form.sector}\nİlgilenilen Ürünler: ${form.interests.join(", ") || "Belirtilmedi"}\n\nMesaj:\n${form.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, topic: "corporate-sales", message }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch { setStatus("err"); }
  };

  const inputStyle: React.CSSProperties = { background: inputBg, border: `1px solid ${inputBdr}`, color: text, outline: "none", width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: "0.875rem" };
  const labelStyle: React.CSSProperties = { color: faint, fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: bgSub,
          borderBottom: `1px solid ${border}`,
          paddingTop: 112,
          paddingBottom: 56,
        }}
      >
        {b2bData.hero.heroBg && (
          <>
            <Image src={b2bData.hero.heroBg} alt="" fill priority quality={90} sizes="100vw" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: d
                  ? "linear-gradient(135deg, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.62) 55%, rgba(8,8,12,0.38) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.30) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} className="flex items-center gap-2 mb-10 group"
            style={{ color: faint, fontSize: "0.875rem" }}>
            <HiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t("b2b_back_short")}
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiShieldCheckLine style={{ color: AMBER, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: AMBER }}>
                {b2bData.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {b2bData.hero.heading1}<br />
              <span style={{ color: AMBER }}>{b2bData.hero.heading2}</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[2px] w-24 origin-left rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${AMBER} 0%, ${AMBER}66 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${AMBER}45`,
              }}
            />
            <p className="leading-relaxed max-w-xl mb-6" style={{ color: muted, fontSize: "0.9375rem" }}>
              {b2bData.hero.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(b2bData.hero.sectorTags ?? []).map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}28`, color: d ? "#FCD34D" : "#92400E" }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Advantages — single card with bullet list ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
          >
            <div className="flex flex-col gap-5">
              {advantages.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 * i }}
                  className="flex items-start gap-4 pb-5"
                  style={{ borderBottom: i < advantages.length - 1 ? `1px solid ${border}` : "none" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
                  >
                    <a.icon style={{ fontSize: 18, color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base mb-1" style={{ color: text }}>{a.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: muted }}>{a.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OEM Featured Products ── */}
      {(() => {
        const resolved = (b2bData.featuredProducts ?? [])
          .map(slot => {
            if (!slot?.categoryId || !slot?.productId) return null;
            const cat = categories.find(c => c.id === slot.categoryId);
            const prod = cat?.products?.find(p => p.id === slot.productId);
            if (!cat || !prod) return null;
            return { cat, prod };
          })
          .filter((x): x is { cat: Category; prod: ProductEntry } => x !== null);
        if (resolved.length === 0) return null;
        return (
          <section style={{ background: bgSub, borderBottom: `1px solid ${border}`, padding: "56px 0" }}>
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <RiBuilding2Line style={{ color: AMBER, fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: AMBER }}>{t("b2b_oem_eyebrow")}</span>
                </div>
                <h2 className="text-xl font-black mb-1" style={{ color: text }}>{t("b2b_oem_heading")}</h2>
                <p className="text-sm max-w-2xl" style={{ color: muted }}>
                  {t("b2b_oem_sub")}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {resolved.map(({ cat, prod }, i) => {
                  const href = `/products/${cat.id}/${prod.id}`;
                  const desc = (prod.description ?? "").trim();
                  const shortDesc = desc.length > 120 ? desc.slice(0, 117).trimEnd() + "…" : desc;
                  return (
                    <motion.div key={`${cat.id}-${prod.id}`}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.07 * i }}>
                      <Link href={href}
                        className="group block h-full rounded-2xl overflow-hidden transition-all duration-200"
                        style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, textDecoration: "none" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.accent}40`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}>
                        {prod.image ? (
                          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3", background: inputBg }}>
                            <Image src={prod.image} alt={prod.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                              style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: `${cat.accent}10` }}>
                            <RiPlugLine style={{ fontSize: 36, color: cat.accent, opacity: 0.6 }} />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ background: `${cat.accent}15`, color: cat.accent, border: `1px solid ${cat.accent}28` }}>
                            {cat.name}
                          </span>
                          <h3 className="font-bold text-sm mb-0.5" style={{ color: text }}>{prod.name}</h3>
                          {prod.subtitle && <p className="text-xs mb-2" style={{ color: faint }}>{prod.subtitle}</p>}
                          {shortDesc && <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{shortDesc}</p>}
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                            {t("b2b_view_product")}
                            <RiArrowRightLine size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Form ── */}
      <section style={{ background: bgSub, padding: "56px 0 72px" }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <RiShieldCheckLine style={{ color: AMBER, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: AMBER }}>{t("b2b_form_eyebrow")}</span>
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: text }}>{t("b2b_form_heading")}</h2>
            <p className="text-sm" style={{ color: muted }}>
              {t("b2b_form_intro")}
            </p>
          </div>
          <AnimatePresence mode="wait">
            {status === "ok" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-12 text-center" style={{ background: card, border: `1px solid ${border}` }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#10B98118", border: "1px solid #10B98130" }}>
                  <RiCheckLine style={{ fontSize: 28, color: "#10B981" }} />
                </div>
                <h3 className="font-black text-base mb-2" style={{ color: text }}>{t("b2b_form_ok_title")}</h3>
                <p className="text-sm" style={{ color: muted }}>{t("b2b_form_ok_body")}</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>{t("b2b_form_name")}</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder={t("b2b_form_name_ph")} style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t("b2b_form_company")}</label>
                    <input required value={form.company} onChange={e => set("company", e.target.value)} placeholder={t("b2b_form_company_ph")} style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>{t("b2b_form_email")}</label>
                    <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder={t("b2b_form_email_ph")} style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t("b2b_form_phone")}</label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder={t("b2b_form_phone_ph")} style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{t("b2b_form_sector")}</label>
                  <select required value={form.sector} onChange={e => set("sector", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }}>
                    <option value="">{t("b2b_form_select_sector")}</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 10 }}>{t("b2b_form_interests")}</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCTS_INTEREST.map(p => {
                      const active = form.interests.includes(p);
                      return (
                        <button key={p} type="button" onClick={() => toggleInterest(p)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                          style={{ background: active ? `${BLUE}15` : inputBg, border: `1px solid ${active ? `${BLUE}50` : inputBdr}`, color: active ? (d ? "#93C5FD" : BLUE) : muted }}>
                          {active && <RiCheckLine className="inline mr-1" style={{ fontSize: 11 }} />}{p}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{t("b2b_form_message")}</label>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3}
                    placeholder={t("b2b_form_message_ph")} style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                {status === "err" && <p className="text-xs text-red-400">{t("b2b_form_err")}</p>}
                <button type="submit" disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all"
                  style={{ background: BLUE, color: "#fff", boxShadow: `0 6px 20px ${BLUE}35` }}>
                  {status === "sending"
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />{t("b2b_form_sending")}</>
                    : <><RiSendPlaneLine size={16} />{t("b2b_form_send")}</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ContactBar />
    </div>
  );
}
