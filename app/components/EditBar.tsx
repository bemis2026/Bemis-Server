"use client";
import { useState, useCallback } from "react";
import { useEditMode } from "../context/EditModeContext";
import { useContent } from "../context/ContentContext";

export default function EditBar() {
  const { isEditMode, pendingCount, clearPending, exit } = useEditMode();
  const { saveContent } = useContent();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveContent();
      clearPending();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Kaydetme başarısız. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }, [saveContent, clearPending]);

  if (!isEditMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: 42,
        background: "#0f172a",
        borderBottom: "1px solid #3B82F6",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        gap: 12,
        fontSize: 12,
      }}
    >
      {/* Left: indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#3B82F6",
            boxShadow: "0 0 6px #3B82F6",
            animation: "editbar-pulse 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <style>{`
          @keyframes editbar-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
        <span style={{ color: "#93C5FD", fontWeight: 700, letterSpacing: "0.08em", fontSize: 11 }}>
          DÜZENLEME MODU
        </span>
      </div>

      {/* Middle: status badge */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {saved ? (
          <span
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.35)",
              color: "#10B981",
              borderRadius: 20,
              padding: "2px 12px",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>✓</span> Kaydedildi
          </span>
        ) : pendingCount > 0 ? (
          <span
            style={{
              background: "rgba(234,179,8,0.15)",
              border: "1px solid rgba(234,179,8,0.35)",
              color: "#EAB308",
              borderRadius: 20,
              padding: "2px 12px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {pendingCount} değişiklik kaydedilmedi
          </span>
        ) : null}
      </div>

      {/* Right hint — hidden on small screens */}
      <span
        className="hidden sm:block"
        style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginRight: 8, whiteSpace: "nowrap" }}
      >
        Mavi çerçeveli alanlara tıklayarak düzenleyin
      </span>

      {/* Admin panel link */}
      <a
        href="/admin"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          fontWeight: 500,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          padding: "4px 10px",
          flexShrink: 0,
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.30)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        ← Admin
      </a>

      {/* Buttons */}
      <button
        onClick={handleSave}
        disabled={saving || pendingCount === 0}
        style={{
          background: pendingCount > 0 ? "#3B82F6" : "rgba(59,130,246,0.3)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "4px 14px",
          fontSize: 12,
          fontWeight: 600,
          cursor: pendingCount > 0 ? "pointer" : "not-allowed",
          opacity: saving ? 0.7 : 1,
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>

      <button
        onClick={exit}
        style={{
          background: "transparent",
          color: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
      >
        Çıkış
      </button>
    </div>
  );
}
