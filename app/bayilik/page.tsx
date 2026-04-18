"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import {
  RiShieldCheckLine, RiMapPinLine, RiHandCoinLine, RiCustomerService2Line,
  RiCheckLine, RiSendPlaneLine, RiStoreLine, RiArrowRightLine,
} from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi";

const BENEFITS = [
  { icon: RiHandCoinLine,         color: "#10B981", title: "Rekabetçi Bayi Fiyatları",  body: "Hacme göre kademeli iskonto yapısı; küçük başlayıp büyüyebilirsiniz." },
  { icon: RiShieldCheckLine,      color: "#818CF8",  title: "Stok & Tedarik Güvencesi",  body: "Öncelikli sipariş kuyruğu ve garantili teslimat takvimi." },
  { icon: RiCustomerService2Line, color: "#F59E0B",  title: "Teknik Destek",              body: "Kurulum, arıza ve müşteri sorularında doğrudan teknik hat." },
  { icon: RiMapPinLine,           color: "#3B82F6",  title: "Bölge Koruması",             body: "Anlaşmalı bayilere bölgesel münhasırlık imkânı." },
  { icon: RiStoreLine,            color: "#F97316",  title: "Pazarlama Desteği",          body: "Ürün görselleri, kataloglar, demo ürün ve showroom materyalleri." },
  { icon: RiArrowRightLine,       color: "#EC4899",  title: "Hızlı Başlangıç",           body: "Minimum stok yükümlülüğüyle bayiliğe başlayın, büyüdükçe artırın." },
];

const CRITERIA = [
  "Elektrik, enerji veya otomotiv sektöründe faaliyet",
  "Yetkili satış & servis kapasitesi",
  "Bölgesel müşteri portföyü veya bayi ağı",
  "Temel teknik kurulum bilgisi (veya ekip)",
];

type FormState = { name: string; company: string; email: string; phone: string; city: string; message: string };
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", city: "", message: "" };

export default function BayilikPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

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
  const GREEN   = "#10B981";

  const set = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = `[BAYİLİK BAŞVURUSU]\n\nŞehir: ${form.city}\n\nMesaj:\n${form.message}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, topic: "dealership", message }),
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
              <RiStoreLine style={{ color: GREEN, fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: GREEN }}>Bayi Ağı</span>
            </div>
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: text }}>
              Bemis E-V Charge<br />
              <span style={{ color: GREEN }}>Bayisi Olun</span>
            </h1>
            <p className="leading-relaxed max-w-xl" style={{ color: muted, fontSize: "0.9375rem" }}>
              Türkiye genelinde büyüyen bayi ağımıza katılın; EV şarj altyapısı pazarındaki hızlı
              büyümeden birlikte yararlanın. Rekabetçi fiyatlar, teknik destek ve bölge koruması.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>Bayi Avantajları</p>
            <h2 className="text-xl font-black" style={{ color: text }}>Neden Bemis Bayisi Olunur?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className="flex items-start gap-3.5 p-4 rounded-xl"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${b.color}15`, border: `1px solid ${b.color}25` }}>
                  <b.icon style={{ fontSize: 16, color: b.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: text }}>{b.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: muted }}>{b.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Criteria + Info ── */}
      <section style={{ background: bgSub, padding: "52px 0", borderBottom: `1px solid ${border}` }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>Başvuru Koşulları</p>
              <h2 className="text-xl font-black mb-4" style={{ color: text }}>Aranan Kriterler</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: muted }}>
                Elektrik, enerji veya otomotiv sektöründe faaliyet gösteren, bölgesine değer katmak
                isteyen her kuruma kapımız açık.
              </p>
              <ul className="space-y-3">
                {CRITERIA.map(c => (
                  <li key={c} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
                      <RiCheckLine style={{ fontSize: 11, color: GREEN }} />
                    </div>
                    <span className="text-sm" style={{ color: muted }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-4" style={{ color: faint }}>Hızlı Bilgi</p>
              <div className="space-y-3">
                {[
                  { label: "Minimum Stok Yükümlülüğü", value: "Esnek — büyüklüğünüze göre" },
                  { label: "Bayi Sözleşme Süresi", value: "1 yıl (yenilenebilir)" },
                  { label: "Teknik Eğitim", value: "Ücretsiz — Bursa'da veya online" },
                  { label: "Başvuru Yanıt Süresi", value: "5 iş günü içinde" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between gap-4 pb-3" style={{ borderBottom: `1px solid ${border}` }}>
                    <span className="text-xs" style={{ color: faint }}>{row.label}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: text }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section style={{ background: bg, padding: "56px 0 72px" }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GREEN }}>Başvuru Formu</p>
            <h2 className="text-2xl font-black mb-2" style={{ color: text }}>Bayilik Başvurusu</h2>
            <p className="text-sm" style={{ color: muted }}>Formu doldurun, satış ekibimiz 5 iş günü içinde sizinle iletişime geçsin.</p>
          </div>
          {status === "ok" ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}>
                <RiCheckLine style={{ fontSize: 28, color: GREEN }} />
              </div>
              <h3 className="font-black text-base mb-2" style={{ color: text }}>Başvurunuz Alındı</h3>
              <p className="text-sm" style={{ color: muted }}>Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Ad Soyad *</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ali Yıldız" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                <div>
                  <label style={labelStyle}>Şirket *</label>
                  <input required value={form.company} onChange={e => set("company", e.target.value)} placeholder="Yıldız Elektrik Ltd." style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>E-Posta *</label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ali@sirket.com" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+90 5XX XXX XX XX" style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bulunduğunuz Şehir</label>
                <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="İstanbul" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
              </div>
              <div>
                <label style={labelStyle}>Mesaj / Ek Bilgi</label>
                <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3}
                  placeholder="Sektörünüz, mevcut müşteri tabanınız, beklentileriniz..." style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.currentTarget.style.borderColor = GREEN; }} onBlur={e => { e.currentTarget.style.borderColor = inputBdr; }} />
              </div>
              {status === "err" && <p className="text-xs text-red-400">Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.</p>}
              <button type="submit" disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all"
                style={{ background: GREEN, color: "#fff", boxShadow: `0 6px 20px ${GREEN}35` }}>
                {status === "sending"
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Gönderiliyor…</>
                  : <><RiSendPlaneLine size={16} />Başvuruyu Gönder</>}
              </button>
            </form>
          )}
        </div>
      </section>
      <ContactBar />
    </div>
  );
}
