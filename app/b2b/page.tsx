"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import {
  RiFlashlightLine, RiCpuLine, RiPlugLine, RiShieldCheckLine,
  RiCheckLine, RiSendPlaneLine, RiBuilding2Line, RiSettings4Line,
  RiWifiLine, RiToolsLine, RiGlobalLine, RiArrowRightLine,
  RiLeafLine, RiLightbulbLine, RiBarChartLine, RiCustomerService2Line,
} from "react-icons/ri";
import { HiArrowLeft, HiChevronRight } from "react-icons/hi";

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
  { icon: RiToolsLine,             color: "#F59E0B", title: "Teknik Destek",       body: "Proje tasarımından devreye almaya kadar mühendislik desteği." },
  { icon: RiBarChartLine,          color: "#3B82F6", title: "Özel Fiyatlandırma", body: "Hacme göre ölçeklenen rekabetçi OEM ve toplu satış fiyatları." },
  { icon: RiWifiLine,              color: "#10B981", title: "OCPP Entegrasyonu",  body: "OCPP 1.6 / 2.0.1 uyumlu donanım ve yazılım çözümleri." },
  { icon: RiGlobalLine,            color: "#818CF8", title: "Sertifikasyon",      body: "CE, TÜV, IEC sertifikalı ürünler; Avrupa ihracatına hazır portföy." },
  { icon: RiLightbulbLine,         color: "#F97316", title: "Özel Geliştirme",    body: "Tasarıma özel (custom) elektronik kart ve yazılım projeleri." },
  { icon: RiCustomerService2Line,  color: "#EC4899", title: "Satış Sonrası",      body: "Garanti, yedek parça ve saha servis anlaşmaları." },
];

const SECTORS = ["EV Üreticisi (OEM)", "Şarj Ağı Operatörü", "Proje Müteahhidi / EPC", "Sistem Entegratörü", "Distribütör / Bayi", "Kamu / Belediye", "Diğer"];
const PRODUCTS_INTEREST = ["DC Hızlı Şarj Ünitesi", "Şarj Panosu & Dağıtım", "DC Şarj Kablosu (CCS2)", "Elektronik Kontrol Kartı (ECU)"];

type FormState = { name: string; company: string; email: string; phone: string; sector: string; interests: string[]; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", sector: "", interests: [], message: "" };
type Category = { id: string; name: string; tagline: string; accent: string };

export default function B2BPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [b2bData, setB2bData] = useState<B2BData>(DEFAULT_B2B);

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
    fetch("/api/products").then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    fetch("/api/b2b").then(r => r.json()).then((data: B2BData) => {
      if (data?.solutions) setB2bData(data);
    }).catch(() => {});
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
      <section style={{ background: bgSub, borderBottom: `1px solid ${border}`, paddingTop: 112, paddingBottom: 56 }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} className="flex items-center gap-2 mb-10 group"
            style={{ color: faint, fontSize: "0.875rem" }}>
            <HiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Geri
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiShieldCheckLine style={{ color: AMBER, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: AMBER }}>
                {b2bData.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {b2bData.hero.heading1}<br />
              <span style={{ color: AMBER }}>{b2bData.hero.heading2}</span>
            </h1>
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

      {/* ── Advantages ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {advantages.map((a, i) => (
              <motion.div key={a.title}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="flex items-start gap-3.5 p-4 rounded-xl"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                  <a.icon style={{ fontSize: 16, color: a.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: text }}>{a.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: muted }}>{a.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OEM Products ── */}
      {b2bData.solutions.length > 0 && (
        <section style={{ background: bgSub, borderBottom: `1px solid ${border}`, padding: "56px 0" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <RiBuilding2Line style={{ color: AMBER, fontSize: 14 }} />
                <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: AMBER }}>Ürün Portföyü</span>
              </div>
              <h2 className="text-xl font-black" style={{ color: text }}>OEM & Kurumsal Teknik Ürünler</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {b2bData.solutions.map((p, i) => {
                const Icon = ICON_MAP[p.id] ?? RiPlugLine;
                return (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.07 * i }}
                    className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.accentColor}15`, border: `1px solid ${p.accentColor}25` }}>
                        <Icon style={{ fontSize: 20, color: p.accentColor }} />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${p.tagColor}15`, color: p.tagColor, border: `1px solid ${p.tagColor}28` }}>
                        {p.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-0.5" style={{ color: text }}>{p.name}</h3>
                    <p className="text-xs mb-2" style={{ color: faint }}>{p.subtitle}</p>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{p.detail}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {p.specs.map((s, j) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.accentColor }} />
                          <span className="text-[11px]" style={{ color: muted }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Consumer products ── */}
      {categories.length > 0 && (
        <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "56px 0" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <RiLeafLine style={{ color: "#10B981", fontSize: 14 }} />
                <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "#10B981" }}>Son Kullanıcı Ürünleri</span>
              </div>
              <h2 className="text-xl font-black mb-1" style={{ color: text }}>Tüketici Ürün Portföyümüz</h2>
              <p className="text-sm" style={{ color: muted }}>Bayilik ve toplu tedarik programlarıyla kurumsal alıcılara sunulan AC şarj kategorileri.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat, i) => (
                <motion.div key={cat.id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.07 * i }}>
                  <Link href={`/products/${cat.id}`}
                    className="group block rounded-2xl p-4 h-full transition-all duration-200"
                    style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, textDecoration: "none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.accent}40`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${cat.accent}15`, border: `1px solid ${cat.accent}25` }}>
                      <RiPlugLine style={{ fontSize: 15, color: cat.accent }} />
                    </div>
                    <p className="font-bold text-sm mb-1" style={{ color: text }}>{cat.name}</p>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{cat.tagline}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                      Gör <HiChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: card, border: `1px solid ${border}`, color: muted, textDecoration: "none" }}>
                Tüm kategorileri gör <RiArrowRightLine size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Form ── */}
      <section style={{ background: bgSub, padding: "56px 0 72px" }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <RiShieldCheckLine style={{ color: AMBER, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: AMBER }}>Teknik Teklif Başvurusu</span>
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: text }}>Teklif Alın</h2>
            <p className="text-sm" style={{ color: muted }}>
              Üreticilere özel fiyatlandırma, teknik dokümanlar ve numune talepleri için formu doldurun.
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
                <h3 className="font-black text-base mb-2" style={{ color: text }}>Başvurunuz Alındı</h3>
                <p className="text-sm" style={{ color: muted }}>Satış mühendisliğimiz en kısa sürede sizinle iletişime geçecek.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Ad Soyad *</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ali Yıldız" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Şirket *</label>
                    <input required value={form.company} onChange={e => set("company", e.target.value)} placeholder="ABC Teknoloji A.Ş." style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>E-Posta *</label>
                    <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ali@sirket.com" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Telefon</label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+90 5XX XXX XX XX" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Sektör *</label>
                  <select required value={form.sector} onChange={e => set("sector", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }}>
                    <option value="">Sektörünüzü seçin</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
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
                          style={{ background: active ? `${BLUE}15` : inputBg, border: `1px solid ${active ? `${BLUE}50` : inputBdr}`, color: active ? (d ? "#93C5FD" : BLUE) : muted }}>
                          {active && <RiCheckLine className="inline mr-1" style={{ fontSize: 11 }} />}{p}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Mesaj / Talep Detayı</label>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3}
                    placeholder="Proje kapsamı, adet, teknik gereksinimler..." style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => { e.currentTarget.style.borderColor = AMBER; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                {status === "err" && <p className="text-xs text-red-400">Gönderim sırasında hata oluştu.</p>}
                <button type="submit" disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all"
                  style={{ background: BLUE, color: "#fff", boxShadow: `0 6px 20px ${BLUE}35` }}>
                  {status === "sending"
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Gönderiliyor…</>
                    : <><RiSendPlaneLine size={16} />Başvuruyu Gönder</>}
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
