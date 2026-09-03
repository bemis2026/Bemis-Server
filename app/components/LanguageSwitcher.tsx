"use client";

// 6-dilli dil seçici (TR/EN/DE/ES/AR/RU). Eski 2-düğmeli TR/EN pill'inin yerine geçer.
// Tetikleyici = bayrak + dil kodu; tıklayınca native adlarla açılır liste. Renkler
// Navbar'ın mevcut lang-toggle token'larından prop olarak gelir (üst/kaydırma/tema uyumu korunur).
// ⚠️ Windows'ta bayrak emoji glyph'i olmayabilir → yanında native ad + kod DAİMA görünür (belirsizlik yok).

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { LANGS, type LangCode } from "../lib/languages";

type Props = {
  compact?: boolean;
  border: string;
  activeBg: string;
  activeColor: string;
  idleColor: string;
  panelBg: string;
  panelBorder: string;
  panelText: string;
};

export default function LanguageSwitcher({
  compact, border, activeBg, activeColor, idleColor, panelBg, panelBorder, panelText,
}: Props) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const pathname = usePathname();
  const router = useRouter();

  // Ürün/kategori sayfalarında dil = GERÇEK URL (indekslenebilir /en). Eşleme
  // varsa oraya git; /en sayfaları İngilizce zorlar (setLang'e gerek yok → Türk
  // ziyaretçinin tercihi localStorage'a yazılmaz). Diğer sayfalarda client-side.
  function onPick(code: LangCode) {
    setOpen(false);
    // {0,2} segment: /products · /products/<kategori> · /products/<kategori>/<ürün>
    // (ürün DETAY sayfaları da eşlensin — tek segmentte kalınca detayda dil
    // değiştirmek TR↔EN geçişi yapmıyordu).
    // 2026-09-03: URL'li dil kolları en/de/es/ru (bkz. app/[lang]/products). Ürün
    // sayfalarında dil = GERÇEK URL: hedef dilin kolu varsa oraya git (zorlanmış dil,
    // setLang gerekmez); yoksa TR yola dön + setLang (ar gibi URL kolu olmayan diller).
    const URL_KOLU = new Set(["en", "de", "es", "ru", "nl"]);
    const trSeg = (pathname ?? "").match(/^\/products((?:\/[^/]+){0,2})$/);
    const langSeg = (pathname ?? "").match(/^\/(en|de|es|ru|nl)\/products((?:\/[^/]+){0,2})$/);
    const segment = trSeg ? (trSeg[1] ?? "") : langSeg ? (langSeg[2] ?? "") : null;
    if (segment !== null) {
      if (URL_KOLU.has(code)) { router.push(`/${code}/products${segment}`); return; }
      if (code === "tr" || langSeg) { setLang(code); router.push(`/products${segment}`); return; }
    }
    setLang(code);
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={current.native}
        className={`flex items-center rounded-lg font-bold uppercase transition-colors ${compact ? "gap-0.5 px-1.5 py-1 text-[10px]" : "gap-1 px-2 py-1 text-[11px]"}`}
        style={{ border, color: activeColor, background: "transparent" }}
      >
        {/* Küçük dünya ikonu + dil KODU (TR/EN/DE…) — üst barı sıkıştırmayan kompakt gösterim.
            (Emoji bayrağı Windows'ta harfe dönüp kodla tekrar ediyordu; SVG her yerde tutarlı.) */}
        <svg width={compact ? 12 : 13} height={compact ? 12 : 13} viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.75, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{current.code.toUpperCase()}</span>
        <svg width="8" height="5" viewBox="0 0 10 6" fill="none" aria-hidden style={{ opacity: 0.5, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 rounded-xl overflow-hidden py-1 z-[70]"
          style={{ background: panelBg, border: panelBorder, minWidth: 170, boxShadow: "0 14px 36px rgba(0,0,0,0.28)" }}
        >
          {LANGS.map((l) => {
            const sel = l.code === lang;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={sel}
                onClick={() => onPick(l.code)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
                style={{ background: sel ? activeBg : "transparent", color: panelText, fontWeight: sel ? 700 : 500 }}
                onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background = activeBg; }}
                onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span className="flex-1 text-left">{l.native}</span>
                <span className="text-[10px] font-bold uppercase" style={{ opacity: 0.5, letterSpacing: "0.04em" }}>{l.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
