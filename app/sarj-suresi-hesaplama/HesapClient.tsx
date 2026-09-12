"use client";

/*
 * ŞARJ SÜRESİ HESAPLAMA — TAM SAYFA (/sarj-suresi-hesaplama)
 *
 * ⚠️⚠️ NEDEN AYRI SAYFA (2026-09-12): hesaplayıcı YALNIZCA anasayfanın bir
 * bölümüydü (`#calculator`). Yani kendi URL'i, kendi `<h1>`i, kendi meta
 * açıklaması ve `WebApplication` şeması YOKTU → "şarj süresi hesaplama",
 * "elektrikli araç şarj süresi kaç saat" gibi ARAÇ ARAYAN sorgularda
 * yarışabileceği bir hedef yoktu. Referans SEO çalışmasında 15 hesaplama aracı
 * AYRI URL/H1/şema ile yayınlanmış ve bunlar bağımsız trafik üretmiş.
 *
 * ⚠️ Anasayfadaki bölüm KALDIRILMADI — aynı bileşen iki yerde. Kanibalizasyon
 *    riski yok çünkü anasayfa bölümü `#calculator` bir ANKRAJ, bu ise kendi
 *    canonical'ı olan bağımsız sayfa; hedef sorgular farklı (marka + kurumsal
 *    vs araç arayan uzun kuyruk).
 * ⚠️ `<h1>` BURADA, bileşenin içindeki başlık `<h2>` olarak kalıyor → doğru
 *    başlık hiyerarşisi. Bileşene DOKUNULMADI (anasayfa görünümü değişmesin).
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";

// Hesaplayıcı ağır (araç veritabanı + grafik) → anasayfadaki gibi tembel yükle.
const Calculator = dynamic(() => import("../components/Calculator"));

export default function HesapClient() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const T = (tr: string, en: string) => pickText(lang, tr, en);

  const ink = d ? "#f0f0f4" : "#1a1a2e";
  const faint = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,46,0.58)";

  return (
    <main className="relative">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />

      <section className="w-full pt-10 pb-2 sm:pt-14">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full px-5 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3" style={{ color: ink }}>
            {T("Elektrikli Araç Şarj Süresi Hesaplama", "EV Charging Time Calculator")}
          </h1>
          {/* ⚠️ Bu paragraf ARACIN aracı tanıtmasıdır — şemadaki `description` ile
              AYNI bilgiyi verir (Google kuralı: şemadaki içerik sayfada görünür). */}
          <p className="text-sm sm:text-base max-w-3xl leading-relaxed" style={{ color: faint }}>
            {T(
              "Aracınızı ve şarj cihazınızı seçin; batarya kapasitesi, aracın dahili AC şarj gücü ve seçtiğiniz akım kademesine göre tahmini şarj süresini ve km başına maliyeti hesaplayın. Şarj hızını cihaz değil, aracınızın dahili şarj ünitesi ile tesisatınızın kapasitesinden düşük olanı belirler — hesaplayıcı bu sınırı da dikkate alır.",
              "Pick your car and your charger; work out the estimated charging time and the cost per kilometre from the battery capacity, the car's onboard AC charging power and the current step you select. Charging speed is set not by the unit but by whichever is lower — the car's onboard charger or your installation — and the calculator accounts for that limit.",
            )}
          </p>
        </div>
      </section>

      <Calculator />

      <ContactBar />
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </main>
  );
}
