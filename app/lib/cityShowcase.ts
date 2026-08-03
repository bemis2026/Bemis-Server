import "server-only";
import { readBin } from "../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";
import { VAT_MULTIPLIER } from "../../lib/vat";
import { categoryShort } from "./seo";
import { getServerProducts } from "./server-content";

// Şehir iniş sayfalarının (/bursa-ev-sarj-istasyonu, /bursa-sarj-kablosu)
// "o şehirde nereden alırım + ne kadar" bölümlerini besleyen SUNUCU katmanı.
//
// ⚠️ NEDEN SUNUCUDA: bu bölümlerin tek amacı sayfaya Google'ın görebileceği
// ÖZGÜN YEREL İÇERİK (bayi adı/adresi) ve SATIN-ALMA sinyali (₺ fiyat) eklemek.
// İstemcide çekilirse HTML'e basılmaz ve amaç boşa gider — bu sayfalar statik
// üretilir (ISR), veri build/revalidate anında gömülür.
//
// 📌 Bağlam (2026-08-02): "bursa şarj cihazı elektrikli araba" aramasında
// 7-8. sayfadaydık. Ölçüm: sayfada ₺ 0 kez, ürün modeli adı 0 kez, Bursa
// bayilerinin adı 0 kez geçiyordu — yani sayfa sorunun cevabını vermiyordu.
// DR sorunu DEĞİL (biz 13, bizi geçen bayimiz Şarj Garaj 0).

export type ShowcaseProduct = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  subtitle?: string;
  image?: string;
  power?: string;
  /** KDV DAHİL, ₺ biçimli (ör. "₺24.098"). Boşsa fiyat çözülememiştir. */
  priceTry: string;
  href: string;
};

export type CityDealer = {
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  /** Daima bir HARİTA adresi döner (mapUrl güvenilmezse ad+adresten üretilir). */
  mapHref: string;
};

/**
 * TCMB EUR/TRY kuru. Aynı kaynak + aynı 6 saatlik önbellek `/api/rate` ve
 * `/meta-catalog.xml` içinde de var.
 * ⚠️ FARK (2026-08-04): o ikisi başarısızlıkta SABİT 37'ye düşer; BURASI
 * `null` döner ve vitrin hiç yayınlanmaz. Gerekçe: 37 yedeği bayat — ölçülen
 * gerçek kur 54,69, yani bir kesintide fiyatlar %32 DÜŞÜK yayınlanırdı.
 * 📌 /api/rate ve /meta-catalog.xml'deki 37 yedeği DURUYOR — ticari etkisi
 *    olduğu için (Merchant fiyat uyuşmazlığı) tek taraflı değiştirilmedi.
 */
async function tryPerEur(): Promise<number | null> {
  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", { next: { revalidate: 21600 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const block = xml.match(/<Currency\s+[^>]*CurrencyCode="EUR"[^>]*>([\s\S]*?)<\/Currency>/);
    const rate = Number(block?.[1].match(/<ForexBuying>([\d.]+)<\/ForexBuying>/)?.[1]);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

/** "EUR 374,00" · "€ 286,00" · "7.161,00 € (KDV hariç)" → 374 (sayısal EUR) */
function parseEur(raw: unknown): number | null {
  if (typeof raw !== "string") return null;
  const m = raw.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?/);
  if (!m) return null;
  const whole = m[1].replace(/\./g, "");
  const frac = (m[2] ?? "00").padEnd(2, "0");
  const n = Number(`${whole}.${frac}`);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type SpecGroup = { group: string; items?: { label: string; value: string }[] };

/** Liste fiyatını (KDV hariç, EUR) ürünün "Fiyat" spec grubundan çıkarır. */
function eurListPrice(specs: SpecGroup[] | undefined): number | null {
  const g = (specs ?? []).find((x) => /fiyat|price/i.test(x.group));
  if (!g?.items?.length) return null;
  const item = g.items.find((i) => /liste|list/i.test(i.label)) ?? g.items[0];
  return parseEur(item?.value);
}

/** Gücü (kW) teknik spec'lerden bulur; yoksa alt başlıktan yakalamayı dener. */
function powerLabel(specs: SpecGroup[] | undefined, subtitle?: string): string | undefined {
  for (const g of specs ?? []) {
    if (/fiyat|price/i.test(g.group)) continue;
    const hit = (g.items ?? []).find((i) => /güç|power/i.test(i.label));
    if (hit?.value) return hit.value;
  }
  const m = subtitle?.match(/[\d.,]+\s*kW/i);
  return m?.[0];
}

/**
 * Şehir sayfasının ürün vitrini. Verilen kategorilerden, GÖRSELİ VE FİYATI
 * ÇÖZÜLEBİLEN ürünleri kategori başına `perCategory` adet alır.
 * Fiyat KDV DAHİL ₺ olarak biçimlenir — ürün detay sayfasındaki "KDV dahil"
 * satırıyla aynı kaynağı (lib/vat.ts) kullanır, tutarlar ayrışmaz.
 */
export async function getCityShowcase(
  categoryIds: string[],
  perCategory = 2,
): Promise<ShowcaseProduct[]> {
  const [cats, rate] = await Promise.all([getServerProducts(), tryPerEur()]);
  // ⚠️⚠️ KUR ÇEKİLEMEDİYSE VİTRİN HİÇ GÖSTERİLMEZ (2026-08-04).
  // Sitenin geri kalanında yedek kur SABİT 37 — ama gerçek kur ölçüldüğünde
  // 54,69'du, yani bir TCMB kesintisinde fiyatlar %32 DÜŞÜK yayınlanırdı.
  // Bu bölüm ₺ tutarı "KDV dahil" ibaresiyle basıyor; yanlış fiyat yayınlamak
  // fiyat göstermemekten kötüdür (ticari taahhüt + Merchant fiyat uyuşmazlığı).
  // Boş dönerse CityLandingClient bölümü zaten gizler (showcase.length > 0).
  // 📌 Aynı 37 yedeği /api/rate ve /meta-catalog.xml'de de var — ORASI AYRI KARAR.
  if (!rate) return [];
  const bicim = new Intl.NumberFormat("tr-TR", {
    style: "currency", currency: "TRY", maximumFractionDigits: 0,
  });
  const out: ShowcaseProduct[] = [];
  for (const id of categoryIds) {
    const cat = cats.find((c) => c.id === id);
    if (!cat?.products?.length) continue;
    let alinan = 0;
    for (const p of cat.products) {
      if (alinan >= perCategory) break;
      const eur = eurListPrice(p.specs as SpecGroup[] | undefined);
      const img = p.image || p.images?.[0];
      if (!eur || !img) continue; // fiyatsız/görselsiz ürün vitrine girmez
      out.push({
        id: p.id,
        categoryId: cat.id,
        // ⚠️ `cat.name` ürün bin'inden gelir ve bazı kategorilerde İNGİLİZCE'dir
        // ("AC Mobile Chargers") → Türkçe sayfada karışık dil görünüyordu.
        categoryName: categoryShort(cat.id) ?? cat.name,
        name: p.name,
        subtitle: p.subtitle,
        image: img,
        power: powerLabel(p.specs as SpecGroup[] | undefined, p.subtitle),
        priceTry: bicim.format(eur * VAT_MULTIPLIER * rate),
        href: `/products/${cat.id}/${p.id}`,
      });
      alinan++;
    }
  }
  return out;
}

const MAP_DOMAINS =
  /(?:google\.[a-z.]+\/maps|maps\.google|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|openstreetmap\.org|yandex\.[a-z.]+\/maps)/i;

/** DealerNetwork'teki `dealerMapHref` ile AYNI kural: mapUrl'e yalnız gerçekten
 *  harita ise güvenilir, aksi hâlde ad+adresten Google Maps araması kurulur
 *  (bu alana yanlışlıkla web sitesi yapıştırılmış kayıtlar var). */
function mapHrefOf(d: { name?: string; address?: string; mapUrl?: string }): string {
  const u = d.mapUrl?.trim();
  if (u && MAP_DOMAINS.test(u)) return u;
  const q = encodeURIComponent([d.name, d.address].filter(Boolean).join(" ").trim());
  return q ? `https://www.google.com/maps/search/?api=1&query=${q}` : (u || "#");
}

type DealerRecord = {
  name?: string; address?: string; phone?: string;
  whatsapp?: string; website?: string; mapUrl?: string;
};

/**
 * Bir şehirdeki yetkili bayiler. Kaynak R2 `dealers` bin'i (admin düzenlemeleri
 * YALNIZ oraya gider); okunamazsa repo `data/dealers.json` yedeğine düşer.
 * ⚠️ Adresi olmayan kayıt DIŞARIDA BIRAKILIR — bu bölümün SEO değeri adresten
 * gelir, adressiz satır ziyaretçiye de bir şey söylemez.
 */
export async function getCityDealers(cityId: string): Promise<CityDealer[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  try { data = await readBin("dealers"); } catch {}
  if (!data) {
    try {
      data = JSON.parse(readFileSync(path.join(process.cwd(), "data", "dealers.json"), "utf-8"));
    } catch { return []; }
  }
  const list: DealerRecord[] = data?.[cityId]?.dealers ?? [];
  return list
    .filter((d) => d?.name && d?.address)
    .map((d) => ({
      name: String(d.name),
      address: d.address,
      phone: d.phone || undefined,
      whatsapp: d.whatsapp || undefined,
      website: d.website || undefined,
      mapHref: mapHrefOf(d),
    }));
}
