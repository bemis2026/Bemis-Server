"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { setAnalyticsConsent } from "./GoogleAnalytics";

const STORAGE_KEY = "bemis-cookie-consent";

type Choice = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
            <p className="text-sm font-bold text-white">Çerezler hakkında</p>
            <p className="text-xs leading-relaxed text-white/55">
              Sitemizde sizin deneyiminizi geliştirmek ve trafiği analiz etmek için çerezler kullanıyoruz.
              Sadece gerekli çerezleri seçerseniz analytics ve istatistik takibi yapılmaz —
              KVKK kapsamındaki haklarınız saklıdır.
            </p>

            <button
              onClick={() => setDetailsOpen(o => !o)}
              className="text-[11px] font-semibold text-blue-300 hover:text-blue-200 transition-colors"
            >
              {detailsOpen ? "Detayları gizle" : "Detaylar"}
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
                      <span className="text-white/65 font-semibold">Gerekli çerezler:</span> oturum,
                      yönetici girişi, dil tercihi gibi sitenin temel çalışması için zorunlu olanlar.
                      Onayınız olmadan da kullanılır (yasal istisna).
                    </p>
                    <p>
                      <span className="text-white/65 font-semibold">Analytics çerezleri:</span> Google
                      Analytics 4 — anonim ziyaret, sayfa görüntüleme, trafik kaynağı verisi toplar.
                      Sadece kabul ederseniz çalışır.
                    </p>
                    <p>
                      <span className="text-white/65 font-semibold">Haklarınız:</span> KVKK kapsamında
                      verilerinize erişme, düzeltme, silme talepleri için <a href="mailto:satis@bemis.com.tr" className="text-blue-300 hover:underline">satis@bemis.com.tr</a> adresine yazabilirsiniz.
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
                Sadece Gerekli
              </button>
              <button
                onClick={() => persist("accepted")}
                className="flex-1 text-xs font-bold rounded-xl px-4 py-2.5 transition-all"
                style={{ background: "#3B82F6", color: "#ffffff", boxShadow: "0 4px 16px rgba(59,130,246,0.30)" }}
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
