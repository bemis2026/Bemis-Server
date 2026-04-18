"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import {
  RiFlashlightLine, RiCpuLine, RiPlugLine, RiShieldCheckLine,
  RiCheckLine, RiSendPlaneLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";

const b2bProducts = [
  {
    id: "dc-charger", icon: RiFlashlightLine,
    name: "DC Hızlı Şarj Ünitesi", subtitle: "Ticari & Halka Açık DC İstasyon",
    specs: ["7 kW – 360 kW güç aralığı", "CCS2 · CHAdeMO · GB/T çıkış", "OCPP 2.0 · Dinamik güç yönetimi", "IP54 dış mekan kasası"],
    tag: "Geliştirme Aşamasında", accent: "#F97316",
  },
  {
    id: "charge-panel", icon: RiCpuLine,
    name: "Şarj Panosu & Dağıtım Ünitesi", subtitle: "Çok Noktalı Enerji Dağıtım Panosu",
    specs: ["4–24 çıkış noktası", "Dinamik yük dengeleme (DLM)", "Modbus / OCPP entegrasyonu", "IP65 paslanmaz çelik muhafaza"],
    tag: "Mevcut", accent: "#3B82F6",
  },
  {
    id: "dc-cable-b2b", icon: RiPlugLine,
    name: "DC Şarj Kablosu (CCS2)", subtitle: "İstasyon Üreticileri için Profesyonel Kablo",
    specs: ["50 kW – 350 kW · 500A maks.", "CCS2 / CHAdeMO / GB/T seçenekleri", "Aktif su soğutmalı model (500A)", "IEC 62893-4 · IEC 62196-3 · TÜV/CE"],
    tag: "Mevcut", accent: "#10B981",
  },
  {
    id: "ecu", icon: RiCpuLine,
    name: "Elektronik Kontrol Kartı (ECU)", subtitle: "OEM için Yerli Tasarım Kontrol Ünitesi",
    specs: ["ARM Cortex-M4 · 180 MHz", "OCPP 1.6J / 2.0.1 · TLS 1.3", "Wi-Fi · 4G · RFID · RS-485 · CAN", "OTA güncellemesi · %100 test"],
    tag: "OEM Mevcut", accent: "#818CF8",
  },
];

const tagColor: Record<string, string> = {
  "Mevcut": "#10B981",
  "OEM Mevcut": "#818CF8",
  "Geliştirme Aşamasında": "#F97316",
};

const SECTORS = [
  "EV Üreticisi (OEM)", "Şarj Ağı Operatörü", "Proje Müteahhidi / EPC",
  "Sistem Entegratörü", "Distribütör / Bayi", "Kamu / Belediye", "Diğer",
];

const PRODUCTS_INTEREST = [
  "DC Hızlı Şarj Ünitesi", "Şarj Panosu & Dağıtım", "DC Şarj Kablosu (CCS2)", "Elektronik Kontrol Kartı (ECU)",
];

type FormState = { name: string; company: string; email: string; phone: string; sector: string; interests: string[]; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", sector: "", interests: [], message: "" };

export default function B2BPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const d = theme === "dark";
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const bg         = d ? "#0c0c0e" : "#f8f8fb";
  const card       = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border     = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg    = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const inputBorder= d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const textPrimary= d ? "#f0f0f4" : "#1a1a2e";
  const textMuted  = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint  = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow     = d ? "none" : "0 1px 12px rgba(0,0,0,0.05)";
  const BLUE       = "#3B82F6";

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

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary };
  const labelStyle = { color: textFaint, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em" };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-20">

        <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
          onClick={() => router.back()} className="flex items-center gap-2 mb-10 group" style={{ color: textMuted }}>
          <HiArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm">Geri</span>
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <RiShieldCheckLine style={{ color: textFaint, fontSize: 16 }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: textFaint }}>OEM & Profesyonel Çözümler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: textPrimary }}>Üreticiler & Kurumsal Alıcılar için</h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: textMuted }}>
            Şarj panoları, DC hızlı şarj üniteleri, OEM elektronik kartlar ve DC şarj kabloları —
            EV altyapı çözümleri geliştiren üreticiler ve entegratörler için teknik ürün portföyümüz.
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {b2bProducts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}>
                  <p.icon style={{ fontSize: 20, color: p.accent }} />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
                  background: `${tagColor[p.tag] ?? "#888"}18`, color: tagColor[p.tag] ?? "#888",
                  border: `1px solid ${tagColor[p.tag] ?? "#888"}30`,
                }}>{p.tag}</span>
              </div>
              <h3 className="font-semibold text-sm mb-0.5" style={{ color: textPrimary }}>{p.name}</h3>
              <p className="text-xs mb-3" style={{ color: textFaint }}>{p.subtitle}</p>
              <ul className="space-y-1.5">
                {p.specs.map((s, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.accent }} />
                    <span className="text-xs" style={{ color: textMuted }}>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Application Form ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: textPrimary }}>Teknik Teklif Başvurusu</h2>
            <p className="text-sm" style={{ color: textMuted }}>
              Üreticilere özel fiyatlandırma, teknik dokümanlar ve numune talepleri için formu doldurun.
            </p>
          </div>

          {status === "ok" ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#10B98118", border: "1px solid #10B98130" }}>
                <RiCheckLine style={{ fontSize: 28, color: "#10B981" }} />
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: textPrimary }}>Başvurunuz Alındı</h3>
              <p className="text-sm" style={{ color: textMuted }}>
                Satış mühendisliğimiz en kısa sürede sizinle iletişime geçecek.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-5"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>

              {/* Name + Company */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Ad Soyad *</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Ali Yıldız" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Şirket *</label>
                  <input required value={form.company} onChange={e => set("company", e.target.value)}
                    placeholder="ABC Teknoloji A.Ş." className={inputClass} style={inputStyle} />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5" style={labelStyle}>E-Posta *</label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="ali@sirket.com" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block mb-1.5" style={labelStyle}>Telefon</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="+90 5XX XXX XX XX" className={inputClass} style={inputStyle} />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>Sektör *</label>
                <select required value={form.sector} onChange={e => set("sector", e.target.value)}
                  className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Sektörünüzü seçin</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Products of interest */}
              <div>
                <label className="block mb-2.5" style={labelStyle}>İlgilenilen Ürün / Hizmet</label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTS_INTEREST.map(p => {
                    const active = form.interests.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => toggleInterest(p)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                        style={{
                          background: active ? `${BLUE}18` : inputBg,
                          border: `1px solid ${active ? BLUE + "50" : inputBorder}`,
                          color: active ? (d ? "#93C5FD" : BLUE) : textMuted,
                        }}>
                        {active && <RiCheckLine className="inline mr-1" style={{ fontSize: 11 }} />}
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>Mesaj / Talep Detayı</label>
                <textarea value={form.message} onChange={e => set("message", e.target.value)}
                  rows={4} placeholder="Proje kapsamı, adet, teknik gereksinimler..."
                  className={inputClass} style={{ ...inputStyle, resize: "none" }} />
              </div>

              {status === "err" && (
                <p className="text-xs text-red-400">Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.</p>
              )}

              <button type="submit" disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60"
                style={{ background: BLUE, color: "#fff" }}>
                {status === "sending" ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Gönderiliyor…</>
                ) : (
                  <><RiSendPlaneLine size={16} />Başvuruyu Gönder</>
                )}
              </button>

              <p className="text-xs text-center" style={{ color: textFaint }}>
                Bu sayfa üretici ve kurumsal alıcılara yöneliktir. Son kullanıcı ürünleri için{" "}
                <button type="button" onClick={() => router.push("/#products")} className="underline hover:opacity-70">
                  ana ürün sayfamızı
                </button>{" "}ziyaret edin.
              </p>
            </form>
          )}
        </motion.div>
      </div>
      <ContactBar />
    </div>
  );
}
