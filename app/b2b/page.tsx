"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import { useTheme } from "../context/ThemeContext";
import {
  RiFlashlightLine,
  RiCpuLine,
  RiPlugLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { HiArrowLeft, HiMail } from "react-icons/hi";

const b2bProducts = [
  {
    id: "dc-charger",
    icon: RiFlashlightLine,
    name: "DC Hızlı Şarj Ünitesi",
    subtitle: "Ticari & Halka Açık DC İstasyon",
    specs: [
      "7 kW – 360 kW güç aralığı",
      "CCS2 · CHAdeMO · GB/T çıkış",
      "OCPP 2.0 · Dinamik güç yönetimi",
      "IP54 dış mekan kasası",
    ],
    tag: "Geliştirme Aşamasında",
    accent: "#F97316",
  },
  {
    id: "charge-panel",
    icon: RiCpuLine,
    name: "Şarj Panosu & Dağıtım Ünitesi",
    subtitle: "Çok Noktalı Enerji Dağıtım Panosu",
    specs: [
      "4–24 çıkış noktası",
      "Dinamik yük dengeleme (DLM)",
      "Modbus / OCPP entegrasyonu",
      "IP65 paslanmaz çelik muhafaza",
    ],
    tag: "Mevcut",
    accent: "#3B82F6",
  },
  {
    id: "dc-cable-b2b",
    icon: RiPlugLine,
    name: "DC Şarj Kablosu (CCS2)",
    subtitle: "İstasyon Üreticileri için Profesyonel Kablo",
    specs: [
      "50 kW – 350 kW · 500A maks.",
      "CCS2 / CHAdeMO / GB/T seçenekleri",
      "Aktif su soğutmalı model (500A)",
      "IEC 62893-4 · IEC 62196-3 · TÜV/CE",
    ],
    tag: "Mevcut",
    accent: "#10B981",
  },
  {
    id: "ecu",
    icon: RiCpuLine,
    name: "Elektronik Kontrol Kartı (ECU)",
    subtitle: "OEM için Yerli Tasarım Kontrol Ünitesi",
    specs: [
      "ARM Cortex-M4 · 180 MHz",
      "OCPP 1.6J / 2.0.1 · TLS 1.3",
      "Wi-Fi · 4G · RFID · RS-485 · CAN",
      "OTA güncellemesi · %100 test",
    ],
    tag: "OEM Mevcut",
    accent: "#818CF8",
  },
];

const tagColor: Record<string, string> = {
  "Mevcut": "#10B981",
  "OEM Mevcut": "#818CF8",
  "Geliştirme Aşamasında": "#F97316",
};

export default function B2BPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const d = theme === "dark";

  const bg       = d ? "#0c0c0e" : "#f8f8fb";
  const card     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border   = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a2e";
  const textMuted   = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const textFaint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow      = d ? "none" : "0 1px 12px rgba(0,0,0,0.05)";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-10 group"
          style={{ color: textMuted }}
        >
          <HiArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm">Geri</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <RiShieldCheckLine style={{ color: textFaint, fontSize: 16 }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: textFaint }}>
              OEM & Profesyonel Çözümler
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: textPrimary }}>
            Üreticiler & Kurumsal Alıcılar için
          </h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: textMuted }}>
            Şarj panoları, DC hızlı şarj üniteleri, OEM elektronik kartlar ve DC şarj kabloları —
            EV altyapı çözümleri geliştiren üreticiler ve entegratörler için teknik ürün portföyümüz.
            Detaylı teknik doküman ve fiyatlandırma için bizimle iletişime geçin.
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {b2bProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className="rounded-2xl p-5"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}
                >
                  <p.icon style={{ fontSize: 20, color: p.accent }} />
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${tagColor[p.tag] ?? "#888"}18`,
                    color: tagColor[p.tag] ?? "#888",
                    border: `1px solid ${tagColor[p.tag] ?? "#888"}30`,
                  }}
                >
                  {p.tag}
                </span>
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow }}
        >
          <h3 className="font-bold text-base mb-2" style={{ color: textPrimary }}>
            Teknik Teklif & NDA Sürecini Başlatın
          </h3>
          <p className="text-sm mb-5" style={{ color: textMuted }}>
            Üreticilere özel fiyatlandırma, teknik dokümanlar ve numune talepleri için
            satış mühendisliğimizle görüşün.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/#contact")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: textPrimary, color: d ? "#0c0c0e" : "#ffffff" }}
            >
              <HiMail size={14} />
              İletişime Geç
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${border}`,
                color: textMuted,
              }}
            >
              <HiArrowLeft size={14} />
              Ana Siteye Dön
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-xs text-center mt-6" style={{ color: textFaint }}>
          Bu sayfa üretici ve kurumsal alıcılara yöneliktir. Son kullanıcı ürünleri için{" "}
          <button
            onClick={() => router.push("/#products")}
            className="underline hover:opacity-70 transition-opacity"
          >
            ana ürün sayfamızı
          </button>{" "}
          ziyaret edin.
        </p>
      </div>
    </div>
  );
}
