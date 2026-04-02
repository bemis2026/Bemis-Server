"use client";
import { useEditMode } from "../context/EditModeContext";
import { useContent } from "../context/ContentContext";

interface SectionWrapperProps {
  id: string;
  index: number;
  total: number;
  children: React.ReactNode;
}

const SECTION_LABELS: Record<string, string> = {
  stats: "İstatistikler",
  dna: "Kurumsal / DNA",
  products: "Ürünler",
  featured: "Öne Çıkan Ürünler",
  dealer: "Bayi Ağı",
  reviews: "Yorumlar",
  calculator: "Hesap Makinesi",
  contact: "İletişim",
};

export default function SectionWrapper({ id, index, total, children }: SectionWrapperProps) {
  const { isEditMode } = useEditMode();
  const { reorderSections } = useContent();

  if (!isEditMode) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      {/* Section handle bar */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: -48,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Section label */}
        <div style={{
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 6,
          padding: "3px 6px",
          fontSize: 9,
          color: "#93C5FD",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          maxHeight: 80,
          overflow: "hidden",
          cursor: "default",
        }}>
          {SECTION_LABELS[id] ?? id}
        </div>

        {/* Up button */}
        <button
          onClick={() => reorderSections(index, index - 1)}
          disabled={index === 0}
          title="Yukarı Taşı"
          style={{
            width: 24, height: 24,
            background: index === 0 ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 6, cursor: index === 0 ? "not-allowed" : "pointer",
            color: index === 0 ? "rgba(255,255,255,0.2)" : "#93C5FD",
            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (index > 0) (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.35)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = index === 0 ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.15)"; }}
        >
          ↑
        </button>

        {/* Down button */}
        <button
          onClick={() => reorderSections(index, index + 1)}
          disabled={index === total - 1}
          title="Aşağı Taşı"
          style={{
            width: 24, height: 24,
            background: index === total - 1 ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 6, cursor: index === total - 1 ? "not-allowed" : "pointer",
            color: index === total - 1 ? "rgba(255,255,255,0.2)" : "#93C5FD",
            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (index < total - 1) (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.35)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = index === total - 1 ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.15)"; }}
        >
          ↓
        </button>
      </div>

      {/* Subtle left border in edit mode */}
      <div style={{
        position: "absolute", left: -2, top: 0, bottom: 0, width: 2,
        background: "rgba(59,130,246,0.2)",
        pointerEvents: "none",
      }} />

      {children}
    </div>
  );
}
