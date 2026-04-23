"use client";

import { useContent } from "../context/ContentContext";

export default function ContentErrorToast() {
  const { contentError, refreshContent, dismissContentError, contentLoading } = useContent();

  if (!contentError) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[210] max-w-sm"
      style={{
        animation: "bemisToastIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div
        style={{
          background: "rgba(17, 24, 39, 0.96)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderLeft: "3px solid #EF4444",
          borderRadius: "10px",
          padding: "12px 14px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(8px)",
          color: "#F9FAFB",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
            <path d="M12 7v6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.2" fill="#EF4444" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: "2px" }}>Bağlantı sorunu</div>
            <div style={{ color: "#D1D5DB", fontSize: "12.5px" }}>{contentError}</div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button
                onClick={refreshContent}
                disabled={contentLoading}
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: contentLoading ? "default" : "pointer",
                  opacity: contentLoading ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {contentLoading ? "Yükleniyor..." : "Tekrar Dene"}
              </button>
              <button
                onClick={dismissContentError}
                style={{
                  background: "transparent",
                  color: "#9CA3AF",
                  border: "1px solid rgba(156, 163, 175, 0.3)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes bemisToastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
