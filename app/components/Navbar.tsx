"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiSearch, HiChevronDown } from "react-icons/hi";
import { HiSun, HiMoon } from "react-icons/hi2";
import { RiBuilding2Line, RiStoreLine, RiWifiLine } from "react-icons/ri";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import E from "./E";

const navLinks = [
  { label: "Ana Sayfa",   href: "#hero"      },
  { label: "Hakkımızda",  href: "#dna"       },
  { label: "Ürünler",     href: "#products"  },
  { label: "Dökümanlar",  href: "/documents" },
  { label: "Bayi Ağı",    href: "#dealer"    },
  { label: "Hesaplayıcı", href: "#calculator"},
  { label: "İletişim",    href: "#contact"   },
  { label: "Kurumsal",    href: "#b2bcta"    },
];

const KURUMSAL_DROPDOWN = [
  { label: "OEM & Üreticiler",        sub: "Teknik portföy ve mühendislik desteği", href: "/b2b",      icon: RiBuilding2Line, accent: "#3B82F6" },
  { label: "Bayilik Başvurusu",        sub: "Bayi ağımıza katılın, bölge koruması", href: "/bayilik",  icon: RiStoreLine,     accent: "#10B981" },
  { label: "Şarj Ağı Operatörleri",   sub: "OCPP ekipman, DLM, uzaktan izleme",    href: "/operator", icon: RiWifiLine,      accent: "#818CF8" },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileKurumsalOpen, setMobileKurumsalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { navbar: navbarContent, logos } = useContent();
  const { lang, setLang } = useLanguage();
  const activeNavLinks = navbarContent?.links?.length ? navbarContent.links : navLinks;
  const logoSrc = logos?.dark || "/logo-white.png";
  const logoFilter = isDark ? undefined : "invert(1)";
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSearchOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith("#")) {
      router.push(href);
    } else if (pathname !== "/") {
      router.push("/" + href);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const isKurumsal = (link: { label: string; href: string }) =>
    link.label === "Kurumsal" || link.href === "#b2bcta" || link.href === "/b2b";

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-[#0A0A0A]/97 backdrop-blur-xl border-b border-white/8 shadow-xl"
            : "bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button className="flex-shrink-0 focus:outline-none" onClick={() => handleNavClick("#hero")} aria-label="Ana sayfa">
            <Image src={logoSrc} alt="Bemis E-V Charge" width={200} height={64}
              className="h-14 w-auto object-contain block" style={{ filter: logoFilter }} priority />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {activeNavLinks.map((link, idx) => {
              const isK = isKurumsal(link);
              return (
                <div key={link.href + idx} className="relative"
                  ref={isK ? dropdownRef : undefined}
                  onMouseEnter={isK ? openDropdown : undefined}
                  onMouseLeave={isK ? scheduleClose : undefined}
                >
                  <button
                    onClick={() => handleNavClick(isK ? "#b2bcta" : link.href)}
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 relative group ${
                      isDark ? "text-white/80 hover:text-white" : "text-black/85 hover:text-black"
                    }`}
                  >
                    <E field={`navbar.links.${idx}.label`} tag="span">{link.label}</E>
                    {isK && <HiChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />}
                    <span className={`absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${isDark ? "bg-white/50" : "bg-black/50"}`} />
                  </button>

                  {/* Dropdown */}
                  {isK && (
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.16 }}
                          onMouseEnter={openDropdown}
                          onMouseLeave={scheduleClose}
                          className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
                          style={{
                            width: 300,
                            background: isDark ? "rgba(12,13,18,0.97)" : "rgba(255,255,255,0.98)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                            boxShadow: isDark
                              ? "0 20px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
                              : "0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          <div className="p-1.5 space-y-0.5">
                            {KURUMSAL_DROPDOWN.map((item) => (
                              <button
                                key={item.href}
                                onClick={() => { setDropdownOpen(false); router.push(item.href); }}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 group/item"
                                style={{ background: "transparent" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}25` }}>
                                  <item.icon size={18} style={{ color: item.accent }} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold leading-tight" style={{ color: isDark ? "#f0f0f4" : "#1a1a1a" }}>{item.label}</p>
                                  <p className="text-[11px] mt-0.5 leading-tight" style={{ color: isDark ? "rgba(240,240,244,0.45)" : "rgba(26,26,26,0.45)" }}>{item.sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          {/* Divider + go to section */}
                          <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                            <button onClick={() => { setDropdownOpen(false); handleNavClick("#b2bcta"); }}
                              className="w-full px-4 py-2.5 text-xs font-semibold text-left transition-colors"
                              style={{ color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.60)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)"; }}
                            >
                              Ana sayfadaki kurumsal bölüme git →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.12)" }}>
              {(["tr", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className="px-2.5 py-1 text-xs font-bold uppercase transition-colors duration-200"
                  style={{
                    background: lang === l ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)") : "transparent",
                    color: lang === l ? (isDark ? "#ffffff" : "#111111") : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={onSearchOpen} className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/50 hover:text-white hover:bg-white/6" : "text-black/50 hover:text-black hover:bg-black/5"}`}>
              <HiSearch size={18} />
            </button>
            <button onClick={toggle} className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/50 hover:text-white hover:bg-white/6" : "text-black/50 hover:text-black hover:bg-black/5"}`}>
              {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>
            <button
              onClick={() => handleNavClick("#contact")}
              className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-white hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)", boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}
            >
              <E field="navbar.ctaLabel" tag="span">{navbarContent?.ctaLabel ?? "Bize Ulaşın"}</E>
            </button>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-1">
            <div className="flex items-center rounded-lg overflow-hidden mr-1" style={{ border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.12)" }}>
              {(["tr", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className="px-2 py-1 text-[10px] font-bold uppercase transition-colors"
                  style={{
                    background: lang === l ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)") : "transparent",
                    color: lang === l ? (isDark ? "#ffffff" : "#111111") : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
                  }}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={onSearchOpen} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black"}`}><HiSearch size={17} /></button>
            <button onClick={toggle} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black"}`}>{isDark ? <HiSun size={17} /> : <HiMoon size={17} />}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 ${isDark ? "text-white/70" : "text-black"}`}>
              {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className={`lg:hidden border-t ${isDark ? "bg-[#181818] border-white/8" : "bg-white border-black/8"}`}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {activeNavLinks.map((link, i) => {
                const isK = isKurumsal(link);
                return (
                  <div key={link.href + i}>
                    <motion.button
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => isK ? setMobileKurumsalOpen(v => !v) : handleNavClick(link.href)}
                      className={`w-full flex items-center justify-between text-base font-medium py-3 text-left border-b transition-colors ${
                        isDark ? "text-white/60 hover:text-white border-white/6" : "text-black/60 hover:text-black border-black/6"
                      }`}
                    >
                      <E field={`navbar.links.${i}.label`} tag="span">{link.label}</E>
                      {isK && <HiChevronDown size={16} className={`transition-transform ${mobileKurumsalOpen ? "rotate-180" : ""}`} />}
                    </motion.button>
                    {isK && mobileKurumsalOpen && (
                      <div className="py-2 space-y-1 pl-2">
                        <button onClick={() => { setMobileOpen(false); handleNavClick("#b2bcta"); }}
                          className={`block w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"}`}>
                          ↳ Ana sayfadaki kurumsal bölüm
                        </button>
                        {KURUMSAL_DROPDOWN.map(item => (
                          <button key={item.href} onClick={() => { setMobileOpen(false); router.push(item.href); }}
                            className={`flex items-center gap-2 w-full text-left text-sm py-2 px-3 rounded-lg ${isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}>
                            <item.icon size={14} style={{ color: item.accent }} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => handleNavClick("#contact")}
                className="mt-3 font-semibold py-3 rounded-lg text-sm text-white"
                style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
              >
                <E field="navbar.ctaLabel" tag="span">{navbarContent?.ctaLabel ?? "Bize Ulaşın"}</E>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
