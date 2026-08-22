"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import ContactBar from "./ContactBar";
import { useTheme } from "../context/ThemeContext";

// Hukuki sayfalar (KVKK Aydınlatma / Çerez Politikası) için ortak, sade kabuk.
// Site tasarım diliyle uyumlu (iç sayfa bg hiyerarşisi, okunabilir dar sütun).
// İçerik data olarak gelir → iki sayfa tek kabuğu paylaşır.
export type LegalSection = { h: string; p?: string[]; ul?: string[] };

export default function LegalPage({ title, updated, intro, sections }: {
  title: string;
  updated: string; // "12 Temmuz 2026" gibi görünen tarih
  intro: string;
  sections: LegalSection[];
}) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);

  const bg    = d ? "#131318" : "#f8f8fb";
  const card  = d ? "#1c1c22" : "#ffffff";
  const line  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const text  = d ? "#f0f0f4" : "#1a1a2e";
  const muted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,46,0.62)";
  const faint = d ? "rgba(240,240,244,0.40)" : "rgba(26,26,46,0.42)";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-3xl mx-auto px-5 sm:px-8" style={{ paddingTop: 120, paddingBottom: 64 }}>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2" style={{ color: text }}>{title}</h1>
        <p className="text-xs font-semibold mb-8" style={{ color: faint }}>Son güncelleme: {updated}</p>

        <p className="text-sm leading-relaxed mb-8" style={{ color: muted }}>{intro}</p>

        <div className="flex flex-col gap-5">
          {sections.map((s, i) => (
            <section key={i} className="rounded-2xl px-5 sm:px-6 py-5" style={{ background: card, border: `1px solid ${line}` }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: text }}>{s.h}</h2>
              {(s.p ?? []).map((t, j) => (
                <p key={j} className="text-sm leading-relaxed mb-2.5 last:mb-0" style={{ color: muted }}>{t}</p>
              ))}
              {s.ul && (
                <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                  {s.ul.map((t, j) => (
                    <li key={j} className="text-sm leading-relaxed" style={{ color: muted }}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <ContactBar />
    </div>
  );
}
