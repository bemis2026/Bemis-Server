"use client";

import { useEffect, useRef, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { HiOutlineStar, HiOutlineTrash, HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";
import { uploadDocument } from "../../../lib/clientDocumentUpload";

type DocEntry = {
  id: string; title: string; description: string; category: string;
  url: string; filename: string; size: string; lang: string; date: string; visible: boolean;
  coverUrl?: string;
};

const DOC_CATEGORIES = [
  { id: "price-list",   label: "Fiyat Listesi" },
  { id: "catalog",      label: "Katalog" },
  { id: "installation", label: "Kurulum Kılavuzu" },
  { id: "certificate",  label: "Sertifikalar" },
  { id: "technical",    label: "Teknik Döküman" },
  { id: "other",        label: "Diğer" },
];

const DOC_LANGS = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
];

export default function DocumentsPanel() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [coverUploadLoading, setCoverUploadLoading] = useState(false);
  // Doc id whose cover is currently being uploaded from the list (vs. modal).
  // null = uploading from modal context (editDoc).
  const [listCoverDocId, setListCoverDocId] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const coverUploadRef = useRef<HTMLInputElement>(null);
  const listCoverRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [editDoc, setEditDoc] = useState<DocEntry | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    fetch("/api/admin/documents")
      .then(r => r.json())
      .then(d => setDocs(d.documents ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async (updated: DocEntry[]) => {
    setSaving(true);
    await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: updated }),
    });
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      // uploadDocument: env varsa direct Cloudinary (Vercel limit bypass);
      // yoksa eski /api/admin/upload akışı.
      const { url } = await uploadDocument(file, "documents");
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      const newDoc: DocEntry = {
        id: `doc-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        description: "",
        category: "other",
        url,
        filename: file.name,
        size: sizeStr,
        lang: "tr",
        date: new Date().toISOString().slice(0, 10),
        visible: true,
      };
      setEditDoc(newDoc);
      setShowModal(true);
    } catch (err) {
      alert(`Yükleme başarısız: ${(err as Error).message}`);
    }
    setUploadLoading(false);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editDoc) return;
    setCoverUploadLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "documents");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok && json.url) {
      setEditDoc({ ...editDoc, coverUrl: json.url });
    } else {
      alert(`Kapak yükleme başarısız: ${json?.error ?? "Bilinmeyen hata"}`);
    }
    setCoverUploadLoading(false);
    if (coverUploadRef.current) coverUploadRef.current.value = "";
  };

  const handleListCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const docId = listCoverDocId;
    if (listCoverRef.current) listCoverRef.current.value = "";
    if (!file || !docId) { setListCoverDocId(null); return; }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "documents");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok && json.url) {
      const updated = docs.map(d => d.id === docId ? { ...d, coverUrl: json.url as string } : d);
      setDocs(updated);
      await save(updated);
    } else {
      alert(`Kapak yükleme başarısız: ${json?.error ?? "Bilinmeyen hata"}`);
    }
    setListCoverDocId(null);
  };

  const removeListCover = async (docId: string) => {
    const updated = docs.map(d => d.id === docId ? { ...d, coverUrl: undefined } : d);
    setDocs(updated);
    await save(updated);
  };

  const saveDoc = async (doc: DocEntry) => {
    const exists = docs.find(d => d.id === doc.id);
    const updated = exists ? docs.map(d => d.id === doc.id ? doc : d) : [...docs, doc];
    setDocs(updated);
    await save(updated);
    setShowModal(false);
    setEditDoc(null);
  };

  const deleteDoc = async (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    await save(updated);
  };

  const toggleVisible = async (id: string) => {
    const updated = docs.map(d => d.id === id ? { ...d, visible: !d.visible } : d);
    setDocs(updated);
    await save(updated);
  };

  const CAT_COLORS: Record<string, string> = {
    "price-list": "#F59E0B", "catalog": "#3B82F6", "installation": "#10B981",
    "certificate": "#8B5CF6", "technical": "#EF4444", "other": "#6B7280",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Dökümanlar</h2>
          <p className="text-xs text-white/35 mt-0.5">{docs.length} döküman · <a href="/documents" target="_blank" className="text-blue-400 hover:underline">/documents</a> sayfasında görünür · Her dokümanın yanındaki <HiOutlinePhotograph className="inline" size={12} /> ikonu ile kapak görseli yükleyebilirsiniz</p>
        </div>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={uploadLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#3B82F6", color: "#fff", opacity: uploadLoading ? 0.6 : 1 }}
        >
          {uploadLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <RiImageAddLine size={15} />
          )}
          Döküman Yükle
        </button>
        <input ref={uploadRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleUpload} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-12 text-center">
          <p className="text-sm text-white/30">Henüz döküman yok. Yukarıdan PDF yükleyin.</p>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div className="space-y-2">
          {saving && <p className="text-xs text-white/30 text-right">Kaydediliyor…</p>}
          {docs.map((doc) => {
            const accent = CAT_COLORS[doc.category] ?? "#6B7280";
            const catLabel = DOC_CATEGORIES.find(c => c.id === doc.category)?.label ?? "Diğer";
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: doc.visible ? 1 : 0.45,
                }}
              >
                {/* Cover thumbnail (clickable to upload/replace) */}
                <button
                  onClick={() => { setListCoverDocId(doc.id); listCoverRef.current?.click(); }}
                  className="relative w-12 h-12 rounded-lg flex-shrink-0 group overflow-hidden flex items-center justify-center transition-all"
                  style={{
                    background: doc.coverUrl ? "transparent" : `${accent}15`,
                    border: `1px dashed ${doc.coverUrl ? "transparent" : accent + "55"}`,
                  }}
                  title={doc.coverUrl ? "Kapak görselini değiştir" : "Kapak görseli ekle"}
                >
                  {doc.coverUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={doc.coverUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors flex items-center justify-center">
                        <HiOutlinePhotograph className="opacity-0 group-hover:opacity-100 text-white transition-opacity" size={16} />
                      </div>
                    </>
                  ) : (
                    <HiOutlinePhotograph size={16} style={{ color: accent }} />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate max-w-xs">{doc.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                      style={{ background: `${accent}18`, color: accent }}>{catLabel}</span>
                    <span className="text-[10px] text-white/30 font-mono">{doc.lang?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {doc.size && <span className="text-[10px] text-white/25">{doc.size}</span>}
                    {doc.date && <span className="text-[10px] text-white/25">{doc.date}</span>}
                    {doc.description && <span className="text-[10px] text-white/30 truncate max-w-sm">{doc.description}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-xs"
                    title="Önizle">↗</a>
                  <button onClick={() => { setListCoverDocId(doc.id); listCoverRef.current?.click(); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-blue-400 transition-colors"
                    title={doc.coverUrl ? "Kapağı değiştir" : "Kapak görseli yükle"}>
                    {listCoverDocId === doc.id ? (
                      <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                    ) : (
                      <HiOutlinePhotograph size={13} />
                    )}
                  </button>
                  {doc.coverUrl && (
                    <button onClick={() => removeListCover(doc.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                      title="Kapağı kaldır">
                      <HiOutlineX size={13} />
                    </button>
                  )}
                  <button onClick={() => toggleVisible(doc.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-xs"
                    title={doc.visible ? "Gizle" : "Göster"}>
                    {doc.visible ? "👁" : "🙈"}
                  </button>
                  <button onClick={() => { setEditDoc({ ...doc }); setShowModal(true); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                    title="Düzenle">
                    <HiOutlineStar size={13} style={{ transform: "none" }} />
                  </button>
                  <button onClick={() => deleteDoc(doc.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 transition-colors"
                    title="Sil">
                    <HiOutlineTrash size={13} />
                  </button>
                </div>
              </div>
            );
          })}
          <input ref={listCoverRef} type="file" accept="image/*" className="hidden" onChange={handleListCoverUpload} />
        </div>
      )}

      {/* Edit / Add Modal */}
      {showModal && editDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditDoc(null); } }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a1a1e] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Döküman Bilgileri</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Başlık *</label>
                <input value={editDoc.title}
                  onChange={e => setEditDoc({ ...editDoc, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Açıklama</label>
                <textarea value={editDoc.description}
                  onChange={e => setEditDoc({ ...editDoc, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22 resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Kapak Görseli</label>
                {editDoc.coverUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editDoc.coverUrl} alt="Kapak" className="w-full h-32 object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        onClick={() => coverUploadRef.current?.click()}
                        disabled={coverUploadLoading}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors"
                        style={{ background: "rgba(0,0,0,0.65)", color: "#fff", backdropFilter: "blur(4px)" }}
                      >
                        {coverUploadLoading ? "…" : "Değiştir"}
                      </button>
                      <button
                        onClick={() => setEditDoc({ ...editDoc, coverUrl: undefined })}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors"
                        style={{ background: "rgba(220,38,38,0.85)", color: "#fff", backdropFilter: "blur(4px)" }}
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => coverUploadRef.current?.click()}
                    disabled={coverUploadLoading}
                    className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-white/12 hover:border-white/25 text-xs font-semibold text-white/45 hover:text-white/70 transition-colors"
                  >
                    {coverUploadLoading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                    ) : (
                      <RiImageAddLine size={16} />
                    )}
                    {coverUploadLoading ? "Yükleniyor…" : "Kapak görseli seç (JPG/PNG/WebP)"}
                  </button>
                )}
                <input ref={coverUploadRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Kategori</label>
                  <select value={editDoc.category}
                    onChange={e => setEditDoc({ ...editDoc, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22">
                    {DOC_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Dil</label>
                  <select value={editDoc.lang}
                    onChange={e => setEditDoc({ ...editDoc, lang: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22">
                    {DOC_LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1 uppercase tracking-wider">Tarih</label>
                  <input type="date" value={editDoc.date}
                    onChange={e => setEditDoc({ ...editDoc, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-white/22" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setEditDoc({ ...editDoc, visible: !editDoc.visible })}
                      className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
                      style={{ background: editDoc.visible ? "#3B82F6" : "rgba(255,255,255,0.10)" }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: editDoc.visible ? "calc(100% - 18px)" : "2px" }} />
                    </div>
                    <span className="text-xs text-white/50">Yayında</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => { setShowModal(false); setEditDoc(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 border border-white/8 hover:border-white/15 transition-colors">
                İptal
              </button>
              <button onClick={() => saveDoc(editDoc)} disabled={!editDoc.title}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40"
                style={{ background: "#3B82F6" }}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
