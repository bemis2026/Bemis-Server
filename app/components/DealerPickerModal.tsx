"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useTheme } from "../context/ThemeContext";
import { CITY_BY_ID } from "../../lib/turkeyCities";
import {
  RiCloseLine, RiGlobalLine, RiMapPin2Line, RiPhoneLine, RiWhatsappLine, RiArrowRightLine, RiSearchLine,
} from "react-icons/ri";

type Dealer = {
  name: string; address?: string; phone?: string; email?: string;
  contactPerson?: string; whatsapp?: string; website?: string;
};
type DealersData = Record<string, { dealers: Dealer[] }>;

const BLUE = "#3B82F6";
const cityLabel = (id: string) => CITY_BY_ID[id]?.label ?? (id.charAt(0).toUpperCase() + id.slice(1));
const digits = (s: string) => s.replace(/[^\d+]/g, "");
const toUrl = (u: string) => (/^https?:\/\//.test(u) ? u : `https://${u}`);

export default function DealerPickerModal({
  open, onClose, productName,
}: { open: boolean; onClose: () => void; productName?: string }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [data, setData] = useState<DealersData>({});
  const [city, setCity] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Bayileri yalnızca modal açılınca çek (gereksiz istek yok).
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/dealers")
      .then((r) => r.json())
      .then((dd: DealersData) => setData(dd || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  // Escape ile kapat + arka plan scroll kilidi.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const bg          = d ? "#141416" : "#ffffff";
  const cardBg      = d ? "rgba(255,255,255,0.04)" : "#f8f8fb";
  const border      = d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted   = d ? "rgba(240,240,244,0.55)" : "rgba(26,26,26,0.55)";

  const cities = Object.keys(data)
    .filter((c) => (data[c]?.dealers?.length ?? 0) > 0)
    .sort((a, b) => cityLabel(a).localeCompare(cityLabel(b), "tr"));

  // Arama: şehir adı VEYA firma adı/adresi (TR-duyarsız). Şehir çipiyle birlikte (AND) çalışır.
  const q = query.trim().toLocaleLowerCase("tr");
  const matchesQuery = (c: string, dl: Dealer) =>
    !q ||
    (dl.name || "").toLocaleLowerCase("tr").includes(q) ||
    (dl.address || "").toLocaleLowerCase("tr").includes(q) ||
    cityLabel(c).toLocaleLowerCase("tr").includes(q);
  const dealersFor = (c: string) => (data[c]?.dealers ?? []).filter((dl) => matchesQuery(c, dl));
  const visibleCities = (city === "all" ? cities : cities.filter((c) => c === city)).filter(
    (c) => dealersFor(c).length > 0
  );
  const totalDealers = cities.reduce((n, c) => n + dealersFor(c).length, 0);

  const chipStyle = (active: boolean): CSSProperties =>
    active
      ? { background: BLUE, color: "#fff", border: `1px solid ${BLUE}` }
      : { background: cardBg, color: textMuted, border: `1px solid ${border}` };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bayi Bul"
    >
      <div
        className="w-full sm:max-w-2xl h-[85vh] sm:h-[640px] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: bg, border: `1px solid ${border}`, boxShadow: "0 24px 70px rgba(0,0,0,0.45)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="min-w-0">
            <h3 className="text-lg font-black" style={{ color: textPrimary }}>Bayi Bul &amp; Satın Al</h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>
              {productName ? `${productName} — yetkili bayilerimizden alın` : "Yetkili bayilerimizden alın"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: cardBg, border: `1px solid ${border}`, color: textPrimary }}
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Arama (şehir veya firma) */}
        {cities.length > 0 && (
          <div className="px-5 sm:px-6 pt-4 flex-shrink-0">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <RiSearchLine size={16} style={{ color: textMuted, flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Şehir veya firma ara…"
                aria-label="Şehir veya firma ara"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm"
                style={{ color: textPrimary }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Aramayı temizle"
                  className="flex-shrink-0 transition-opacity hover:opacity-70"
                  style={{ color: textMuted }}
                >
                  <RiCloseLine size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Şehir seçimi */}
        {cities.length > 0 && (
          <div className="px-5 sm:px-6 pt-3 pb-1 flex flex-wrap gap-2 flex-shrink-0">
            <button onClick={() => setCity("all")} className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all" style={chipStyle(city === "all")}>
              Tümü ({totalDealers})
            </button>
            {cities.map((c) => (
              <button key={c} onClick={() => setCity(c)} className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all" style={chipStyle(city === c)}>
                {cityLabel(c)}
              </button>
            ))}
          </div>
        )}

        {/* Bayi listesi */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-4 space-y-5">
          {loading && <p className="text-sm text-center py-10" style={{ color: textMuted }}>Yükleniyor…</p>}
          {!loading && visibleCities.length === 0 && <p className="text-sm text-center py-10" style={{ color: textMuted }}>{q ? "Aramanıza uygun bayi bulunamadı." : "Bayi bulunamadı."}</p>}
          {!loading && visibleCities.map((c) => (
            <div key={c}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: d ? "#93C5FD" : BLUE }}>
                <RiMapPin2Line size={13} /> {cityLabel(c)} <span style={{ color: textMuted }}>· {dealersFor(c).length}</span>
              </p>
              <div className="space-y-2.5">
                {dealersFor(c).map((dl, i) => (
                  <div key={i} className="rounded-2xl p-3.5 sm:p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <p className="text-sm font-bold leading-snug" style={{ color: textPrimary }}>{dl.name}</p>
                    {dl.address && <p className="text-xs mt-1 leading-snug" style={{ color: textMuted }}>{dl.address}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {dl.website && (
                        <a
                          href={toUrl(dl.website)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white transition-all hover:opacity-90"
                          style={{ background: BLUE }}
                        >
                          <RiGlobalLine size={14} /> Web Sitesi <RiArrowRightLine size={12} />
                        </a>
                      )}
                      {dl.phone && (
                        <a
                          href={`tel:${digits(dl.phone)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: textPrimary, border: `1px solid ${border}` }}
                        >
                          <RiPhoneLine size={14} /> Ara
                        </a>
                      )}
                      {dl.whatsapp && (
                        <a
                          href={`https://wa.me/${digits(dl.whatsapp).replace(/^\+/, "")}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ background: "rgba(37,211,102,0.12)", color: "#1faa52", border: "1px solid rgba(37,211,102,0.30)" }}
                        >
                          <RiWhatsappLine size={14} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
