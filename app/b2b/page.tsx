"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import {
  RiFlashlightLine, RiCpuLine, RiPlugLine, RiShieldCheckLine,
  RiCheckLine, RiSendPlaneLine, RiBuilding2Line, RiSettings4Line,
  RiWifiLine, RiToolsLine, RiGlobalLine, RiArrowRightLine,
  RiLeafLine, RiLightbulbLine, RiBarChartLine, RiCustomerService2Line,
} from "react-icons/ri";
import { HiArrowLeft, HiChevronRight } from "react-icons/hi";

/* ─── Palette ──────────────────────────────────────────────────────────── */
// B2B page always uses its own dark industrial palette, regardless of site theme
const C = {
  bg:        "#080b12",
  bgSub:     "#0d1119",
  card:      "rgba(255,255,255,0.035)",
  cardHover: "rgba(255,255,255,0.06)",
  border:    "rgba(255,255,255,0.07)",
  borderAcc: "rgba(245,158,11,0.25)",
  amber:     "#F59E0B",
  amberDim:  "#92400E",
  blue:      "#3B82F6",
  green:     "#10B981",
  purple:    "#818CF8",
  orange:    "#F97316",
  text:      "#e8eaf0",
  muted:     "rgba(232,234,240,0.50)",
  faint:     "rgba(232,234,240,0.25)",
  vfaint:    "rgba(232,234,240,0.10)",
};

/* ─── Data types ────────────────────────────────────────────────────────── */
type B2BSolution = {
  id: string; name: string; subtitle: string; tag: string;
  tagColor: string; accentColor: string; detail: string; specs: string[];
};
type B2BHero = {
  eyebrow: string; heading1: string; heading2: string;
  description: string; sectorTags: string[];
};
type B2BData = { hero: B2BHero; solutions: B2BSolution[] };

const ICON_MAP: Record<string, React.ElementType> = {
  "dc-charger": RiFlashlightLine,
  "charge-panel": RiCpuLine,
  "dc-cable": RiPlugLine,
  "ecu": RiSettings4Line,
};

const DEFAULT_B2B: B2BData = {
  hero: {
    eyebrow: "Kurumsal & OEM Çözümler",
    heading1: "EV Altyapısı için",
    heading2: "Profesyonel Çözümler",
    description: "Şarj ağı operatörleri, OEM üreticiler ve sistem entegratörleri için teknik ürün portföyü.",
    sectorTags: ["OEM Üretici", "Şarj Ağı Operatörü", "Sistem Entegratörü", "Proje Müteahhidi"],
  },
  solutions: [],
};

const advantages = [
  { icon: RiToolsLine,          title: "Teknik Destek",       body: "Proje tasarımından devreye almaya kadar mühendislik desteği.", color: C.amber },
  { icon: RiBarChartLine,       title: "Özel Fiyatlandırma", body: "Hacme göre ölçeklenen rekabetçi OEM ve toplu satış fiyatları.", color: C.blue },
  { icon: RiWifiLine,           title: "OCPP Entegrasyonu",  body: "OCPP 1.6 / 2.0.1 uyumlu donanım ve yazılım çözümleri.", color: C.green },
  { icon: RiGlobalLine,         title: "Sertifikasyon",      body: "CE, TÜV, IEC sertifikalı ürünler; Avrupa ihracatına hazır portföy.", color: C.purple },
  { icon: RiLightbulbLine,      title: "Özel Geliştirme",    body: "Tasarıma özel (custom) elektronik kart ve yazılım projeleri.", color: C.orange },
  { icon: RiCustomerService2Line, title: "Satış Sonrası",   body: "Garanti, yedek parça ve saha servis anlaşmaları.", color: "#EC4899" },
];

const SECTORS = [
  "EV Üreticisi (OEM)", "Şarj Ağı Operatörü", "Proje Müteahhidi / EPC",
  "Sistem Entegratörü", "Distribütör / Bayi", "Kamu / Belediye", "Diğer",
];

const PRODUCTS_INTEREST = [
  "DC Hızlı Şarj Ünitesi", "Şarj Panosu & Dağıtım", "DC Şarj Kablosu (CCS2)", "Elektronik Kontrol Kartı (ECU)",
];

type FormState = { name: string; company: string; email: string; phone: string; sector: string; interests: string[]; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", sector: "", interests: [], message: "" };

type Category = { id: string; name: string; tagline: string; accent: string };

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function B2BPage() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [b2bData, setB2bData] = useState<B2BData>(DEFAULT_B2B);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    fetch("/api/b2b").then(r => r.json()).then((data: B2BData) => {
      if (data?.solutions) setB2bData(data);
    }).catch(() => {});
  }, []);

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));
  const toggleInterest = (val: string) =>
    setForm(p => ({
      ...p,
      interests: p.interests.includes(val) ? p.interests.filter(i => i !== val) : [...p.interests, val],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = `[B2B BAŞVURU]\n\nSektör: ${form.sector}\nİlgilenilen Ürünler: ${form.interests.join(", ") || "Belirtilmedi"}\n\nMesaj:\n${form.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, topic: "corporate-sales", message }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${C.border}`,
    color: C.text,
    outline: "none",
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: "0.875rem",
    transition: "border-color 0.15s",
  };
  const labelStyle: React.CSSProperties = {
    color: C.faint,
    fontSize: "0.70rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,158,11,0.06) 0%, transparent 60%)",
        zIndex: 0,
      }} />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ════════════════════════════════ HERO ════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{
          background: `linear-gradient(180deg, #060912 0%, ${C.bgSub} 100%)`,
          borderBottom: `1px solid ${C.border}`,
          paddingTop: 120,
          paddingBottom: 72,
        }}>
          {/* Grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(${C.vfaint} 1px, transparent 1px), linear-gradient(90deg, ${C.vfaint} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.4,
          }} />
          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none" style={{
            background: "radial-gradient(ellipse at top right, rgba(245,158,11,0.08) 0%, transparent 60%)",
          }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
            <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()} className="flex items-center gap-2 mb-10 group"
              style={{ color: C.faint, fontSize: "0.875rem" }}>
              <HiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Ana sayfaya dön
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.amber }} />
                <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: C.amber }}>
                  {b2bData.hero.eyebrow}
                </span>
              </div>

              <h1 className="font-black leading-tight mb-5" style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                background: `linear-gradient(135deg, ${C.text} 0%, rgba(232,234,240,0.65) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {b2bData.hero.heading1}<br />
                <span style={{
                  background: `linear-gradient(90deg, ${C.amber}, #FCD34D)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{b2bData.hero.heading2}</span>
              </h1>

              <p className="leading-relaxed max-w-2xl mb-8" style={{ color: C.muted, fontSize: "1rem" }}>
                {b2bData.hero.description}
              </p>

              {/* Sector tags */}
              <div className="flex flex-wrap gap-2">
                {(b2bData.hero.sectorTags ?? []).map(tag => (
                  <span key={tag} className="text-[11px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)", color: "#FCD34D" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════ ADVANTAGES ════════════════════════════ */}
        <section style={{ background: C.bgSub, borderBottom: `1px solid ${C.border}`, padding: "56px 0" }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {advantages.map((a, i) => (
                <motion.div key={a.title}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                    <a.icon style={{ fontSize: 18, color: a.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: C.text }}>{a.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{a.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ B2B PRODUCTS ═══════════════════════════ */}
        <section style={{ padding: "72px 0", background: C.bg }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <RiBuilding2Line style={{ color: C.amber, fontSize: 14 }} />
                <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: C.amber }}>
                  Ürün Portföyü
                </span>
              </div>
              <h2 className="text-2xl font-black mb-2" style={{ color: C.text }}>OEM & Kurumsal Teknik Ürünler</h2>
              <p className="text-sm" style={{ color: C.muted }}>
                Profesyonel EV altyapısı için geliştirilen, sertifikalı ve entegrasyon hazır bileşenler.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {b2bData.solutions.map((p, i) => {
                const Icon = ICON_MAP[p.id] ?? RiPlugLine;
                return (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 * i }}
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="rounded-2xl p-6 transition-all duration-200 cursor-default"
                    style={{
                      background: hoveredCard === p.id ? C.cardHover : C.card,
                      border: `1px solid ${hoveredCard === p.id ? `${p.accentColor}30` : C.border}`,
                      boxShadow: hoveredCard === p.id ? `0 8px 40px ${p.accentColor}10` : "none",
                    }}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.accentColor}12`, border: `1px solid ${p.accentColor}22` }}>
                        <Icon style={{ fontSize: 22, color: p.accentColor }} />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-0.5"
                        style={{ background: `${p.tagColor}15`, color: p.tagColor, border: `1px solid ${p.tagColor}28` }}>
                        {p.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-1" style={{ color: C.text }}>{p.name}</h3>
                    <p className="text-xs mb-3" style={{ color: C.faint }}>{p.subtitle}</p>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{p.detail}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {p.specs.map((s, j) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.accentColor }} />
                          <span className="text-[11px]" style={{ color: C.muted }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════ CONSUMER PRODUCTS SECTION ═══════════════════ */}
        {categories.length > 0 && (
          <section style={{ background: C.bgSub, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "72px 0" }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <RiLeafLine style={{ color: C.green, fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: C.green }}>
                    Son Kullanıcı Ürünleri
                  </span>
                </div>
                <h2 className="text-2xl font-black mb-2" style={{ color: C.text }}>Tüketici Ürün Portföyümüz</h2>
                <p className="text-sm max-w-xl" style={{ color: C.muted }}>
                  Kurumsal müşterilerimiz, son kullanıcılara yönelik AC şarj üniteleri ve aksesuarlarımızı
                  toplu satın alma ve bayilik programlarıyla tedarik edebilir.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, i) => (
                  <motion.div key={cat.id}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.07 * i }}>
                    <Link href={`/products/${cat.id}`}
                      className="block rounded-2xl p-5 h-full transition-all duration-200 group"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = C.cardHover;
                        (e.currentTarget as HTMLElement).style.borderColor = `${cat.accent}35`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = C.card;
                        (e.currentTarget as HTMLElement).style.borderColor = C.border;
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${cat.accent}15`, border: `1px solid ${cat.accent}25` }}>
                        <RiPlugLine style={{ fontSize: 17, color: cat.accent }} />
                      </div>
                      <p className="font-bold text-sm mb-1.5 group-hover:opacity-90 transition-opacity" style={{ color: C.text }}>
                        {cat.name}
                      </p>
                      <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>
                        {cat.tagline}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                        Ürünleri gör <HiChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.muted, textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; }}>
                  Tüm ürün kategorilerini gör
                  <RiArrowRightLine size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════ APPLICATION FORM ═══════════════════════ */}
        <section style={{ background: C.bg, padding: "72px 0 80px" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <RiShieldCheckLine style={{ color: C.amber, fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: C.amber }}>
                    Teknik Teklif Başvurusu
                  </span>
                </div>
                <h2 className="text-2xl font-black mb-2" style={{ color: C.text }}>Teklif Alın</h2>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  Üreticilere özel fiyatlandırma, teknik dokümanlar ve numune talepleri için formu doldurun.
                  Satış mühendisliğimiz 1 iş günü içinde size ulaşır.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === "ok" ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-12 text-center"
                    style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: `${C.green}18`, border: `1px solid ${C.green}30` }}>
                      <RiCheckLine style={{ fontSize: 32, color: C.green }} />
                    </div>
                    <h3 className="font-black text-lg mb-2" style={{ color: C.text }}>Başvurunuz Alındı</h3>
                    <p className="text-sm" style={{ color: C.muted }}>
                      Satış mühendisliğimiz en kısa sürede sizinle iletişime geçecek.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5 rounded-2xl p-6 sm:p-8"
                    style={{ background: C.card, border: `1px solid ${C.border}` }}>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Ad Soyad *</label>
                        <input required value={form.name} onChange={e => set("name", e.target.value)}
                          placeholder="Ali Yıldız" style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Şirket *</label>
                        <input required value={form.company} onChange={e => set("company", e.target.value)}
                          placeholder="ABC Teknoloji A.Ş." style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>E-Posta *</label>
                        <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                          placeholder="ali@sirket.com" style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Telefon</label>
                        <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                          placeholder="+90 5XX XXX XX XX" style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Sektör *</label>
                      <select required value={form.sector} onChange={e => set("sector", e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; }}>
                        <option value="" style={{ background: "#0d1119" }}>Sektörünüzü seçin</option>
                        {SECTORS.map(s => <option key={s} value={s} style={{ background: "#0d1119" }}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ ...labelStyle, marginBottom: 10 }}>İlgilenilen Ürün / Hizmet</label>
                      <div className="flex flex-wrap gap-2">
                        {PRODUCTS_INTEREST.map(p => {
                          const active = form.interests.includes(p);
                          return (
                            <button key={p} type="button" onClick={() => toggleInterest(p)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                              style={{
                                background: active ? `${C.amber}15` : "rgba(255,255,255,0.04)",
                                border: `1px solid ${active ? `${C.amber}45` : C.border}`,
                                color: active ? "#FCD34D" : C.muted,
                              }}>
                              {active && <RiCheckLine className="inline mr-1" style={{ fontSize: 11 }} />}
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Mesaj / Talep Detayı</label>
                      <textarea value={form.message} onChange={e => set("message", e.target.value)}
                        rows={4} placeholder="Proje kapsamı, adet, teknik gereksinimler..."
                        style={{ ...inputStyle, resize: "none" }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.amber; }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                    </div>

                    {status === "err" && (
                      <p className="text-xs" style={{ color: "#F87171" }}>
                        Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.
                      </p>
                    )}

                    <button type="submit" disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60"
                      style={{ background: `linear-gradient(135deg, ${C.amber}, #D97706)`, color: "#000", boxShadow: `0 6px 24px ${C.amber}30` }}>
                      {status === "sending" ? (
                        <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Gönderiliyor…</>
                      ) : (
                        <><RiSendPlaneLine size={16} />Başvuruyu Gönder</>
                      )}
                    </button>

                    <p className="text-xs text-center" style={{ color: C.faint }}>
                      Bu sayfa üretici ve kurumsal alıcılara yöneliktir. Son kullanıcı ürünleri için{" "}
                      <button type="button" onClick={() => router.push("/products")}
                        style={{ color: C.muted, textDecoration: "underline" }} className="hover:opacity-70">
                        ürünler sayfamızı
                      </button>{" "}ziyaret edin.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

      </div>
      <ContactBar />
    </div>
  );
}
