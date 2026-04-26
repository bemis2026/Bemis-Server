"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineRefresh, HiOutlineHome, HiOutlineExclamation } from "react-icons/hi";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface errors to console in production so support can grep deploy logs.
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-16"
      style={{ background: "linear-gradient(160deg, #141414 0%, #0e0e0e 50%, #161616 100%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(239,68,68,0.06), transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-2xl">
        <Link href="/" className="inline-block mb-12">
          <Image src="/logo-white.png" alt="Bemis E-V Charge" width={180} height={56}
            className="h-10 w-auto object-contain" priority />
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <HiOutlineExclamation size={14} style={{ color: "#FCA5A5" }} />
          <p className="text-[11px] font-bold tracking-[0.20em] uppercase" style={{ color: "#FCA5A5" }}>
            Beklenmedik Hata
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Bir şeyler<br />
          <span className="text-white/40">ters gitti.</span>
        </h1>
        <p className="text-sm sm:text-base text-white/45 leading-relaxed max-w-lg mb-10">
          Bu sayfayı yüklerken beklenmedik bir hata oluştu. Sayfayı yenilemeyi dene — sorun
          devam ederse bize ulaşırsan en kısa sürede çözeriz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button onClick={() => reset()}
            className="group flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl transition-all duration-200 flex-1"
            style={{ background: "#3B82F6", color: "#fff", border: "1px solid #3B82F6", boxShadow: "0 6px 24px rgba(59,130,246,0.25)" }}>
            <HiOutlineRefresh size={16} />
            <span className="text-sm font-semibold">Sayfayı Yenile</span>
          </button>
          <Link href="/"
            className="group flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl transition-all duration-200 flex-1"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <HiOutlineHome size={16} />
            <span className="text-sm font-semibold">Ana Sayfaya Dön</span>
          </Link>
        </div>

        {error.digest && (
          <div className="rounded-2xl p-4"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="text-[10px] font-semibold text-red-300/70 mb-1.5 uppercase tracking-wider">Hata Kodu (destek için)</p>
            <code className="text-[11px] text-white/60 font-mono break-all">{error.digest}</code>
          </div>
        )}
      </div>
    </main>
  );
}
