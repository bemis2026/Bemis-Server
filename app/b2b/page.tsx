"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "../components/Img";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { accentInk } from "../lib/accentInk";
import { pickText } from "../lib/ui";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useUiStrings } from "../../lib/uiStrings";
import {
  RiPlugLine,
  RiShieldCheckLine,
  RiBuilding2Line,
  RiArrowRightLine,
} from "react-icons/ri";
import JsonLd from "../components/JsonLd";
import { serviceSchema, faqSchema } from "../lib/seo";

// Kurumsal alim SSS'i — hem gorunur icerik hem FAQPage semasi (ayni metin).
// ⚠️ ADET/SURE/FIYAT TAAHHUDU YOK: kullanici bir sayi vermedi, uydurulmadi.
// Yeni taahhut eklenecekse ONCE dogrulat.
// ⚠️ SSS TEK KAYNAK — hem GÖRÜNÜR bölüm hem FAQPage şeması buradan beslenir.
//    ŞEMA daima TÜRKÇE (`B2B_FAQ`, aşağıda türetilir): /b2b TEK URL ve TR
//    canonical → Googlebot SSR'da Türkçe görür, şema ile görünür metin ayrışmaz.
//    GÖRÜNÜR metin ise dile duyarlıdır (pickText, `en` = ui.json anahtarı).
//    📌 İki yerde metin TUTMA: yeni soru eklerken yalnız buraya yaz.
const B2B_SSS = [
  {
    q: { tr: "Şarj cihazı imalatçısı mısınız, ithalatçı mı?", en: "Are you a charging device manufacturer or an importer?" },
    a: { tr: "İmalatçıyız. AC şarj cihazlarını, Type 2 şarj kablolarını ve şarj ünitesi ekipmanlarını Bursa Organize Sanayi Bölgesi'ndeki kendi tesisimizde üretiyoruz; donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştiriliyor. Ürünler ithal edilip etiketlenmiyor.", en: "We are a manufacturer. We produce AC charging devices, Type 2 charging cables and charging unit equipment at our own facility in the Bursa Organised Industrial Zone; hardware and embedded software are developed by our own R&D team. Products are not imported and relabelled." },
  },
  {
    q: { tr: "Toptan alım yapabilir miyim?", en: "Can I buy wholesale?" },
    a: { tr: "Evet. Elektrik malzemesi toptancıları, pano üreticileri, filo ve enerji firmalarıyla toptan tedarik modelinde çalışıyoruz. Talep ettiğiniz ürün ve adet bilgisiyle bize ulaşırsanız ticari şartları birlikte belirleriz.", en: "Yes. We work in a wholesale supply model with electrical wholesalers, switchboard manufacturers, fleet and energy companies. Contact us with the product and quantity you need and we will define the commercial terms together." },
  },
  {
    q: { tr: "Kendi markamızla üretim (white-label) yapıyor musunuz?", en: "Do you manufacture under our own brand (white-label)?" },
    a: { tr: "Evet. Mevcut ürün ailemiz sizin markanızla etiketlenebilir; ambalaj, kullanım kılavuzu ve ürün etiketi kendi marka kimliğinizle hazırlanır. Üretim, kalite kontrol ve sertifikasyon bizde kalır.", en: "Yes. Our existing product family can be labelled with your brand; packaging, user manual and product label are prepared in your own brand identity. Manufacturing, quality control and certification stay with us." },
  },
  {
    q: { tr: "Fason üretimde neler özelleştirilebiliyor?", en: "What can be customised in contract manufacturing?" },
    a: { tr: "Kablo kesiti ve uzunluğu, soket tipi, mahfaza rengi ve etiketleme talebe göre belirlenebiliyor. Ürün geliştirme sürecinin başından sertifikasyona kadar mühendislik ekibimiz devrede olur.", en: "Cable cross-section and length, socket type, enclosure colour and labelling can be set on request. Our engineering team is involved from the start of product development through to certification." },
  },
  {
    q: { tr: "Ürünleriniz hangi sertifikalara sahip?", en: "Which certificates do your products hold?" },
    a: { tr: "Ürünlerimiz CE sertifikalıdır ve IP65/IP66 koruma sınıfında üretilir; IEC 61851 ve IEC 62196 standartlarına uygundur, OCPP uyumlu modellerimiz mevcuttur. Üretim tesisimiz ISO 9001 kalite yönetim sistemine sahiptir.", en: "Our products are CE certified and produced in IP65/IP66 protection class; they comply with IEC 61851 and IEC 62196, and OCPP-compatible models are available. Our production facility holds an ISO 9001 quality management system." },
  },
  {
    q: { tr: "İhracat yapıyor musunuz?", en: "Do you export?" },
    a: { tr: "Evet. 80'den fazla ülkeye ihracat gerçekleştiriyoruz. Dış ticaret talepleri için trade@bemis.com.tr adresinden bize ulaşabilirsiniz; İngilizce üretici ve teklif sayfamız da yayında.", en: "Yes. We export to more than 80 countries. For foreign trade enquiries you can reach us at trade@bemis.com.tr; our English manufacturer and quote page is also online." },
  },
];

// ŞEMA KAYNAĞI — kanonik TÜRKÇE, B2B_SSS'ten TÜRETİLİR (elle yazılmaz).
const B2B_FAQ = B2B_SSS.map((f) => ({ q: f.q.tr, a: f.a.tr }));

/* ─── Data types ────────────────────────────────────────────────────────── */
type B2BFeaturedSlot = { categoryId?: string; productId?: string };
type B2BHero = {
  eyebrow: string; heading1: string; heading2: string;
  description: string; sectorTags: string[];
  heroBg?: string;
};
type B2BApplication = { id: string; image: string; title?: string; body?: string };
type B2BData = {
  hero: B2BHero;
  featuredProducts?: B2BFeaturedSlot[];
  applications?: B2BApplication[];
};

type ProductEntry = { id: string; name: string; subtitle?: string; description?: string; image?: string };
type Category = { id: string; name: string; tagline: string; accent: string; products?: ProductEntry[] };

export default function B2BPage() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { dna } = useContent();
  const t = useUiStrings();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const localizedDefault: B2BData = {
    hero: {
      eyebrow:     t("b2b_default_eyebrow"),
      heading1:    t("b2b_default_h1"),
      heading2:    t("b2b_default_h2"),
      description: t("b2b_default_desc"),
      sectorTags:  [t("b2b_sector_oem"), t("b2b_sector_op"), t("b2b_sector_int"), t("b2b_sector_proj")],
    },
    featuredProducts: [],
  };
  const [b2bData, setB2bData] = useState<B2BData>(localizedDefault);

  const bg        = d ? "#131318" : "#f8f8fb";
  const bgSub     = d ? "#1a1a20" : "#ffffff";
  const card      = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border    = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const inputBg   = d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const text      = d ? "#f0f0f4" : "#1a1a2e";
  const muted     = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,46,0.50)";
  const faint     = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,46,0.28)";
  const shadow    = d ? "none" : "0 1px 12px rgba(0,0,0,0.06)";
  const AMBER     = "#F59E0B";

  useEffect(() => {
    // ⚠️ BAYAT YANIT KORUMASI — bkz. operator/page.tsx notu (2026-09-13).
    let iptal = false;
    fetch(`/api/products?lang=${lang}`).then(r => r.json()).then((data: Category[]) => {
      if (iptal) return;
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data: B2BData) => {
      if (iptal) return;
      if (data?.hero) setB2bData(data);
    }).catch(() => {});
    return () => { iptal = true; };
  }, [lang]);

  // Admin panel live preview — receive postMessage from parent iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "BEMIS_B2B_PREVIEW" || !e.data?.b2bData) return;
      setB2bData(e.data.b2bData);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      {/* ⚠️ FAQPage EKLENDİ (2026-08-03): şemadaki "white-label / toplu sipariş /
          özel mühendislik" ifadeleri sayfanın görünür metninde YOKTU — Google
          şema içeriğinin sayfada görünür olmasını şart koşar. Artık aşağıdaki
          "Çalışma Modelleri" + "Kurumsal alım soruları" bölümleri o içeriği
          görünür kılıyor ve SSS metni B2B_FAQ ile BİREBİR aynı. */}
      <JsonLd data={[
        serviceSchema({
          name: "OEM & Üretici Çözümleri",
          description: "EV şarj ürünleri OEM üretimi, white-label etiketleme, toplu sipariş ve özel mühendislik çözümleri. CE & IP65 sertifikalı, 80+ ülkeye ihracat tecrübesi.",
          url: "/b2b",
          offerings: ["OEM Üretim", "White-Label Etiketleme", "Toplu Sipariş", "Özel Mühendislik", "Sertifikalı Üretim"],
        }),
        faqSchema(B2B_FAQ),
      ]} />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: bgSub,
          borderBottom: `1px solid ${border}`,
          paddingTop: 112,
          paddingBottom: 56,
        }}
      >
        {b2bData.hero.heroBg && (
          <>
            <Image src={b2bData.hero.heroBg} alt="" fill priority quality={90} sizes="100vw" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: d
                  ? "linear-gradient(135deg, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.62) 55%, rgba(8,8,12,0.38) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.30) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <RiShieldCheckLine style={{ color: accentInk(AMBER, d), fontSize: 14 }} />
              <span className="text-xs font-bold tracking-[0.20em] uppercase" style={{ color: accentInk(AMBER, d) }}>
                {b2bData.hero.eyebrow}
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3" style={{ color: text }}>
              {b2bData.hero.heading1}<br />
              <span style={{ color: accentInk(AMBER, d) }}>{b2bData.hero.heading2}</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[2px] w-24 origin-left rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${AMBER} 0%, ${AMBER}66 60%, transparent 100%)`,
                boxShadow: `0 0 12px ${AMBER}45`,
              }}
            />
            <p className="leading-relaxed max-w-xl mb-6" style={{ color: muted, fontSize: "0.9375rem" }}>
              {b2bData.hero.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(b2bData.hero.sectorTags ?? []).map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}28`, color: d ? "#FCD34D" : "#92400E" }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OEM Üreticilerine Sunduğumuz Çözümler — left image / right
          text intro. The image source is dna.factoryImage (managed
          from admin → Hakkımızda / DNA), so the operator can swap it
          without touching B2B-specific admin fields. The legacy
          applications gallery has been retired — what manufacturers
          need on first scroll is a clear "what we do" statement, not
          a wall of case-study tiles. */}
      <section style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "52px 0" }}>
        {/* Geniş ekran (2026-07-13): Kurumsal 3 sayfası (b2b/bayilik/operator)
            blog/sözlük/ürün ile aynı 1600px desenine geçti. ⚠️ `wide-content`
            KALDIRILDI: `.wide-content.mx-auto` özgüllüğü (0,2,0) Tailwind'in
            2xl:max-w-[1600px]'ini (0,1,0) ezip 1360px'e sabitliyordu. */}
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
          {/* Görsel-ağırlıklı 12'li ızgara (görsel 7/12 ≈ %58, metin 5/12) —
              geniş ekranda görsel belirgin/büyük dursun (50/50 hâlâ küçük
              geliyordu); metin başlık+paragraflar için yeterli genişlikte kalır. */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {dna.factoryImage ? (
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden lg:col-span-7 media-cap"
                // 16/9: görselin GERÇEK oranı (1600×900) → object-cover ile
                // kırpma OLMADAN çerçeveye tam oturur (sıkışma/bozulma yok).
                style={{ aspectRatio: "16/9", border: `1px solid ${border}`, boxShadow: shadow }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dna.factoryImage}
                  alt={pickText(lang, "Bemis üretim tesisi", "Bemis manufacturing facility")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ) : (
              <div
                className="rounded-3xl flex items-center justify-center lg:col-span-7"
                style={{ aspectRatio: "16/9", background: card, border: `1px dashed ${border}` }}
              >
                <span className="text-xs font-semibold" style={{ color: faint }}>
                  Görsel admin → DNA → Üretim Görseli alanından yüklendiğinde burada görünecek.
                </span>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: accentInk(AMBER, d) }}>
                {pickText(lang, "Çözüm Ortaklığı", "OEM & Solution Partnership")}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-4" style={{ color: text }}>
                {pickText(lang, "OEM Üreticilerine Sunduğumuz Çözümler", "Solutions we offer OEM manufacturers")}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: muted }}>
                {/* ⚠️ Yabancı dilde milliyetçi çerçeve YOK — menşe OLGU olarak geçer. */}
                {pickText(lang,
                  "Bemis Teknik Elektrik, 1994'ten bu yana endüstriyel elektrik ekipmanı üretimi yapan, 80+ ülkeye ihracat gerçekleştiren bir Türkiye üreticisidir. EV şarj cihazı üreten OEM firmalarına bileşen ve mühendislik desteği sunuyoruz.",
                  "Bemis Teknik Elektrik has manufactured industrial electrical equipment since 1994 and exports to more than 80 countries from its facility in Türkiye. We provide components and engineering support to OEM companies that build EV charging devices.")}
              </p>
              <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: muted }}>
                {pickText(lang,
                  "Type 2 ve CCS2 soketler, AC ve DC şarj kabloları, elektronik kontrol kartları ve özel mahfaza tasarımları ile çözüm ortağıyız. Ürün geliştirme sürecinin başından sertifikasyona kadar mühendislik ekibimiz devreye girer; tedarik zinciri Bursa OSB üretim tesisinden tek noktadan yönetilir.",
                  "We are a solution partner for Type 2 and CCS2 sockets, AC and DC charging cables, electronic control boards and custom enclosure designs. Our engineering team is involved from the start of product development through to certification; the supply chain is managed from a single point at our Bursa OIZ production facility.")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  // ⚠️ 2026-08-03: "11.000 m²" yazıyordu — o değer TARİHÇEDE 2010
                  // yılına ait (kurumsal timeline'da doğru). Bugünkü tesis sitenin
                  // 12 ayrı yerinde 16.000 m² olarak geçiyor; bu rozet onu güncel
                  // gibi gösterip çelişki yaratıyordu.
                  pickText(lang, "16.000 m² Üretim Tesisi", "16,000 m² Production Facility"),
                  pickText(lang, "80+ Ülke İhracat", "Exports to 80+ countries"),
                  pickText(lang, "CE / TSE / TÜV Sertifikalı", "CE / TSE / TÜV certified"),
                  "ISO 9001:2015",   // evrensel standart adı — çevrilmez
                ].map((chip) => (
                  <span
                    key={chip}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: `${AMBER}15`,
                      border: `1px solid ${AMBER}30`,
                      color: accentInk(AMBER, d),
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Çalışma modelleri + SSS ───────────────────────────────────────
          ⚠️ 2026-08-03 EKLENDİ. İki sebep:
          (1) ŞEMA↔SAYFA UYUŞMAZLIĞI: serviceSchema'da "white-label etiketleme",
              "toplu sipariş", "özel mühendislik" YAZIYORDU ama sayfanın görünür
              metninde HİÇBİRİ geçmiyordu. Google, şemadaki içeriğin sayfada
              görünür olmasını şart koşar.
          (2) ARAMA BOŞLUĞU: "imalatçı", "toptan", "fason" kelimeleri sitenin
              HİÇBİR yerinde geçmiyordu (ölçüldü). "Şarj cihazı imalatçısı" ya da
              "toptan şarj kablosu" arayan alıcı bize ulaşamıyordu — üstelik bunlar
              e-ticaretin rekabet etmediği, bayi modeline en uygun aramalar.
          ⚠️ Adet/süre/fiyat TAAHHÜDÜ YOK — kullanıcı bana bir sayı vermedi,
          uydurulmadı. Yeni bir taahhüt eklenecekse önce doğrulat. */}
      <section className="py-14 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: accentInk(AMBER, d) }}>
            {pickText(lang, "Çalışma Modelleri", "Working models")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3" style={{ color: text }}>
            {pickText(lang, "Fason, white-label ve toptan tedarik", "Contract manufacturing, white-label and wholesale supply")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-3xl" style={{ color: muted }}>
            {/* ⚠️ Vurgu (<strong>) HER dilde korunur: cümle önek / vurgu / sonek
                olarak ÜÇ parçaya bölündü. Tek parça pickText yapsaydım Türkçe
                sayfadaki kalın vurgu kaybolurdu (görünür TR arayüzü sorulmadan
                değiştirilmez). Türkçede ek "-dır" vurguya bitişiktir; diğer
                dillerde sonek kendi dilbilgisine göre yazıldı. */}
            {pickText(lang, "Bemis E-V Charge bir ", "Bemis E-V Charge is a ")}
            <strong style={{ color: text }}>{pickText(lang, "üretici ve imalatçı", "manufacturer and producer")}</strong>
            {pickText(lang,
              "dır; ürünleri ithal edip etiketlemez, Bursa Organize Sanayi Bölgesi'ndeki kendi tesisinde üretir. Bu yüzden kurumsal alıcılarla üç farklı modelde çalışabiliyoruz.",
              "; it does not import and relabel products — it manufactures them at its own facility in the Bursa Organised Industrial Zone. That is why we can work with corporate buyers under three different models.")}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                t: pickText(lang, "Fason / OEM üretim", "Contract / OEM manufacturing"),
                x: pickText(lang,
                  "Ürünü sizin teknik şartnamenize göre üretiriz. Kablo kesiti ve uzunluğu, soket tipi, mahfaza rengi ve etiketleme talebinize göre belirlenir; mühendislik ekibimiz tasarımdan sertifikasyona kadar süreçte yer alır.",
                  "We manufacture the product to your technical specification. Cable cross-section and length, socket type, enclosure colour and labelling are set according to your request; our engineering team is involved from design through to certification."),
              },
              {
                t: pickText(lang, "White-label etiketleme", "White-label labelling"),
                x: pickText(lang,
                  "Mevcut ürün ailemiz sizin markanızla etiketlenir. Ambalaj, kullanım kılavuzu ve ürün etiketi kendi marka kimliğinizle hazırlanır; üretim ve kalite kontrol bizde kalır.",
                  "Our existing product family is labelled with your brand. Packaging, user manual and product label are prepared in your own brand identity; manufacturing and quality control stay with us."),
              },
              {
                t: pickText(lang, "Toptan tedarik", "Wholesale supply"),
                x: pickText(lang,
                  "Standart katalog ürünlerinin toplu alımı. Elektrik malzemesi toptancıları, panocular, filo ve enerji firmaları için düzenli tedarik; sevkiyat Bursa'daki üretim tesisinden tek noktadan yönetilir.",
                  "Bulk purchasing of standard catalogue products. Regular supply for electrical wholesalers, switchboard manufacturers, fleet and energy companies; shipping is managed from a single point at our Bursa production facility."),
              },
            ].map((m) => (
              <div
                key={m.t}
                className="rounded-2xl p-5"
                style={{ background: d ? "rgba(255,255,255,0.04)" : "#ffffff", border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: text }}>{m.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{m.x}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: text }}>
            {pickText(lang, "Kurumsal alım soruları", "Corporate purchasing questions")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* GÖRÜNÜR SSS dile duyarlı (B2B_SSS); ŞEMA kanonik TR (B2B_FAQ). */}
            {B2B_SSS.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: d ? "rgba(255,255,255,0.04)" : "#ffffff", border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: text }}>{pickText(lang, f.q.tr, f.q.en)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{pickText(lang, f.a.tr, f.a.en)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OEM Featured Products ── */}
      {(() => {
        const resolved = (b2bData.featuredProducts ?? [])
          .map(slot => {
            if (!slot?.categoryId || !slot?.productId) return null;
            const cat = categories.find(c => c.id === slot.categoryId);
            const prod = cat?.products?.find(p => p.id === slot.productId);
            if (!cat || !prod) return null;
            return { cat, prod };
          })
          .filter((x): x is { cat: Category; prod: ProductEntry } => x !== null);
        if (resolved.length === 0) return null;
        return (
          <section style={{ background: bgSub, borderBottom: `1px solid ${border}`, padding: "56px 0" }}>
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <RiBuilding2Line style={{ color: accentInk(AMBER, d), fontSize: 14 }} />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentInk(AMBER, d) }}>{t("b2b_oem_eyebrow")}</span>
                </div>
                <h2 className="text-xl font-black mb-1" style={{ color: text }}>{t("b2b_oem_heading")}</h2>
                <p className="text-sm max-w-2xl" style={{ color: muted }}>
                  {t("b2b_oem_sub")}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {resolved.map(({ cat, prod }, i) => {
                  const href = `/products/${cat.id}/${prod.id}`;
                  const desc = (prod.description ?? "").trim();
                  const shortDesc = desc.length > 120 ? desc.slice(0, 117).trimEnd() + "…" : desc;
                  return (
                    <motion.div key={`${cat.id}-${prod.id}`}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.07 * i }}>
                      <Link href={href}
                        className="group block h-full rounded-2xl overflow-hidden transition-all duration-200"
                        style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow, textDecoration: "none" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.accent}40`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}>
                        {prod.image ? (
                          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3", background: `${cat.accent}10` }}>
                            <Image src={prod.image} alt={prod.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                              className="object-contain p-3" quality={88} />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: `${cat.accent}10` }}>
                            <RiPlugLine style={{ fontSize: 36, color: cat.accent, opacity: 0.6 }} />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ background: `${cat.accent}15`, color: cat.accent, border: `1px solid ${cat.accent}28` }}>
                            {cat.name}
                          </span>
                          <h3 className="font-bold text-sm mb-0.5" style={{ color: text }}>{prod.name}</h3>
                          {prod.subtitle && <p className="text-xs mb-2" style={{ color: faint }}>{prod.subtitle}</p>}
                          {shortDesc && <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>{shortDesc}</p>}
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                            {t("b2b_view_product")}
                            <RiArrowRightLine size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      <ContactBar />
    </div>
  );
}
