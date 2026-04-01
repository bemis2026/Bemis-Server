"use client";

import { motion } from "framer-motion";
import { RiLinkedinFill, RiInstagramLine, RiTwitterXLine } from "react-icons/ri";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContent } from "../context/ContentContext";

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
  { label: "Bayilik Başvurusu",  href: "#dealer",  scroll: true },
  { label: "Kurumsal Satış",     href: "#contact", scroll: true },
  { label: "İhracat / Export",   href: "#contact", scroll: true },
  { label: "İş Ortaklığı",       href: "#contact", scroll: true },
  { label: "OEM / Üretici",      href: "/b2b",     scroll: false },
];

const supportLinks = [
  { label: "İletişim",           href: "#contact", scroll: true },
  { label: "Teknik Destek",      href: "#contact", scroll: true },
  { label: "Kurulum Kılavuzu",   href: "#contact", scroll: true },
  { label: "Garanti",            href: "#contact", scroll: true },
  { label: "KVKK",               href: "#contact", scroll: true },
];

const navGroups = [
  { title: "Ürünler",      links: productLinks },
  { title: "Şirket",       links: companyLinks },
  { title: "İş Ortaklığı", links: partnerLinks },
  { title: "Destek",       links: supportLinks },
];

export default function Footer() {
  const router = useRouter();
  const { social } = useContent();

  const socials = [
    { icon: RiLinkedinFill,  label: "LinkedIn",    href: social.linkedin },
    { icon: RiInstagramLine, label: "Instagram",   href: social.instagram },
    { icon: RiTwitterXLine,  label: "X / Twitter", href: social.twitter },
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
    <footer className="border-t border-[#242424] overflow-hidden" style={{ background: "linear-gradient(180deg, #141416 0%, #111113 50%, #0e0e10 100%)" }}>
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
                src="/logo-white.png"
                alt="Bemis E-V Charge"
                width={130}
                height={42}
                className="h-8 w-auto object-contain"
              />
            </motion.div>

            <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
              Bemis Teknik Elektrik A.Ş. bünyesindeki EV şarj ekipmanları markamız.
              1994&apos;ten bu yana Türkiye&apos;den dünyaya kaliteli elektrik ekipmanı.
            </p>

            <p className="text-white/20 text-xs mb-3">Bizi takip edin:</p>
            <div className="flex items-center gap-2 mb-6">
              {socials.map((s, i) => (
                s.href ? (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/35 hover:text-white hover:border-white/30 transition-all duration-200"
                    aria-label={s.label}
                  >
                    <s.icon className="text-sm" />
                  </a>
                ) : (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-white/20 cursor-default"
                    aria-label={s.label}
                  >
                    <s.icon className="text-sm" />
                  </div>
                )
              ))}
            </div>

            {/* B2B note */}
            <div className="border border-[#1e1e1e] rounded-xl px-4 py-3 max-w-xs">
              <p className="text-white/20 text-xs leading-relaxed">
                Üreticiler ve OEM çözümleri için{" "}
                <button
                  onClick={() => router.push("/b2b")}
                  className="text-white/40 underline hover:text-white/60 transition-colors"
                >
                  profesyonel ürün sayfamızı
                </button>{" "}
                ziyaret edin.
              </p>
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
              <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <button
                      onClick={() => handleClick(link.href, link.scroll ?? true)}
                      className="text-white/35 hover:text-white/70 text-sm transition-colors duration-200 text-left"
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
      <div className="border-t border-[#222222]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-white/20 text-xs">
              <span>© 2026 Bemis Teknik Elektrik A.Ş.</span>
              <span className="hidden sm:block text-white/10">·</span>
              <span>Tüm hakları saklıdır.</span>
              <span className="hidden sm:block text-white/10">·</span>
              <span>Yerli Üretim, Küresel Kalite</span>
            </div>
            <div className="flex items-center gap-4 text-white/20 text-xs">
              <button className="hover:text-white/40 transition-colors">Gizlilik Politikası</button>
              <button className="hover:text-white/40 transition-colors">KVKK</button>
              <button
                onClick={() => router.push("/b2b")}
                className="hover:text-white/40 transition-colors"
              >
                OEM / B2B
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
