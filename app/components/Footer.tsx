"use client";

import { motion } from "framer-motion";
import { RiLinkedinFill, RiInstagramLine, RiYoutubeFill, RiFacebookFill } from "react-icons/ri";
import { HiPhone, HiMail } from "react-icons/hi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { byLang, pickText } from "../lib/ui";
import E from "./E";

// Footer iç linkleri (SSR — Google taraması için sayılır). Ürünler: 8 kategori;
// Şirket: Bemis Dünyası/Yerli Üretim/Blog/Bursa EV Şarj; Destek: Dökümanlar/SSS/Rehberler.
type FooterPair = { tr: string; en: string };
type FooterLink = {
  label: FooterPair; href: string; scroll: boolean;
  /** ⚠️ SADECE TÜRKÇE footer'da göster (2026-08-03). Şehir iniş sayfaları
   *  bilinçli olarak yalnız Türkçe yazıldı (yerel SEO hedefi); etiket çevrili
   *  olduğu için yabancı ziyaretçi İngilizce linkten Türkçe sayfaya düşüyordu.
   *  📌 Sayfa gerçekten çevrilirse bu bayrağı KALDIR. */
  trOnly?: boolean;
};

// ⚠️ 2026-08-01 — YAPI DEĞİŞTİ. Eskiden `{ tr: [...], en: [...] }` iki PARALEL
// diziydi ve `byLang` yabancı dilde EN dizisini OLDUĞU GİBİ döndürüyordu →
// footer'ın 24 linkinin 24'ü de/es/ar/ru'da İNGİLİZCE kalıyordu.
// Ayrıca iki dizi zamanla AYRIŞMIŞTI: 26 Tem'de TR'ye eklenen "Arıza & Garanti"
// linki EN dizisine hiç eklenmemiş → İngilizce footer'da destek girişi YOKTU.
// Artık TEK dizi; her etiket kendi {tr,en} çiftini taşır → kayma yapısal olarak
// imkansız. Yabancı diller pickText üzerinden ui.json'dan çevrilir.
// 📌 Yeni link eklerken tek yere ekle; iki dil de aynı satırda durur.
const NAV_GROUPS: { title: FooterPair; links: FooterLink[] }[] = [
  { title: { tr: "Ürünler", en: "Products" }, links: [
    { label: { tr: "AC Wallbox",                 en: "AC Wallbox" },                 href: "/products/wallbox",           scroll: false },
    { label: { tr: "AC Mobile Chargers",         en: "AC Mobile Chargers" },         href: "/products/portable",          scroll: false },
    { label: { tr: "AC Şarj Kabloları Type 2",   en: "AC Charging Cables Type 2" },  href: "/products/cables",            scroll: false },
    { label: { tr: "V2L / C2L Adaptörler",       en: "V2L / C2L Adapters" },         href: "/products/v2l-c2l",           scroll: false },
    // ⚠️ Kategori adı 4 yerde yaşıyor (content bin · burası · products bin ·
    // seo.ts). 2026-08-05'te hepsi tek ada çekildi — biri değişip öteki unutulmasın.
    { label: { tr: "Dönüştürücü Adaptörler ve Uzatma Kabloları", en: "Converter Adapters & Extension Cables" }, href: "/products/converters", scroll: false },
    { label: { tr: "DC Şarj Üniteleri",          en: "DC Charging Units" },          href: "/products/dc-units",          scroll: false },
    { label: { tr: "Şarj Ünitesi Ekipmanları",   en: "Charger Equipment" },          href: "/products/charger-equipment", scroll: false },
    { label: { tr: "Aksesuarlar",                en: "Accessories" },                href: "/products/accessories",       scroll: false },
  ]},
  { title: { tr: "Şirket", en: "Company" }, links: [
    { label: { tr: "Hakkımızda",      en: "About Us" },            href: "#dna",                     scroll: true  },
    { label: { tr: "Bemis Dünyası",   en: "Bemis World" },         href: "/kurumsal",                scroll: false },
    { label: { tr: "Yerli Üretim",    en: "In-House Production" }, href: "/uretici",                 scroll: false },
    { label: { tr: "Blog & Haberler", en: "Blog & News" },         href: "/blog",                    scroll: false },
    // ⚠️ trOnly: şehir iniş sayfaları yalnız Türkçe yazıldı (yerel SEO hedefi).
    // Yabancı dilde İngilizce etiketten Türkçe sayfaya düşülüyordu.
    { label: { tr: "Bursa EV Şarj",   en: "Bursa EV Charging" },   href: "/bursa-ev-sarj-istasyonu", scroll: false, trOnly: true },
    { label: { tr: "İstatistikler",   en: "Statistics" },          href: "#stats",                   scroll: true  },
  ]},
  { title: { tr: "İş Ortaklığı", en: "Partnership" }, links: [
    { label: { tr: "Bayi Bul",            en: "Find a Dealer" },      href: "#dealer",        scroll: true  },
    { label: { tr: "OEM / Üretici",       en: "OEM / Manufacturer" }, href: "/b2b",           scroll: false },
    { label: { tr: "Bayilik Başvurusu",   en: "Dealer Application" }, href: "/bayilik",       scroll: false },
    { label: { tr: "Şarj Ağı Operatörü",  en: "Network Operators" },  href: "/operator",      scroll: false },
    { label: { tr: "İhracat / Export",    en: "Export" },             href: "#dealer-export", scroll: true  },
  ]},
  { title: { tr: "Destek", en: "Support" }, links: [
    // ⚠️ 2026-07-26: "Destek" sütunu vardı ama arızalı ürünü olan kullanıcı için
    // hiçbir giriş yoktu (döküman/SSS/hesaplayıcı). En üste eklendi.
    // ⚠️ 2026-08-01: bu satırın İngilizcesi EKSİKTİ, eklendi.
    { label: { tr: "Arıza & Garanti",       en: "Fault & Warranty" }, href: "/destek",         scroll: false },
    { label: { tr: "Dökümanlar",            en: "Documents" },        href: "/documents",      scroll: false },
    { label: { tr: "Kalite & Belgeler",     en: "Quality & Certs" },  href: "/documents",      scroll: false },
    { label: { tr: "Sıkça Sorulan Sorular", en: "FAQ" },              href: "/blog#sss",       scroll: false },
    { label: { tr: "Rehberler",             en: "Guides" },           href: "/blog#rehberler", scroll: false },
    { label: { tr: "Hesaplayıcı",           en: "Calculator" },       href: "#calculator",     scroll: true  },
  ]},
];

export default function Footer() {
  const router = useRouter();
  const { social, footer: footerContent, logos, contact } = useContent();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  // Etiketler dile göre ÇEVRİLİR (eskiden byLang tüm EN dizisini dönüyordu).
  const navGroups = NAV_GROUPS.map((g) => ({
    title: pickText(lang, g.title.tr, g.title.en),
    links: g.links
      .filter((l) => !l.trOnly || lang === "tr")
      .map((l) => ({ ...l, label: pickText(lang, l.label.tr, l.label.en) })),
  }));

  const bg          = d ? "linear-gradient(180deg, #202022 0%, #1c1c1e 50%, #1a1a1c 100%)"
                        : "linear-gradient(180deg, #efefef 0%, #e8e8e8 50%, #e4e4e4 100%)";
  const borderTop   = d ? "#242424" : "#d8d8d8";
  const borderBot   = d ? "#222222" : "#d0d0d0";
  const textMuted   = d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const textFaint   = d ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.30)";
  const textFainter = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.15)";
  const textHead    = d ? "#ffffff" : "#111111";
  const socialBg    = d ? "#1e1e1e" : "#ffffff";
  const socialBorder = d ? "#2a2a2a" : "#d4d4d4";
  const socialText  = d ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)";
  const socialHoverText  = d ? "#ffffff" : "#111111";
  const socialHoverBorder = d ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)";
  const b2bBorder   = d ? "#1e1e1e" : "#d8d8d8";
  const logoSrc     = logos?.dark || "/logo-white.png";
  const logoStyle   = d ? {} : { filter: "brightness(0)" };

  const socials = [
    { icon: RiLinkedinFill,  label: "LinkedIn",  href: social.linkedin },
    { icon: RiInstagramLine, label: "Instagram", href: social.instagram },
    { icon: RiYoutubeFill,   label: "YouTube",   href: social.youtube },
    { icon: RiFacebookFill,  label: "Facebook",  href: social.facebook },
  ];

  const handleClick = (href: string, scroll: boolean) => {
    if (!scroll) {
      router.push(href);
      return;
    }
    // Scroll target on the same page
    if (href.startsWith("#")) {
      // dealer-export is gated behind the Yurtdışı tab, so its element only
      // exists when DealerNetwork is in that mode. Set the hash explicitly
      // (and dispatch hashchange even when already on the same value) so
      // DealerNetwork's listener can flip the tab and scroll into view.
      if (href === "#dealer-export") {
        if (window.location.pathname !== "/") {
          router.push(`/${href}`);
          return;
        }
        if (window.location.hash === href) {
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {
          window.location.hash = "dealer-export";
        }
        return;
      }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate home then scroll (if on a sub-page)
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <footer className="overflow-hidden" style={{ background: bg, borderTop: `1px solid ${borderTop}` }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 sm:gap-8">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-5 cursor-pointer inline-block"
              onClick={() => handleClick("#hero", true)}
            >
              <Image
                src={logoSrc}
                alt="Bemis E-V Charge"
                width={220}
                height={72}
                quality={90}
                className="h-14 w-auto object-contain"
                style={logoStyle}
              />
            </motion.div>

            {/* Uzun tanıtım paragrafı mobilde GİZLİ — footer'ı gereksiz uzatıyordu
                (kullanıcı isteği). Masaüstünde (sm+) marka anlatısı olarak kalır. */}
            <p className="hidden sm:block text-sm leading-relaxed mb-5 max-w-xs" style={{ color: textMuted }}>
              <E field="footer.description" tag="span" multiline>{footerContent.description}</E>
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <img
                src="/badges/yerli-uretim.jpg"
                alt="Yerli Üretim"
                className="h-8 w-auto object-contain"
                style={{ filter: d ? "invert(1) brightness(0.85)" : "none", opacity: d ? 0.7 : 0.6 }}
                loading="lazy"
                decoding="async"
              />
            </div>

            <p className="text-xs mb-3" style={{ color: textFaint }}><E field="footer.followLabel" tag="span">{footerContent.followLabel}</E></p>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              {socials.map((s, i) => (
                s.href ? (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{ background: socialBg, border: `1px solid ${socialBorder}`, color: socialText }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = socialHoverText; (e.currentTarget as HTMLElement).style.borderColor = socialHoverBorder; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = socialText; (e.currentTarget as HTMLElement).style.borderColor = socialBorder; }}
                    aria-label={s.label}
                  >
                    <s.icon className="text-sm" />
                  </a>
                ) : (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-default"
                    style={{ background: socialBg, border: `1px solid ${socialBorder}`, color: textFainter }}
                    aria-label={s.label}
                  >
                    <s.icon className="text-sm" />
                  </div>
                )
              ))}
            </div>

          </div>

          {/* Nav columns */}
          {navGroups.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="col-span-1"
            >
              {/* h4→h3: W3C başlık sırası (h2'den sonra h4 atlamaydı); görünüm sınıflardan, birebir aynı. */}
              <h3 className="font-semibold text-sm mb-2.5 sm:mb-4" style={{ color: textHead }}>{group.title}</h3>
              <ul className="space-y-1.5 sm:space-y-2.5">
                {group.links.map((link, j) => (
                  <li key={j}>
                    {/* Gerçek <a href> → Google taranabilir iç-link olarak görür
                        (sitelink adayı + iç-link gücü). onClick SPA/yumuşak-kaydırma
                        davranışını korur; hash hedefleri "/#..." ile ana sayfaya çözülür. */}
                    <a
                      href={link.scroll ? `/${link.href}` : link.href}
                      onClick={e => {
                        // Sol-tık (modifiersiz) → SPA/kaydırma davranışı; ctrl/cmd/shift-tık
                        // → href sayesinde tarayıcı yeni sekmede açar (engelleme).
                        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                        e.preventDefault();
                        handleClick(link.href, link.scroll ?? true);
                      }}
                      className="text-sm transition-colors duration-200 text-left inline-block"
                      style={{ color: textMuted }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = textHead; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = textMuted; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${borderBot}` }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: textFaint }}>
              <E field="footer.copyright" tag="span">{footerContent.copyright}</E>
              <span className="hidden sm:block" style={{ color: textFainter }}>·</span>
              <E field="footer.rightsLabel" tag="span">{footerContent.rightsLabel}</E>
              <span className="hidden sm:block" style={{ color: textFainter }}>·</span>
              <E field="footer.tagline" tag="span">{footerContent.tagline}</E>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs" style={{ color: textFaint }}>
              {contact?.phone && (
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70">
                  <HiPhone style={{ fontSize: 12 }} /> {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70">
                  <HiMail style={{ fontSize: 12 }} /> {contact.email}
                </a>
              )}
              <a href="/b2b" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); router.push("/b2b"); }} className="transition-colors hover:opacity-70">OEM / B2B</a>
              {/* KVKK sayfaları — kullanıcı metinleri onayladı (2026-07-12); gerçek <a> = taranabilir */}
              <a href="/gizlilik" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); router.push("/gizlilik"); }} className="transition-colors hover:opacity-70">{byLang({ tr: "Gizlilik / KVKK", en: "Privacy / GDPR" }, lang)}</a>
              <a href="/cerez-politikasi" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); router.push("/cerez-politikasi"); }} className="transition-colors hover:opacity-70">{byLang({ tr: "Çerez Politikası", en: "Cookie Policy" }, lang)}</a>
              {/* Bemis Grup — kardeş markalar. Basit tutuldu (kullanıcı kararı 2026-07-13):
                  şemada karmaşık hiyerarşi YOK; Organization.parentOrganization zaten
                  bemis.com.tr + ana şirket Wikidata bağını taşıyor. Bu satır ziyaretçiye
                  grup yapısını gösterir; flex-wrap içinde olduğu için footer BÜYÜMEZ.
                  ⚠️ Bunlar DIŞ link — bize backlink kazandırmaz (asıl kazanç: bemis.com.tr'nin
                  bize link vermesi, o taraf ayrı sitede yapılmalı). */}
              <span className="inline-flex items-center gap-2">
                <span style={{ color: textFainter }}>Bemis Grup:</span>
                {/* Kendi markamız — basınca anasayfa (SPA, aynı sekme). Kardeş
                    markalar (Bemis Teknik / BYES) dış site → yeni sekme. */}
                <a href="/" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); router.push("/"); }} className="transition-colors hover:opacity-70">Bemis E-V Charge</a>
                <span style={{ color: textFainter }}>·</span>
                <a href="https://www.bemis.com.tr" target="_blank" rel="noopener" className="transition-colors hover:opacity-70">Bemis Teknik</a>
                <span style={{ color: textFainter }}>·</span>
                <a href="https://www.byes.com.tr" target="_blank" rel="noopener" className="transition-colors hover:opacity-70">BYES</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
