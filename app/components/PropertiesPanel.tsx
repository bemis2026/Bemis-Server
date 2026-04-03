"use client";
import { useCallback, useRef, useState } from "react";
import { useEditMode } from "../context/EditModeContext";
import { useContent, getByPath } from "../context/ContentContext";

const PRESET_COLORS = [
  "#ffffff", "#f0f0f0", "#1a1a1a", "#000000",
  "#3B82F6", "#2563EB", "#1D4ED8",
  "#10B981", "#059669",
  "#F59E0B", "#D97706",
  "#EF4444", "#DC2626",
  "#8B5CF6", "#7C3AED",
  "#EC4899",
];

const TEXT_COLOR_PRESETS = [
  "#ffffff", "#f0f0f4", "#e2e8f0", "#94a3b8",
  "#1a1a1a", "#111111",
  "#3B82F6", "#93C5FD",
  "#10B981", "#34D399",
  "#F59E0B", "#FCD34D",
  "#EF4444", "#F87171",
  "#8B5CF6", "#C4B5FD",
  "#EC4899",
];

const FONT_SIZE_PRESETS = [
  { label: "10", value: "10px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "30", value: "30px" },
  { label: "36", value: "36px" },
  { label: "48", value: "48px" },
  { label: "60", value: "60px" },
  { label: "72", value: "72px" },
];

export default function PropertiesPanel() {
  const { isEditMode, selectedElement, clearSelection } = useEditMode();
  const { liveUpdate, markPending, updateTextStyle, textStyles, ...content } = useContent() as any;
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isEditMode || !selectedElement) return null;

  const currentValue = getByPath(content, selectedElement.field) ?? "";
  const currentTextStyle: { color?: string; fontSize?: string } = (textStyles as any)?.[selectedElement.field] ?? {};

  const updateStyle = (prop: "color" | "fontSize", value: string) => {
    updateTextStyle(selectedElement.field, prop, value);
    markPending(selectedElement.field);
  };

  const update = (value: string) => {
    liveUpdate(selectedElement.field, value);
    markPending(selectedElement.field);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", selectedElement.uploadFolder ?? "uploads");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      update(url);
    } catch {
      alert("Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Backdrop — click outside closes panel */}
      <div
        onClick={clearSelection}
        style={{
          position: "fixed", inset: 0, zIndex: 299,
          background: "transparent",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 42,
          right: 0,
          width: 280,
          maxHeight: "calc(100vh - 42px)",
          overflowY: "auto",
          zIndex: 300,
          background: "#0f172a",
          borderLeft: "1px solid rgba(59,130,246,0.35)",
          borderBottom: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "12px 14px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#93C5FD", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
              {selectedElement.type === "text" ? "Metin" :
               selectedElement.type === "image" ? "Görsel" :
               selectedElement.type === "color" ? "Renk" :
               selectedElement.type === "link" ? "Bağlantı" : "Sayı"}
            </div>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
              {selectedElement.label}
            </div>
          </div>
          <button
            onClick={clearSelection}
            style={{
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              fontSize: 18, lineHeight: 1, padding: "2px 4px", borderRadius: 4,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 14, flex: 1 }}>
          {selectedElement.type === "text" && (
            <>
              <TextControl
                value={String(currentValue)}
                multiline={selectedElement.multiline}
                placeholder={selectedElement.placeholder}
                onChange={update}
              />

              {/* ── Text Style Controls ── */}
              <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  METİN STİLİ
                </div>

                {/* Color */}
                <div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Renk</span>
                    {currentTextStyle.color && (
                      <button
                        onClick={() => updateStyle("color", "")}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", padding: 0 }}
                      >
                        Sıfırla
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: currentTextStyle.color || "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    <input
                      type="color"
                      value={currentTextStyle.color || "#ffffff"}
                      onChange={e => updateStyle("color", e.target.value)}
                      style={{ width: 32, height: 28, border: "none", cursor: "pointer", background: "none", flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      value={currentTextStyle.color || ""}
                      onChange={e => updateStyle("color", e.target.value)}
                      placeholder="varsayılan"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "5px 8px", color: "#e2e8f0", fontSize: 11, outline: "none", flex: 1 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {TEXT_COLOR_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => updateStyle("color", c)}
                        title={c}
                        style={{
                          width: 20, height: 20, borderRadius: 4, background: c, padding: 0, cursor: "pointer",
                          border: currentTextStyle.color === c ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.15)",
                          boxShadow: currentTextStyle.color === c ? "0 0 0 2px rgba(59,130,246,0.4)" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Boyut (px)</span>
                    {currentTextStyle.fontSize && (
                      <button
                        onClick={() => updateStyle("fontSize", "")}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", padding: 0 }}
                      >
                        Sıfırla
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                    {FONT_SIZE_PRESETS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => updateStyle("fontSize", value)}
                        style={{
                          padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: "pointer",
                          background: currentTextStyle.fontSize === value ? "#3B82F6" : "rgba(255,255,255,0.07)",
                          color: currentTextStyle.fontSize === value ? "#fff" : "rgba(255,255,255,0.55)",
                          border: currentTextStyle.fontSize === value ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentTextStyle.fontSize || ""}
                    onChange={e => updateStyle("fontSize", e.target.value)}
                    placeholder="ör. 32px veya 2rem"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedElement.type === "image" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {currentValue && (
                <div style={{
                  width: "100%", height: 120, borderRadius: 8, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#1e293b",
                }}>
                  <img
                    src={currentValue}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  background: uploading ? "rgba(59,130,246,0.3)" : "#3B82F6",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "8px 14px", fontSize: 12, fontWeight: 600,
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? "Yükleniyor…" : "📁 Bilgisayardan Seç"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center" }}>veya URL girin</div>
              <input
                type="text"
                value={String(currentValue)}
                onChange={e => update(e.target.value)}
                placeholder="https://..."
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8, padding: "7px 10px",
                  color: "#e2e8f0", fontSize: 12,
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              {currentValue && (
                <button
                  onClick={() => update("")}
                  style={{
                    background: "rgba(239,68,68,0.12)", color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
                    padding: "5px 10px", fontSize: 11, cursor: "pointer",
                  }}
                >
                  Görseli Kaldır
                </button>
              )}
            </div>
          )}

          {selectedElement.type === "color" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Current color preview */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: currentValue || "#3B82F6",
                  border: "2px solid rgba(255,255,255,0.2)",
                  flexShrink: 0,
                }} />
                <input
                  type="text"
                  value={String(currentValue)}
                  onChange={e => update(e.target.value)}
                  placeholder="#3B82F6"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "6px 10px",
                    color: "#e2e8f0", fontSize: 12,
                    outline: "none", flex: 1,
                  }}
                />
              </div>
              {/* Native color picker */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Renk seç:</span>
                <input
                  type="color"
                  value={currentValue || "#3B82F6"}
                  onChange={e => update(e.target.value)}
                  style={{ width: 36, height: 28, border: "none", cursor: "pointer", background: "none" }}
                />
              </div>
              {/* Presets */}
              <div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginBottom: 7, fontWeight: 600, letterSpacing: "0.08em" }}>HAZIR RENKLER</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(selectedElement.presetColors ?? PRESET_COLORS).map(c => (
                    <button
                      key={c}
                      onClick={() => update(c)}
                      title={c}
                      style={{
                        width: 24, height: 24, borderRadius: 6, background: c,
                        border: currentValue === c ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.15)",
                        cursor: "pointer", padding: 0,
                        boxShadow: currentValue === c ? "0 0 0 2px rgba(59,130,246,0.4)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedElement.type === "link" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>URL</label>
              <input
                type="url"
                value={String(currentValue)}
                onChange={e => update(e.target.value)}
                placeholder={selectedElement.placeholder ?? "https://"}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8, padding: "8px 10px",
                  color: "#e2e8f0", fontSize: 13,
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              {currentValue && (
                <a
                  href={String(currentValue)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#93C5FD", fontSize: 11 }}
                >
                  ↗ Önizle
                </a>
              )}
            </div>
          )}

          {selectedElement.type === "number" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="range"
                  min={selectedElement.min ?? 0}
                  max={selectedElement.max ?? 100}
                  step={selectedElement.step ?? 1}
                  value={Number(currentValue) || 0}
                  onChange={e => update(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, minWidth: 40, textAlign: "right" }}>
                  {currentValue}{selectedElement.unit ?? ""}
                </span>
              </div>
              <input
                type="number"
                min={selectedElement.min}
                max={selectedElement.max}
                step={selectedElement.step ?? 1}
                value={Number(currentValue) || 0}
                onChange={e => update(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8, padding: "6px 10px",
                  color: "#e2e8f0", fontSize: 13,
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
            </div>
          )}
        </div>

        {/* Field path hint */}
        <div style={{
          padding: "8px 14px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.2)", fontSize: 9,
          fontFamily: "monospace",
        }}>
          {selectedElement.field}
        </div>
      </div>
    </>
  );
}

function TextControl({
  value, multiline, placeholder, onChange,
}: {
  value: string;
  multiline?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const baseStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(59,130,246,0.3)",
    borderRadius: 8, padding: "9px 11px",
    color: "#e2e8f0", fontSize: 13,
    outline: "none", width: "100%", boxSizing: "border-box",
    resize: "vertical" as const,
    lineHeight: 1.5,
    fontFamily: "inherit",
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        style={baseStyle}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseStyle}
    />
  );
}
