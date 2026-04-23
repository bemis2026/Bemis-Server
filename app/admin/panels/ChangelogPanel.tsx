"use client";

import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

type ChangelogEntry = { id: string; version: string; date: string; title: string; items: string[] };

export default function ChangelogPanel() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ version: "", title: "", items: "" });

  useEffect(() => {
    fetch("/api/admin/changelog")
      .then(r => r.json())
      .then(d => setEntries(d.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.version || !form.title) return;
    setSaving(true);
    const newEntry: ChangelogEntry = {
      id: `v${Date.now()}`,
      version: form.version,
      date: new Date().toISOString().slice(0, 10),
      title: form.title,
      items: form.items.split("\n").map(s => s.trim()).filter(Boolean),
    };
    const updated = [newEntry, ...entries];
    const res = await fetch("/api/admin/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: updated }),
    });
    if (res.ok) {
      setEntries(updated);
      setForm({ version: "", title: "", items: "" });
      setAdding(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    await fetch("/api/admin/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: updated }),
    });
    setEntries(updated);
  };

  const ACCENT = "#3B82F6";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white mb-0.5">Değişiklik Geçmişi</h2>
          <p className="text-xs text-white/35">Versiyon güncellemelerini ve yapılan değişiklikleri takip edin.</p>
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 text-xs bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-xl transition-colors font-semibold"
        >
          <HiOutlinePlus size={14} /> Yeni Versiyon
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white/3 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Versiyon</label>
              <input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))}
                placeholder="v1.3" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Başlık</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Yeni özellik adı" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Değişiklikler (her satır ayrı madde)</label>
            <textarea value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))}
              rows={4} placeholder={"Yeni özellik eklendi\nHata düzeltildi\nPerformans iyileştirildi"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 outline-none resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="text-xs text-white/40 hover:text-white/60 px-3 py-2">İptal</button>
            <button onClick={handleAdd} disabled={saving || !form.version || !form.title}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-10">Henüz kayıt yok.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={entry.id} className="bg-white/3 border border-white/7 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg"
                    style={{ background: `${ACCENT}18`, color: i === 0 ? ACCENT : "rgba(255,255,255,0.50)", border: `1px solid ${i === 0 ? ACCENT + "30" : "rgba(255,255,255,0.08)"}` }}>
                    {entry.version}
                  </span>
                  {i === 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                      Güncel
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/25">{entry.date}</span>
                  <button onClick={() => handleDelete(entry.id)} className="text-white/20 hover:text-red-400 transition-colors">
                    <HiOutlineTrash size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-white/80 mb-2">{entry.title}</p>
              {entry.items.length > 0 && (
                <ul className="space-y-1">
                  {entry.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: ACCENT }} />
                      <span className="text-xs text-white/45 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
