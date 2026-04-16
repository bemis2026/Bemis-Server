"use client";

import { motion } from "framer-motion";
import { RiLinkedinFill, RiInstagramLine } from "react-icons/ri";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import E from "./E";

const productLinks = [
  { label: "AC Wallbox",                   href: "/products/wallbox" },
  { label: "AC Mobile Chargers",           href: "/products/portable" },
  { label: "AC Şarj Kabloları Type 2",     href: "/products/cables" },
  { label: "V2L / C2L Adaptörler",         href: "/products/v2l-c2l" },
  { label: "Uzatma & Dönüştürücüler",      href: "/products/converters" },
  { label: "Aksesuarlar",                  href: "/products/accessories" },
  { label: "DC Şarj Üniteleri →  Yakında", href: "#products", scroll: true },
];

const companyLinks = [
  { label: "Hakkımızda",         href: "#brand-story", scroll: true },
  { label: "Teknoloji",          href: "#technology",  scroll: true },
  { label: "Kalite & Belgeler",  href: "#technology",  scroll: true },
  { label: "İstatistikler",      href: "#stats",       scroll: true },
  { label: "Kariyer",            href: "#contact",     scroll: true },
];

const partnerLinks = [
  { label: "Bayi Bul",           href: "#dealer",  scroll: true },
  { label: "Kurumsal Satış",     href: "#contact", scroll: true },
  { label: "İhracat / Export",   href: "#contact", scroll: true },
  { label: "İş Ortaklığı",       href: "#contact", scroll: true },
  { label: "OEM / Üretici",      href: "/b2b",     scroll: false },
];

const supportLinks = [
  { label: "İletişim",           href: "#contact",    scroll: true  },
  { label: "Teknik Destek",      href: "#contact",    scroll: true  },
  { label: "Dökümanlar",         href: "/documents",  scroll: false },
  { label: "Garanti",            href: "#contact",    scroll: true  },
  { label: "KVKK",               href: "#contact",    scroll: true  },
];

const navGroups = [
  { title: "Ürünler",      links: productLinks },
  { title: "Şirket",       links: companyLinks },
  { title: "İş Ortaklığı", links: partnerLinks },
  { title: "Destek",       links: supportLinks },
];

export default function Footer() {
  const router = useRouter();
  const { social, footer: footerContent, logos } = useContent();
  const { theme } = useTheme();
  const d = theme === "dark";

  const bg          = d ? "linear-gradient(180deg, #141416 0%, #111113 50%, #0e0e10 100%)"
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
  const logoSrc     = d ? (logos?.dark || "/logo-white.png") : (logos?.light || "/logo-black.png");
  const logoStyle   = {};

  const socials = [
    { icon: RiLinkedinFill,  label: "LinkedIn",  href: social.linkedin },
    { icon: RiInstagramLine, label: "Instagram", href: social.instagram },
  ];

  const handleClick = (href: string, scroll: boolean) => {
    if (!scroll) {
      router.push(href);
      return;
    }
    // Scroll target on the same page
    if (href.startsWith("#")) {
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
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

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
                className="h-14 w-auto object-contain"
                style={logoStyle}
              />
            </motion.div>

            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: textMuted }}>
              <E field="footer.description" tag="span" multiline>{footerContent.description}</E>
            </p>

            <p className="text-xs mb-3" style={{ color: textFaint }}><E field="footer.followLabel" tag="span">{footerContent.followLabel}</E></p>
            <div className="flex items-center gap-2 mb-6">
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
              <h4 className="font-semibold text-sm mb-4" style={{ color: textHead }}>{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <button
                      onClick={() => handleClick(link.href, link.scroll ?? true)}
                      className="text-sm transition-colors duration-200 text-left"
                      style={{ color: textMuted }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = textHead; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = textMuted; }}
                    >
                      {link.label}
                    </button>
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
            <div className="flex items-center gap-4 text-xs" style={{ color: textFaint }}>
              <button className="transition-colors hover:opacity-70">Gizlilik Politikası</button>
              <button className="transition-colors hover:opacity-70">KVKK</button>
              <button onClick={() => router.push("/b2b")} className="transition-colors hover:opacity-70">OEM / B2B</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
