"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiX, HiCheckCircle } from "react-icons/hi";
import { RiBuilding4Line, RiGlobalLine } from "react-icons/ri";
import { useDealerApplyOverlay } from "../context/DealerApplyOverlayContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { trackEvent, trackGoogleAdsConversion } from "./GoogleAnalytics";
import { trackMetaPixelEvent } from "./MetaPixel";
import { useFocusTrap } from "@/lib/useFocusTrap";

type FormState = {
  name: string;
  company: string;
  location: string;
  phone: string;
  email: string;
  message: string;
};

const EMPTY: FormState = { name: "", company: "", location: "", phone: "", email: "", message: "" };

const STRINGS = {
  tr: {
    titleTr: "Bayi Başvurusu",
    titleIntl: "Distribütör Başvurusu",
    subTr: "Türkiye'de yetkili bayi olmak için kısa bir başvuru formu doldurun. En kısa sürede dönüş yapacağız.",
    subIntl: "Yurtdışı distribütörlük için kısa bir başvuru formu doldurun. Ekibimiz en kısa sürede iletişime geçecek.",
    name: "Ad Soyad",
    company: "Şirket / Bayi Adı",
    locationTr: "Şehir / Bölge",
    locationIntl: "Ülke",
    phone: "Telefon",
    email: "E-Posta",
    message: "Faaliyet alanı ve kısa notunuz",
    messagePh: "Hangi sektördesiniz, kapsam, hedef bölge…",
    submit: "Başvuruyu Gönder",
    sending: "Gönderiliyor…",
    successTitle: "Başvurunuz alındı",
    successBody: "Ekibimiz başvurunuzu en kısa sürede inceleyip sizinle iletişime geçecek.",
    close: "Kapat",
    required: "Zorunlu alanları doldurun",
    error: "Gönderim başarısız oldu. Lütfen tekrar deneyin.",
  },
  en: {
    titleTr: "Dealer Application",
    titleIntl: "Distributor Application",
    subTr: "Apply to become an authorised dealer in Türkiye. We'll get back to you shortly.",
    subIntl: "Apply to become an international distributor. Our team will contact you shortly.",
    name: "Full Name",
    company: "Company / Dealer Name",
    locationTr: "City / Region",
    locationIntl: "Country",
    phone: "Phone",
    email: "Email",
    message: "Your field of activity & a short note",
    messagePh: "Your sector, scope, target region…",
    submit: "Send Application",
    sending: "Sending…",
    successTitle: "Application received",
    successBody: "We've received your application and will get in touch shortly.",
    close: "Close",
    required: "Please fill in the required fields",
    error: "Submission failed. Please try again.",
  },
} as const;

export default function DealerApplyOverlay() {
  const { open, mode, closeDealerApply } = useDealerApplyOverlay();
  const panelRef = useFocusTrap<HTMLDivElement>(open);
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { marketing } = useContent();
  const d = theme === "dark";
  const t = STRINGS[lang];

  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  // Bot koruması: form render anı (zaman-tuzağı) + gizli honeypot input ref'i.
  const startedAtRef = useRef(Date.now());
  const hpRef = useRef<HTMLInputElement>(null);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDealerApply(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeDealerApply]);

  // Reset form whenever the overlay re-opens — so a returning user
  // starts fresh instead of seeing a stale success/error state.
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setStatus("idle");
      setErrMsg("");
    }
  }, [open]);

  const accent = mode === "tr" ? "#10B981" : "#3B82F6";
  const title = mode === "tr" ? t.titleTr : t.titleIntl;
  const subtitle = mode === "tr" ? t.subTr : t.subIntl;
  const locationLabel = mode === "tr" ? t.locationTr : t.locationIntl;
  const Icon = mode === "tr" ? RiBuilding4Line : RiGlobalLine;

  const surface = d ? "#0d0e12" : "#ffffff";
  const text    = d ? "#f0f0f4" : "#1a1a2e";
  const muted   = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,46,0.55)";
  const inputBg = d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const inputBorder = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.location.trim()) {
      setStatus("err"); setErrMsg(t.required);
      return;
    }
    setStatus("sending"); setErrMsg("");
    try {
      const messageBody = [
        `Başvuru Tipi: ${mode === "tr" ? "Türkiye Bayilik" : "Yurtdışı Distribütörlük"}`,
        `${locationLabel}: ${form.location}`,
        "",
        form.message || "(ek not yok)",
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          topic: mode === "tr" ? "dealer-apply" : "export",
          message: messageBody,
          website: hpRef.current?.value ?? "", // honeypot (gizli)
          elapsed: Date.now() - startedAtRef.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setErrMsg((data?.error as string) || t.error);
        return;
      }
      setStatus("ok");
      const topic = mode === "tr" ? "dealer-apply" : "export";
      trackEvent("dealer_apply_submit", { mode, topic });
      const adsId = marketing?.googleAdsId?.trim();
      const convLabel = marketing?.googleAdsContactLabel?.trim();
      if (adsId && convLabel) {
        trackGoogleAdsConversion(`${adsId}/${convLabel}`);
      }
      trackMetaPixelEvent("Lead", { content_name: topic });
    } catch {
      setStatus("err"); setErrMsg(t.error);
    }
  };

  const inputCls = "w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none";
  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: text,
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeDealerApply}
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center"
          style={{
            background: d ? "rgba(4,6,10,0.75)" : "rgba(20,22,32,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl mx-3 sm:mx-6 my-3 sm:my-6 rounded-2xl overflow-hidden"
            style={{
              maxHeight: "calc(100vh - 24px)",
              background: surface,
              border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              boxShadow: d ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.18)",
            }}
          >
            <button
              onClick={closeDealerApply}
              aria-label={t.close}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: d ? "rgba(20,22,28,0.85)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                color: text,
                backdropFilter: "blur(8px)",
              }}
            >
              <HiX size={16} />
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 24px)" }}>
              <div className="px-6 sm:px-8 pt-7 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
                  >
                    <Icon style={{ fontSize: 22, color: accent }} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black leading-tight" style={{ color: text }}>{title}</h2>
                    <p className="text-xs sm:text-sm" style={{ color: muted }}>{subtitle}</p>
                  </div>
                </div>

                {status === "ok" ? (
                  <div role="status" aria-live="polite" className="text-center py-8">
                    <div
                      className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
                    >
                      <HiCheckCircle size={36} style={{ color: accent }} />
                    </div>
                    <p className="font-bold text-lg mb-1" style={{ color: text }}>{t.successTitle}</p>
                    <p className="text-sm" style={{ color: muted }}>{t.successBody}</p>
                    <button
                      onClick={closeDealerApply}
                      className="mt-6 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background: accent }}
                    >
                      {t.close}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 mt-2">
                    {/* Honeypot — gizli; sadece bot doldurur → sunucu sessizce reddeder */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                      <label>Web Siteniz (boş bırakın)
                        <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="da-name" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                          {t.name} *
                        </label>
                        <input
                          id="da-name"
                          type="text" required value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputCls} style={inputStyle}
                        />
                      </div>
                      <div>
                        <label htmlFor="da-company" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                          {t.company}
                        </label>
                        <input
                          id="da-company"
                          type="text" value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className={inputCls} style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="da-location" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                          {locationLabel} *
                        </label>
                        <input
                          id="da-location"
                          type="text" required value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          className={inputCls} style={inputStyle}
                        />
                      </div>
                      <div>
                        <label htmlFor="da-phone" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                          {t.phone}
                        </label>
                        <input
                          id="da-phone"
                          type="tel" value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputCls} style={inputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="da-email" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                        {t.email} *
                      </label>
                      <input
                        id="da-email"
                        type="email" required value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls} style={inputStyle}
                      />
                    </div>

                    <div>
                      <label htmlFor="da-message" className="block text-[11px] font-bold tracking-wide uppercase mb-1.5" style={{ color: muted }}>
                        {t.message}
                      </label>
                      <textarea
                        id="da-message"
                        rows={3} value={form.message} placeholder={t.messagePh}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={inputCls} style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                      />
                    </div>

                    {status === "err" && errMsg && (
                      <p role="alert" className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "#EF444412", color: "#EF4444", border: "1px solid #EF444433" }}>
                        {errMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full font-bold py-3 rounded-xl text-sm text-white transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
                      style={{ background: accent, boxShadow: `0 6px 20px ${accent}40` }}
                    >
                      {status === "sending" ? t.sending : t.submit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
