"use client";

import { useEffect, useRef, useState } from "react";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import {
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineLightningBolt,
  HiOutlineTemplate,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineEye,
  HiOutlineSave,
} from "react-icons/hi";

type B2BFeaturedSlot = { categoryId?: string; productId?: string };
type CatBrief = { id: string; name: string; products?: { id: string; name: string }[] };
type B2BHero = { eyebrow: string; heading1: string; heading2: string; description: string; sectorTags: string[]; heroBg?: string };
type B2BBenefit = { title: string; body: string };
type B2BCapability = { title: string; body: string };
type B2BCtaChannel = { href: string; label: string; sub: string };
type B2BCta = { eyebrow: string; heading: string; description: string; tags: string[]; channels: B2BCtaChannel[] };
type B2BBayilik = { heading1: string; heading2: string; description: string; infoTable: { label: string; value: string }[]; benefits: B2BBenefit[]; criteria: string[]; heroBg?: string };
type B2BOperator = { heading1: string; heading2: string; description: string; capabilities: B2BCapability[]; ocppFeatures: string[]; heroBg?: string; featuredProducts?: B2BFeaturedSlot[] };
type B2BApplication = { id: string; image: string; title?: string; body?: string };
type B2BPageData = { hero: B2BHero; featuredProducts?: B2BFeaturedSlot[]; applications?: B2BApplication[]; cta?: B2BCta; bayilik?: B2BBayilik; operator?: B2BOperator };

const defaultBayilik = (): B2BBayilik => ({ heading1: "", heading2: "", description: "", infoTable: [], benefits: [], criteria: [] });
const defaultOperator = (): B2BOperator => ({ heading1: "", heading2: "", description: "", capabilities: [], ocppFeatures: [] });
const defaultCta = (): B2BCta => ({ eyebrow: "", heading: "", description: "", tags: [], channels: [] });

const B2B_TAB_META = [
  { id: "oem"      as const, label: "OEM / Üretici",  icon: HiOutlineOfficeBuilding, color: "#F59E0B", page: "/b2b"     },
  { id: "bayilik"  as const, label: "Bayilik",         icon: HiOutlineClipboardList,  color: "#10B981", page: "/bayilik" },
  { id: "operator" as const, label: "Operatörler",     icon: HiOutlineLightningBolt,  color: "#818CF8", page: "/operator"},
  { id: "cta"      as const, label: "Ana Sayfa Bandı", icon: HiOutlineTemplate,       color: "#3B82F6", page: "/"       },
];

function B2BCard({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}60 0%, transparent 70%)` }} />
      <div className="p-5">{children}</div>
    </div>
  );
}

function B2BSectionTitle({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{label}</p>
      {hint && <p className="text-[10px] text-white/25">{hint}</p>}
    </div>
  );
}

function B2BAddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-white/8 hover:border-white/20 text-white/35 hover:text-white/65 transition-all">
      <HiOutlinePlus size={12} /> {label}
    </button>
  );
}

function B2BDelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/6 hover:border-red-500/30 text-white/20 hover:text-red-400 transition-all flex-shrink-0">
      <HiOutlineTrash size={12} />
    </button>
  );
}

// Convenience wrappers — called as functions {addBtn(...)}, not as <AddBtn>, so no remount issue
const addBtn = (onClick: () => void, label: string) => <B2BAddBtn key={label} onClick={onClick} label={label} />;
const delBtn = (onClick: () => void) => <B2BDelBtn onClick={onClick} />;

export default function B2BPanel({ onSaved, postToPreview, onSubTabChange }: { onSaved?: () => void; postToPreview?: (msg: object) => void; onSubTabChange?: (page: string) => void }) {
  const [data, setData] = useState<B2BPageData | null>(null);
  const [categories, setCategories] = useState<CatBrief[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<"ok" | "err" | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<"oem" | "bayilik" | "operator" | "cta">("oem");
  const [dirty, setDirty] = useState(false);
  const initialLoadedRef = useRef(false);
  const previewDebRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useUnsavedChanges(dirty);

  useEffect(() => {
    fetch("/api/admin/b2b")
      .then(r => { if (!r.ok) throw new Error("auth"); return r.json(); })
      .then(d => setData(d))
      .catch(() => {});
    fetch("/api/products")
      .then(r => r.json())
      .then((d: CatBrief[]) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Flag dirty on any data change after the initial fetch populates state.
  useEffect(() => {
    if (!data) return;
    if (!initialLoadedRef.current) { initialLoadedRef.current = true; return; }
    setDirty(true);
  }, [data]);

  // Debounced live preview — sends B2B data to the iframe whenever data changes
  useEffect(() => {
    if (!data || !postToPreview) return;
    if (previewDebRef.current) clearTimeout(previewDebRef.current);
    previewDebRef.current = setTimeout(() => {
      postToPreview({ type: "BEMIS_B2B_PREVIEW", b2bData: data });
    }, 400);
    return () => { if (previewDebRef.current) clearTimeout(previewDebRef.current); };
  }, [data, postToPreview]);

  // Re-send preview after sub-tab change (iframe navigates to new page, needs time to load)
  const prevSubTabRef = useRef(subTab);
  useEffect(() => {
    if (prevSubTabRef.current === subTab) return;
    prevSubTabRef.current = subTab;
    if (!data || !postToPreview) return;
    const timer = setTimeout(() => {
      postToPreview({ type: "BEMIS_B2B_PREVIEW", b2bData: data });
      // "Ana Sayfa Bandı" is at bottom of homepage — scroll preview to it
      if (subTab === "cta") {
        setTimeout(() => postToPreview({ type: "BEMIS_PREVIEW_SCROLL", anchor: "b2bcta" }), 400);
      }
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTab]);

  const showToast = (type: "ok" | "err", msg?: string) => { setToast(type); setToastMsg(msg ?? null); setTimeout(() => { setToast(null); setToastMsg(null); }, 6000); };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (r.ok) { showToast("ok"); setDirty(false); onSaved?.(); }
      else {
        let msg = `HTTP ${r.status}`;
        try { const d = await r.json(); msg = d.error ?? msg; } catch {}
        showToast("err", msg);
      }
    } catch (e) {
      showToast("err", String(e));
    }
    setSaving(false);
  };

  const setHero = (field: keyof B2BHero, val: string | string[]) =>
    setData(p => p ? { ...p, hero: { ...p.hero, [field]: val } } : p);

  const setBayilikField = (field: keyof B2BBayilik, val: string) =>
    setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), [field]: val } } : p);

  const setOperatorField = (field: keyof B2BOperator, val: string) =>
    setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), [field]: val } } : p);

  const uploadHeroBg = async (
    file: File,
    onUrl: (url: string) => void,
  ) => {
    try {
      const { uploadImage } = await import("../../../lib/clientImageUpload");
      const { url } = await uploadImage(file, "hero-bg");
      onUrl(url);
      showToast("ok", "Arka plan görseli yüklendi.");
    } catch (e) {
      showToast("err", String(e));
    }
  };

  // Featured-product binding is unlimited now — admin can grow the
  // list as far as they like. updateSlot just patches the existing
  // array; addSlot pushes an empty entry; removeSlot drops one.
  const updateSlot = (index: number, patch: Partial<B2BFeaturedSlot>) =>
    setData(p => {
      if (!p) return p;
      const next = [...(p.featuredProducts ?? [])];
      while (next.length <= index) next.push({});
      next[index] = { ...next[index], ...patch };
      return { ...p, featuredProducts: next };
    });
  const addSlot = () =>
    setData(p => p ? { ...p, featuredProducts: [...(p.featuredProducts ?? []), {}] } : p);
  const removeSlot = (index: number) =>
    setData(p => p ? { ...p, featuredProducts: (p.featuredProducts ?? []).filter((_, i) => i !== index) } : p);

  // Operator featured products — same shape as OEM, lives under operator.featuredProducts
  const updateOpSlot = (index: number, patch: Partial<B2BFeaturedSlot>) =>
    setData(p => {
      if (!p) return p;
      const op = p.operator ?? defaultOperator();
      const next = [...(op.featuredProducts ?? [])];
      while (next.length <= index) next.push({});
      next[index] = { ...next[index], ...patch };
      return { ...p, operator: { ...op, featuredProducts: next } };
    });
  const addOpSlot = () =>
    setData(p => {
      if (!p) return p;
      const op = p.operator ?? defaultOperator();
      return { ...p, operator: { ...op, featuredProducts: [...(op.featuredProducts ?? []), {}] } };
    });
  const removeOpSlot = (index: number) =>
    setData(p => {
      if (!p) return p;
      const op = p.operator ?? defaultOperator();
      return { ...p, operator: { ...op, featuredProducts: (op.featuredProducts ?? []).filter((_, i) => i !== index) } };
    });

  const inputCls = "w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 transition-colors";
  const labelCls = "block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider";

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-52 gap-3">
      <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-amber-400 animate-spin" />
      <p className="text-xs text-white/30">OEM verileri yükleniyor…</p>
    </div>
  );

  const activeTab = B2B_TAB_META.find(t => t.id === subTab)!;

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all ${
          toast === "ok"
            ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-300"
            : "bg-red-500/15 border border-red-500/25 text-red-300"
        }`}>
          {toast === "ok" ? <HiOutlineCheck size={15} /> : <HiOutlineExclamation size={15} />}
          <span>{toast === "ok" ? "Tüm değişiklikler kaydedildi." : `Kayıt başarısız: ${toastMsg ?? "bilinmeyen hata"}`}</span>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex-1">
          <h2 className="text-lg font-black text-white mb-1">OEM & Kurumsal</h2>
          <div className="flex items-center gap-3">
            {B2B_TAB_META.filter(t => t.page !== "/").map(t => (
              <a key={t.page} href={t.page} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-[11px] transition-colors hover:opacity-80"
                style={{ color: t.color }}>
                <HiOutlineEye size={11} /> {t.page}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1.5 mb-7 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {B2B_TAB_META.map(t => (
          <button key={t.id} onClick={() => { setSubTab(t.id); onSubTabChange?.(t.page); }}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-[11px] font-semibold transition-all duration-200"
            style={subTab === t.id
              ? { background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}25`, boxShadow: `0 0 20px ${t.color}10` }
              : { color: "rgba(255,255,255,0.28)", border: "1px solid transparent" }}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          OEM / Üretici tab
      ══════════════════════════════════════════════════════ */}
      {subTab === "oem" && (
        <div className="space-y-5">
          {/* Hero */}
          <B2BCard accent="#F59E0B">
            <B2BSectionTitle label="Hero Bölümü" hint="/b2b sayfası üst alanı" />
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Üst Etiket (Eyebrow)</label>
                <input className={inputCls} value={data.hero.eyebrow} onChange={e => setHero("eyebrow", e.target.value)} placeholder="Kurumsal & OEM Çözümler" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Başlık — Satır 1</label>
                  <input className={inputCls} value={data.hero.heading1} onChange={e => setHero("heading1", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Başlık — Satır 2 <span style={{ color: "#F59E0B" }}>●</span> Amber</label>
                  <input className={inputCls} value={data.hero.heading2} onChange={e => setHero("heading2", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Açıklama</label>
                <textarea className={inputCls} rows={3} style={{ resize: "none" }} value={data.hero.description} onChange={e => setHero("description", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Hero Arka Plan Görseli <span className="normal-case font-normal text-white/25">(opsiyonel · ana sayfa hero gibi)</span></label>
                {data.hero.heroBg ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: "16/6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.hero.heroBg} alt="hero-bg" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="text-xs bg-white/90 text-black font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
                        Değiştir
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setHero("heroBg", url)); }} />
                      </label>
                      <button onClick={() => setHero("heroBg", "")} className="text-xs bg-red-500/80 text-white font-semibold px-3 py-1.5 rounded-lg">Kaldır</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl py-4 text-xs text-white/40 hover:text-white/70 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.15)", aspectRatio: "16/6" }}>
                    <span>+ Görsel Yükle</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setHero("heroBg", url)); }} />
                  </label>
                )}
              </div>
              <div>
                <label className={labelCls}>Sektör Etiketleri <span className="normal-case font-normal text-white/25">(virgülle ayırın)</span></label>
                <input className={inputCls}
                  value={(data.hero.sectorTags ?? []).join(", ")}
                  onChange={e => setHero("sectorTags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="OEM Üretici, Şarj Ağı Operatörü, Sistem Entegratörü" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(data.hero.sectorTags ?? []).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </B2BCard>

          {/* Öne Çıkan Ürünler — sınırsız */}
          <B2BCard accent="#F59E0B">
            <B2BSectionTitle label="Öne Çıkan Ürünler" hint="Ürün kataloğundan seçilir — sayı sınırsız" />
            <p className="text-[11px] text-white/40 mb-4 -mt-1">
              Şarj ünitesi üreticilerine tanıtılacak ürünleri ürün yönetimindeki kataloğundan seçin. İstediğiniz kadar slot ekleyebilirsiniz; boş slotlar sayfada gösterilmez.
            </p>
            <div className="space-y-3">
              {(data.featuredProducts ?? []).map((_, i) => {
                const slot = data.featuredProducts?.[i] ?? {};
                const catProducts = categories.find(c => c.id === slot.categoryId)?.products ?? [];
                return (
                  <div key={i} className="rounded-xl p-3.5 space-y-2.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                          style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}>
                          {i + 1}
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Slot {i + 1}</p>
                      </div>
                      <button onClick={() => removeSlot(i)}
                        className="flex items-center gap-1 text-[10px] text-white/30 hover:text-red-400 transition-colors">
                        <HiOutlineTrash size={11} /> Sil
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select className={inputCls} value={slot.categoryId ?? ""}
                        onChange={e => updateSlot(i, { categoryId: e.target.value || undefined, productId: undefined })}>
                        <option value="" style={{ background: "#0f0f12" }}>— Kategori seç —</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id} style={{ background: "#0f0f12" }}>{c.name}</option>
                        ))}
                      </select>
                      <select className={inputCls} value={slot.productId ?? ""} disabled={!slot.categoryId}
                        onChange={e => updateSlot(i, { productId: e.target.value || undefined })}>
                        <option value="" style={{ background: "#0f0f12" }}>— Ürün seç —</option>
                        {catProducts.map(pr => (
                          <option key={pr.id} value={pr.id} style={{ background: "#0f0f12" }}>{pr.name}</option>
                        ))}
                      </select>
                    </div>
                    {slot.categoryId && slot.productId && (
                      <p className="text-[10px] text-white/35">
                        → /products/{slot.categoryId}/{slot.productId}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </B2BCard>

          {/* Üretici Uygulamaları gallery removed — public /b2b page now
              leads with a single image+text intro block ("OEM
              Üreticilerine Sunduğumuz Çözümler") sourced from
              dna.factoryImage instead of a separate case-study tile
              grid. Reference projects already live on the homepage
              ("Sahada Bemis") marquee. Keeping `applications` in the
              schema is harmless; no admin UI needed.
          */}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Bayilik tab
      ══════════════════════════════════════════════════════ */}
      {subTab === "bayilik" && (
        <div className="space-y-5">
          {/* Hero */}
          <B2BCard accent="#10B981">
            <B2BSectionTitle label="Hero Bölümü" hint="/bayilik sayfası" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Başlık — Satır 1</label>
                  <input className={inputCls} value={data.bayilik?.heading1 ?? ""}
                    onChange={e => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), heading1: e.target.value } } : p)} />
                </div>
                <div>
                  <label className={labelCls}>Başlık — Satır 2 <span style={{ color: "#10B981" }}>●</span> Yeşil</label>
                  <input className={inputCls} value={data.bayilik?.heading2 ?? ""}
                    onChange={e => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), heading2: e.target.value } } : p)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Açıklama</label>
                <textarea className={inputCls} rows={3} style={{ resize: "none" }} value={data.bayilik?.description ?? ""}
                  onChange={e => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), description: e.target.value } } : p)} />
              </div>
              <div>
                <label className={labelCls}>Hero Arka Plan Görseli <span className="normal-case font-normal text-white/25">(opsiyonel)</span></label>
                {data.bayilik?.heroBg ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: "16/6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.bayilik.heroBg} alt="hero-bg" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="text-xs bg-white/90 text-black font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
                        Değiştir
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setBayilikField("heroBg", url)); }} />
                      </label>
                      <button onClick={() => setBayilikField("heroBg", "")} className="text-xs bg-red-500/80 text-white font-semibold px-3 py-1.5 rounded-lg">Kaldır</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl py-4 text-xs text-white/40 hover:text-white/70 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.15)", aspectRatio: "16/6" }}>
                    <span>+ Görsel Yükle</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setBayilikField("heroBg", url)); }} />
                  </label>
                )}
              </div>
            </div>
          </B2BCard>

          {/* Benefits */}
          <B2BCard accent="#10B981">
            <B2BSectionTitle label="Bayi Avantajları" hint="Sayfada 6 kart olarak gösterilir" />
            <div className="space-y-2">
              {(data.bayilik?.benefits ?? []).map((b, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input className={inputCls} value={b.title} placeholder="Başlık"
                      onChange={e => setData(p => {
                        if (!p?.bayilik) return p;
                        const benefits = [...p.bayilik.benefits];
                        benefits[idx] = { ...benefits[idx], title: e.target.value };
                        return { ...p, bayilik: { ...p.bayilik, benefits } };
                      })} />
                    <input className={inputCls} value={b.body} placeholder="Açıklama"
                      onChange={e => setData(p => {
                        if (!p?.bayilik) return p;
                        const benefits = [...p.bayilik.benefits];
                        benefits[idx] = { ...benefits[idx], body: e.target.value };
                        return { ...p, bayilik: { ...p.bayilik, benefits } };
                      })} />
                  </div>
                  {delBtn(() => setData(p => p?.bayilik ? { ...p, bayilik: { ...p.bayilik, benefits: p.bayilik.benefits.filter((_, i) => i !== idx) } } : p))}
                </div>
              ))}
              <div className="pt-1">
                {addBtn(() => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), benefits: [...(p.bayilik?.benefits ?? []), { title: "", body: "" }] } } : p), "Avantaj Ekle")}
              </div>
            </div>
          </B2BCard>

          {/* Criteria */}
          <B2BCard accent="#10B981">
            <B2BSectionTitle label="Aranan Kriterler" hint="Başvuru koşulları listesi" />
            <div className="space-y-2">
              {(data.bayilik?.criteria ?? []).map((c, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.22)" }}>
                    <HiOutlineCheck size={10} style={{ color: "#10B981" }} />
                  </div>
                  <input className={inputCls} value={c} placeholder={`Kriter ${idx + 1}`}
                    onChange={e => setData(p => {
                      if (!p?.bayilik) return p;
                      const criteria = [...p.bayilik.criteria];
                      criteria[idx] = e.target.value;
                      return { ...p, bayilik: { ...p.bayilik, criteria } };
                    })} />
                  {delBtn(() => setData(p => p?.bayilik ? { ...p, bayilik: { ...p.bayilik, criteria: p.bayilik.criteria.filter((_, i) => i !== idx) } } : p))}
                </div>
              ))}
              <div className="pt-1">
                {addBtn(() => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), criteria: [...(p.bayilik?.criteria ?? []), ""] } } : p), "Kriter Ekle")}
              </div>
            </div>
          </B2BCard>

          {/* Info Table */}
          <B2BCard accent="#10B981">
            <B2BSectionTitle label="Hızlı Bilgi Tablosu" hint="Sayfada sağ panelde gösterilir" />
            <div className="space-y-2">
              {(data.bayilik?.infoTable ?? []).map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={inputCls} value={row.label} placeholder="Etiket"
                    onChange={e => setData(p => {
                      if (!p?.bayilik) return p;
                      const infoTable = [...p.bayilik.infoTable];
                      infoTable[idx] = { ...infoTable[idx], label: e.target.value };
                      return { ...p, bayilik: { ...p.bayilik, infoTable } };
                    })} />
                  <input className={inputCls} value={row.value} placeholder="Değer"
                    onChange={e => setData(p => {
                      if (!p?.bayilik) return p;
                      const infoTable = [...p.bayilik.infoTable];
                      infoTable[idx] = { ...infoTable[idx], value: e.target.value };
                      return { ...p, bayilik: { ...p.bayilik, infoTable } };
                    })} />
                  {delBtn(() => setData(p => p?.bayilik ? { ...p, bayilik: { ...p.bayilik, infoTable: p.bayilik.infoTable.filter((_, i) => i !== idx) } } : p))}
                </div>
              ))}
              <div className="pt-1">
                {addBtn(() => setData(p => p ? { ...p, bayilik: { ...(p.bayilik ?? defaultBayilik()), infoTable: [...(p.bayilik?.infoTable ?? []), { label: "", value: "" }] } } : p), "Satır Ekle")}
              </div>
            </div>
          </B2BCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Operator tab
      ══════════════════════════════════════════════════════ */}
      {subTab === "operator" && (
        <div className="space-y-5">
          <B2BCard accent="#818CF8">
            <B2BSectionTitle label="Hero Bölümü" hint="/operator sayfası" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Başlık — Satır 1</label>
                  <input className={inputCls} value={data.operator?.heading1 ?? ""}
                    onChange={e => setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), heading1: e.target.value } } : p)} />
                </div>
                <div>
                  <label className={labelCls}>Başlık — Satır 2 <span style={{ color: "#818CF8" }}>●</span> Mor</label>
                  <input className={inputCls} value={data.operator?.heading2 ?? ""}
                    onChange={e => setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), heading2: e.target.value } } : p)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Açıklama</label>
                <textarea className={inputCls} rows={3} style={{ resize: "none" }} value={data.operator?.description ?? ""}
                  onChange={e => setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), description: e.target.value } } : p)} />
              </div>
              <div>
                <label className={labelCls}>Hero Arka Plan Görseli <span className="normal-case font-normal text-white/25">(opsiyonel)</span></label>
                {data.operator?.heroBg ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: "16/6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.operator.heroBg} alt="hero-bg" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="text-xs bg-white/90 text-black font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
                        Değiştir
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setOperatorField("heroBg", url)); }} />
                      </label>
                      <button onClick={() => setOperatorField("heroBg", "")} className="text-xs bg-red-500/80 text-white font-semibold px-3 py-1.5 rounded-lg">Kaldır</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl py-4 text-xs text-white/40 hover:text-white/70 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.15)", aspectRatio: "16/6" }}>
                    <span>+ Görsel Yükle</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroBg(f, url => setOperatorField("heroBg", url)); }} />
                  </label>
                )}
              </div>
            </div>
          </B2BCard>

          <B2BCard accent="#818CF8">
            <B2BSectionTitle label="Teknik Özellikler" hint="Sayfada 4 kart olarak gösterilir" />
            <div className="space-y-2">
              {(data.operator?.capabilities ?? []).map((c, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black"
                    style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8", border: "1px solid rgba(129,140,248,0.2)" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input className={inputCls} value={c.title} placeholder="Özellik başlığı"
                      onChange={e => setData(p => {
                        if (!p?.operator) return p;
                        const capabilities = [...p.operator.capabilities];
                        capabilities[idx] = { ...capabilities[idx], title: e.target.value };
                        return { ...p, operator: { ...p.operator, capabilities } };
                      })} />
                    <input className={inputCls} value={c.body} placeholder="Açıklama"
                      onChange={e => setData(p => {
                        if (!p?.operator) return p;
                        const capabilities = [...p.operator.capabilities];
                        capabilities[idx] = { ...capabilities[idx], body: e.target.value };
                        return { ...p, operator: { ...p.operator, capabilities } };
                      })} />
                  </div>
                  {delBtn(() => setData(p => p?.operator ? { ...p, operator: { ...p.operator, capabilities: p.operator.capabilities.filter((_, i) => i !== idx) } } : p))}
                </div>
              ))}
              <div className="pt-1">
                {addBtn(() => setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), capabilities: [...(p.operator?.capabilities ?? []), { title: "", body: "" }] } } : p), "Özellik Ekle")}
              </div>
            </div>
          </B2BCard>

          <B2BCard accent="#3B82F6">
            <B2BSectionTitle label="OCPP Özellik Listesi" hint="Sayfada 2 sütun grid olarak gösterilir" />
            <div className="grid grid-cols-2 gap-2">
              {(data.operator?.ocppFeatures ?? []).map((f, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={inputCls} value={f} placeholder={`Özellik ${idx + 1}`}
                    onChange={e => setData(p => {
                      if (!p?.operator) return p;
                      const ocppFeatures = [...p.operator.ocppFeatures];
                      ocppFeatures[idx] = e.target.value;
                      return { ...p, operator: { ...p.operator, ocppFeatures } };
                    })} />
                  {delBtn(() => setData(p => p?.operator ? { ...p, operator: { ...p.operator, ocppFeatures: p.operator.ocppFeatures.filter((_, i) => i !== idx) } } : p))}
                </div>
              ))}
            </div>
            <div className="pt-3">
              {addBtn(() => setData(p => p ? { ...p, operator: { ...(p.operator ?? defaultOperator()), ocppFeatures: [...(p.operator?.ocppFeatures ?? []), ""] } } : p), "Özellik Ekle")}
            </div>
          </B2BCard>

          {/* Operatör için Öne Çıkan Ürünler — sınırsız, same pattern as OEM tab */}
          <B2BCard accent="#818CF8">
            <B2BSectionTitle label="Operatörlere Özel Ürünler" hint="Ürün kataloğundan öne çıkan ürün seçin — sayı sınırsız" />
            <p className="text-[11px] text-white/40 mb-4 -mt-1">
              Şarj ağı operatörlerine tanıtılacak ürünleri ürün yönetimindeki kataloğundan seçin. İstediğiniz kadar slot ekleyebilirsiniz; boş slotlar sayfada gösterilmez.
            </p>
            <div className="space-y-3">
              {(data.operator?.featuredProducts ?? []).map((_, i) => {
                const slot = data.operator?.featuredProducts?.[i] ?? {};
                const catProducts = categories.find(c => c.id === slot.categoryId)?.products ?? [];
                return (
                  <div key={i} className="rounded-xl p-3.5 space-y-2.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                          style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8", border: "1px solid rgba(129,140,248,0.25)" }}>
                          {i + 1}
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">Slot {i + 1}</p>
                      </div>
                      <button onClick={() => removeOpSlot(i)}
                        className="flex items-center gap-1 text-[10px] text-white/30 hover:text-red-400 transition-colors">
                        <HiOutlineTrash size={11} /> Sil
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select className={inputCls} value={slot.categoryId ?? ""}
                        onChange={e => updateOpSlot(i, { categoryId: e.target.value || undefined, productId: undefined })}>
                        <option value="" style={{ background: "#0f0f12" }}>— Kategori seç —</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id} style={{ background: "#0f0f12" }}>{c.name}</option>
                        ))}
                      </select>
                      <select className={inputCls} value={slot.productId ?? ""} disabled={!slot.categoryId}
                        onChange={e => updateOpSlot(i, { productId: e.target.value || undefined })}>
                        <option value="" style={{ background: "#0f0f12" }}>— Ürün seç —</option>
                        {catProducts.map(pr => (
                          <option key={pr.id} value={pr.id} style={{ background: "#0f0f12" }}>{pr.name}</option>
                        ))}
                      </select>
                    </div>
                    {slot.categoryId && slot.productId && (
                      <p className="text-[10px] text-white/35">
                        → /products/{slot.categoryId}/{slot.productId}
                      </p>
                    )}
                  </div>
                );
              })}
              <button
                onClick={addOpSlot}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all"
                style={{ background: "rgba(129,140,248,0.12)", border: "1px dashed rgba(129,140,248,0.40)", color: "#818CF8" }}
              >
                <HiOutlinePlus size={13} /> Slot Ekle
              </button>
            </div>
          </B2BCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Ana Sayfa Bandı (CTA) tab
      ══════════════════════════════════════════════════════ */}
      {subTab === "cta" && (
        <div className="space-y-5">
          <B2BCard accent="#3B82F6">
            <B2BSectionTitle label="Ana Sayfa OEM Bandı" hint="Ana sayfada B2BCta bölümü" />
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Üst Etiket (Eyebrow)</label>
                <input className={inputCls} value={data.cta?.eyebrow ?? ""}
                  onChange={e => setData(p => p ? { ...p, cta: { ...(p.cta ?? defaultCta()), eyebrow: e.target.value } } : p)} />
              </div>
              <div>
                <label className={labelCls}>Başlık</label>
                <input className={inputCls} value={data.cta?.heading ?? ""}
                  onChange={e => setData(p => p ? { ...p, cta: { ...(p.cta ?? defaultCta()), heading: e.target.value } } : p)} />
              </div>
              <div>
                <label className={labelCls}>Açıklama</label>
                <textarea className={inputCls} rows={3} style={{ resize: "none" }} value={data.cta?.description ?? ""}
                  onChange={e => setData(p => p ? { ...p, cta: { ...(p.cta ?? defaultCta()), description: e.target.value } } : p)} />
              </div>
              <div>
                <label className={labelCls}>Etiketler <span className="normal-case font-normal text-white/25">(virgülle ayırın)</span></label>
                <input className={inputCls}
                  value={(data.cta?.tags ?? []).join(", ")}
                  onChange={e => setData(p => p ? { ...p, cta: { ...(p.cta ?? defaultCta()), tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } } : p)}
                  placeholder="OEM Üretici, Şarj Ağı Operatörü, Distribütör / Bayi" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(data.cta?.tags ?? []).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(59,130,246,0.12)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.20)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </B2BCard>

          <div>
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">3 Kanal Kartı</p>
            <div className="space-y-3">
              {(data.cta?.channels ?? []).map((ch, idx) => {
                const accent = idx === 0 ? "#3B82F6" : idx === 1 ? "#10B981" : "#818CF8";
                return (
                  <div key={idx} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${accent}20`, background: "rgba(255,255,255,0.02)" }}>
                    <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${accent}50, transparent)` }} />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: `${accent}20`, border: `1px solid ${accent}30` }} />
                        <p className="text-xs font-bold" style={{ color: accent }}>Kart {idx + 1}</p>
                        <span className="text-[10px] text-white/25 ml-auto">{ch.href}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Kart Başlığı</label>
                          <input className={inputCls} value={ch.label} placeholder="örn. OEM & Üreticiler"
                            onChange={e => setData(p => {
                              if (!p?.cta) return p;
                              const channels = [...p.cta.channels];
                              channels[idx] = { ...channels[idx], label: e.target.value };
                              return { ...p, cta: { ...p.cta, channels } };
                            })} />
                        </div>
                        <div>
                          <label className={labelCls}>Alt Metin</label>
                          <input className={inputCls} value={ch.sub} placeholder="Kısa açıklama"
                            onChange={e => setData(p => {
                              if (!p?.cta) return p;
                              const channels = [...p.cta.channels];
                              channels[idx] = { ...channels[idx], sub: e.target.value };
                              return { ...p, cta: { ...p.cta, channels } };
                            })} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky bottom save bar ─────────────────────────── */}
      <div className="sticky bottom-0 left-0 right-0 mt-8 pt-4 pb-1" style={{ background: "linear-gradient(to top, rgba(10,10,12,1) 60%, rgba(10,10,12,0))" }}>
        <button onClick={save} disabled={saving}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-all hover:brightness-110"
          style={{ background: saving ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", color: "#000", boxShadow: saving ? "none" : "0 4px 20px rgba(245,158,11,0.25)" }}>
          {saving
            ? <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Kaydediliyor…</>
            : <><HiOutlineSave size={15} />Değişiklikleri Kaydet — {activeTab.label}{dirty ? " •" : ""}</>}
        </button>
      </div>
    </div>
  );
}
