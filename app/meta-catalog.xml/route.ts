// ÜRÜN FEED'İ — /meta-catalog.xml
//
// Meta (Commerce Manager katalog) ve Google Merchant Center'ın ORTAK kabul ettiği
// RSS 2.0 + `g:` namespace biçiminde ürün akışı. Platforma tek seferlik URL verilir,
// o periyodik olarak çeker → ürün eklendiğinde/değiştiğinde katalog KENDİ güncellenir
// (elle CSV yükleme derdi yok).
//
// ⚠️ FİYAT ZORUNLU: Hem Meta hem Google, `g:price` alanı olmayan ürünü REDDEDER.
// Bemis liste fiyatları ürün sayfalarında ZATEN herkese açık (ürün detayında
// "Fiyat Listesi" bloğu) → feed'e koymak yeni bir bilgi açığa çıkarmaz.
// Yine de kapatmak gerekirse: env `CATALOG_PRICES=off` → fiyat alanı yazılmaz
// (bu durumda platformlar ürünleri onaylamaz; feed yalnız iç kullanım/staging olur).
//
// ⚠️ REKLAM STRATEJİSİ (kullanıcı kararı 2026-07-25): kataloglu DİNAMİK reklam
// yerine karusel + teklif/bayi yönlendirmesi önerildi. Feed yine de kurulur —
// Google Merchant Center ve ileride dinamik reklam istenirse hazır bekler.
import { getServerProducts, getServerCategoriesMeta } from "../lib/server-content";
import { SITE_URL } from "../lib/seo";
import { VAT_RATE, withVat } from "../../lib/vat";

// ⚠️ 6 saat: kur (/api/rate, TCMB) da 6 saatte bir tazeleniyor. Feed'i onunla
// AYNI pencerede tutmak, feed fiyatı ile sayfada görünen ₺ fiyatın birbirinden
// kaymasını (Merchant Center "fiyat uyuşmazlığı" uyarısı) engeller.
export const revalidate = 21600;

const BRAND = "Bemis E-V Charge";

// Para birimi: Türkçe ürün sayfaları fiyatı ₺ gösterir (CurrencyContext:
// lang==="en" ? EUR : TRY) ve feed TÜRKÇE sayfaya link verir → Merchant Center
// hedef ülkesi Türkiye için doğru olan TRY'dir. env CATALOG_CURRENCY=EUR ile
// ham EUR liste fiyatına dönülebilir.
const FEED_CURRENCY = (process.env.CATALOG_CURRENCY ?? "TRY").toUpperCase() === "EUR" ? "EUR" : "TRY";

/**
 * TCMB EUR/TRY kuru — /api/rate ile AYNI kaynak ve aynı 6 saatlik önbellek.
 * ⚠️⚠️ SABİT 37 YEDEĞİ KALDIRILDI (2026-08-04, kullanıcı kararı). Ölçülen gerçek
 * kur 54,69'du; bir TCMB kesintisinde bu feed TÜM fiyatları %32 DÜŞÜK gönderirdi
 * → Google Merchant "fiyat uyuşmazlığı" + gerçek ticari taahhüt riski.
 * Artık kur yoksa `null` döner ve FEED HİÇ YAYINLANMAZ (aşağıda 503).
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
  // Sayı bloğunu al (binlik ".", ondalık ","); tüm liste fiyatları EUR cinsinden.
  const m = raw.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?/);
  if (!m) return null;
  const whole = m[1].replace(/\./g, "");
  const frac = (m[2] ?? "00").padEnd(2, "0");
  const val = Number(`${whole}.${frac}`);
  return Number.isFinite(val) && val > 0 ? val : null;
}

function eurOf(product: { specs?: { group?: string; items?: { label?: string; value?: string }[] }[] }): number | null {
  for (const g of product.specs ?? []) {
    if (!/fiyat|price/i.test(g.group ?? "")) continue;
    for (const it of g.items ?? []) {
      const p = parseEur(it?.value);
      if (p) return p;
    }
  }
  return null;
}

// ⚠️ KDV: Google (ve Meta) Türkiye hedefinde fiyatın KDV DAHİL olmasını bekler.
// Ürün liste fiyatları KDV HARİÇ tutuluyor (sözleşme de iskonto/prim hesaplarını
// "KDV hariç" üzerinden kurar) → feed'e yazılırken KDV eklenir. Ürün sayfasında da
// KDV dahil tutar GÖRÜNÜR (bkz. ProductDetailClient fiyat bloğu) — feed ile sayfa
// aynı sayıyı gösterir, "fiyat uyuşmazlığı" uyarısı oluşmaz.
// ⚠️ Oran `lib/vat.ts`ten gelir — sayfa da AYNI dosyayı kullanır. Env ile ayrı bir
// oran tutmak yasak: biri güncellenip diğeri unutulursa Merchant "fiyat
// uyuşmazlığı" verir. Oran değişirse yalnız lib/vat.ts güncellenir.

/**
 * Feed fiyatı — KDV DAHİL: "24098.00 TRY" | "449.00 EUR"
 *
 * ⚠️ TAM SAYIYA YUVARLANIR çünkü ürün sayfası fiyatı tam sayı gösterir
 * (lib/formatPrice → Intl maximumFractionDigits: 0 → "₺24.098"). Feed 24098.36
 * gönderirken sayfa ₺24.098 gösterirse Google "fiyat uyuşmazlığı" işaretleyebilir.
 * Aynı yuvarlama kuralı (Math.round) iki tarafta da uygulanır → birebir eşleşme.
 */
function formatPrice(eur: number, rate: number): string {
  const gross = withVat(eur);
  return FEED_CURRENCY === "TRY"
    ? `${Math.round(gross * rate).toFixed(2)} TRY`
    : `${Math.round(gross).toFixed(2)} EUR`;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/**
 * ⚠️ GOOGLE `id` SINIRI 50 KARAKTER (Meta'da 100). Uzun ürün id'leri Merchant
 * Center'da SESSİZCE ELENİYORDU: feed 118 ürün gönderiyordu, Merchant 104
 * gösteriyordu — aradaki 14, id'si 50 karakteri aşan ürünlerdi (ör.
 * "pano-prizi-kilit-motorsuz-monofaze-3-7-7-4-kw-3-noktadan-montaj" = 63 kr).
 *
 * Kısaltma KARARLI olmalı (her üretimde aynı sonuç) — id değişirse platform onu
 * YENİ ürün sayar. Yöntem: ilk 42 karakter + tam id'den türetilen 7 haneli hash
 * (42+1+7 = 50). 50 karakteri aşmayan id'lere DOKUNULMAZ → Merchant'ta hâlihazırda
 * işlenmiş 104 ürünün kimliği korunur.
 */
function feedId(id: string): string {
  if (id.length <= 50) return id;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) >>> 0;
  return `${id.slice(0, 42)}-${h.toString(36).padStart(7, "0").slice(-7)}`;
}

/** Varyantları tek ürün ailesinde toplamak için ad-tabanlı grup anahtarı. */
const groupKey = (name: unknown) =>
  String(name ?? "").toLocaleLowerCase("tr").replace(/[^a-z0-9ğüşiöç]+/gi, "-").replace(/(^-|-$)/g, "").slice(0, 60);

const abs = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

export async function GET() {
  const withPrice = (process.env.CATALOG_PRICES ?? "on").toLowerCase() !== "off";
  const [categories, catsMeta, rate] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
    tryPerEur(),
  ]);

  // ⚠️ Kur yoksa ₺ fiyat üretilemez. Feed'i FİYATSIZ ya da YANLIŞ fiyatla yayınlamak
  // yerine 503 döndürülür: Google/Meta çekimi başarısız sayar, ELİNDEKİ SON GEÇERLİ
  // KOPYAYI korur ve sonra yeniden dener. Yanlış fiyatla güncellemek, güncellememekten
  // kötüdür (tüm katalog "fiyat uyuşmazlığı" ile askıya alınabilir).
  if (withPrice && FEED_CURRENCY === "TRY" && rate === null) {
    return new Response("<!-- kur alinamadi (TCMB); feed bilerek yayinlanmadi -->", {
      status: 503,
      headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store", "X-Rate-Missing": "1" },
    });
  }

  const items: string[] = [];
  let skippedNoPrice = 0;

  for (const cat of categories) {
    const catName = catsMeta[cat.id]?.name || cat.name;
    for (const p of cat.products ?? []) {
      const eur = eurOf(p);
      const price = eur !== null ? formatPrice(eur, rate as number) : null;
      if (withPrice && !price) { skippedNoPrice++; continue; } // fiyatsız ürün platformca reddedilir
      const img = (p.image || p.images?.[0] || "").trim();
      if (!img) { skippedNoPrice++; continue; }               // görsel de zorunlu
      const link = `${SITE_URL}/products/${cat.id}/${p.id}`;
      const title = [p.name, p.subtitle].filter(Boolean).join(" · ").slice(0, 190);
      const desc = (p.description || `${p.name} — ${catName}. ${BRAND} üretimi.`).replace(/\s+/g, " ").slice(0, 4900);
      const extra = (p.images ?? []).filter((u) => u && u !== img).slice(0, 10);

      items.push(
        `    <item>
      <g:id>${esc(feedId(p.id))}</g:id>
      <g:title>${esc(title)}</g:title>
      <g:description>${esc(desc)}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(abs(img))}</g:image_link>
${extra.map((u) => `      <g:additional_image_link>${esc(abs(u))}</g:additional_image_link>`).join("\n")}${extra.length ? "\n" : ""}      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>${withPrice && price ? `\n      <g:price>${esc(price)}</g:price>` : ""}
      <g:brand>${esc(BRAND)}</g:brand>${p.code ? `\n      <g:mpn>${esc(p.code)}</g:mpn>` : ""}
      <g:identifier_exists>no</g:identifier_exists>
      <g:item_group_id>${esc(groupKey(p.name))}</g:item_group_id>
      <g:product_type>${esc(catName)}</g:product_type>
    </item>`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(BRAND)} — Ürün Kataloğu</title>
    <link>${SITE_URL}</link>
    <description>Bemis E-V Charge elektrikli araç şarj ürünleri (Meta Commerce Manager / Google Merchant Center uyumlu feed).</description>
    <!-- Tanı: platformun HANGİ sürümü çektiğini anlamak için. Merchant/Meta'daki
         "son güncelleme" bu tarihten ESKİYSE, panel eski kopyayı işlemiştir. -->
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>bemis-feed v4 · ${items.length} ürün · ${FEED_CURRENCY} · KDV %${VAT_RATE} dahil</generator>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // ⚠️ s-maxage, ISR penceresiyle (21600 = 6sa) EŞİT olmalı. Önceden 86400'dü:
      // CDN, feed düzeltildikten sonra bile 24 saate kadar ESKİ kopyayı servis
      // edebiliyordu → "düzelttim ama panelde hâlâ eski sayı" durumu.
      "Cache-Control": "public, max-age=1800, s-maxage=21600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex", // feed arama sonuçlarında çıkmasın
      "X-Item-Count": String(items.length),
      "X-Skipped": String(skippedNoPrice),
      "X-Currency": FEED_CURRENCY,
      "X-Eur-Try": String(rate ?? "-"), // hangi kurla üretildiği (uyuşmazlık teşhisi için)
    },
  });
}
