"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineMail, HiOutlineMailOpen, HiOutlineArchive, HiOutlineRefresh,
  HiOutlineSearch, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineUser,
  HiOutlineExternalLink, HiOutlineChevronDown, HiOutlineChevronRight,
} from "react-icons/hi";

type Message = {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  topic?: string;
  topicLabel?: string;
  message?: string;
  ip?: string;
  receivedAt?: string;
  uploadedAt?: string;
  read?: boolean;
  archived?: boolean;
};

const TOPIC_COLORS: Record<string, string> = {
  "product-info":    "#3B82F6",
  "price-quote":     "#F59E0B",
  "dealer-apply":    "#10B981",
  "dealership":      "#10B981",
  "corporate-sales": "#8B5CF6",
  "operator":        "#EC4899",
  "export":          "#06B6D4",
  "technical":       "#EF4444",
  "installation":    "#84CC16",
  "partnership":     "#A855F7",
  "other":           "#6B7280",
};

type Filter = "all" | "unread" | "archived";

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [topicFilter, setTopicFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateState = async (id: string, patch: { read?: boolean; archived?: boolean }) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    }).catch(() => {});
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.add(id); }
      return next;
    });
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) updateState(id, { read: true });
  };

  const visible = messages.filter((m) => {
    if (filter === "unread" && (m.read || m.archived)) return false;
    if (filter === "archived" && !m.archived) return false;
    if (filter === "all" && m.archived) return false;
    if (topicFilter && m.topic !== topicFilter) return false;
    if (query) {
      const q = query.toLocaleLowerCase("tr");
      const hay = [m.name, m.company, m.email, m.phone, m.message, m.topicLabel].filter(Boolean).join(" ").toLocaleLowerCase("tr");
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const totals = {
    all: messages.filter((m) => !m.archived).length,
    unread: messages.filter((m) => !m.read && !m.archived).length,
    archived: messages.filter((m) => m.archived).length,
  };

  const topics = Array.from(new Set(messages.map((m) => m.topic).filter(Boolean) as string[]));

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Mesajlar</h2>
          <p className="text-xs text-white/35 mt-0.5">
            {messages.length} mesaj · iletişim formu, bayilik başvuruları ve diğer tüm gönderimler
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
        >
          <HiOutlineRefresh size={13} /> Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          { id: "all", label: "Tümü", count: totals.all },
          { id: "unread", label: "Okunmamış", count: totals.unread },
          { id: "archived", label: "Arşiv", count: totals.archived },
        ] as { id: Filter; label: string; count: number }[]).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            style={{
              background: filter === f.id ? "#3B82F6" : "rgba(255,255,255,0.04)",
              color: filter === f.id ? "#fff" : "rgba(255,255,255,0.55)",
              border: `1px solid ${filter === f.id ? "transparent" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {f.label}
            <span className="opacity-60">{f.count}</span>
          </button>
        ))}

        <div className="h-5 w-px bg-white/10 mx-1" />

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/65 focus:outline-none focus:border-white/25"
        >
          <option value="">Tüm Konular</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {messages.find((m) => m.topic === t)?.topicLabel ?? t}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <HiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" size={13} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/25"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-12 text-center">
          <HiOutlineMail size={32} className="mx-auto text-white/20 mb-2" />
          <p className="text-sm text-white/40">Bu filtrede mesaj yok.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="space-y-2">
          {visible.map((m) => {
            const accent = TOPIC_COLORS[m.topic ?? "other"] ?? "#6B7280";
            const isOpen = expanded.has(m.id);
            const date = m.receivedAt ?? m.uploadedAt;
            const dateStr = date ? new Date(date).toLocaleString("tr-TR", {
              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
            }) : "—";
            return (
              <div
                key={m.id}
                className="rounded-xl border transition-all"
                style={{
                  background: m.read ? "rgba(255,255,255,0.02)" : "rgba(59,130,246,0.05)",
                  borderColor: m.read ? "rgba(255,255,255,0.07)" : "rgba(59,130,246,0.22)",
                }}
              >
                {/* Row header — clickable to expand */}
                <button
                  onClick={() => toggleExpand(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="flex-shrink-0">
                    {isOpen ? <HiOutlineChevronDown className="text-white/40" size={14} /> : <HiOutlineChevronRight className="text-white/40" size={14} />}
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.read ? "transparent" : accent, border: m.read ? "1px solid rgba(255,255,255,0.18)" : "none" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm truncate max-w-xs ${m.read ? "font-medium text-white/75" : "font-bold text-white"}`}>
                        {m.name ?? "İsimsiz"}
                      </span>
                      {m.topicLabel && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: `${accent}1c`, color: accent }}>
                          {m.topicLabel}
                        </span>
                      )}
                      {m.company && (
                        <span className="text-[11px] text-white/40 truncate max-w-[160px]">· {m.company}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/35 truncate mt-0.5">{m.message?.slice(0, 110)}{(m.message?.length ?? 0) > 110 ? "…" : ""}</p>
                  </div>
                  <span className="text-[10px] text-white/35 flex-shrink-0 hidden sm:block">{dateStr}</span>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      <div className="flex items-start gap-2 text-xs">
                        <HiOutlineUser className="text-white/30 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white/30 uppercase text-[9px] font-bold tracking-wider mb-0.5">Ad Soyad</p>
                          <p className="text-white/85">{m.name ?? "—"}</p>
                        </div>
                      </div>
                      {m.company && (
                        <div className="flex items-start gap-2 text-xs">
                          <HiOutlineOfficeBuilding className="text-white/30 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white/30 uppercase text-[9px] font-bold tracking-wider mb-0.5">Şirket</p>
                            <p className="text-white/85 truncate">{m.company}</p>
                          </div>
                        </div>
                      )}
                      {m.email && (
                        <div className="flex items-start gap-2 text-xs">
                          <HiOutlineMail className="text-white/30 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white/30 uppercase text-[9px] font-bold tracking-wider mb-0.5">E-posta</p>
                            <a href={`mailto:${m.email}`} className="text-blue-400 hover:underline truncate block">{m.email}</a>
                          </div>
                        </div>
                      )}
                      {m.phone && (
                        <div className="flex items-start gap-2 text-xs">
                          <HiOutlinePhone className="text-white/30 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white/30 uppercase text-[9px] font-bold tracking-wider mb-0.5">Telefon</p>
                            <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="text-blue-400 hover:underline">{m.phone}</a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-white/30 uppercase text-[9px] font-bold tracking-wider mb-1.5">Mesaj</p>
                      <div className="rounded-lg bg-white/4 border border-white/8 p-3 text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                        {m.message}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/30">
                      <span>{dateStr}{m.ip && ` · IP: ${m.ip}`}</span>
                      <div className="flex items-center gap-2">
                        {m.email && (
                          <a
                            href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.topicLabel ?? "İletişim")}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-500/14 border border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-500/30 transition-colors text-xs font-semibold"
                          >
                            <HiOutlineExternalLink size={12} /> Yanıtla
                          </a>
                        )}
                        <button
                          onClick={() => updateState(m.id, { read: !m.read })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/10 text-white/55 hover:text-white hover:border-white/20 transition-colors text-xs font-semibold"
                        >
                          {m.read ? <HiOutlineMail size={12} /> : <HiOutlineMailOpen size={12} />}
                          {m.read ? "Okunmadı işaretle" : "Okundu işaretle"}
                        </button>
                        <button
                          onClick={() => updateState(m.id, { archived: !m.archived })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/10 text-white/55 hover:text-white hover:border-white/20 transition-colors text-xs font-semibold"
                        >
                          <HiOutlineArchive size={12} /> {m.archived ? "Arşivden Çıkar" : "Arşivle"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
