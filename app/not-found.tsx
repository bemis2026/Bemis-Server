"use client";

// ⚠️ SUNUCU bileşeniydi; metni 7 dile bağlamak için istemciye çevrildi.
//    `metadata` export'u YOK → güvenli. Görünüm birebir aynı.
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";
import { pickText } from "./lib/ui";
import Image from "./components/Img";
import { HiOutlineArrowRight, HiOutlineHome, HiOutlineCube, HiOutlineMail } from "react-icons/hi";

export default function NotFound() {
  const { lang } = useLanguage();
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-16"
      style={{ background: "linear-gradient(160deg, #141414 0%, #0e0e0e 50%, #161616 100%)" }}>
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.08), transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <Image src="/logo-white.png" alt="Bemis E-V Charge" width={180} height={56} quality={90}
            className="h-10 w-auto object-contain" priority />
        </Link>

        {/* 404 hero */}
        <p className="text-[11px] font-bold tracking-[0.20em] uppercase mb-3"
          style={{ color: "rgba(59,130,246,0.85)" }}>
          Hata · 404
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          {pickText(lang, "Aradığın sayfa", "The page you are looking for")}<br />
          <span className="text-white/40">{pickText(lang, "bulunamadı.", "was not found.")}</span>
        </h1>
        <p className="text-sm sm:text-base text-white/45 leading-relaxed max-w-lg mb-10">
          {pickText(lang,
            "Bağlantı bozulmuş veya sayfa kaldırılmış olabilir. Aşağıdan ana sayfaya dönebilir, ürün kataloğuna göz atabilir ya da bizimle iletişime geçebilirsin.",
            "The link may be broken or the page may have been removed. You can return to the home page below, browse the product catalogue or get in touch with us.",
          )}
        </p>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          {[
            { href: "/",          label: pickText(lang, "Ana Sayfa", "Home"),                  icon: HiOutlineHome,  primary: true  },
            { href: "/products",  label: pickText(lang, "Ürün Kataloğu", "Product catalogue"), icon: HiOutlineCube,  primary: false },
            { href: "/#contact",  label: pickText(lang, "İletişim", "Contact Us"),             icon: HiOutlineMail,  primary: false },
          ].map(({ href, label, icon: Icon, primary }) => (
            <Link key={href} href={href}
              className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
              style={{
                background: primary ? "#3B82F6" : "rgba(255,255,255,0.04)",
                border: `1px solid ${primary ? "#3B82F6" : "rgba(255,255,255,0.10)"}`,
                color: primary ? "#ffffff" : "rgba(255,255,255,0.75)",
                boxShadow: primary ? "0 6px 24px rgba(59,130,246,0.25)" : "none",
              }}>
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-semibold flex-1">{label}</span>
              <HiOutlineArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Helpful tip */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold text-white/55 mb-2">{pickText(lang, "Belirli bir ürün mü arıyorsun?", "Looking for a specific product?")}</p>
          <p className="text-xs text-white/35 leading-relaxed">
            {pickText(lang, "Ana sayfadaki arama kutusu (sağ üst ", "The search box on the home page (top right ")}<kbd className="text-[10px] bg-white/8 border border-white/15 rounded px-1.5 py-0.5">⌘ K</kbd> / <kbd className="text-[10px] bg-white/8 border border-white/15 rounded px-1.5 py-0.5">Ctrl K</kbd>)
            {pickText(lang, ") ürün adı, kodu veya kategoriye göre tüm kataloğu tarar.", ") searches the whole catalogue by product name, code or category.")}
          </p>
        </div>
      </div>
    </main>
  );
}
