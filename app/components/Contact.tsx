"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import E from "./E";
import { HiLocationMarker, HiPhone, HiMail, HiClock, HiCheckCircle } from "react-icons/hi";
import { RiLinkedinFill, RiInstagramLine, RiYoutubeFill, RiFacebookFill } from "react-icons/ri";
import { trackEvent, trackGoogleAdsConversion } from "./GoogleAnalytics";
import { trackMetaPixelEvent } from "./MetaPixel";
import { useUiStrings, type UiStringKey } from "../../lib/uiStrings";

const topicKeys: { value: string; key: UiStringKey }[] = [
  { value: "product-info",    key: "topic_product" },
  { value: "price-quote",     key: "topic_quote" },
  { value: "corporate-sales", key: "topic_corp" },
  { value: "export",          key: "topic_export" },
  { value: "technical",       key: "topic_tech" },
  { value: "installation",    key: "topic_install" },
  { value: "partnership",     key: "topic_partnership" },
  { value: "other",           key: "topic_other" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { contact, social, contactSection, sectionBgs, marketing } = useContent();
  const t = useUiStrings();
  const d = theme === "dark";
  const topics = topicKeys.map((tk) => ({ value: tk.value, label: t(tk.key) }));

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const BLUE      = "#3B82F6";
  const bg        = d ? "linear-gradient(155deg, #0f0f13 0%, #0d0d11 60%, #111116 100%)" : "linear-gradient(155deg, #f5f6fa 0%, #f2f3f7 60%, #f7f8fb 100%)";
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
    { icon: HiLocationMarker, label: t("contact_label_address"), value: contact.address,      sub: contact.addressSub },
    { icon: HiPhone,          label: t("contact_label_phone"),   value: contact.phone,        sub: `${contact.workingDays}, ${contact.workingHours}` },
    { icon: HiMail,           label: t("contact_label_email"),   value: contact.email,        sub: t("contact_email_sub") },
    { icon: HiClock,          label: t("contact_label_hours"),   value: contact.workingHours, sub: contact.workingDays },
  ];

  const socialLinks = [
    { icon: RiLinkedinFill,  label: "LinkedIn",  href: social.linkedin },
    { icon: RiInstagramLine, label: "Instagram", href: social.instagram },
    { icon: RiYoutubeFill,   label: "YouTube",   href: social.youtube },
    { icon: RiFacebookFill,  label: "Facebook",  href: social.facebook },
  ].filter((s) => s.href);

  // py-2.5 below sm: keeps more form fields visible when the mobile
  // keyboard is up; py-3 returns at tablet+ for a fuller touch target.
  const inputClass = `w-full rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none transition-colors`;
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
              className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
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
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2"
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
                  <h3 className="font-bold text-lg mb-2" style={{ color: textPrimary }}>{t("contact_received")}</h3>
                  <p className="text-sm" style={{ color: textMuted }}>
                    {t("contact_received_sub")}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs font-medium underline"
                    style={{ color: textFaint }}
                  >
                    {t("contact_send_another")}
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
                        setSendError(j.error ?? t("contact_err_generic"));
                      } else {
                        setSubmitted(true);
                        const topic = String(fd.get("topic") ?? "");
                        trackEvent("contact_form_submit", { topic });
                        // Mirror to Google Ads conversion + Meta Pixel
                        // Lead event so the same form fill counts in
                        // every ad surface the operator runs.
                        const adsId = marketing?.googleAdsId?.trim();
                        const convLabel = marketing?.googleAdsContactLabel?.trim();
                        if (adsId && convLabel) {
                          trackGoogleAdsConversion(`${adsId}/${convLabel}`);
                        }
                        trackMetaPixelEvent("Lead", { content_name: topic });
                      }
                    } catch {
                      setSendError(t("contact_err_network"));
                    } finally {
                      setSending(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-base mb-5" style={{ color: textPrimary }}>
                    {t("contact_form_title")}
                  </h3>

                  {/* Name + Company */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_name")} *</label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder={t("contact_name_ph")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_company")}</label>
                      <input
                        name="company"
                        type="text"
                        placeholder={t("contact_company_ph")}
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
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_label_email")} *</label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder={t("contact_email_ph")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_phone")}</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder={t("contact_phone_ph")}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocus)}
                        onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_subject")} *</label>
                    <div className="relative">
                      <select
                        required
                        name="topic"
                        className={`${inputClass} appearance-none cursor-pointer pr-8`}
                        style={{ ...inputStyle, color: textMuted }}
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-[#1a1a1a]">{t("contact_topic_select")}</option>
                        {topics.map((tp) => (
                          <option key={tp.value} value={tp.value} className="bg-[#1a1a1a]">
                            {tp.label}
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
                    <label className="text-xs mb-1.5 block" style={{ color: textFaint }}>{t("contact_message")} *</label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder={t("contact_message_ph")}
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
                    {sending ? t("contact_sending") : t("contact_send_short")}
                  </button>

                  <p className="text-xs text-center" style={{ color: textFaint }}>
                    {t("contact_kvkk")}
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
