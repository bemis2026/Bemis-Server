"use client";

// Yönetim paneli → SEO sekmesi: hangi arama kümesini hangi sayfa hedefliyor.
//
// ⚠️ SALT GÖRÜNTÜLEME. Buradan içerik düzenlenmez; tablo `app/lib/seoHedefler.ts`
//    üzerinden sayfaların KENDİ SEO kaynaklarını okur (dcKablo · ortakAlan ·
//    cities · CATEGORY_SEO). Elle kopyalanan bir liste ilk metin değişikliğinde
//    sessizce yalan söylemeye başlardı; burada kaynak değişirse tablo da değişir.

import { useMemo, useState } from "react";
import { HiOutlineExternalLink, HiOutlineSearch } from "react-icons/hi";
import { SEO_HEDEFLERI, seoOzet, type SeoHedef } from "../../lib/seoHedefler";

const ACCENT = "#3B82F6";

/** Alan rozetinin rengi — göz tablodaki grupları ayırabilsin. */
const ALAN_RENK: Record<string, string> = {
  "İniş sayfası": "#059669",
  "Kategori": "#3B82F6",
  "Şehir sayfası": "#F59E0B",
};

export default function SeoPanel() {
  const ozet = useMemo(() => seoOzet(), []);
  const [alanFiltre, setAlanFiltre] = useState<string>("hepsi");
  const [arama, setArama] = useState("");

  const satirlar = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return SEO_HEDEFLERI.filter((h: SeoHedef) => {
      if (alanFiltre !== "hepsi" && h.alan !== alanFiltre) return false;
      if (!q) return true;
      const havuz = [h.kume, h.sayfa, h.bolge, h.kitle, h.ayrim, ...h.anahtarlar]
        .join(" ")
        .toLocaleLowerCase("tr");
      return havuz.includes(q);
    });
  }, [alanFiltre, arama]);

  const gorunenAnahtar = satirlar.reduce((t, h) => t + h.anahtarlar.length, 0);

  return (
    <div className="space-y-6">
      {/* ── Başlık ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-white mb-0.5">SEO Hedef Haritası</h2>
        <p className="text-xs text-white/35">
          Hangi arama kümesini hangi sayfa hedefliyor, hangi bölgede ve neyle ayrışıyor.
          Tablo sayfaların kendi SEO kaynaklarından okunur — ayrıca güncellenmesi gerekmez.
        </p>
      </div>

      {/* ── Özet kartlar ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Hedef sayfa</div>
          <div className="text-2xl font-black text-white">{ozet.sayfa}</div>
        </div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Anahtar arama</div>
          <div className="text-2xl font-black" style={{ color: ACCENT }}>{ozet.anahtar}</div>
        </div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Alan dağılımı</div>
          <div className="space-y-0.5">
            {ozet.alanlar.map(([ad, n]) => (
              <div key={ad} className="flex items-center justify-between text-[11px]">
                <span className="text-white/55">{ad}</span>
                <span className="font-bold text-white/80">{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Bölge</div>
          <div className="space-y-0.5">
            {ozet.bolgeler.map(([ad, n]) => (
              <div key={ad} className="flex items-center justify-between text-[11px]">
                <span className="text-white/55">{ad}</span>
                <span className="font-bold text-white/80">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filtreler ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {["hepsi", "İniş sayfası", "Kategori", "Şehir sayfası"].map((a) => {
          const aktif = alanFiltre === a;
          return (
            <button
              key={a}
              onClick={() => setAlanFiltre(a)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer"
              style={{
                color: aktif ? "#fff" : "rgba(255,255,255,0.55)",
                background: aktif ? (ALAN_RENK[a] ?? ACCENT) + "33" : "rgba(255,255,255,0.04)",
                borderColor: aktif ? (ALAN_RENK[a] ?? ACCENT) + "66" : "rgba(255,255,255,0.10)",
              }}
            >
              {a === "hepsi" ? "Hepsi" : a}
            </button>
          );
        })}

        <div className="relative ms-auto">
          <HiOutlineSearch size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Anahtar kelime ara…"
            className="bg-white/5 border border-white/10 rounded-xl ps-8 pe-3 py-2 text-xs text-white outline-none w-56"
          />
        </div>
      </div>

      {/* ── Tablo ──────────────────────────────────────────────────── */}
      {/* ⚠️ Geniş içerik kendi kabında yatay kayar — panel gövdesi taşmaz. */}
      <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-white/4">
                <th className="text-start font-bold text-white/70 px-4 py-3 whitespace-nowrap">Arama kümesi</th>
                <th className="text-start font-bold text-white/70 px-4 py-3 whitespace-nowrap">Alan</th>
                <th className="text-start font-bold text-white/70 px-4 py-3 whitespace-nowrap">Bölge</th>
                <th className="text-start font-bold text-white/70 px-4 py-3 whitespace-nowrap">Hedef sayfa</th>
                <th className="text-start font-bold text-white/70 px-4 py-3">Hedeflenen aramalar</th>
              </tr>
            </thead>
            <tbody>
              {satirlar.map((h) => (
                <tr key={h.sayfa} className="border-t border-white/8 align-top">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white/90 whitespace-nowrap">{h.kume}</div>
                    <div className="text-[10px] text-white/35 mt-0.5">{h.kitle}</div>
                    <div className="text-[10px] mt-1" style={{ color: ACCENT }}>{h.ayrim}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold"
                      style={{
                        color: ALAN_RENK[h.alan] ?? "#fff",
                        background: (ALAN_RENK[h.alan] ?? ACCENT) + "1f",
                        border: `1px solid ${(ALAN_RENK[h.alan] ?? ACCENT)}44`,
                      }}
                    >
                      {h.alan}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-white/60">{h.bolge}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={h.sayfa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold hover:opacity-70 transition-opacity cursor-pointer"
                      style={{ color: ACCENT }}
                    >
                      {h.sayfa}
                      <HiOutlineExternalLink size={12} />
                    </a>
                    <div className="text-[10px] text-white/30 mt-0.5">{h.tarih}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {h.anahtarlar.map((k) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-white/6 border border-white/10 text-white/65"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-white/30">
        Gösterilen: {satirlar.length} sayfa · {gorunenAnahtar} anahtar arama.
        Kaynak: ilgili sayfaların kendi SEO kayıtları (keywords / metaTitle alanları).
      </p>
    </div>
  );
}
