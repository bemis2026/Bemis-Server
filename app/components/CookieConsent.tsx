"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { setAnalyticsConsent } from "./GoogleAnalytics";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";

const STORAGE_KEY = "bemis-cookie-consent";

type Choice = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // 6 dil: tr/en satır içi, de/es/ar/ru/nl ui.json (anahtar = İngilizce metin). TR metni birebir eski hali.
  const { lang } = useLanguage();
  const t = (tr: string, en: string) => pickText(lang, tr, en);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "rejected") {
        setChoice(stored);
      }
    } catch {}
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setAnalyticsConsent(value === "accepted");
    // Broadcast to MetaPixel (and any future marketing pixel) so they
    // can flip from "revoked" to "granted" without a reload.
    try {
      window.dispatchEvent(new CustomEvent("bemis:marketing-consent", { detail: value === "accepted" }));
    } catch {}
    setChoice(value);
  };

  // Don't render until we've checked localStorage to avoid flicker on
  // returning visitors who already decided.
  if (!mounted || choice !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md z-[180]"
      >
        <div className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "rgba(15,15,18,0.96)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
          }}>
          <div className="p-5 space-y-3">
            <p className="text-sm font-bold text-white">{t("Çerezler hakkında", "About cookies")}</p>
            <p className="text-xs leading-relaxed text-white/55">
              {t("Sitemizde sizin deneyiminizi geliştirmek ve trafiği analiz etmek için çerezler kullanıyoruz. Sadece gerekli çerezleri seçerseniz analytics ve istatistik takibi yapılmaz — KVKK kapsamındaki haklarınız saklıdır.", "We use cookies to improve your experience and analyse our traffic. If you choose necessary cookies only, no analytics or statistics tracking takes place — your data protection rights (KVKK/GDPR) are reserved.")}
            </p>

            <button
              onClick={() => setDetailsOpen(o => !o)}
              className="text-[11px] font-semibold text-blue-300 hover:text-blue-200 transition-colors"
            >
              {detailsOpen ? t("Detayları gizle", "Hide details") : t("Detaylar", "Details")}
            </button>

            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="text-[11px] leading-relaxed text-white/45 space-y-2 pt-1">
                    <p>
                      <span className="text-white/65 font-semibold">{t("Gerekli çerezler:", "Necessary cookies:")}</span> {t("oturum, yönetici girişi, dil tercihi gibi sitenin temel çalışması için zorunlu olanlar. Onayınız olmadan da kullanılır (yasal istisna).", "session, admin login and language preference — required for the site to work. Used without your consent (legal exemption).")}
                    </p>
                    <p>
                      <span className="text-white/65 font-semibold">{t("Analytics çerezleri:", "Analytics cookies:")}</span> {t("Google Analytics 4 — anonim ziyaret, sayfa görüntüleme, trafik kaynağı verisi toplar. Sadece kabul ederseniz çalışır.", "Google Analytics 4 — collects anonymous visit, page view and traffic source data. Runs only if you accept.")}
                    </p>
                    <p>
                      <span className="text-white/65 font-semibold">{t("Haklarınız:", "Your rights:")}</span> {t("KVKK kapsamında verilerinize erişme, düzeltme, silme talepleri için", "To access, correct or delete your personal data (KVKK/GDPR), write to")} <a href="mailto:sales@bemis.com.tr" className="text-blue-300 hover:underline">sales@bemis.com.tr</a>{t(" adresine yazabilirsiniz.", ".")}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => persist("rejected")}
                className="flex-1 text-xs font-semibold rounded-xl px-4 py-2.5 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.70)" }}
              >
                {t("Sadece Gerekli", "Necessary only")}
              </button>
              <button
                onClick={() => persist("accepted")}
                className="flex-1 text-xs font-bold rounded-xl px-4 py-2.5 transition-all"
                style={{ background: "#3B82F6", color: "#ffffff", boxShadow: "0 4px 16px rgba(59,130,246,0.30)" }}
              >
                {t("Tümünü Kabul Et", "Accept all")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
