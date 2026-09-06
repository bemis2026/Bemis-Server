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
const B2B_FAQ = [
  {
    q: "Şarj cihazı imalatçısı mısınız, ithalatçı mı?",
    a: "İmalatçıyız. AC şarj cihazlarını, Type 2 şarj kablolarını ve şarj ünitesi ekipmanlarını Bursa Organize Sanayi Bölgesi'ndeki kendi tesisimizde üretiyoruz; donanım ve gömülü yazılım kendi Ar-Ge ekibimizde geliştiriliyor. Ürünler ithal edilip etiketlenmiyor.",
  },
  {
    q: "Toptan alım yapabilir miyim?",
    a: "Evet. Elektrik malzemesi toptancıları, pano üreticileri, filo ve enerji firmalarıyla toptan tedarik modelinde çalışıyoruz. Talep ettiğiniz ürün ve adet bilgisiyle bize ulaşırsanız ticari şartları birlikte belirleriz.",
  },
  {
    q: "Kendi markamızla üretim (white-label) yapıyor musunuz?",
    a: "Evet. Mevcut ürün ailemiz sizin markanızla etiketlenebilir; ambalaj, kullanım kılavuzu ve ürün etiketi kendi marka kimliğinizle hazırlanır. Üretim, kalite kontrol ve sertifikasyon bizde kalır.",
  },
  {
    q: "Fason üretimde neler özelleştirilebiliyor?",
    a: "Kablo kesiti ve uzunluğu, soket tipi, mahfaza rengi ve etiketleme talebe göre belirlenebiliyor. Ürün geliştirme sürecinin başından sertifikasyona kadar mühendislik ekibimiz devrede olur.",
  },
  {
    q: "Ürünleriniz hangi sertifikalara sahip?",
    a: "Ürünlerimiz CE sertifikalıdır ve IP65/IP66 koruma sınıfında üretilir; IEC 61851 ve IEC 62196 standartlarına uygundur, OCPP uyumlu modellerimiz mevcuttur. Üretim tesisimiz ISO 9001 kalite yönetim sistemine sahiptir.",
  },
  {
    q: "İhracat yapıyor musunuz?",
    a: "Evet. 60'tan fazla ülkeye ihracat gerçekleştiriyoruz. Dış ticaret talepleri için trade@bemis.com.tr adresinden bize ulaşabilirsiniz; İngilizce üretici ve teklif sayfamız da yayında.",
  },
];

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
    fetch(`/api/products?lang=${lang}`).then(r => r.json()).then((data: Category[]) => {
      setCategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
    fetch(`/api/b2b?lang=${lang}`).then(r => r.json()).then((data: B2BData) => {
      if (data?.hero) setB2bData(data);
    }).catch(() => {});
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
          description: "EV şarj ürünleri OEM üretimi, white-label etiketleme, toplu sipariş ve özel mühendislik çözümleri. CE & IP65 sertifikalı, 60+ ülkeye ihracat tecrübesi.",
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
                  alt="Bemis üretim tesisi"
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
                Çözüm Ortaklığı
              </p>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-4" style={{ color: text }}>
                OEM Üreticilerine Sunduğumuz Çözümler
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: muted }}>
                Bemis Teknik Elektrik, 1994&apos;ten bu yana endüstriyel elektrik
                ekipmanı üretimi yapan, 60+ ülkeye ihracat gerçekleştiren bir
                Türkiye üreticisidir. EV şarj cihazı üreten OEM firmalarına
                bileşen ve mühendislik desteği sunuyoruz.
              </p>
              <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: muted }}>
                Type 2 ve CCS2 soketler, AC ve DC şarj kabloları, elektronik
                kontrol kartları ve özel mahfaza tasarımları ile çözüm
                ortağıyız. Ürün geliştirme sürecinin başından sertifikasyona
                kadar mühendislik ekibimiz devreye girer; tedarik zinciri Bursa
                OSB üretim tesisinden tek noktadan yönetilir.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  // ⚠️ 2026-08-03: "11.000 m²" yazıyordu — o değer TARİHÇEDE 2010
                  // yılına ait (kurumsal timeline'da doğru). Bugünkü tesis sitenin
                  // 12 ayrı yerinde 16.000 m² olarak geçiyor; bu rozet onu güncel
                  // gibi gösterip çelişki yaratıyordu.
                  "16.000 m² Üretim Tesisi",
                  "60+ Ülke İhracat",
                  "CE / TSE / TÜV Sertifikalı",
                  "ISO 9001:2015",
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
            Çalışma Modelleri
          </p>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3" style={{ color: text }}>
            Fason, white-label ve toptan tedarik
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-3xl" style={{ color: muted }}>
            Bemis E-V Charge bir <strong style={{ color: text }}>üretici ve imalatçı</strong>dır; ürünleri
            ithal edip etiketlemez, Bursa Organize Sanayi Bölgesi&apos;ndeki kendi tesisinde üretir.
            Bu yüzden kurumsal alıcılarla üç farklı modelde çalışabiliyoruz.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                t: "Fason / OEM üretim",
                x: "Ürünü sizin teknik şartnamenize göre üretiriz. Kablo kesiti ve uzunluğu, soket tipi, mahfaza rengi ve etiketleme talebinize göre belirlenir; mühendislik ekibimiz tasarımdan sertifikasyona kadar süreçte yer alır.",
              },
              {
                t: "White-label etiketleme",
                x: "Mevcut ürün ailemiz sizin markanızla etiketlenir. Ambalaj, kullanım kılavuzu ve ürün etiketi kendi marka kimliğinizle hazırlanır; üretim ve kalite kontrol bizde kalır.",
              },
              {
                t: "Toptan tedarik",
                x: "Standart katalog ürünlerinin toplu alımı. Elektrik malzemesi toptancıları, panocular, filo ve enerji firmaları için düzenli tedarik; sevkiyat Bursa'daki üretim tesisinden tek noktadan yönetilir.",
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
            Kurumsal alım soruları
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {B2B_FAQ.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: d ? "rgba(255,255,255,0.04)" : "#ffffff", border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: text }}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{f.a}</p>
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
