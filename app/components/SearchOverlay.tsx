"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiX } from "react-icons/hi";

interface SearchResult {
  label: string;
  type: "product" | "section";
  target: string;
}

const ALL_RESULTS: SearchResult[] = [
  { label: "AC Wallbox", type: "product", target: "#products" },
  { label: "Taşınabilir Şarj", type: "product", target: "#products" },
  { label: "DC Şarj Kablosu", type: "product", target: "#products" },
  { label: "AC Şarj Kablosu", type: "product", target: "#products" },
  { label: "V2L/C2L Aksesuar", type: "product", target: "#products" },
  { label: "Hakkımızda", type: "section", target: "#brand-story" },
  { label: "Teknoloji", type: "section", target: "#technology" },
  { label: "Bayi Ağı", type: "section", target: "#dealer" },
  { label: "İletişim", type: "section", target: "#contact" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? ALL_RESULTS.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_RESULTS;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
    }
  }, [isOpen]);

  const handleResultClick = (target: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1e1e]">
              <HiSearch className="text-white/40 text-xl flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün veya bölüm ara..."
                className="flex-1 bg-transparent text-white placeholder-white/30 text-base outline-none"
              />
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-md"
                aria-label="Kapat"
              >
                <HiX size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">Sonuç bulunamadı.</p>
              ) : (
                filtered.map((result) => (
                  <button
                    key={result.label}
                    onClick={() => handleResultClick(result.target)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left group"
                  >
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        result.type === "product"
                          ? "bg-white/10 text-white/60"
                          : "bg-white/6 text-white/40"
                      }`}
                    >
                      {result.type === "product" ? "Ürün" : "Bölüm"}
                    </span>
                    <span className="text-white/70 group-hover:text-white text-sm transition-colors">
                      {result.label}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-[#1e1e1e] flex items-center gap-3">
              <kbd className="text-[10px] text-white/25 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
              <span className="text-white/25 text-xs">kapatmak için</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
