"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  HiArrowLeft, HiDownload, HiExternalLink,
} from "react-icons/hi";
import { RiFilePdf2Line } from "react-icons/ri";

type DocItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url: string;
  filename?: string;
  size?: string;
  lang?: string;
  date?: string;
};

const UI = {
  back:     { tr: "Dökümanlar",            en: "Documents" },
  loading:  { tr: "Yükleniyor…",           en: "Loading…" },
  notFound: { tr: "Döküman bulunamadı",    en: "Document not found" },
  download: { tr: "İndir",                 en: "Download" },
  newTab:   { tr: "Yeni sekmede aç",       en: "Open in new tab" },
  noPreview:{ tr: "Bu dosya tarayıcıda önizlenemez — indirip açın.", en: "This file can't be previewed — download to open." },
  openPdf:  { tr: "PDF'i Aç",              en: "Open PDF" },
  mobilAc:  { tr: "PDF'i görüntülemek için açın ya da indirin.", en: "Open or download to view the PDF." },
} as const;

export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const d = theme === "dark";
  const { lang } = useLanguage();
  const t = (k: keyof typeof UI) => (lang === "en" ? UI[k].en : UI[k].tr);

  const rawId = params?.id;
  const id = decodeURIComponent(Array.isArray(rawId) ? rawId[0] : (rawId ?? ""));

  const [doc, setDoc] = useState<DocItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobil, setIsMobil] = useState(false);

  // iOS Safari (ve dar ekran) iframe'de PDF'i gömülü göstermez → mobilde
  // gömülü görünüm yerine "Aç / İndir" odaklı kart gösterilir.
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsMobil(ios || window.innerWidth < 820);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/documents")
      .then((r) => r.json())
      .then((docs: DocItem[]) => {
        if (!alive) return;
        setDoc((Array.isArray(docs) ? docs : []).find((x) => x.id === id) ?? null);
      })
      .catch(() => alive && setDoc(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const url = doc?.url || "";
  const isPdf =
    (doc?.filename || "").toLowerCase().endsWith(".pdf") ||
    url.toLowerCase().includes(".pdf") ||
    url.toLowerCase().includes("/raw/upload/"); // Cloudinary raw PDF

  // Temiz indirme: dosyayı blob olarak çek → ham (Cloudinary/R2) URL kullanıcıya
  // gösterilmez. CORS engellerse ham URL'i yeni sekmede açmaya düşer.
  async function indir() {
    if (!doc) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = doc.filename || `${doc.title || "dokuman"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(obj), 5000);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const bg = d ? "#0c0c0e" : "#f8f8fb";
  const barBg = d ? "rgba(18,18,20,0.92)" : "rgba(255,255,255,0.94)";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,26,0.55)";

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: bg }}>
      {/* Üst bar — Bemis markalı, temiz URL */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderBottom: `1px solid ${border}`,
          background: barBg,
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push("/documents")}
          style={{ display: "flex", alignItems: "center", gap: 6, color: textMuted, fontSize: 13, fontWeight: 600 }}
        >
          <HiArrowLeft size={16} />
          <span className="hidden sm:inline">{t("back")}</span>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: textPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc?.title || (loading ? t("loading") : t("notFound"))}
          </div>
        </div>

        {doc && (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              title={t("newTab")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: textMuted, border: `1px solid ${border}` }}
            >
              <HiExternalLink size={15} />
            </button>
            <button
              onClick={indir}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "#3B82F6" }}
            >
              <HiDownload size={15} />
              <span className="hidden sm:inline">{t("download")}</span>
            </button>
          </div>
        )}
      </header>

      {/* Gövde */}
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid rgba(59,130,246,0.3)",
              borderTopColor: "#3B82F6",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : !doc ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <RiFilePdf2Line size={48} style={{ color: textMuted }} />
          <p style={{ color: textMuted, fontSize: 14, fontWeight: 600 }}>{t("notFound")}</p>
          <button
            onClick={() => router.push("/documents")}
            style={{ padding: "9px 16px", borderRadius: 10, background: "#3B82F6", color: "#fff", fontSize: 13, fontWeight: 600 }}
          >
            {t("back")}
          </button>
        </div>
      ) : isPdf && !isMobil ? (
        <iframe
          src={url}
          title={doc.title}
          style={{ flex: 1, width: "100%", border: 0, background: d ? "#1a1a1a" : "#e5e5e5" }}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}>
          <RiFilePdf2Line size={52} style={{ color: "#3B82F6" }} />
          <p style={{ color: textPrimary, fontSize: 15, fontWeight: 700, textAlign: "center" }}>{doc.title}</p>
          <p style={{ color: textMuted, fontSize: 13, textAlign: "center", maxWidth: 360 }}>
            {isPdf ? t("mobilAc") : t("noPreview")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {isPdf && (
              <button
                onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, background: "#3B82F6", color: "#fff", fontSize: 14, fontWeight: 700 }}
              >
                <HiExternalLink size={16} />
                {t("openPdf")}
              </button>
            )}
            <button
              onClick={indir}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                color: isPdf ? textPrimary : "#fff",
                background: isPdf ? (d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") : "#3B82F6",
                border: isPdf ? `1px solid ${border}` : "none",
              }}
            >
              <HiDownload size={16} />
              {t("download")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
