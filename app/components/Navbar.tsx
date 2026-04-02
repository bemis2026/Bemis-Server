"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiSearch } from "react-icons/hi";
import { HiSun, HiMoon } from "react-icons/hi2";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Ana Sayfa",   href: "#hero"       },
  { label: "Kurumsal",    href: "#dna"        },
  { label: "Ürünler",     href: "#products"   },
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
    if (pathname !== "/") {
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
            : "bg-white/97 backdrop-blur-xl border-b border-black/8 shadow-xl"
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
            {isDark ? (
              /* Dark mode: white logo directly on dark background */
              <Image
                src="/logo-white.png"
                alt="Bemis E-V Charge"
                width={200}
                height={64}
                className="h-14 w-auto object-contain block"
                priority
              />
            ) : (
              /* Light mode: white logo on dark pill for contrast */
              <div className="bg-[#0A0A0A] rounded-xl px-3 py-2">
                <Image
                  src="/logo-white.png"
                  alt="Bemis E-V Charge"
                  width={200}
                  height={64}
                  className="h-14 w-auto object-contain block"
                  priority
                />
              </div>
            )}
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isDark ? "text-white/55 hover:text-white" : "text-black/55 hover:text-black"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${isDark ? "bg-white/50" : "bg-black/50"}`} />
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/40 hover:text-white hover:bg-white/8" : "text-black/40 hover:text-black hover:bg-black/6"}`}
              title="Ara (Ctrl+K)"
            >
              <HiSearch size={17} />
            </button>
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-white/40 hover:text-white hover:bg-white/8" : "text-black/40 hover:text-black hover:bg-black/6"}`}
              title={isDark ? "Aydınlık mod" : "Karanlık mod"}
            >
              {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>
            <button
              onClick={() => handleNavClick("#contact")}
              className={`ml-1 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors ${isDark ? "bg-[#0A0A0A] hover:bg-[#2a2a2a] text-white" : "bg-[#111111] hover:bg-[#333333] text-white"}`}
            >
              Bize Ulaşın
            </button>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-1">
            <button onClick={onSearchOpen} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black/50"}`}>
              <HiSearch size={17} />
            </button>
            <button onClick={toggle} className={`p-2 rounded-lg ${isDark ? "text-white/50" : "text-black/50"}`}>
              {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 ${isDark ? "text-white/70" : "text-black/70"}`}
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
              {navLinks.map((link, i) => (
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
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className={`mt-3 font-semibold py-3 rounded-lg text-sm ${isDark ? "bg-[#0A0A0A] text-white" : "bg-[#111111] text-white"}`}
              >
                Bize Ulaşın
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
