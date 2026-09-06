"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "./Img";
import { motion } from "framer-motion";
import { HiChevronDown, HiPhone } from "react-icons/hi";
import {
  RiCpuLine, RiCustomerService2Line, RiShieldCheckLine, RiMapPin2Line,
  RiToolsLine, RiPriceTag3Line, RiArrowRightLine, RiStore2Line,
  RiWhatsappLine, RiGlobalLine, RiRoadMapLine, RiSearchEyeLine, RiTruckLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import { CITY_PAGES, type CityPage } from "../lib/cities";
import type { ShowcaseProduct, CityDealer } from "../lib/cityShowcase";

// wa.me ULUSLARARASI biçim ister; bayi telefonları veride YEREL yazımda
// ("0546 927 28 04"). Ham kullanılırsa bağlantı sessizce çalışmaz.
// (DealerNetwork'teki waNumber ile aynı kural.)
const waNumber = (s: string) => {
  const d = (s || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (d.startsWith("90")) return d;
  if (d.startsWith("0")) return "90" + d.slice(1);
  if (d.length === 10 && d.startsWith("5")) return "90" + d;
  return d;
};

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

const PRODUCTS = [
  { name: "AC Wallbox Şarj İstasyonları", href: "/products/wallbox",  note: "Ev & iş yeri · 7,4–22 kW" },
  { name: "Taşınabilir Şarj Cihazları",   href: "/products/portable", note: "Mobil / seyyar şarj" },
  { name: "Type 2 Şarj Kabloları",        href: "/products/cables",   note: "Yerli şarj kablosu üretimi" },
  { name: "V2L / C2L Adaptörler",         href: "/products/v2l-c2l",  note: "Araçtan elektrik çözümleri" },
  { name: "Aksesuarlar",                  href: "/products/accessories", note: "Tutucu, adaptör, ekipman" },
];

export default function CityLandingClient({
  city,
  showcase = [],
  dealers = [],
}: {
  city: CityPage;
  /** Sunucudan gelir (app/lib/cityShowcase.ts). Boşsa bölüm render EDİLMEZ. */
  showcase?: ShowcaseProduct[];
  dealers?: CityDealer[];
}) {
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

  // Yerel açıyla genel faydalar (şehir adı dinamik yerleştirilir).
  const BENEFITS = [
    { icon: RiMapPin2Line,          title: `${city.city} merkezli üretici`, text: `${city.loc} doğrudan üreticisinden tedarik — aracı/ithalatçı yok, en hızlı destek ve yedek parça.` },
    { icon: RiCpuLine,              title: "Yerli mühendislik & yazılım",  text: "Donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştirilir." },
    { icon: RiShieldCheckLine,      title: "Sertifikalı kalite",           text: "CE, IP65/IP66, IEC 61851 ve OCPP uyumu — güvenli, standartlara uygun cihazlar." },
    { icon: RiCustomerService2Line, title: "Hızlı kurulum desteği",        text: "Ev, site ve iş yeri için elektrik altyapısı ve kurulum yönlendirmesi." },
    { icon: RiPriceTag3Line,        title: "Uygun maliyet",                text: "Üreticiden doğrudan tedarik; aradaki ithalat marjı olmadan rekabetçi fiyat." },
    { icon: RiToolsLine,            title: "OEM & filo çözümleri",         text: "İş yeri, AVM, otel ve filolar için çoklu kurulum + OEM/özel üretim." },
  ];

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

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: d ? "#93C5FD" : BLUE }}
          >
            <RiMapPin2Line size={14} /> {city.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}
          >
            {city.h1}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed max-w-3xl mb-7" style={{ color: textMuted }}
          >
            {city.intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95"
              style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}
            >
              Ürünleri İncele <RiArrowRightLine size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#dealer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}
            >
              <RiStore2Line size={16} /> Bayi Bul
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Neden Bemis */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            {city.city}&apos;da neden Bemis E-V Charge?
          </motion.h2>
          {accentLine}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }} whileHover={{ y: -4 }}
                className="group rounded-2xl p-5"
                style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}25` }}>
                  <b.icon size={20} style={{ color: BLUE }} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ürün vitrini (₺ KDV dahil) ──────────────────────────────────────
          ⚠️ 2026-08-02 eklendi. Sayfada daha önce ₺ işareti 0 kez, ürün modeli
          adı 0 kez geçiyordu; "Bursa'da şarj cihazı" arayan ziyaretçi ne ürün
          ne fiyat görüyordu. Fiyatlar ürün sayfalarında ZATEN yayında —
          burada göstermek yeni bilgi açığa çıkarmaz, sayfayı satın-alma
          niyetine cevap verir hâle getirir. ⚠️ SEPET AÇILMAZ: satış yetkili
          bayi üzerinden yürür, kartlar ürün sayfasına götürür. */}
      {showcase.length > 0 && (
        <section className="py-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
              className="text-2xl font-black mb-2" style={{ color: textPrimary }}
            >
              {city.city}&apos;da öne çıkan modeller ve fiyatları
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.08 }}
              className="text-sm mb-3 max-w-prose" style={{ color: textMuted }}
            >
              Aşağıdaki tutarlar üretici liste fiyatı olup KDV dahildir. Kurulum
              fiyata dahil değildir; yetkili bayimiz keşif sonrası ayrıca teklif verir.
            </motion.p>
            {accentLine}
            {/* 1280px+ tek satırda 6 kart — 3 sütunda kartlar iri kalıyor ve
                "nereden alınır" bölümünü ekrandan çok aşağı itiyordu. */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {showcase.map((p, i) => (
                <motion.div
                  key={`${p.categoryId}-${p.id}`}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.06 }} whileHover={{ y: -4 }}
                >
                  <Link
                    href={p.href}
                    className="group rounded-2xl block h-full overflow-hidden"
                    style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Ürün fotoğrafları beyaz zeminli → kart görsel alanı her iki
                        temada AÇIK kalır (ürün kartlarındaki kuralın aynısı). */}
                    <div className="relative w-full aspect-square" style={{ background: "#f3f4f6" }}>
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={`${p.name}${p.subtitle ? " " + p.subtitle : ""} — ${city.city} elektrikli araba şarj cihazı`}
                          fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                          quality={88}
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: BLUE }}>
                        {p.categoryName}
                      </p>
                      <h3 className="text-sm font-bold leading-snug" style={{ color: textPrimary }}>{p.name}</h3>
                      {p.subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: textFaint }}>{p.subtitle}</p>
                      )}
                      {p.power && (
                        <span
                          className="inline-block text-[11px] font-semibold mt-2 px-2 py-0.5 rounded-full"
                          style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30`, color: BLUE }}
                        >
                          {p.power}
                        </span>
                      )}
                      <p className="text-base font-black mt-2" style={{ color: textPrimary }}>{p.priceTry}</p>
                      <p className="text-[10px]" style={{ color: textFaint }}>KDV dahil</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: BLUE }}
              >
                Tüm ürünleri ve fiyatları gör
                <RiArrowRightLine size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Ürünler */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-2" style={{ color: textPrimary }}
          >
            {city.city}&apos;da hangi şarj ürünlerini bulabilirsiniz?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-sm mb-3" style={{ color: textMuted }}
          >
            Ev, iş yeri ve filolarınız için eksiksiz bir EV şarj ürün ailesi.
          </motion.p>
          {accentLine}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }} whileHover={{ y: -4 }}
              >
                <Link
                  href={p.href}
                  className="group rounded-2xl p-5 block h-full"
                  style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold" style={{ color: textPrimary }}>{p.name}</h3>
                    <RiArrowRightLine size={16} style={{ color: BLUE }} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs" style={{ color: textFaint }}>{p.note}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── {city}'da nereden alınır: yetkili bayiler + satın alma yolu ──────
          ⚠️ 2026-08-02 eklendi. Sayfada daha önce şehirdeki bayilerin adı/adresi
          HİÇ geçmiyordu — yalnız anasayfadaki haritaya götüren bir düğme vardı.
          Bu bölüm hem ziyaretçinin "nereden alırım" sorusunu doğrudan cevaplar
          hem de sayfaya sitede BAŞKA HİÇBİR YERDE olmayan özgün yerel içerik
          (açık adres + telefon) kazandırır — yerel aramada en değerli sinyal.
          ⚠️ Adresi olmayan bayi kaydı sunucuda ELENİR (bkz. getCityDealers). */}
      {dealers.length > 0 && (
        <section className="py-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
              className="text-2xl font-black mb-2" style={{ color: textPrimary }}
            >
              {city.city}&apos;da nereden alabilirsiniz?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: 0.08 }}
              className="text-sm mb-3 max-w-prose" style={{ color: textMuted }}
            >
              Bemis E-V Charge son kullanıcıya doğrudan satış yapmaz; satış ve kurulum
              {" "}{city.loc} yetkili bayilerimiz üzerinden yürür. Aşağıda {city.city}&apos;daki
              {" "}{dealers.length} yetkili bayimizin iletişim bilgileri yer alıyor.
            </motion.p>
            {accentLine}

            {/* Satın alma yolu — 3 adım. Yalnız GERÇEKTEN sunulan hizmetler yazılır. */}
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {[
                { icon: RiSearchEyeLine, t: "1 · Yetkili bayi keşfe gelir", x: `${city.city} içindeki yetkili bayimiz adresinize gelir; elektrik altyapınızı, pano mesafesini ve kablo güzergâhını yerinde değerlendirir.` },
                { icon: RiStore2Line,    t: "2 · Ürünü tesiste görebilirsiniz", x: `Dilerseniz Bursa Organize Sanayi Bölgesi'ndeki üretim tesisimize gelip cihazları yerinde inceleyebilir, doğrudan teslim alabilirsiniz.` },
                { icon: RiTruckLine,     t: "3 · Kurulum ve teslim", x: "Cihaz teslim edilir, kurulum yetkili bayi tarafından ürün kurulum şartnamesine uygun şekilde yapılır. Ürünler 2 yıl üretici garantilidir." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}25` }}>
                    <s.icon size={20} style={{ color: BLUE }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: textPrimary }}>{s.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{s.x}</p>
                </motion.div>
              ))}
            </div>

            {/* Yetkili bayiler — ad + AÇIK ADRES + iletişim + harita */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dealers.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }} whileHover={{ y: -4 }}
                  className="rounded-2xl p-5 flex flex-col"
                  style={{ background: surface, border: `1px solid ${border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BLUE}45`; e.currentTarget.style.boxShadow = `0 12px 30px ${BLUE}1f`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: textPrimary }}>{b.name}</h3>
                  {b.address && (
                    <p className="text-xs leading-relaxed mb-3 flex items-start gap-1.5" style={{ color: textMuted }}>
                      <RiMapPin2Line size={13} className="flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                      <span>{b.address}</span>
                    </p>
                  )}
                  <div className="flex flex-col gap-1.5 text-xs mt-auto">
                    {b.phone && (
                      <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 hover:underline" style={{ color: textMuted }}>
                        <HiPhone size={13} className="flex-shrink-0" style={{ color: BLUE }} />
                        {b.phone}
                      </a>
                    )}
                    {b.whatsapp && (
                      <a href={`https://wa.me/${waNumber(b.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline" style={{ color: textMuted }}>
                        <RiWhatsappLine size={13} className="flex-shrink-0" style={{ color: "#25D366" }} />
                        WhatsApp
                      </a>
                    )}
                    {b.website && (
                      <a href={b.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline" style={{ color: textMuted }}>
                        <RiGlobalLine size={13} className="flex-shrink-0" style={{ color: BLUE }} />
                        Web sitesi
                      </a>
                    )}
                    <a href={b.mapHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline" style={{ color: BLUE }}>
                      <RiRoadMapLine size={13} className="flex-shrink-0" />
                      Haritada Aç
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — basınca açılır akordeon */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-2xl font-black mb-3" style={{ color: textPrimary }}
          >
            {city.city} · Sıkça Sorulan Sorular
          </motion.h2>
          {accentLine}
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: textMuted }}
          >
            {city.localPitch}
          </motion.p>
          <div className="space-y-3">
            {city.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: surface, border: `1px solid ${open ? `${BLUE}40` : border}`, transition: "border-color 0.25s" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 text-left p-4 cursor-pointer"
                    onMouseEnter={(e) => { if (!open) (e.currentTarget.parentElement as HTMLElement).style.borderColor = `${BLUE}30`; }}
                    onMouseLeave={(e) => { if (!open) (e.currentTarget.parentElement as HTMLElement).style.borderColor = border; }}
                  >
                    <span className="text-sm font-bold" style={{ color: textPrimary }}>{f.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
                      className="flex-shrink-0 inline-flex" style={{ color: d ? "#93C5FD" : BLUE }}
                    >
                      <HiChevronDown size={18} />
                    </motion.span>
                  </button>
                  {/* ⚠️ SEO/GEO: cevap DAİMA DOM'da (koşullu mount DEĞİL) — yalnız yüksekliği
                      animasyonla kapanır. Eskiden `{open && ...}` idi ve akordeon kapalıyken cevap
                      HTML'e HİÇ basılmıyordu → 6 SSS cevabının 5'i ne Google'ın gövde metnine ne de
                      AI tarayıcılarına görünüyordu (FAQPage şeması doluydu ama sayfa boştu). */}
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: "hidden" }}
                    aria-hidden={!open}
                  >
                    <p className="text-sm leading-relaxed px-4 pb-4" style={{ color: textMuted }}>{f.a}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* İlgili bölgesel sayfalar — şehir sayfaları arası çapraz link.
          ⚠️ Bu sayfalar birbirine HİÇ link vermiyordu; aynı şehirdeki ikinci sayfa
          (ör. Bursa şarj kablosu) yalnız /uretici ve sitemap üzerinden bulunabiliyordu.
          Çapa metni sayfaya özel `linkLabel`. */}
      {CITY_PAGES.filter((c) => c.slug !== city.slug).length > 0 && (
        <section className="pb-10 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-xs" style={{ color: textFaint }}>
            <span className="font-semibold uppercase tracking-wider">İlgili sayfalar:</span>
            {CITY_PAGES.filter((c) => c.slug !== city.slug).map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="font-bold transition-opacity hover:opacity-70 cursor-pointer" style={{ color: d ? "#93C5FD" : BLUE }}>
                {c.linkLabel || `${c.city} EV Şarj İstasyonu`}
              </Link>
            ))}
            <Link href="/uretici" className="font-bold transition-opacity hover:opacity-70 cursor-pointer" style={{ color: d ? "#93C5FD" : BLUE }}>
              Yerli Üretici Hikayemiz
            </Link>
          </div>
        </section>
      )}

      <div className="pb-6" />
      <ContactBar />
    </div>
  );
}
