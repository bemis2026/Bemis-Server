"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import {
  RiWifiLine, RiFlashlightLine, RiCpuLine, RiSettings4Line,
  RiBarChartLine, RiShieldCheckLine, RiGlobalLine, RiPlugLine,
  RiCheckLine, RiSendPlaneLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";
import { useEffect } from "react";

const PRODUCTS = [
  { icon: RiFlashlightLine, color: "#F97316", name: "DC Hızlı Şarj Ünitesi",      body: "7–360 kW güç aralığı. OCPP 2.0 uyumlu. CCS2, CHAdeMO ve GB/T konnektör desteği." },
  { icon: RiCpuLine,        color: "#3B82F6", name: "Şarj Panosu & DLM",          body: "4–24 çıkış noktası. Dinamik yük dengeleme ile enerji maliyetini minimize eder." },
  { icon: RiSettings4Line,  color: "#818CF8", name: "OCPP Kontrol Kartı (ECU)",   body: "OCPP 1.6J / 2.0.1 · TLS 1.3 · OTA güncelleme. Ağa hazır, sıfır entegrasyon yükü." },
  { icon: RiPlugLine,       color: "#10B981", name: "DC Şarj Kablosu",            body: "500A'e kadar profesyonel DC kablo. Aktif su soğutmalı model mevcut." },
];

const CAPABILITY_ICONS = [RiWifiLine, RiBarChartLine, RiGlobalLine, RiShieldCheckLine];
const CAPABILITY_COLORS = ["#3B82F6", "#818CF8", "#10B981", "#F59E0B"];

type FormState = { name: string; company: string; email: string; phone: string; network: string; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", network: "", message: "" };

type Capability = { title: string; body: string };
type OperatorContent = { heading1: string; heading2: string; description: string; capabilities: Capability[]; ocppFeatures: string[] };
const DEFAULT_OP: OperatorContent = {
  heading1: "Şarj Ağınızı", heading2: "Bizimle Büyütün",
  description: "OCPP uyumlu DC hızlı şarj üniteleri, akıllı şarj panoları ve entegrasyon hazır kontrol kartlarıyla şarj ağı operatörlerine uçtan uca donanım çözümü sunuyoruz.",
  capabilities: [
    { title: "OCPP 1.6 / 2.0.1",      body: "Tüm büyük yönetim platformlarıyla uyumlu açık protokol desteği." },
    { title: "Dinamik Güç Yönetimi",  body: "Anlık tüketimi izleyerek şarj noktaları arasında yükü dengeler." },
    { title: "Uzaktan İzleme & OTA",  body: "Bulut tabanlı firmware güncellemesi ve gerçek zamanlı arıza uyarısı." },
    { title: "CE & IEC Sertifikası",  body: "Avrupa ihracat standartlarına uygun; sertifika süreçlerinde destek." },
  ],
  ocppFeatures: [
    "Uzaktan başlat / durdur", "RFID kimlik doğrulama",
    "Gerçek zamanlı güç ölçümü", "Çoklu ödeme entegrasyonu",
    "Oturum geçmişi & faturalandırma", "Firmware OTA güncelleme",
    "Hata kodu raporlama", "Dinamik tarife desteği",
  ],
};

export default function OperatorPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [cms, setCms] = useState<OperatorContent>(DEFAULT_OP);

  useEffect(() => {
    fetch("/api/b2b").then(r => r.json()).then((data) => {
      if (data?.operator) setCms(data.operator);
    }).catch(() => {});
  }, []);

  const bg      = d ? "#0c0c0e" : "#f8f8fb";
  const bgSub   = d ? "#111114" : "#ffffff";
  const card    = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const inputBdr= d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const text    = d ? "#f0f0f4" : "#1a1a2e";
  const muted   = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow  = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const PURPLE  = "#818CF8";
  const BLUE    = "#3B82F6";

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = `[OPERATÖR BAŞVURUSU]\n\nMevcut / Planlanan Ağ: ${form.network}\n\nMesaj:\n${form.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, topic: "operator", message }),
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
              <RiWifiLine style={{ color: PURPLE, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: PURPLE }}>
                Şarj Ağı Operatörleri
              </span>
            </div>
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              {cms.heading1}<br />
              <span style={{ color: PURPLE }}>{cms.heading2}</span>
            </h1>
            <p className="leading-relaxed max-w-xl" style={{ color: muted, fontSize: "0.9375rem" }}>
              {cms.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: PURPLE }}>Teknik Altyapı</p>
            <h2 className="text-xl font-black" style={{ color: text }}>Operatör Odaklı Özellikler</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(cms.capabilities ?? DEFAULT_OP.capabilities).map((c, i) => {
              const Icon = CAPABILITY_ICONS[i % CAPABILITY_ICONS.length];
              const color = CAPABILITY_COLORS[i % CAPABILITY_COLORS.length];
              return (
                <motion.div key={c.title}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.07 * i }}
                  className="p-4 rounded-xl" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon style={{ fontSize: 16, color }} />
                  </div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: text }}>{c.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: muted }}>{c.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Products + OCPP ── */}
      <section style={{ background: bgSub, padding: "52px 0", borderBottom: `1px solid ${border}` }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Products */}
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: PURPLE }}>Ürün Portföyü</p>
              <h2 className="text-xl font-black mb-5" style={{ color: text }}>Operatörlere Özel Ürünler</h2>
              <div className="space-y-3">
                {PRODUCTS.map((p, i) => (
                  <motion.div key={p.name}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.07 * i }}
                    className="flex items-start gap-3.5 p-4 rounded-xl"
                    style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                      <p.icon style={{ fontSize: 16, color: p.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: text }}>{p.name}</p>
                      <p className="text-xs leading-relaxed" style={{ color: muted }}>{p.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* OCPP features */}
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: BLUE }}>OCPP Özellik Listesi</p>
              <h2 className="text-xl font-black mb-5" style={{ color: text }}>Desteklenen Fonksiyonlar</h2>
              <div className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                <div className="grid grid-cols-2 gap-2.5">
                  {(cms.ocppFeatures ?? DEFAULT_OP.ocppFeatures).map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30` }}>
                        <RiCheckLine style={{ fontSize: 10, color: BLUE }} />
                      </div>
                      <span className="text-xs" style={{ color: muted }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 text-xs" style={{ borderTop: `1px solid ${border}`, color: faint }}>
                  OCPP 1.6J ve 2.0.1 desteği · TLS 1.3 şifreleme · JSON & SOAP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section style={{ background: bg, padding: "56px 0 72px" }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: PURPLE }}>Teklif Alın</p>
            <h2 className="text-2xl font-black mb-2" style={{ color: text }}>Operatör Teklif Formu</h2>
            <p className="text-sm" style={{ color: muted }}>
              Ağ büyüklüğünüzü ve gereksinimlerinizi paylaşın; teknik ekibimiz size özel teklif hazırlasın.
            </p>
          </div>

          {status === "ok" ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${PURPLE}18`, border: `1px solid ${PURPLE}30` }}>
                <RiCheckLine style={{ fontSize: 28, color: PURPLE }} />
              </div>
              <h3 className="font-black text-base mb-2" style={{ color: text }}>Talebiniz Alındı</h3>
              <p className="text-sm" style={{ color: muted }}>Teknik ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Ad Soyad *</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ali Yıldız" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                <div>
                  <label style={labelStyle}>Şirket *</label>
                  <input required value={form.company} onChange={e => set("company", e.target.value)} placeholder="XYZ Enerji A.Ş." style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>E-Posta *</label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ali@sirket.com" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+90 5XX XXX XX XX" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mevcut / Planlanan Şarj Ağı</label>
                <input value={form.network} onChange={e => set("network", e.target.value)}
                  placeholder="örn. 50 noktalı halka açık DC ağ, AVM lokasyonları..." style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
              </div>
              <div>
                <label style={labelStyle}>Talep Detayı</label>
                <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3}
                  placeholder="Ürün gereksinimleri, adet, lokasyon tipi, entegrasyon beklentisi..."
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.currentTarget.style.borderColor = PURPLE; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
              </div>
              {status === "err" && <p className="text-xs text-red-400">Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.</p>}
              <button type="submit" disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all"
                style={{ background: PURPLE, color: "#fff", boxShadow: `0 6px 20px ${PURPLE}35` }}>
                {status === "sending"
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Gönderiliyor…</>
                  : <><RiSendPlaneLine size={16} />Teklif Talebi Gönder</>}
              </button>
            </form>
          )}
        </div>
      </section>
      <ContactBar />
    </div>
  );
}
