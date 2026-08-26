import "server-only";
import { readBin } from "../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import { applyProductSeo } from "./productSeo";
import { productNameEn } from "./productNamesEn";

/**
 * DİLE GÖRE BİRLEŞTİRİLMİŞ KATALOG — SUNUCU TARAFI TEK KAYNAK.
 *
 * ⚠️ NEDEN VAR (2026-08-26 ölçümü): `/en/*` sayfaları içeriği SUNUCUDAN değil,
 * tarayıcıdan `/api/products?lang=en` çekerek dolduruyordu. Sonuç: arama motoru
 * o 159 sayfada neredeyse boş HTML görüyordu —
 *   /products         1889 kelime  ↔  /en/products         52
 *   /products/wallbox  844 kelime  ↔  /en/products/wallbox 30
 *   Charger 2 detay    804 kelime  ↔  EN karşılığı         46
 * ve İngilizce sayfaların HİÇBİRİNDE `<h1>` yoktu. Üstelik sunucuda basılan tek
 * dolu alan olan Product şemasının `description`'ı TÜRKÇE'ydi (25 örnekten 17'si).
 * 28 günde bu 159 sayfanın getirdiği toplam organik oturum: **3**.
 *
 * ⚠️ BU BİR ÇEVİRİ İŞİ DEĞİLDİ: İngilizce metinler veri katmanında ZATEN vardı
 * (`productsEn` bin çifti + `data/products-en.json`), yalnız sunucu tarafına
 * bağlanmamıştı. Bu modül o bağlantıyı kurar.
 *
 * ⚠️ TEK KAYNAK OLMASI ŞART: birleştirme mantığı eskiden yalnız
 * `app/api/products/route.ts` içindeydi. Sayfalar için kopyalansaydı, ikisi
 * zamanla ayrışır ve "API doğru, sayfa yanlış" sınıfı sessiz hatalar doğardı.
 * Route artık bu modülü çağırır; sayfalar da aynı fonksiyonu çağırır.
 *
 * ⚠️ BİRLEŞTİRME POZİSYONELDİR (indeks hizası): TR dizisi yapıyı verir, çeviri
 * overlay'i yalnız çevrilebilir alanları ezer. KİMLİK alanları (id/code/name/
 * image/images/accent) DAİMA TR'den gelir — overlay'lerde eski çeviri turlarından
 * kalmış değerler olabilir. Yeni ürün eklerken 12 kaynağa AYNI İNDEKSTE ekle.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapTr(record: any): unknown[] {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.products)) {
    return record.products;
  }
  return [];
}

// EN bin'i { en: [...] }; eski tek-bin EN yükleri düz diziydi.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapEn(record: any): unknown[] | null {
  if (Array.isArray(record)) return record;
  if (record && typeof record === "object" && Array.isArray(record.en)) return record.en;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadJsonFile(p: string): any {
  try { return JSON.parse(readFileSync(p, "utf-8")); } catch { return null; }
}

// Pozisyonel birleştirme: TR yapıyı (görsel, accent, id, href) verir; overlay
// yalnız çevrilebilir alanları ezer. Overlay'de eksik olan her şey TR'ye düşer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeCategories(trArr: any[], enArr: any[] | null): any[] {
  if (!enArr) return trArr;
  return trArr.map((trCat, i) => {
    const enCat = enArr[i];
    if (!enCat) return trCat;
    return {
      ...trCat,
      ...enCat,
      // Kimlik / marka alanları DAİMA TR'den — bunlar çevrilmez, dolayısıyla
      // overlay'de duran her değer (ör. [].name'in çevrilebilir sayıldığı eski
      // MyMemory turlarından kalma) YOK SAYILMALI.
      id: trCat.id,
      accent: trCat.accent,
      image: trCat.image,
      name: trCat.name,
      products: Array.isArray(trCat.products)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? trCat.products.map((trP: any, j: number) => {
            const enP = Array.isArray(enCat.products) ? enCat.products[j] : null;
            if (!enP) return trP;
            return {
              ...trP,
              ...enP,
              id: trP.id,
              code: trP.code,
              image: trP.image,
              images: trP.images,
              name: trP.name,
              specs: Array.isArray(trP.specs)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? trP.specs.map((trS: any, k: number) => {
                    const enS = Array.isArray(enP.specs) ? enP.specs[k] : null;
                    if (!enS) return trS;
                    return {
                      ...trS,
                      group: enS.group ?? trS.group,
                      items: Array.isArray(trS.items)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? trS.items.map((trI: any, m: number) => {
                            const enI = Array.isArray(enS.items) ? enS.items[m] : null;
                            return enI ? { ...trI, ...enI } : trI;
                          })
                        : trS.items,
                    };
                  })
                : trP.specs,
            };
          })
        : trCat.products,
    };
  });
}

// TR kategorileri iki shard'dan birleştirir. Kategoriler kendi bin'i içinde
// konum-kararlıdır; sıra "ana bin, sonra ek bin" — operatörün yeni taşma
// kategorisini sona eklemesiyle aynı.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readShardedTr(): Promise<{ tr: unknown[]; primary: any | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main = await readBin("products"); } catch {}
  try { extra = await readBin("productsExtra"); } catch {}
  if (!main) {
    main = loadJsonFile(path.join(process.cwd(), "data", "products.json"));
    return { tr: unwrapTr(main), primary: main };
  }
  const merged = [...unwrapTr(main), ...unwrapTr(extra)];
  return { tr: merged, primary: main };
}

async function readShardedEn(): Promise<unknown[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let main: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extra: any = null;
  try { main = await readBin("productsEn"); } catch {}
  try { extra = await readBin("productsEnExtra"); } catch {}
  const m = unwrapEn(main);
  const e = unwrapEn(extra);
  if (!m && !e) return null;
  return [...(m ?? []), ...(e ?? [])];
}

/**
 * Verilen dil için birleştirilmiş katalog. Katalog hiç okunamazsa `null`
 * (çağıran 500 döndürür / TR'ye düşer) — boş dizi ile karıştırma.
 *
 * `lang="tr"` → yalnız TR + kod tarafı SEO haritası.
 * `lang="en"` → EN bin çifti ?? products bin `_translations.en` ?? dosya yedeği,
 *               ardından elle küratörlü İngilizce ad haritası.
 * de/es/ar/ru → products bin `_translations[lang]` ?? paketlenmiş overlay dosyası.
 * Bilinmeyen dil → overlay yok → TR'ye düşer.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProductsForLang(lang: string): Promise<any[] | null> {
  const { tr, primary: trRecord } = await readShardedTr();
  if (tr.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trSeo = applyProductSeo(tr as any[]);
  if (lang === "tr") return trSeo;

  let overlay: unknown[] | null = null;
  if (lang === "en") {
    overlay = await readShardedEn();
    if (!overlay && trRecord && typeof trRecord === "object" && trRecord._translations?.en) {
      overlay = unwrapEn(trRecord._translations.en);
    }
    if (!overlay) {
      const fileEn = loadJsonFile(path.join(process.cwd(), "data", "products-en.json"));
      if (Array.isArray(fileEn)) overlay = fileEn;
    }
  } else if (["de", "es", "ar", "ru"].includes(lang)) {
    // Önce admin oto-çevirisi (products bin `_translations[lang]`, akıllı hibrit),
    // sonra paketlenmiş premium overlay dosyası.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = trRecord && typeof trRecord === "object" ? (trRecord as any)._translations?.[lang] : null;
    if (Array.isArray(t)) overlay = t;
    if (!overlay) {
      const f = loadJsonFile(path.join(process.cwd(), "data", `products-${lang}.json`));
      if (Array.isArray(f)) overlay = f;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged = mergeCategories(trSeo, overlay as any[] | null);

  // ⚠️ Ürün ADI birleştirmede TR-kilitli (kimlik alanı; eski çeviri geçişlerinden
  // gelen productsEn adlarına güvenilmiyor). İngilizce sayfalarda adın Türkçe
  // kalmaması için elle küratörlü harita (app/lib/productNamesEn.ts) BURADA
  // uygulanır. Eşlemesi olmayan ad AYNEN kalır → sessiz bozulma yok.
  if (lang === "en") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const cat of merged as any[]) {
      if (!Array.isArray(cat?.products)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cat.products = cat.products.map((p: any) =>
        p && typeof p.name === "string" ? { ...p, name: productNameEn(p.name) } : p,
      );
    }
  }
  return merged;
}
