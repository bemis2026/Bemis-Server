"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiSearch } from "react-icons/hi";
import { HiSun, HiMoon } from "react-icons/hi2";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import E from "./E";

const navLinks = [
  { label: "Ana Sayfa",   href: "#hero"       },
  { label: "Kurumsal",    href: "#dna"        },
  { label: "Ürünler",     href: "#products"   },
  { label: "Dökümanlar",  href: "/documents"  },
  { label: "Hesaplayıcı", href: "#calculator" },
  { label: "Bayi Ağı",    href: "#dealer"     },
  { label: "İletişim",    href: "#contact"    },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
          <button
            className="flex-shrink-0 focus:outline-none"
            onClick={() => handleNavClick("#hero")}
            aria-label="Ana sayfa"
          >
            <Image
              src={logoSrc}
              alt="Bemis E-V Charge"
              width={200}
              height={64}
              className="h-14 w-auto object-contain block"
              style={{ filter: logoFilter }}
              priority
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {activeNavLinks.map((link, idx) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-semibold transition-colors duration-200 relative group ${
                  isDark ? "text-white/80 hover:text-white" : "text-black/85 hover:text-black"
                }`}
              >
                <E field={`navbar.links.${idx}.label`} tag="span">{link.label}</E>
                <span className={`absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${isDark ? "bg-white/50" : "bg-black/50"}`} />
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.12)" }}>
              {(["tr", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
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
            <button
              onClick={onSearchOpen}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/65 hover:text-white hover:bg-white/8" : "text-black/75 hover:text-black hover:bg-black/6"}`}
              title="Ara (Ctrl+K)"
            >
              <HiSearch size={17} />
            </button>
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/65 hover:text-white hover:bg-white/8" : "text-black/75 hover:text-black hover:bg-black/6"}`}
              title={isDark ? "Aydınlık mod" : "Karanlık mod"}
            >
              {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>
            <button
              onClick={() => handleNavClick("#contact")}
              className={`ml-1 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors ${isDark ? "bg-[#0A0A0A] hover:bg-[#2a2a2a] text-white" : "hover:opacity-80"}`}
              style={isDark ? {} : { backgroundColor: "#111111", color: "#ffffff" }}
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
            <button onClick={onSearchOpen} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black"}`}>
              <HiSearch size={17} />
            </button>
            <button onClick={toggle} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black"}`}>
              {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 ${isDark ? "text-white/70" : "text-black"}`}
            >
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
              {activeNavLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-base font-medium py-3 text-left border-b transition-colors ${
                    isDark
                      ? "text-white/60 hover:text-white border-white/6"
                      : "text-black/60 hover:text-black border-black/6"
                  } last:border-0`}
                >
                  <E field={`navbar.links.${i}.label`} tag="span">{link.label}</E>
                </motion.button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className={`mt-3 font-semibold py-3 rounded-lg text-sm ${isDark ? "bg-[#0A0A0A] text-white" : "bg-[#111111] text-white"}`}
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
