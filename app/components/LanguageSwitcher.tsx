"use client";

// 6-dilli dil seçici (TR/EN/DE/ES/AR/RU). Eski 2-düğmeli TR/EN pill'inin yerine geçer.
// Tetikleyici = bayrak + dil kodu; tıklayınca native adlarla açılır liste. Renkler
// Navbar'ın mevcut lang-toggle token'larından prop olarak gelir (üst/kaydırma/tema uyumu korunur).
// ⚠️ Windows'ta bayrak emoji glyph'i olmayabilir → yanında native ad + kod DAİMA görünür (belirsizlik yok).

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { LANGS } from "../lib/languages";

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
        className={`flex items-center rounded-lg font-bold uppercase transition-colors ${compact ? "gap-1 px-2 py-1 text-[10px]" : "gap-1.5 px-2.5 py-1.5 text-xs"}`}
        style={{ border, color: activeColor, background: "transparent" }}
      >
        <span aria-hidden style={{ fontSize: compact ? 12 : 14, lineHeight: 1 }}>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden style={{ opacity: 0.55, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
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
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
                style={{ background: sel ? activeBg : "transparent", color: panelText, fontWeight: sel ? 700 : 500 }}
                onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background = activeBg; }}
                onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>{l.flag}</span>
                <span className="flex-1 text-left">{l.native}</span>
                <span className="text-[10px] font-bold uppercase" style={{ opacity: 0.5 }}>{l.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
