// Blog yazısı → ürün eşlemesi (SUNUCU tarafı).
//
// NEDEN VAR: blog sitenin en büyük organik giriş kapısı ama yazı sayfalarında
// ürün yüzeyi HİÇ yoktu — okuyucu yazıyı bitirip çıkıyordu. Bu katman her yazıya
// konusuyla ilgili birkaç ürün bağlar.
//
// ⚠️⚠️ EN ÖNEMLİ KURAL — YANLIŞ ÜRÜN GÖSTERME:
// Ürünler yazının KONUSUNA göre değil, yazının okuyucusuna GERÇEKTEN UYAN ürüne
// göre seçilir. Kanıtlanmış vaka: `togg-v2l-aractan-elektrik` yazısının konusu V2L
// ama katalogtaki 12 V2L adaptörünün HİÇBİRİ Togg'a uymuyor (araç tarafındaki uç
// Hyundai·Kia·Ssangyong / MG / BYD·Skywell için). Otomatik "konu → kategori"
// eşlemesi o sayfada Togg sahibine alamayacağı ürünü gösterirdi — 2026-09-17'de
// tam bu sebeple bir düzeltme yapılmıştı (site kendiyle çelişiyordu).
// 📌 Bu yüzden `KURATORLU` haritası otomatik eşlemeyi EZER.
//
// SEÇİM SIRASI:
//   1) KURATORLU[slug]  → elle seçilmiş ürün kimlikleri (sıra korunur)
//   2) yazının `related` linklerinden çıkarılan ürün kategorileri
//   3) hiçbiri yoksa → boş dizi → blok HİÇ render edilmez (yazı bozulmaz)

import type { BlogPost } from "../blog/posts";

export type BlogUrun = {
  id: string;
  ad: string;
  altBaslik: string;
  gorsel: string;
  kategoriId: string;
  kategoriAdi: string;
};

/** Yazı sayfasında gösterilecek en fazla ürün. 4 = geniş ekranda tek satır. */
const AZAMI = 4;

/**
 * Elle küratörlü yazı → ürün eşlemesi.
 * ⚠️ Buraya ürün eklerken kimliğin katalogda GERÇEKTEN var olduğunu doğrula
 *    (`/api/products`); olmayan kimlik sessizce atlanır, blok eksik görünür.
 */
const KURATORLU: Record<string, string[]> = {
  // Togg T10X / T10F: AC şarj soketi Type 2, standart dahili şarj ünitesi 11 kW
  // (kaynak: app/lib/vehicleCharging.ts + Calculator.tsx, EV Database doğrulaması).
  // Seçilenlerin DÖRDÜ DE Togg ile gerçekten çalışır:
  //   · 16A trifaze Type 2 seti → tam 11 kW, Togg'un kabul gücüyle birebir
  //   · Pro Mobile 2 (3,7-11 kW) → taşınabilir, yine 11 kW sınıfı
  //   · Charger 2 → evde duvar tipi
  //   · C2L adaptör → enerjiyi ARAÇTAN değil şarj cihazından alır, marka bağımsız
  // ⛔ Marka V2L adaptörleri (Hyundai/MG/BYD) BİLEREK EKLENMEDİ — Togg'a uymuyor.
  "togg-v2l-aractan-elektrik": [
    "sarj-seti-20a-trifaze-5m",
    "pro-mobile-2-11kw-5m",
    "charger-2-kablolu",
    "c2l-tekli-priz-uzatma-fisli-adaptor",
  ],
};

/**
 * `related` linklerinden ürün kategorisi kimliklerini çıkarır.
 * ⚠️ Dil önekine duyarsız: hem `/products/wallbox` hem `/de/products/wallbox` eşleşir
 *    (çeviri katmanı `dilLinkleriDuzelt` ile linkleri dil koluna taşıyor).
 */
function kategorilerdenRelated(post: BlogPost): string[] {
  const out: string[] = [];
  for (const r of post.related ?? []) {
    const m = /\/products\/([^/#?]+)/.exec(r.href);
    if (m && !out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

/**
 * Yazıya bağlanacak ürünleri döndürür.
 * @param kategoriler `getProductsForLang(lang)` çıktısı (dile göre birleştirilmiş).
 */
export function yaziUrunleri(
  post: BlogPost,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kategoriler: any[] | null,
): BlogUrun[] {
  if (!kategoriler || kategoriler.length === 0) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bul = (id: string): { p: any; k: any } | null => {
    for (const k of kategoriler) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = (k.products ?? []).find((x: any) => x.id === id);
      if (p) return { p, k };
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kur = (p: any, k: any): BlogUrun => ({
    id: p.id,
    ad: p.name ?? "",
    altBaslik: p.subtitle ?? "",
    gorsel: p.image ?? "",
    kategoriId: k.id,
    kategoriAdi: k.name ?? "",
  });

  // 1) Küratörlü liste
  const elle = KURATORLU[post.slug];
  if (elle) {
    const out: BlogUrun[] = [];
    for (const id of elle) {
      const hit = bul(id);
      // ⚠️ Görselsiz ürün gösterilmez: kartta boş kutu çıkar, kalitesiz durur.
      if (hit && hit.p.image) out.push(kur(hit.p, hit.k));
    }
    if (out.length > 0) return out.slice(0, AZAMI);
  }

  // 2) related linklerinden türet — her kategoriden sırayla alarak çeşitlendir
  const katIds = kategorilerdenRelated(post);
  if (katIds.length === 0) return [];

  const havuzlar = katIds
    .map((id) => kategoriler.find((k) => k.id === id))
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((k: any) => ({ k, list: (k.products ?? []).filter((p: any) => p.image) }));

  const out: BlogUrun[] = [];
  for (let i = 0; out.length < AZAMI; i++) {
    let eklendi = false;
    for (const h of havuzlar) {
      if (out.length >= AZAMI) break;
      const p = h.list[i];
      if (p) {
        out.push(kur(p, h.k));
        eklendi = true;
      }
    }
    if (!eklendi) break; // havuzlar tükendi
  }
  return out;
}

/** Ürün bloğunun "tümünü gör" hedefi — ilk ürünün kategorisi, yoksa /products. */
export function urunBloguHedefi(urunler: BlogUrun[]): string {
  return urunler.length > 0 ? `/products/${urunler[0].kategoriId}` : "/products";
}
