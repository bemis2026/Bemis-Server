// SEO HEDEF HARİTASI — hangi arama kümesini hangi sayfa hedefliyor.
//
// ⚠️ BU DOSYA ELLE YAZILMIŞ BİR LİSTE DEĞİL: anahtar kelimeler sayfaların
//    KENDİ SEO kaynaklarından içe aktarılır (`dcKablo.ts`, `ortakAlan.ts`,
//    `cities.ts`, `seo.ts`). Sebep: elle kopyalanan bir tablo ilk metin
//    değişikliğinde sessizce yalan söylemeye başlar. Buradaki tablo yanlışsa
//    kaynak da yanlıştır — ikisi ayrışamaz.
//
// 📌 Yeni bir iniş sayfası açınca: kaynağını buraya ekle. Yönetim panelindeki
//    SEO sekmesi bu diziyi okur, ayrıca bir yere yazmak gerekmez.

import { CATEGORY_SEO } from "./seo";
import { DC_KABLO } from "./dcKablo";
import { ORTAK_ALAN } from "./ortakAlan";
import { CITY_PAGES } from "./cities";

export type SeoAlan = "İniş sayfası" | "Kategori" | "Şehir sayfası";

export type SeoHedef = {
  /** Arama kümesinin kısa adı. */
  kume: string;
  /** Hedefi taşıyan sayfa. */
  sayfa: string;
  alan: SeoAlan;
  /** Coğrafi kapsam — "bölge". */
  bolge: string;
  /** Bu aramayı kim yapıyor. */
  kitle: string;
  /** Hedeflenen aramalar (sayfanın kendi keywords alanından). */
  anahtarlar: string[];
  /** Ayrıştırıcı: bu sayfada neyle öne çıkıyoruz. */
  ayrim: string;
  /** Sayfa ne zaman açıldı / güncellendi. */
  tarih: string;
};

/** "a, b, c" → ["a","b","c"] */
function bol(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Şehir sayfalarının panelde görünen ek notu. Slug'ı burada olmayan şehir de
 *  listelenir — yalnız açıklaması genel kalır, tablodan DÜŞMEZ. */
const SEHIR_NOTU: Record<string, { kume?: string; kitle?: string; ayrim?: string; tarih?: string }> = {
  "bursa-ev-sarj-istasyonu": {
    kume: "Bursa — şarj cihazı / istasyonu",
    kitle: "Bursa ve çevresinde cihaz arayan son kullanıcı ve iş yeri",
    ayrim: "Üretim tesisi Bursa OSB'de — doğrudan üreticiden",
    tarih: "2026-07-27",
  },
  "bursa-sarj-kablosu": {
    kume: "Bursa — şarj kablosu",
    kitle: "Bursa'da Type 2 kablo arayan son kullanıcı",
    ayrim: "Kabloyu kendi tesisinde üreten yerli üretici",
    tarih: "2026-08-02",
  },
  "istanbul-ev-sarj-istasyonu": {
    kume: "İstanbul — şarj cihazı / istasyonu",
    kitle: "İstanbul'da ev, site ve iş yeri için cihaz arayan alıcı",
    ayrim: "İki yakada yetkili bayi · site/apartman ortak alan çözümü",
    tarih: "2026-09-15",
  },
  "ankara-ev-sarj-istasyonu": {
    kume: "Ankara — şarj cihazı / istasyonu",
    kitle: "Ankara'da ev, kurum ve filo için cihaz arayan alıcı",
    ayrim: "Yetkili bayi ağı · çok cihazlı kurulum ve yük dengeleme",
    tarih: "2026-09-15",
  },
  "izmir-ev-sarj-istasyonu": {
    kume: "İzmir — şarj cihazı / istasyonu",
    kitle: "İzmir'de müstakil ev ve iş yeri için cihaz arayan alıcı",
    ayrim: "Yetkili bayi ağı · müstakil ev kurulumu ve planlı şarj",
    tarih: "2026-09-15",
  },
  "istanbul-sarj-kablosu": {
    kume: "İstanbul — şarj kablosu",
    kitle: "İstanbul'da Type 2 kablo arayan sürücü",
    ayrim: "Uzunluk seçimi · soketli AC istasyonda taşınan kablo",
    tarih: "2026-09-15",
  },
  "ankara-sarj-kablosu": {
    kume: "Ankara — şarj kablosu",
    kitle: "Ankara'da filo/kurum ve bireysel kablo alıcısı",
    ayrim: "Filoda kablo standardizasyonu · 32A trifaze 22 kW",
    tarih: "2026-09-15",
  },
  "izmir-sarj-kablosu": {
    kume: "İzmir — şarj kablosu",
    kitle: "İzmir'de müstakil ev / villa için kablo arayan sürücü",
    ayrim: "Uzun mesafe · 15 metreye kadar boy",
    tarih: "2026-09-15",
  },
};

export const SEO_HEDEFLERI: SeoHedef[] = [
  // ── İniş sayfaları (arama kümesine özel) ──────────────────────────────
  {
    kume: "Apartman / site ortak alanı",
    sayfa: `/${ORTAK_ALAN.slug}`,
    alan: "İniş sayfası",
    bolge: "Türkiye geneli",
    kitle: "Site ve apartman yönetimleri, toplu konut projeleri",
    anahtarlar: bol(ORTAK_ALAN.keywords),
    ayrim: "Ortak alan yönetim paneli ücretsiz (Charger Plus 2 · Pro 2 — 16 SKU)",
    tarih: "2026-09-15",
  },
  {
    kume: "DC şarj kablosu / CCS2 soketi",
    sayfa: `/${DC_KABLO.slug}`,
    alan: "İniş sayfası",
    bolge: "Türkiye geneli",
    kitle: "İstasyon üreticileri (OEM), işletmeciler, saha servisleri",
    anahtarlar: bol(DC_KABLO.keywords),
    ayrim: "Bir ucu açık CCS2 kablo seti · 80–400 A · 5 ve 8 m",
    tarih: "2026-09-14",
  },

  // ── Şehir sayfaları (yerel SEO) ───────────────────────────────────────
  // ⚠️ 2026-09-15: İKİ BURSA SATIRI ELLE YAZILIYDI. Üç yeni şehir eklenince
  //    tablo eksik kalacaktı — panelin varlık sebebi tam bunu önlemekti.
  //    Artık CITY_PAGES üzerinden TÜRETİLİYOR: yeni şehir eklemek için bu
  //    dosyaya dokunmak gerekmez, `SEHIR_NOTU`na satır eklemek yeterli
  //    (notu olmayan şehir de listelenir, yalnız açıklaması genel olur).
  ...CITY_PAGES.map((c): SeoHedef => {
    const not = SEHIR_NOTU[c.slug];
    return {
      kume: not?.kume ?? `${c.city} — elektrikli araç şarjı`,
      sayfa: `/${c.slug}`,
      alan: "Şehir sayfası",
      bolge: c.region,
      kitle: not?.kitle ?? `${c.loc} cihaz arayan son kullanıcı ve iş yeri`,
      anahtarlar: c.keywords,
      ayrim: not?.ayrim ?? (c.isHQ ? "Üretim tesisi bu şehirde" : "Şehirdeki yetkili bayi ağı"),
      tarih: not?.tarih ?? "—",
    };
  }),

  // ── Kategori sayfaları (ürün kümesi aramaları) ────────────────────────
  {
    kume: "AC wallbox / ev tipi şarj istasyonu",
    sayfa: "/products/wallbox",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "Ev, iş yeri ve ortak alan için cihaz arayanlar",
    anahtarlar: [
      CATEGORY_SEO.wallbox?.metaTitle ?? "",
      "ev tipi şarj istasyonu",
      "apartman şarj istasyonu",
      "site otoparkı şarj istasyonu",
      "ortak alan yönetim paneli",
    ].filter(Boolean),
    ayrim: "3,7–22 kW ayarlanabilir · OCPP 1.6 · ücretsiz ortak alan paneli",
    tarih: "2026-09-15",
  },
  {
    kume: "Şarj ünitesi ekipmanı",
    sayfa: "/products/charger-equipment",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "İstasyon üreticileri ve teknik servisler",
    anahtarlar: [
      CATEGORY_SEO["charger-equipment"]?.metaTitle ?? "",
      "dc şarj kablosu",
      "ccs2 soket",
      "type 2 priz",
    ].filter(Boolean),
    ayrim: "OEM tedarik ve yedek parça",
    tarih: "2026-09-14",
  },
  {
    kume: "Taşınabilir / seyyar şarj cihazı",
    sayfa: "/products/portable",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "Sabit kurulum istemeyen son kullanıcı",
    anahtarlar: [
      CATEGORY_SEO.portable?.metaTitle ?? "",
      "taşınabilir şarj cihazı",
      "seyyar şarj aleti",
    ].filter(Boolean),
    ayrim: "Portatif Type 2 · fişten şarj",
    tarih: "2026-07-13",
  },
  {
    kume: "Type 2 şarj kablosu",
    sayfa: "/products/cables",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "Kablo / uzatma arayan son kullanıcı",
    anahtarlar: [
      CATEGORY_SEO.cables?.metaTitle ?? "",
      "type 2 şarj kablosu",
      "elektrikli araç şarj kablosu",
    ].filter(Boolean),
    ayrim: "%94 yerli malı belgeli, kendi üretimimiz",
    tarih: "2026-07-13",
  },
  {
    kume: "V2L / C2L adaptör",
    sayfa: "/products/v2l-c2l",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "Araçtan elektrik almak isteyen kullanıcı",
    anahtarlar: [
      CATEGORY_SEO["v2l-c2l"]?.metaTitle ?? "",
      "v2l adaptörü",
      "araçtan elektrik",
    ].filter(Boolean),
    ayrim: "Araç modeline göre uyumluluk rehberi",
    tarih: "2026-07-13",
  },
  {
    kume: "DC hızlı şarj ünitesi",
    sayfa: "/products/dc-units",
    alan: "Kategori",
    bolge: "Türkiye geneli",
    kitle: "İşletmeci, operatör ve filo sahipleri",
    anahtarlar: [
      CATEGORY_SEO["dc-units"]?.metaTitle ?? "",
      "dc hızlı şarj istasyonu",
      "ccs2 şarj ünitesi",
    ].filter(Boolean),
    ayrim: "OCPP 1.6J / 2.0.1 · saha kurulumu",
    tarih: "2026-07-13",
  },
];

/** Panel başlığındaki özet sayılar. */
export function seoOzet() {
  const alanlar = new Map<string, number>();
  const bolgeler = new Map<string, number>();
  let anahtar = 0;
  for (const h of SEO_HEDEFLERI) {
    alanlar.set(h.alan, (alanlar.get(h.alan) ?? 0) + 1);
    bolgeler.set(h.bolge, (bolgeler.get(h.bolge) ?? 0) + 1);
    anahtar += h.anahtarlar.length;
  }
  return {
    sayfa: SEO_HEDEFLERI.length,
    anahtar,
    alanlar: [...alanlar.entries()],
    bolgeler: [...bolgeler.entries()],
  };
}
