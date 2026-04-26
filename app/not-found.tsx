import Link from "next/link";
import Image from "next/image";
import { HiOutlineArrowRight, HiOutlineHome, HiOutlineCube, HiOutlineMail } from "react-icons/hi";

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-16"
      style={{ background: "linear-gradient(160deg, #141414 0%, #0e0e0e 50%, #161616 100%)" }}>
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.08), transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <Image src="/logo-white.png" alt="Bemis E-V Charge" width={180} height={56}
            className="h-10 w-auto object-contain" priority />
        </Link>

        {/* 404 hero */}
        <p className="text-[11px] font-bold tracking-[0.20em] uppercase mb-3"
          style={{ color: "rgba(59,130,246,0.85)" }}>
          Hata · 404
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Aradığın sayfa<br />
          <span className="text-white/40">bulunamadı.</span>
        </h1>
        <p className="text-sm sm:text-base text-white/45 leading-relaxed max-w-lg mb-10">
          Bağlantı bozulmuş veya sayfa kaldırılmış olabilir. Aşağıdan ana sayfaya dönebilir,
          ürün kataloğuna göz atabilir ya da bizimle iletişime geçebilirsin.
        </p>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          {[
            { href: "/",          label: "Ana Sayfa",       icon: HiOutlineHome,  primary: true  },
            { href: "/products",  label: "Ürün Kataloğu",   icon: HiOutlineCube,  primary: false },
            { href: "/#contact",  label: "İletişim",        icon: HiOutlineMail,  primary: false },
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
          <p className="text-xs font-semibold text-white/55 mb-2">Belirli bir ürün mü arıyorsun?</p>
          <p className="text-xs text-white/35 leading-relaxed">
            Ana sayfadaki arama kutusu (sağ üst <kbd className="text-[10px] bg-white/8 border border-white/15 rounded px-1.5 py-0.5">⌘ K</kbd> / <kbd className="text-[10px] bg-white/8 border border-white/15 rounded px-1.5 py-0.5">Ctrl K</kbd>)
            ürün adı, kodu veya kategoriye göre tüm kataloğu tarar.
          </p>
        </div>
      </div>
    </main>
  );
}
