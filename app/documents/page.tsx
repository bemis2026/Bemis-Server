"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import ContactBar from "../components/ContactBar";
import SearchOverlay from "../components/SearchOverlay";
import Image from "next/image";
import {
  HiArrowLeft, HiDownload, HiSearch,
} from "react-icons/hi";
import {
  RiFilePdf2Line, RiFileExcel2Line, RiFileWord2Line,
  RiFileTextLine, RiPriceTag3Line,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

type Document = {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  filename: string;
  size: string;
  lang: string;
  date: string;
  visible: boolean;
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all",          label: "Tümü" },
  { id: "price-list",   label: "Fiyat Listesi" },
  { id: "catalog",      label: "Katalog" },
  { id: "installation", label: "Kurulum Kılavuzu" },
  { id: "certificate",  label: "Sertifikalar" },
  { id: "technical",    label: "Teknik Döküman" },
  { id: "other",        label: "Diğer" },
];

function fileIcon(filename: string, accent: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const props = { size: 28, style: { color: accent } };
  if (ext === "pdf") return <RiFilePdf2Line {...props} />;
  if (ext === "xls" || ext === "xlsx") return <RiFileExcel2Line {...props} />;
  if (ext === "doc" || ext === "docx") return <RiFileWord2Line {...props} />;
  return <RiFileTextLine {...props} />;
}

const CAT_ACCENTS: Record<string, string> = {
  "price-list":   "#F59E0B",
  "catalog":      "#3B82F6",
  "installation": "#10B981",
  "certificate":  "#8B5CF6",
  "technical":    "#EF4444",
  "other":        "#6B7280",
};

export default function DocumentsPage() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/documents")
      .then(r => r.json())
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bg          = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface     = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border      = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.50)" : "rgba(26,26,26,0.50)";
  const textFaint   = d ? "rgba(240,240,244,0.28)" : "rgba(26,26,26,0.32)";

  const filtered = documents.filter(doc => {
    const matchCat = activeCategory === "all" || doc.category === activeCategory;
    const matchQ   = !query || doc.title.toLowerCase().includes(query.toLowerCase()) ||
                     doc.description?.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(d => d.category === cat.id);
    if (items.length) acc.push({ ...cat, items });
    return acc;
  }, [] as { id: string; label: string; items: Document[] }[]);

  // If "all" selected, show grouped; otherwise flat list
  const showGrouped = activeCategory === "all" && !query;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Header */}
      <div className="pt-28 pb-8 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 mb-6 group"
            style={{ color: textMuted }}
          >
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Ana Sayfa</span>
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 mb-2"
              >
                <Image src="/logo-white.png" alt="Bemis E-V Charge" width={140} height={42}
                  className="h-8 w-auto object-contain"
                  style={{ filter: d ? "none" : "invert(1)" }}
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-3xl sm:text-4xl font-black"
                style={{ color: textPrimary }}
              >
                Dökümanlar
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm mt-1"
                style={{ color: textMuted }}
              >
                {loading ? "Yükleniyor…" : `${documents.length} döküman`}
              </motion.p>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="relative"
            >
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={14}
                style={{ color: textFaint }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Döküman ara…"
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none w-64"
                style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}
              />
            </motion.div>
          </div>

          {/* Category filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex gap-2 flex-wrap"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: activeCategory === cat.id
                    ? (cat.id === "all" ? "#3B82F6" : CAT_ACCENTS[cat.id])
                    : surface,
                  color: activeCategory === cat.id ? "#fff" : textMuted,
                  border: `1px solid ${activeCategory === cat.id ? "transparent" : border}`,
                }}
              >
                {cat.label}
                {cat.id !== "all" && (
                  <span className="ml-1.5 opacity-60">
                    {documents.filter(doc => doc.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "rgba(59,130,246,0.3)", borderTopColor: "#3B82F6" }} />
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <RiFilePdf2Line size={48} style={{ color: textFaint }} />
              <p className="text-sm font-semibold" style={{ color: textMuted }}>Henüz döküman eklenmemiş</p>
            </div>
          )}

          {!loading && documents.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <HiSearch size={40} style={{ color: textFaint }} />
              <p className="text-sm font-semibold" style={{ color: textMuted }}>Sonuç bulunamadı</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {showGrouped ? (
                <div className="space-y-10">
                  {grouped.map((group, gi) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: gi * 0.08 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 rounded-full" style={{ background: CAT_ACCENTS[group.id] }} />
                        <h2 className="text-sm font-bold" style={{ color: textPrimary }}>{group.label}</h2>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${CAT_ACCENTS[group.id]}18`, color: CAT_ACCENTS[group.id] }}>
                          {group.items.length}
                        </span>
                      </div>
                      <DocGrid docs={group.items} d={d} surface={surface} border={border} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <DocGrid docs={filtered} d={d} surface={surface} border={border} textPrimary={textPrimary} textMuted={textMuted} textFaint={textFaint} />
              )}
            </>
          )}
        </div>
      </div>

      <ContactBar />
    </div>
  );
}

function DocGrid({ docs, d, surface, border, textPrimary, textMuted, textFaint }: {
  docs: Document[]; d: boolean;
  surface: string; border: string;
  textPrimary: string; textMuted: string; textFaint: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {docs.map((doc, i) => {
        const accent = CAT_ACCENTS[doc.category] ?? "#6B7280";
        const catLabel = CATEGORIES.find(c => c.id === doc.category)?.label ?? "Diğer";
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            {/* Top colored band */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
              >
                {fileIcon(doc.filename || "file.pdf", accent)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${accent}15`, color: accent }}>
                    {catLabel}
                  </span>
                  {doc.lang && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textFaint }}>
                      {doc.lang.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 flex flex-col flex-1">
              <h3 className="text-sm font-bold leading-snug mb-1" style={{ color: textPrimary }}>
                {doc.title}
              </h3>
              {doc.description && (
                <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: textMuted }}>
                  {doc.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-auto mb-3">
                {doc.size && (
                  <span className="text-[10px]" style={{ color: textFaint }}>{doc.size}</span>
                )}
                {doc.date && (
                  <span className="text-[10px]" style={{ color: textFaint }}>
                    {new Date(doc.date).toLocaleDateString("tr-TR", { year: "numeric", month: "short" })}
                  </span>
                )}
              </div>

              <a
                href={doc.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: accent, color: "#fff" }}
              >
                <HiDownload size={14} />
                İndir
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
