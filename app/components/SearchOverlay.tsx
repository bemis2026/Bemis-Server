"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiX } from "react-icons/hi";
import { useLanguage } from "../context/LanguageContext";
import { groupVariantsByName } from "../../lib/productGroups";

type ProductEntry = {
  id: string;
  name: string;
  code?: string;
  subtitle?: string;
};

type Category = {
  id: string;
  name: string;
  tagline?: string;
  products?: ProductEntry[];
};

type SearchResult =
  | { kind: "product";  label: string; sub: string; href: string; haystack: string }
  | { kind: "category"; label: string; sub: string; href: string; haystack: string }
  | { kind: "section";  label: string; sub: string; target: string; haystack: string };

const SECTIONS: SearchResult[] = [
  { kind: "section", label: "Hakkımızda",  sub: "Ana sayfa bölümü", target: "#dna",        haystack: "hakkımızda hakkimizda about dna" },
  { kind: "section", label: "Teknoloji",   sub: "Ana sayfa bölümü", target: "#technology", haystack: "teknoloji technology" },
  { kind: "section", label: "Bayi Ağı",    sub: "Ana sayfa bölümü", target: "#dealer",     haystack: "bayi ağı agi dealer" },
  { kind: "section", label: "Hesaplayıcı", sub: "Ana sayfa bölümü", target: "#calculator", haystack: "hesaplayıcı hesaplayici calculator" },
  { kind: "section", label: "İletişim",    sub: "Ana sayfa bölümü", target: "#contact",    haystack: "iletişim iletisim contact" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchedLangRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (fetchedLangRef.current === lang) return;
    fetchedLangRef.current = lang;
    fetch(`/api/products?lang=${lang}`)
      .then(r => (r.ok ? r.json() : []))
      .then((d: unknown) => setCategories(Array.isArray(d) ? d as Category[] : []))
      .catch(() => {});
  }, [isOpen, lang]);

  const allResults: SearchResult[] = useMemo(() => {
    const out: SearchResult[] = [];
    for (const cat of categories) {
      out.push({
        kind: "category",
        label: cat.name,
        sub: cat.tagline ?? "Kategori",
        href: `/products/${cat.id}`,
        haystack: normalize(`${cat.name} ${cat.id} ${cat.tagline ?? ""}`),
      });
      // Group variants so search results show one entry per family
      // (e.g. "Charger 2" once instead of "Charger 2 · Kablolu" + "Charger 2 · Fişli").
      // The haystack still indexes every variant's code/subtitle/id so the
      // user can find the family by typing any variant-specific term.
      for (const group of groupVariantsByName(cat.products ?? [])) {
        const p = group.primary;
        const subParts = group.variants.length > 1
          ? `${cat.name} · ${group.variants.length} versiyon`
          : `${cat.name}${p.code ? ` · ${p.code}` : ""}`;
        const haystackParts = group.variants.flatMap((v) => [
          v.name, v.code ?? "", v.id, v.subtitle ?? "",
        ]);
        out.push({
          kind: "product",
          label: p.name,
          sub: subParts,
          href: `/products/${cat.id}/${p.id}`,
          haystack: normalize(`${haystackParts.join(" ")} ${cat.name}`),
        });
      }
    }
    return [...out, ...SECTIONS];
  }, [categories]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return allResults.slice(0, 30);
    const tokens = q.split(/\s+/).filter(Boolean);
    return allResults
      .filter(r => tokens.every(t => r.haystack.includes(t)))
      .slice(0, 50);
  }, [query, allResults]);

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

  const handleResultClick = (r: SearchResult) => {
    onClose();
    if (r.kind === "section") {
      setTimeout(() => {
        document.querySelector(r.target)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return;
    }
    router.push(r.href);
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1e1e]">
              <HiSearch className="text-white/40 text-xl flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün adı, kodu veya bölüm ara..."
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

            <div className="max-h-96 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">Sonuç bulunamadı.</p>
              ) : (
                filtered.map((r) => {
                  const key = r.kind === "section" ? `s:${r.target}` : `${r.kind}:${r.href}`;
                  const tagLabel = r.kind === "product" ? "Ürün" : r.kind === "category" ? "Kategori" : "Bölüm";
                  const tagClass = r.kind === "product"
                    ? "bg-blue-500/15 text-blue-300"
                    : r.kind === "category"
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-white/6 text-white/40";
                  return (
                    <button
                      key={key}
                      onClick={() => handleResultClick(r)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tagClass}`}>
                        {tagLabel}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-white/85 group-hover:text-white text-sm truncate">{r.label}</p>
                        <p className="text-white/35 text-[11px] truncate">{r.sub}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

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
