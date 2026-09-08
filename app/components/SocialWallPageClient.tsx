"use client";

// /musteri-videolari — kullanıcı paylaşımlarının tam listesi.
// ⚠️ İçerik CMS'ten (socialWallSection) gelir; sunucuda ContentProvider zaten
// dolu geldiği için SSR'da metin BASILIR (arama motoru boş sayfa görmez).

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiInstagramLine, RiArrowRightLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import Footer from "./Footer";
import { SocialGrid, gecerliPaylasimlar } from "./SocialWall";

const PEMBE = "#E1306C";

export default function SocialWallPageClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const { socialWallSection: section, social } = useContent();
  const { lang } = useLanguage();
  const t = (tr: string, en: string) => pickText(lang, tr, en);

  const items = useMemo(() => gecerliPaylasimlar(section?.items), [section?.items]);

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const textFaint = d ? "rgba(240,240,244,0.42)" : "rgba(26,26,26,0.45)";
  const instagramUrl = social?.instagram || "https://www.instagram.com/bemis.evcharge/";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider mb-3" style={{ color: PEMBE }}>
            <RiInstagramLine size={14} />
            {section?.sectionLabel || t("Sosyal Medya", "Social media")}
          </span>
          <h1 className="text-3xl lg:text-4xl font-black mb-3" style={{ color: textPrimary }}>
            {section?.heading || t("Kullanıcılarımızın Paylaşımları", "Posts from our users")}
          </h1>
          <p className="text-base max-w-3xl mb-2" style={{ color: textMuted }}>
            {section?.subheading ||
              t(
                "Bemis E-V Charge kullanan sürücülerin ve bayilerimizin Instagram'da paylaştığı kurulum ve kullanım anları.",
                "Installation and everyday-use moments shared on Instagram by Bemis E-V Charge drivers and dealers."
              )}
          </p>
          <p className="text-sm max-w-3xl mb-8" style={{ color: textFaint }}>
            {t(
              "İçerikler Instagram'da barındırılır; bir karta tıkladığınızda gönderi bu sayfada açılır.",
              "The content is hosted on Instagram; clicking a card opens the post on this page."
            )}
          </p>
        </motion.div>

        {items.length > 0 ? (
          <SocialGrid items={items} />
        ) : (
          <div
            className="rounded-2xl px-6 py-12 text-center"
            style={{ background: d ? "rgba(255,255,255,0.04)" : "#ffffff", border: `1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}
          >
            <RiInstagramLine size={34} style={{ color: PEMBE, margin: "0 auto 12px" }} />
            <p className="text-base font-bold mb-1" style={{ color: textPrimary }}>
              {t("Henüz paylaşım eklenmedi", "No posts added yet")}
            </p>
            <p className="text-sm" style={{ color: textMuted }}>
              {t("Instagram hesabımızdan güncel içerikleri görebilirsiniz.", "You can see the latest content on our Instagram account.")}
            </p>
          </div>
        )}

        {/* Instagram hesabına köprü — sayfa boş kalsa da bir çıkış yolu olsun. */}
        <div className="flex flex-wrap items-center gap-3 mt-10">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: PEMBE, color: "#fff" }}
          >
            <RiInstagramLine size={16} />
            {t("Instagram'da bizi takip edin", "Follow us on Instagram")}
          </a>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: d ? "rgba(255,255,255,0.06)" : "#ffffff", border: `1px solid ${d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`, color: textPrimary }}
          >
            {t("Ürünleri incele", "Browse products")}
            <RiArrowRightLine size={16} />
          </Link>
        </div>
      </main>

      <ContactBar />
      <Footer />
    </div>
  );
}
