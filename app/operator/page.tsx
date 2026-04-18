"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import {
  RiWifiLine, RiFlashlightLine, RiCpuLine, RiSettings4Line,
  RiBarChartLine, RiShieldCheckLine, RiGlobalLine, RiPlugLine,
  RiCheckLine, RiSendPlaneLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";

const C = {
  bg:     "#080b12",
  bgSub:  "#0d1119",
  card:   "rgba(255,255,255,0.035)",
  border: "rgba(255,255,255,0.07)",
  purple: "#818CF8",
  blue:   "#3B82F6",
  text:   "#e8eaf0",
  muted:  "rgba(232,234,240,0.50)",
  faint:  "rgba(232,234,240,0.25)",
  vfaint: "rgba(232,234,240,0.10)",
};

const PRODUCTS = [
  {
    icon: RiFlashlightLine, color: "#F97316",
    name: "DC Hızlı Şarj Ünitesi",
    body: "7–360 kW güç aralığı. OCPP 2.0 uyumlu. CCS2, CHAdeMO ve GB/T konnektör desteği.",
  },
  {
    icon: RiCpuLine, color: C.blue,
    name: "Şarj Panosu & DLM",
    body: "4–24 çıkış noktası. Dinamik yük dengeleme ile enerji maliyetini minimize eder.",
  },
  {
    icon: RiSettings4Line, color: C.purple,
    name: "OCPP Kontrol Kartı (ECU)",
    body: "OCPP 1.6J / 2.0.1 · TLS 1.3 · OTA güncelleme. Ağa hazır, sıfır entegrasyon yükü.",
  },
  {
    icon: RiPlugLine, color: "#10B981",
    name: "DC Şarj Kablosu",
    body: "500A'e kadar profesyonel DC kablo. Aktif su soğutmalı model mevcut.",
  },
];

const CAPABILITIES = [
  { icon: RiWifiLine,      color: C.blue,   title: "OCPP 1.6 / 2.0.1",       body: "Tüm büyük yönetim platformlarıyla uyumlu açık protokol desteği." },
  { icon: RiBarChartLine,  color: C.purple,  title: "Dinamik Güç Yönetimi",   body: "Anlık tüketimi izleyerek şarj noktaları arasında yükü dengeler." },
  { icon: RiGlobalLine,    color: "#10B981", title: "Uzaktan İzleme & OTA",   body: "Bulut tabanlı firmware güncellemesi ve gerçek zamanlı arıza uyarısı." },
  { icon: RiShieldCheckLine, color: "#F59E0B", title: "CE & IEC Sertifikası", body: "Avrupa ihracat standartlarına uygun; sertifika süreçlerinde destek." },
];

const OCPP_FEATURES = [
  "Uzaktan başlat / durdur", "RFID kimlik doğrulama",
  "Gerçek zamanlı güç ölçümü", "Çoklu ödeme entegrasyonu",
  "Oturum geçmişi & faturalandırma", "Firmware OTA güncelleme",
  "Hata kodu raporlama", "Dinamik tarife desteği",
];

type FormState = { name: string; company: string; email: string; phone: string; network: string; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", network: "", message: "" };

export default function OperatorPage() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = `[OPERATÖR BAŞVURUSU]\n\nMevcut / Planlanan Ağ: ${form.network}\n\nMesaj:\n${form.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, topic: "operator", message }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${C.border}`,
    color: C.text,
    outline: "none",
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: "0.875rem",
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

      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(129,140,248,0.06) 0%, transparent 60%)",
        zIndex: 0,
      }} />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── Hero ── */}
        <section style={{
          background: `linear-gradient(180deg, #060912 0%, ${C.bgSub} 100%)`,
          borderBottom: `1px solid ${C.border}`,
          paddingTop: 120,
          paddingBottom: 64,
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(${C.vfaint} 1px, transparent 1px), linear-gradient(90deg, ${C.vfaint} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.3,
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[350px] pointer-events-none" style={{
            background: "radial-gradient(ellipse at top right, rgba(129,140,248,0.08) 0%, transparent 60%)",
          }} />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
            <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()} className="flex items-center gap-2 mb-10 group"
              style={{ color: C.faint, fontSize: "0.875rem" }}>
              <HiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Geri
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.purple }} />
                <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: C.purple }}>
                  Şarj Ağı Operatörleri
                </span>
              </div>

              <h1 className="font-black leading-tight mb-4" style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                background: `linear-gradient(135deg, ${C.text} 0%, rgba(232,234,240,0.65) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Şarj Ağınızı<br />
                <span style={{
                  background: `linear-gradient(90deg, ${C.purple}, #A5B4FC)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Bizimle Büyütün</span>
              </h1>

              <p className="leading-relaxed max-w-xl" style={{ color: C.muted, fontSize: "0.9375rem" }}>
                OCPP uyumlu DC hızlı şarj üniteleri, akıllı şarj panoları ve entegrasyon hazır kontrol kartlarıyla
                şarj ağı operatörlerine uçtan uca donanım çözümü sunuyoruz.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section style={{ background: C.bgSub, borderBottom: `1px solid ${C.border}`, padding: "56px 0" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: C.purple }}>Teknik Altyapı</p>
              <h2 className="text-xl font-black" style={{ color: C.text }}>Operatör Odaklı Özellikler</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CAPABILITIES.map((c, i) => (
                <motion.div key={c.title}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.07 * i }}
                  className="p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                    <c.icon style={{ fontSize: 18, color: c.color }} />
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: C.text }}>{c.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Products + OCPP ── */}
        <section style={{ background: C.bg, padding: "56px 0", borderBottom: `1px solid ${C.border}` }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Product list */}
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: C.purple }}>Ürün Portföyü</p>
                <h2 className="text-xl font-black mb-5" style={{ color: C.text }}>Operatörlere Özel Ürünler</h2>
                <div className="space-y-3">
                  {PRODUCTS.map((p, i) => (
                    <motion.div key={p.name}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.07 * i }}
                      className="flex items-start gap-4 p-4 rounded-xl"
                      style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                        <p.icon style={{ fontSize: 18, color: p.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5" style={{ color: C.text }}>{p.name}</p>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{p.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* OCPP features */}
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: C.blue }}>OCPP Özellik Listesi</p>
                <h2 className="text-xl font-black mb-5" style={{ color: C.text }}>Desteklenen Fonksiyonlar</h2>
                <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="grid grid-cols-2 gap-2">
                    {OCPP_FEATURES.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: `${C.blue}18`, border: `1px solid ${C.blue}30` }}>
                          <RiCheckLine style={{ fontSize: 10, color: C.blue }} />
                        </div>
                        <span className="text-xs" style={{ color: C.muted }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 text-xs" style={{ borderTop: `1px solid ${C.border}`, color: C.faint }}>
                    OCPP 1.6J ve 2.0.1 desteği · TLS 1.3 şifreleme · JSON & SOAP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Form ── */}
        <section style={{ background: C.bgSub, padding: "64px 0 80px" }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: C.purple }}>Teklif Alın</p>
              <h2 className="text-2xl font-black mb-2" style={{ color: C.text }}>Operatör Teklif Formu</h2>
              <p className="text-sm" style={{ color: C.muted }}>
                Ağ büyüklüğünüzü ve gereksinimlerinizi paylaşın; teknik ekibimiz size özel teklif hazırlasın.
              </p>
            </div>

            {status === "ok" ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: `${C.purple}18`, border: `1px solid ${C.purple}30` }}>
                  <RiCheckLine style={{ fontSize: 32, color: C.purple }} />
                </div>
                <h3 className="font-black text-lg mb-2" style={{ color: C.text }}>Talebiniz Alındı</h3>
                <p className="text-sm" style={{ color: C.muted }}>Teknik ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4"
                style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Ad Soyad *</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)}
                      placeholder="Ali Yıldız" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Şirket *</label>
                    <input required value={form.company} onChange={e => set("company", e.target.value)}
                      placeholder="XYZ Enerji A.Ş." style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>E-Posta *</label>
                    <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="ali@sirket.com" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Telefon</label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="+90 5XX XXX XX XX" style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Mevcut / Planlanan Şarj Ağı</label>
                  <input value={form.network} onChange={e => set("network", e.target.value)}
                    placeholder="örn. 50 noktalı halka açık DC ağ, AVM lokasyonları..."
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                </div>
                <div>
                  <label style={labelStyle}>Talep Detayı</label>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)}
                    rows={3} placeholder="Ürün gereksinimleri, adet, lokasyon tipi, entegrasyon beklentisi..."
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => { e.currentTarget.style.borderColor = C.purple; }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.border; }} />
                </div>

                {status === "err" && (
                  <p className="text-xs" style={{ color: "#F87171" }}>Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.</p>
                )}

                <button type="submit" disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all"
                  style={{ background: `linear-gradient(135deg, ${C.purple}, #6366F1)`, color: "#fff", boxShadow: `0 6px 24px ${C.purple}30` }}>
                  {status === "sending" ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Gönderiliyor…</>
                  ) : (
                    <><RiSendPlaneLine size={16} />Teklif Talebi Gönder</>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
      <ContactBar />
    </div>
  );
}
