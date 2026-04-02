"use client";
import { useState, useCallback, useEffect } from "react";
import { useEditMode } from "../context/EditModeContext";
import { useContent } from "../context/ContentContext";

export default function EditBar() {
  const { isEditMode, pendingCount, clearPending, exit, clearSelection } = useEditMode();
  const { saveContent, undo, redo, canUndo, canRedo } = useContent();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEditMode) return;
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
      if (e.key === "Escape") { clearSelection(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditMode, undo, redo, clearSelection]);

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

  const btnBase: React.CSSProperties = {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 7,
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    transition: "all 0.15s",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.3,
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: 42,
        background: "#0f172a",
        borderBottom: "1px solid #3B82F6",
        display: "flex",
        alignItems: "center",
        paddingLeft: 14,
        paddingRight: 14,
        gap: 8,
        fontSize: 12,
      }}
    >
      {/* Pulse + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, flex: "0 0 auto" }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#3B82F6", boxShadow: "0 0 6px #3B82F6",
          animation: "eb-pulse 2s ease-in-out infinite", flexShrink: 0,
        }} />
        <style>{`@keyframes eb-pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <span style={{ color: "#93C5FD", fontWeight: 700, letterSpacing: "0.08em", fontSize: 10 }}>
          DÜZENLEME MODU
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        style={canUndo ? btnBase : btnDisabled}
        title="Geri Al (Ctrl+Z)"
        onMouseEnter={e => { if (canUndo) { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)"; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        ↩ Geri
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        style={canRedo ? btnBase : btnDisabled}
        title="İleri Al (Ctrl+Y)"
        onMouseEnter={e => { if (canRedo) { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)"; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        ↪ İleri
      </button>

      {/* Status */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {saved ? (
          <span style={{
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)",
            color: "#10B981", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 5,
          }}>✓ Kaydedildi</span>
        ) : pendingCount > 0 ? (
          <span style={{
            background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.35)",
            color: "#EAB308", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 600,
          }}>{pendingCount} değişiklik kaydedilmedi</span>
        ) : null}
      </div>

      {/* Hint */}
      <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginRight: 4, whiteSpace: "nowrap" }}>
        Tıkla → düzenle
      </span>

      {/* Admin link */}
      <a
        href="/admin"
        style={{
          ...btnBase,
          textDecoration: "none",
          color: "rgba(255,255,255,0.45)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        ← Admin
      </a>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || pendingCount === 0}
        style={{
          background: pendingCount > 0 ? "#3B82F6" : "rgba(59,130,246,0.25)",
          color: "#fff", border: "none", borderRadius: 7,
          padding: "5px 14px", fontSize: 12, fontWeight: 600,
          cursor: pendingCount > 0 ? "pointer" : "not-allowed",
          opacity: saving ? 0.7 : 1, transition: "all 0.2s", flexShrink: 0,
        }}
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>

      {/* Exit */}
      <button
        onClick={exit}
        style={btnBase}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        Çıkış
      </button>
    </div>
  );
}
