"use client";

/*
 * TARANABİLİR BAYİ DİZİNİ — anasayfanın İLK HTML'ine giren bayi listesi.
 *
 * ⚠️⚠️ NEDEN VAR (2026-09-12, ÖLÇÜLDÜ): `DealerNetwork` etkileşimli bölümü bayi
 * verisini `useEffect` içinde `/api/dealers`'tan çekiyor VE kartları yalnız
 * kullanıcı bir bölge/şehir SEÇİNCE basıyor. Sonuç: Googlebot olarak alınan
 * anasayfa HTML'inde (409 KB) bayi adı, adresi ve web adresi HİÇ YOKTU —
 * 33 bayinin 30'unun `<a href>` bağlantısı pratikte taranamıyordu.
 * (Aynı kusur sınıfı bu sitede daha önce üç kez çıktı: footer düğmesi ·
 *  şehir akordeonu · /blog sekmesi → koşullu mount = içerik HTML'e girmiyor.)
 *
 * Bu bileşen o boşluğu kapatır: veri SUNUCUDAN prop ile gelir, bileşen istemci
 * bileşeni olduğu için Next tarafından SSR edilir → liste ilk HTML'de olur.
 *
 * ⚠️ GİZLEME YOK. Liste GERÇEKTEN görünürdür (display:none / 0px / ekran-okuyucu
 *    hilesi YOK). Yalnız tarayıcıya görünen, kullanıcıya görünmeyen bağlantı
 *    Google'ın "gizli bağlantı" tanımına girer ve manuel işlem sebebidir.
 * ⚠️ `nofollow` KOYULMADI: bayiler gerçek ticari ortaklarımız, editoryal bağlantı.
 *    Ücretli/şişirilmiş bağlantı değil.
 * ⚠️ AYRICALIK YOK: liste TÜM bayileri aynı biçimde gösterir. Tek bir bayiyi öne
 *    çıkaran özel yerleşim istenirse reddet — diğer bayilere karşı haksızlık olur
 *    ve düzeni bozar (kullanıcı 2026-09-12'de bunu açıkça gerekçe gösterdi).
 */

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText, fillText } from "../lib/ui";
import { getCityLabel } from "../../lib/turkeyCities";

export type DizinBayi = {
  name?: string;
  address?: string;
  website?: string;
  tier?: string;
};
export type DizinVeri = Record<string, { dealers?: DizinBayi[] }>;

export default function DealerDirectory({ data }: { data: DizinVeri }) {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const d = theme === "dark";
  const T = (tr: string, en: string) => pickText(lang, tr, en);

  const sehirler = Object.keys(data ?? {})
    .map((id) => ({ id, etiket: getCityLabel(id) || id, bayiler: (data[id]?.dealers ?? []).filter((b) => b?.name?.trim()) }))
    .filter((s) => s.bayiler.length > 0)
    .sort((a, b) => a.etiket.localeCompare(b.etiket, "tr"));

  const toplam = sehirler.reduce((n, s) => n + s.bayiler.length, 0);
  if (!toplam) return null;

  const metin = d ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.78)";
  const soluk = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.50)";
  const cizgi = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const baglanti = d ? "#93C5FD" : "#2563EB";

  return (
    <section id="dealer-directory" className="w-full py-12 sm:py-16" style={{ borderTop: `1px solid ${cizgi}` }}>
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full px-5 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-black mb-1" style={{ color: metin }}>
          {T("Yetkili Bayilerimiz", "Our Authorised Dealers")}
        </h2>
        <p className="text-sm mb-7" style={{ color: soluk }}>
          {/* ⚠️ SAYI YER TUTUCUYLA: anahtar statik kalmalı, yoksa ui.json'da
              hiçbir zaman eşleşmez ve 5 dil kalıcı olarak İngilizce görür. */}
          {fillText(
            lang,
            "Türkiye genelinde {n} yetkili bayi, {c} şehirde.",
            "{n} authorised dealers across {c} cities in Türkiye.",
            { n: toplam, c: sehirler.length },
          )}
        </p>

        {/* ⚠️ ADRES BİLEREK YOK: etkileşimli bayi bölümü zaten tam adresi gösteriyor.
            Buranın işi TARANABİLİR ad + bağlantı; adres eklenince bölüm 4724 px'e
            çıkıyordu (ölçüldü) ve anasayfanın altına ikinci bir sayfa gibi biniyordu. */}
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sehirler.map((s) => (
            <div key={s.id}>
              <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: soluk }}>
                {s.etiket}
              </h3>
              <ul className="space-y-1.5">
                {s.bayiler.map((b, i) => (
                  <li key={`${s.id}-${i}`} className="text-[13px] leading-snug" style={{ color: metin }}>
                    <span>{b.name}</span>
                    {b.website?.trim() && (
                      <>
                        {" — "}
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline break-all"
                          style={{ color: baglanti }}
                        >
                          {b.website.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
