"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiMapPin2Line, RiPhoneLine, RiMailLine, RiWhatsappLine,
  RiTimeLine, RiArrowRightLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import Footer from "../components/Footer";

const BLUE = "#3B82F6";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Ye%C5%9Fil%20Cad.%20No%3A31%2C%2016140%20Bursa";
const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Ye%C5%9Fil%20Cad.%20No%3A31%2C%2016140%20Bursa&output=embed";

export default function ContactPageClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const accent = d ? "#93C5FD" : BLUE;

  const items = [
    {
      icon: RiMapPin2Line,
      label: "Adres",
      value: (
        <span>
          Yeşil Cad. No:31, 16140 Bursa, Türkiye
        </span>
      ),
    },
    {
      icon: RiPhoneLine,
      label: "Telefon",
      value: (
        <a href="tel:+902244330216" className="hover:opacity-80" style={{ color: accent }}>
          +90 224 433 02 16
        </a>
      ),
    },
    {
      icon: RiMailLine,
      label: "E-posta",
      value: (
        <a href="mailto:info@bemisevcharge.com" className="hover:opacity-80" style={{ color: accent }}>
          info@bemisevcharge.com
        </a>
      ),
    },
    {
      icon: RiWhatsappLine,
      label: "WhatsApp",
      value: (
        <a
          href="https://wa.me/905339562546"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
          style={{ color: accent }}
        >
          +90 533 956 25 46
        </a>
      ),
    },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <section className="relative overflow-hidden pt-28 pb-8 px-5 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: accent }}
          >
            <RiMapPin2Line size={14} /> Bize Ulaşın
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4"
            style={{ color: textPrimary }}
          >
            İletişim
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="h-px w-24 origin-left mb-5"
            style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed max-w-3xl"
            style={{ color: textMuted }}
          >
            Bemis E-V Charge ile ürünlerimiz, bayilik ve teklif talepleriniz için iletişime geçin. Aşağıdaki
            kanallardan bize ulaşabilir, dilerseniz yol tarifi alarak Bursa&apos;daki adresimizi ziyaret edebilirsiniz.
          </motion.p>
        </div>
      </section>

      <section className="py-8 px-5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl p-6 sm:p-8 lg:p-10"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {items.map((it) => (
                <div key={it.label} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center rounded-2xl"
                    style={{ width: 44, height: 44, background: d ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.08)", color: accent }}
                  >
                    <it.icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: textMuted }}>
                      {it.label}
                    </p>
                    <p className="text-base sm:text-lg font-semibold leading-relaxed" style={{ color: textPrimary }}>
                      {it.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Çalışma saatleri */}
            <div className="mt-8 pt-7" style={{ borderTop: `1px solid ${border}` }}>
              <div className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-2xl"
                  style={{ width: 44, height: 44, background: d ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.08)", color: accent }}
                >
                  <RiTimeLine size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: textMuted }}>
                    Çalışma Saatleri
                  </p>
                  {/* TODO: gerçek çalışma saatleri kullanıcıdan teyit edilecek */}
                  <p className="text-base sm:text-lg font-semibold" style={{ color: textPrimary }}>
                    Hafta içi 08:30–18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                style={{ background: BLUE }}
              >
                Yol Tarifi Al <RiArrowRightLine size={16} />
              </a>
            </div>
          </motion.div>

          {/* Gömülü harita */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-6 rounded-3xl overflow-hidden"
            style={{ border: `1px solid ${border}` }}
          >
            <iframe
              src={MAP_EMBED_SRC}
              title="Bemis E-V Charge konum haritası"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: 360, border: 0, display: "block" }}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
