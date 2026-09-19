"use client";

import Link from "next/link";
import Img from "../components/Img";
import { motion } from "framer-motion";
import { RiWhatsappFill, RiMailLine, RiPhoneLine, RiArrowRightLine, RiShieldCheckLine, RiBuilding2Line, RiAwardLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import { accentInk } from "../lib/accentInk";
import { forcedLangForPath, urunYolu } from "../lib/languages";
import { usePathname } from "next/navigation";
import type { BlogUrun } from "../lib/blogProducts";

// Blog yazısı sayfasının ticari yüzeyleri: ürün ızgarası + iletişim/pazarlama
// bandı + okurken görünen yapışkan yan panel.
//
// ⚠️ NEDEN AYRI DOSYA: BlogShell zaten 535 satır ve 3 görünüm (liste/yazı/haber)
// barındırıyor; bu bloklar oraya gömülseydi dosya okunamaz hâle gelirdi.
//
// ⚠️ İÇERİK SINIRI — UYDURMA TİCARİ VAAT YOK:
// Bantta geçen üç olgu (1994'ten beri üretim · CE belgeli · 2 yıl üretici garantisi)
// sitenin başka yerlerinde ZATEN yazılı ve doğrulanmış olgulardır. Fiyat, teslim
// süresi, iskonto, stok ya da "ücretsiz kurulum" gibi ifade EKLENMEZ.
// ⚠️ IP65 BİLEREK YAZILMADI: katalog karma (DC üniteleri IP54) → kategori-geneli
//    koruma iddiası site içi çelişki üretir.

const BLUE = "#3B82F6";

/**
 * Dile göre iletişim hedefi.
 * ⚠️ `/iletisim` YALNIZ Türkçe; `/export` İngilizce ihracat masası. Diğer dillerde
 *    karşılığı olan bir iletişim SAYFASI yok → e-postaya düşülür (dil sorunu olmaz).
 *    Karşılığı olmayan bir sayfaya link vermek ziyaretçiyi Türkçe gövdeye atardı.
 */
function iletisimHedefi(lang: string, email: string): string {
  if (lang === "tr") return "/iletisim";
  if (lang === "en") return "/export";
  return email ? `mailto:${email}` : "/export";
}

/* ── Öne çıkan ürünler ızgarası ──────────────────────────────────────────── */
export function UrunBlogu({ urunler, hedef, d, surface, border, textPrimary, textMuted, textFaint }: {
  urunler: BlogUrun[]; hedef: string; d: boolean; surface: string; border: string; textPrimary: string; textMuted: string; textFaint: string;
}) {
  const { lang } = useLanguage();
  const forced = forcedLangForPath(usePathname());
  const taban = forced && forced !== "tr" ? `/${forced}` : "";
  if (urunler.length === 0) return null;

  return (
    <section className="mt-16 pt-10" style={{ borderTop: `1px solid ${border}` }}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentInk(BLUE, d) }}>
            {pickText(lang, "ÜRÜNLERİMİZ", "OUR PRODUCTS")}
          </span>
          <h2 className="text-2xl font-black mt-1.5" style={{ color: textPrimary }}>
            {pickText(lang, "Öne Çıkan Ürünler", "Featured Products")}
          </h2>
          <p className="text-sm mt-1.5 max-w-xl" style={{ color: textMuted }}>
            {pickText(lang, "Bu rehberdeki konuyla ilgili, kendi tesisimizde ürettiğimiz çözümler.", "Solutions we manufacture in our own facility, related to this guide.")}
          </p>
        </div>
        <Link href={urunYolu(hedef, forced)} className="text-sm font-bold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors"
          style={{ background: `${BLUE}14`, color: accentInk(BLUE, d), border: `1px solid ${BLUE}30` }}>
          {pickText(lang, "Tüm ürünleri gör", "Browse all products")} <RiArrowRightLine size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {urunler.map((u) => (
          <UrunKarti key={u.id} u={u} d={d} surface={surface} border={border} textPrimary={textPrimary} textFaint={textFaint} taban={taban} />
        ))}
      </div>
    </section>
  );
}

/* ── Ürün kartı ──────────────────────────────────────────────────────────── */
function UrunKarti({ u, d, surface, border, textPrimary, textFaint, taban }: {
  u: BlogUrun; d: boolean; surface: string; border: string; textPrimary: string; textFaint: string; taban: string;
}) {
  const { lang } = useLanguage();
  return (
    <Link
      href={`${taban}/products/${u.kategoriId}/${u.id}`}
      className="group rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: "#f3f4f6" }}>
        <Img src={u.gorsel} alt={u.ad} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 22vw" className="object-contain p-3" quality={88} />
      </div>
      <div className="p-3.5 flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textFaint }}>{u.kategoriAdi}</span>
        <span className="text-sm font-bold leading-snug" style={{ color: textPrimary }}>{u.ad}</span>
        {u.altBaslik && <span className="text-xs leading-snug" style={{ color: textFaint }}>{u.altBaslik}</span>}
        <span className="mt-auto pt-2 text-xs font-bold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: accentInk(BLUE, d) }}>
          {pickText(lang, "İncele", "View Product")}
          <RiArrowRightLine size={13} />
        </span>
      </div>
    </Link>
  );
}

/* ── İletişim / pazarlama bandı ──────────────────────────────────────────── */
export function IletisimBandi({ d, border, textPrimary, textMuted }: {
  d: boolean; border: string; textPrimary: string; textMuted: string;
}) {
  const { lang } = useLanguage();
  const { contact } = useContent();

  const rawWa = (contact.whatsappPhone?.trim() || contact.phone || "").trim();
  const waDigits = rawWa.replace(/\D/g, "");
  const waMsg = (contact.whatsappMessage ?? "").trim() || "Merhaba, Bemis E-V Charge ürünleri hakkında bilgi almak istiyorum.";
  const email = (contact.email ?? "").trim();
  const phone = (contact.phone ?? "").trim();

  const olgular = [
    { ikon: RiBuilding2Line, metin: pickText(lang, "1994'ten bu yana kendi tesisimizde üretim", "Manufacturing in our own facility since 1994") },
    { ikon: RiAwardLine,     metin: pickText(lang, "CE belgeli ürün ailesi", "CE-certified product family") },
    { ikon: RiShieldCheckLine, metin: pickText(lang, "2 yıl üretici garantisi", "2-year manufacturer warranty") },
  ];

  // ⚠️⚠️ `opacity: 0` BİLEREK KULLANILMADI — bu depoda BEŞ ayrı görünmezlik
  //    kusurunun tek sebebi oydu: initial={{opacity:0}} sunucu HTML'ine
  //    `opacity:0` basar ve gözlemci/rAF tetiklenmezse blok KALICI görünmez
  //    kalır. Burası bir DÖNÜŞÜM bandı (Bize Ulaşın / WhatsApp) → görünmemesi
  //    doğrudan iş kaybı. Yalnız `y` kaydırması animasyonlu.
  return (
    <motion.section
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="mt-12 rounded-3xl overflow-hidden"
      style={{
        background: d
          ? "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.04) 100%)"
          : "linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.03) 100%)",
        border: `1px solid ${BLUE}33`,
      }}
    >
      <div className="p-6 sm:p-9 lg:p-11 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
        <div>
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accentInk(BLUE, d) }}>
            {pickText(lang, "DESTEK", "SUPPORT")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-3 leading-tight" style={{ color: textPrimary }}>
            {pickText(lang, "Doğru ürünü birlikte seçelim", "Let's choose the right product together")}
          </h2>
          <p className="text-sm sm:text-[15px] leading-relaxed mb-5 max-w-xl" style={{ color: textMuted }}>
            {pickText(
              lang,
              "Aracınıza ve tesisatınıza hangi ürünün uyduğundan emin değilseniz bize yazın; yetkili bayimiz veya satış ekibimiz yönlendirsin.",
              "Not sure which product fits your vehicle and electrical installation? Get in touch and our authorised dealer or sales team will guide you.",
            )}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {waDigits && (
              <a
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{ background: "#25D366" }}
              >
                <RiWhatsappFill size={17} />
                {pickText(lang, "WhatsApp'tan yazın", "Message on WhatsApp")}
              </a>
            )}
            <Link
              href={iletisimHedefi(lang, email)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5 cursor-pointer"
              style={{ background: BLUE }}
            >
              <RiMailLine size={16} />
              {pickText(lang, "Bize Ulaşın", "Contact Us")}
            </Link>
          </div>
        </div>

        <ul className="space-y-3">
          {olgular.map((o, i) => {
            const I = o.ikon;
            return (
              <li key={i} className="flex items-start gap-2.5 text-sm font-semibold" style={{ color: textMuted }}>
                <I size={17} style={{ color: accentInk(BLUE, d), flexShrink: 0, marginTop: 1 }} />
                <span>{o.metin}</span>
              </li>
            );
          })}
          {(phone || email) && (
            <li className="pt-2 mt-1 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${border}` }}>
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-sm font-bold inline-flex items-center gap-2 hover:underline" style={{ color: textPrimary }}>
                  <RiPhoneLine size={15} style={{ color: accentInk(BLUE, d) }} /> {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-sm font-bold inline-flex items-center gap-2 hover:underline" style={{ color: textPrimary }}>
                  <RiMailLine size={15} style={{ color: accentInk(BLUE, d) }} /> {email}
                </a>
              )}
            </li>
          )}
        </ul>
      </div>
    </motion.section>
  );
}

/* ── Yapışkan yan panel (yalnız lg+; okurken görünür) ────────────────────── */
export function YanPanel({ d, surface, border, textPrimary, textMuted, textFaint }: {
  d: boolean; surface: string; border: string; textPrimary: string; textMuted: string; textFaint: string;
}) {
  const { lang } = useLanguage();
  const { contact } = useContent();
  const forced = forcedLangForPath(usePathname());

  const rawWa = (contact.whatsappPhone?.trim() || contact.phone || "").trim();
  const waDigits = rawWa.replace(/\D/g, "");
  const waMsg = (contact.whatsappMessage ?? "").trim() || "Merhaba, Bemis E-V Charge ürünleri hakkında bilgi almak istiyorum.";

  return (
    <div className="sticky top-28 space-y-4">
      <div className="rounded-2xl p-5" style={{ background: surface, border: `1px solid ${border}` }}>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: textFaint }}>
          {pickText(lang, "YERLİ ÜRETİM", "MADE IN TÜRKİYE")}
        </span>
        {/* Marka adı — çevrilmez, pickText'e bağlanmaz (check:i18n de anahtar beklemez). */}
        <p className="text-base font-black mt-2 mb-2 leading-snug" style={{ color: textPrimary }}>
          Bemis E-V Charge
        </p>
        <p className="text-xs leading-relaxed mb-4" style={{ color: textMuted }}>
          {pickText(
            lang,
            "Elektrikli araç şarj kabloları, taşınabilir cihazlar ve duvar tipi istasyonlar — tasarımdan son teste kadar kendi tesisimizde.",
            "EV charging cables, portable devices and wallbox stations — designed and tested in our own facility.",
          )}
        </p>
        <div className="flex flex-col gap-2">
          <Link href={urunYolu("/products", forced)} className="text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5 cursor-pointer" style={{ background: BLUE }}>
            {pickText(lang, "Ürünleri İncele", "Explore Products")}
          </Link>
          {waDigits && (
            <a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              style={{ background: `${BLUE}14`, color: accentInk(BLUE, d), border: `1px solid ${BLUE}30` }}
            >
              <RiWhatsappFill size={15} /> {pickText(lang, "Hemen sorun", "Ask us now")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
