"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import {
  RiCarLine, RiPlugLine, RiFlashlightLine, RiArrowRightLine,
  RiStore2Line, RiInformationLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import Footer from "./Footer";
import { VEHICLES, INSTALL_GUIDE, VEHICLE_FAQ } from "../lib/vehicleCharging";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

export default function VehicleChargingClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const bg          = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint   = d ? "rgba(240,240,244,0.42)" : "rgba(26,26,26,0.45)";

  const accentLine = (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="h-px w-24 origin-left mb-7"
      style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
    />
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}18 0%, transparent 70%)` }}
          aria-hidden
        />
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto relative">
          {/* ⚠️ opacity:0 ile animasyon YOK — ilk ekranda görünmesi gereken metni
              opacity animasyonuna bağlamak LCP'yi bozuyor (kayıtlı ders). */}
          <motion.span
            initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: d ? `${BLUE}18` : `${BLUE}10`, border: `1px solid ${BLUE}${d ? "35" : "25"}`, color: d ? "#93C5FD" : BLUE }}
          >
            <RiCarLine size={14} /> Araç Uyumluluğu
          </motion.span>
          <motion.h1
            initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4"
            style={{ color: textPrimary }}
          >
            Hangi Araca Hangi Şarj Cihazı ve Kablosu?
          </motion.h1>
          <motion.p
            initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
            className="text-base leading-relaxed max-w-3xl mb-6"
            style={{ color: textMuted }}
          >
            Türkiye&apos;de satılan elektrikli otomobillerin tamamına yakını AC şarjda{" "}
            <strong style={{ color: textPrimary }}>Type 2</strong> soket kullanır — Togg, Hyundai,
            Tesla, BYD, MG ve Renault dahil. Yani doğru ürünü seçerken soket tipi değil,{" "}
            <strong style={{ color: textPrimary }}>aracınızın dahili şarj gücü</strong> ve{" "}
            <strong style={{ color: textPrimary }}>evinizin tesisatı</strong> belirleyicidir.
            Aşağıdaki tablo ikisini bir arada gösterir.
          </motion.p>
          <motion.div
            initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/products/wallbox"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95"
              style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}
            >
              Şarj Cihazlarını İncele <RiArrowRightLine size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/products/cables"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
            >
              <RiPlugLine size={16} /> Şarj Kabloları
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── En kritik kural ── */}
      <section className="px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="rounded-2xl p-5 flex items-start gap-3"
            style={{ background: d ? `${BLUE}12` : `${BLUE}0d`, border: `1px solid ${BLUE}28` }}
          >
            <RiInformationLine size={20} className="flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
              <strong style={{ color: textPrimary }}>Şarj hızını cihaz değil aracınız belirler.</strong>{" "}
              Dahili şarj ünitesi 11 kW olan bir araç, 22 kW&apos;lık bir cihaza bağlansa da 11 kW çeker.
              Bu yüzden &quot;en güçlü cihazı alayım&quot; yaklaşımı çoğu durumda gereksiz maliyettir —
              doğru seçim, aracınızın sınırı ile evinizin tesisatının kesişimidir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Araç tablosu ── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            Araç modellerine göre AC şarj gücü
          </motion.h2>
          {accentLine}
          {/* ⚠️ Tablo dar ekranda KENDİ konteynerinde yatay kayar — sayfa gövdesi
              asla yatay taşmaz (kayıtlı kural). */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr style={{ background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
                    {["Araç", "AC soketi", "Aracın dahili AC gücü", "Önerilen Bemis ürünü"].map((h) => (
                      <th key={h} className="text-left font-bold px-4 py-3" style={{ color: textPrimary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VEHICLES.map((v, i) => (
                    <tr key={v.name} style={{ borderTop: `1px solid ${border}`, background: i % 2 ? (d ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent" }}>
                      <td className="px-4 py-3 font-bold align-top" style={{ color: textPrimary }}>
                        {v.name}
                        {v.note && (
                          <span className="block font-normal text-xs mt-1 max-w-xs" style={{ color: textFaint }}>{v.note}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top" style={{ color: textMuted }}>{v.acPort}</td>
                      <td className="px-4 py-3 align-top font-semibold" style={{ color: BLUE }}>{v.onboardAc}</td>
                      <td className="px-4 py-3 align-top" style={{ color: textMuted }}>
                        {v.onboardAc.startsWith("6,6")
                          ? "Charger 2 (32A tek faz) veya taşınabilir Mono Mobile"
                          : "Charger 2 / Charger Plus 2 · 32A · Type 2 şarj kablosu"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: textFaint }}>
            Değerler EV Database&apos;deki model sayfalarından alınmıştır (Ağustos 2026). Aynı modelin farklı
            donanım paketlerinde ve model yıllarında dahili şarj gücü değişebilir; kesin değer için aracınızın
            kullanım kılavuzuna bakın. Listede olmayan bir aracınız varsa bize yazın, birlikte belirleyelim.
          </p>
        </div>
      </section>

      {/* ── Tesisata göre seçim ── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            Evinizin tesisatına göre ne alınmalı?
          </motion.h2>
          {accentLine}
          <div className="grid sm:grid-cols-3 gap-4">
            {INSTALL_GUIDE.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }} whileHover={{ y: -4 }}
                className="rounded-2xl p-5 flex flex-col"
                style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}25` }}>
                  <RiFlashlightLine size={20} style={{ color: BLUE }} />
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{g.title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: textMuted }}>{g.body}</p>
                <p className="text-xs font-semibold mt-auto pt-3" style={{ color: BLUE, borderTop: `1px solid ${border}` }}>
                  {g.product}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS (FAQPage şemasıyla aynı metin) ── */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            Sıkça Sorulan Sorular
          </motion.h2>
          {accentLine}
          <div className="space-y-2">
            {VEHICLE_FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: surface, border: `1px solid ${border}` }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{f.q}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                      <HiChevronDown size={18} style={{ color: BLUE }} />
                    </motion.span>
                  </button>
                  {/* ⚠️ Cevap DAİMA mount — koşullu mount edilirse HTML'e hiç
                      basılmaz ve ne Google ne AI tarayıcıları görür (kayıtlı ders:
                      şehir sayfalarında 6 cevabın 5'i görünmezdi). */}
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ overflow: "hidden" }}
                    aria-hidden={!open}
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Kapanış CTA ── */}
      <section className="pb-14 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: `linear-gradient(135deg, ${BLUE}14 0%, transparent 100%)`, border: `1px solid ${BLUE}28` }}
          >
            <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: textPrimary }}>
              Aracınıza uygun modeli birlikte belirleyelim
            </h2>
            <p className="text-sm leading-relaxed mb-5 max-w-2xl" style={{ color: textMuted }}>
              Bemis E-V Charge, şarj cihazlarını ve Type 2 kablolarını Bursa&apos;daki kendi tesisinde üretir.
              Satış ve kurulum keşfi yetkili bayilerimiz üzerinden yürür; bayimiz tesisatınızı yerinde
              değerlendirip aracınıza uygun modeli ve kurulum maliyetini çıkarır.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#dealer"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95"
                style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}
              >
                <RiStore2Line size={16} /> Size En Yakın Bayi
              </Link>
              <Link
                href="/iletisim"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95"
                style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
              >
                Bize Ulaşın <RiArrowRightLine size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactBar />
      <Footer />
    </div>
  );
}
