"use client";

import { useEffect, useState } from "react";

type AnalyticsMetrics = {
  sessions: number; users: number; pageViews: number;
  avgSessionDuration: number; bounceRate: number;
};
type TrendRow  = { date: string; sessions: number; users: number };
type PageRow   = { path: string; views: number; avgTime: number };
type ChannelRow= { channel: string; sessions: number; users: number };
type EventRow  = { name: string; count: number };
type AnalyticsData = {
  metrics: AnalyticsMetrics;
  trend: TrendRow[];
  pages: PageRow[];
  channels: ChannelRow[];
  events: EventRow[];
};

export default function AnalyticsPanel() {
  const [range, setRange] = useState<"7" | "28" | "90">("28");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/analytics?range=${range}`)
      .then(r => r.json())
      .then((d) => {
        if (d.error === "GA4_NOT_CONFIGURED") { setError("not_configured"); return; }
        if (d.error) { setError("api_error"); return; }
        setData(d);
      })
      .catch(() => setError("api_error"))
      .finally(() => setLoading(false));
  }, [range]);

  const fmtDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return m > 0 ? `${m}d ${s}s` : `${s}s`;
  };

  const fmtDate = (d: string) =>
    `${d.slice(6, 8)}/${d.slice(4, 6)}`;

  const BLUE = "#3B82F6";

  // ── Not configured: link straight to Google Analytics ──────────────────
  if (error === "not_configured") {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-base font-bold mb-1">Analytics</h2>
          <p className="text-xs text-white/35">Ziyaretçi istatistikleri Google Analytics&apos;te görüntüleniyor.</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F9AB00 0%, #E37400 100%)" }}>
              <span className="text-white text-2xl font-black">GA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white mb-1">Google Analytics 4</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Frontend tracking aktif (GA tag <code className="text-white/70 bg-white/8 px-1 rounded text-[10px]">G-Q5GCREWZ0W</code>).
                Veriler doğrudan analytics.google.com&apos;da takip edilebilir.
              </p>
            </div>
          </div>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
            className="block w-full text-center text-sm font-semibold rounded-xl px-4 py-3 transition-all"
            style={{ background: "#F9AB00", color: "#1a1a1a" }}>
            Google Analytics&apos;te aç ↗
          </a>
          <p className="text-[11px] text-white/30 leading-relaxed">
            Realtime ziyaretçiler, sayfa görüntülemeleri, trafik kaynakları, dönüşüm olayları —
            tümü GA tarafında daha zengin filtreleme ve raporlama ile görüntülenir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + range picker */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Analytics</h2>
          <p className="text-xs text-white/35 mt-0.5">Google Analytics 4 — gerçek zamanlı veriler</p>
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
          {(["7", "28", "90"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: range === r ? BLUE : "transparent", color: range === r ? "#fff" : "rgba(255,255,255,0.40)" }}
            >
              {r === "7" ? "7 gün" : r === "28" ? "28 gün" : "90 gün"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      )}

      {error === "api_error" && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-red-400">
          GA4 API&apos;ye bağlanılamadı. Service account izinlerini ve ortam değişkenlerini kontrol edin.
        </div>
      )}

      {data && !loading && (
        <>
          {/* ── Overview cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "Kullanıcılar",    value: data.metrics.users.toLocaleString("tr"),       sub: "toplam" },
              { label: "Oturumlar",       value: data.metrics.sessions.toLocaleString("tr"),    sub: "toplam" },
              { label: "Sayfa Görüntülemesi", value: data.metrics.pageViews.toLocaleString("tr"), sub: "toplam" },
              { label: "Ort. Süre",       value: fmtDuration(data.metrics.avgSessionDuration),  sub: "oturum başı" },
              { label: "Hemen Çıkma",     value: `%${(data.metrics.bounceRate * 100).toFixed(1)}`, sub: "oran" },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Trend chart ── */}
          {data.trend.length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">Günlük Oturum Trendi</p>
              <TrendChart data={data.trend} fmtDate={fmtDate} color={BLUE} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            {/* ── Top pages ── */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">En Çok Ziyaret Edilen Sayfalar</p>
              <div className="space-y-2">
                {data.pages.slice(0, 8).map((page, i) => {
                  const maxViews = data.pages[0]?.views ?? 1;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60 truncate max-w-[200px]">{page.path || "/"}</span>
                        <span className="text-xs font-semibold text-white/80 flex-shrink-0 ml-2">{page.views.toLocaleString("tr")}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(page.views / maxViews) * 100}%`, background: BLUE, opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Channels ── */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/50 mb-4">Trafik Kaynakları</p>
              <div className="space-y-2">
                {data.channels.map((ch, i) => {
                  const maxSessions = data.channels[0]?.sessions ?? 1;
                  const colors = [BLUE, "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{ch.channel || "Diğer"}</span>
                        <span className="text-xs font-semibold text-white/80">{ch.sessions.toLocaleString("tr")}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(ch.sessions / maxSessions) * 100}%`, background: colors[i % colors.length], opacity: 0.75 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Key events ── */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-xs font-bold text-white/50 mb-4">Önemli Etkinlikler</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.events
                .filter(e => !["session_start","first_visit","page_view","user_engagement","scroll"].includes(e.name))
                .slice(0, 8)
                .map((ev, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
                    <p className="text-[10px] text-white/35 font-mono mb-1 truncate">{ev.name}</p>
                    <p className="text-xl font-black text-white">{ev.count.toLocaleString("tr")}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sparkline trend chart (SVG) ────────────────────────────────────────────
function TrendChart({ data, fmtDate, color }: { data: TrendRow[]; fmtDate: (d: string) => string; color: string }) {
  const W = 800, H = 140, PAD = 12;
  const maxVal = Math.max(...data.map(d => d.sessions), 1);
  const pts = data.map((d, i) => {
    const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - (d.sessions / maxVal) * (H - PAD * 2);
    return { x, y, d };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0]?.x},${H - PAD} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1]?.x},${H - PAD} Z`;

  // Show max ~10 labels to avoid overlap
  const step = Math.ceil(data.length / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 2)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Area fill */}
      <path d={area} fill="url(#areaGrad)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          {i % step === 0 && (
            <>
              <circle cx={p.x} cy={p.y} r="3" fill={color} />
              <text x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.30)">{fmtDate(p.d.date)}</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
