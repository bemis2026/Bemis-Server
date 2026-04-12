"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import E from "./E";
import { HiLocationMarker, HiPhone, HiMail, HiClock, HiCheckCircle } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine } from "react-icons/ri";

const topics = [
  { value: "product-info",    label: "Ürün Bilgisi" },
  { value: "price-quote",     label: "Fiyat Teklifi" },
  { value: "corporate-sales", label: "Kurumsal Satış" },
  { value: "export",          label: "İhracat / Export" },
  { value: "technical",       label: "Teknik Destek" },
  { value: "installation",    label: "Kurulum Yardımı" },
  { value: "partnership",     label: "İş Ortaklığı" },
  { value: "other",           label: "Diğer" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { contact, social, contactSection, sectionBgs } = useContent();
  const d = theme === "dark";

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const BLUE      = "#3B82F6";
  const bg        = d ? "linear-gradient(180deg, #1a1a1a 0%, #141414 100%)" : "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)";
  const card      = d ? "rgba(255,255,255,0.035)" : "#ffffff";
  const border    = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const input     = d ? "rgba(255,255,255,0.04)" : "#f4f4f7";
  const inputBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const inputFocus = d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const iconBg    = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const iconBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const shadow    = d ? "none" : "0 2px 20px rgba(0,0,0,0.06)";

  const contactItems = [
    { icon: HiLocationMarker, label: "Adres",            value: contact.address,        sub: contact.addressSub },
    { icon: HiPhone,          label: "Telefon",          value: contact.phone,          sub: `${contact.workingDays}, ${contact.workingHours}` },
    { icon: HiMail,           label: "E-Posta",          value: contact.email,          sub: "Genel bilgi ve sorular" },
    { icon: HiClock,          label: "Çalışma Saatleri", value: contact.workingHours,   sub: contact.workingDays },
  ];

  const socialLinks = [
    { icon: RiLinkedinFill,  label: "LinkedIn",  href: social.linkedin },
    { icon: RiInstagramLine, label: "Instagram", href: social.instagram },
  ].filter((s) => s.href);

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`;
  const inputStyle = {
    background: input,
    border: `1px solid ${inputBorder}`,
    color: textPrimary,
    // focus ring via JS
  };

  const sectionBgUrl = sectionBgs?.["contact"] ?? "";

  return (
    <section id="contact" style={{ background: bg }} className="relative py-8 lg:py-12 overflow-hidden">
      {sectionBgUrl && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${sectionBgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          <div className="absolute inset-0 z-0" style={{ background: d ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.72)" }} />
        </>
      )}
      <div ref={ref} className="relative z-[1] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left ── */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-block text-[10px] font-bold tracking-[0.20em] uppercase px-3 py-1.5 rounded-full mb-4"
              style={{
                background: d ? `${BLUE}18` : `${BLUE}10`,
                border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}25`,
                color: d ? "#93C5FD" : BLUE,
              }}
            >
              <E field="contactSection.sectionLabel" tag="span">{contactSection.sectionLabel}</E>
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2"
              style={{ color: textPrimary }}
            >
              <E field="contactSection.heading">{contactSection.heading}</E>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-px w-24 origin-left mb-4"
              style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="text-sm leading-relaxed mb-7"
              style={{ color: textMuted }}
            >
              <E field="contactSection.subheading" tag="span">{contactSection.subheading}</E>
            </motion.p>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="rounded-2xl p-4"
                  style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                  >
                    <item.icon className="text-sm" style={{ color: d ? "#93C5FD" : BLUE }} />
                  </div>
                  <p className="text-xs mb-0.5" style={{ color: textFaint }}>{item.label}</p>
                  <p className="font-semibold text-sm" style={{ color: textPrimary }}>{item.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: textFaint }}>{item.sub}</p>
                </motion.div>
              ))}
            </div>

          </div>

          {/* ── Right — Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
            >
              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                  >
                    <HiCheckCircle style={{ color: "#10B981", fontSize: 28 }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: textPrimary }}>Mesajınız Alındı!</h3>
                  <p className="text-sm" style={{ color: textMuted }}>
                    En kısa sürede size geri dönüş yapacağız.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs font-medium underline"
                    style={{ color: textFaint }}
                  >
                    Yeni mesaj gönder
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSendError(null);
                    setSending(true);
                    const fd = new FormData(e.currentTarget);
                    try {
                      const res = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name:    fd.get("name"),
                          company: fd.get("company"),
                          email:   fd.get("email"),
                          phone:   fd.get("phone"),
                          topic:   fd.get("topic"),
                          message: fd.get("message"),
                        }),
                      });
                      if (!res.ok) {
                        const j = await res.json().catch(() => ({}));
                        setSendError(j.error ?? "Bir hata oluştu, lütfen tekrar deneyin.");
                      } else {
                        setSubmitted(true);
                      }
                    } catch {
                      setSendError("Bağlantı hatası. Lütfen tekrar deneyin.");
                    } finally {
                      setSending(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-base mb-5" style={{ color: textPrimary }}>
                    Mesaj Gönderin
                  </h3>

                  {/* Name + Company */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>Ad Soyad *</label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Adınız"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>Şirket</label>
                      <input
                        name="company"
                        type="text"
                        placeholder="Şirket adı"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>E-Posta *</label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="email@sirket.com"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>Telefon</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+90 5XX XXX XX XX"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>Konu *</label>
                    <div className="relative">
                      <select
                        required
                        name="topic"
                        className={`${inputClass} appearance-none cursor-pointer pr-8`}
                        style={{ ...inputStyle, color: textMuted }}
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-[#1a1a1a]">Konu seçin</option>
                        {topics.map((t) => (
                          <option key={t.value} value={t.value} className="bg-[#1a1a1a]">
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                        style={{ color: textFaint }}
                      >
                        ▾
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>Mesajınız *</label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Mesajınızı buraya yazın..."
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                      onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                    />
                  </div>

                  {sendError && (
                    <p className="text-xs text-center rounded-xl px-4 py-2.5" style={{ background: "rgba(239,68,68,0.10)", color: "#F87171", border: "1px solid rgba(239,68,68,0.20)" }}>
                      {sendError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60"
                    style={{ background: textPrimary, color: d ? "#0c0c0e" : "#ffffff" }}
                  >
                    {sending ? "Gönderiliyor…" : "Mesaj Gönder"}
                  </button>

                  <p className="text-xs text-center" style={{ color: textFaint }}>
                    Verileriniz KVKK ve gizlilik politikamız kapsamında korunmaktadır.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
