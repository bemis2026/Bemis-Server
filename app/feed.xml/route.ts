import { getServerProducts } from "../lib/server-content";

// Google Shopping / Meta Commerce / Facebook Catalog uyumlu product feed.
//
// Bu RSS 2.0 + g: (Google content namespace) çıktısı; Meta Commerce
// Manager, Google Merchant Center ve TikTok Catalog her üçü de bu
// formatı doğrudan kabul eder. Meta hourly otomatik tarar, Merchant
// 1-7 günde bir.
//
// Spec referans:
//   https://support.google.com/merchants/answer/7052112
//   https://www.facebook.com/business/help/120325381656392
//
// Schema:
//   - id        : product slug (kararlı, JSONBin'deki id ile aynı)
//   - title     : product.name
//   - description: product.description veya subtitle fallback
//   - link      : kanonik ürün URL'si
//   - image_link: product.image (varsa product.images[0])
//   - additional_image_link: kalan görseller
//   - availability: "in stock" (sahada listemiz, stok takibi yok)
//   - price     : "350.00 EUR" — sadece spec'te "Fiyat" / "Price"
//                  group'u varsa emit edilir
//   - brand     : "Bemis E-V Charge"
//   - condition : "new"
//   - identifier_exists: "no" (GTIN/MPN yok, free-form code var)
//   - product_type : kategori adı
//
// Fiyat parse: lib/formatPrice.ts ile aynı mantık ama feed için raw
// EUR sayısını lazım — bu yüzden burada inline parse ediyoruz.

const SITE = "https://www.bemisevcharge.com.tr";
const NUM_RE = /(\d{1,3}(?:[.,]\d{3})+|\d+)([.,]\d+)?/;

function escape(s: string | undefined | null): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string | undefined | null): string {
  // CDATA can't contain ']]>' — split it if so.
  return `<![CDATA[${String(s ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function parseEurAmount(raw: string): number | null {
  const m = raw.match(NUM_RE);
  if (!m) return null;
  const whole = m[1].replace(/[.,]/g, "");
  const frac = m[2] ? m[2].replace(/[.,]/, ".") : "";
  const n = Number(whole + frac);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type FeedProduct = {
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  additional_images: string[];
  brand: string;
  product_type: string;
  price_eur: number | null;
};

function buildFeedItems(categories: Awaited<ReturnType<typeof getServerProducts>>): FeedProduct[] {
  const items: FeedProduct[] = [];
  for (const cat of categories) {
    const productType = cat.name;
    for (const p of cat.products ?? []) {
      const link = `${SITE}/products/${cat.id}/${p.id}`;
      const allImgs = [p.image, ...(p.images ?? [])]
        .map((x) => (x ?? "").trim())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i);
      if (allImgs.length === 0) continue; // Merchant rejects items without primary image

      // Fiyatı spec içinde "Fiyat" veya "Price" group'unda ara.
      let priceEur: number | null = null;
      for (const grp of p.specs ?? []) {
        const isPriceGroup = /fiyat|price/i.test(grp.group ?? "");
        if (!isPriceGroup) continue;
        for (const it of grp.items ?? []) {
          const v = parseEurAmount(it.value ?? "");
          if (v != null) { priceEur = v; break; }
        }
        if (priceEur != null) break;
      }

      const description = (p.description?.trim() || p.subtitle?.trim() || p.name).slice(0, 5000);

      items.push({
        id: p.id,
        title: p.name,
        description,
        link,
        image_link: allImgs[0],
        additional_images: allImgs.slice(1, 11), // Meta accepts ≤10 additional
        brand: "Bemis E-V Charge",
        product_type: productType,
        price_eur: priceEur,
      });
    }
  }
  return items;
}

export const revalidate = 3600; // 1 saat — Meta zaten saatte 1 çekiyor

export async function GET() {
  let categories: Awaited<ReturnType<typeof getServerProducts>> = [];
  try {
    categories = await getServerProducts();
  } catch {
    // Empty feed beats a 500 — Meta will retry next cycle.
  }
  const items = buildFeedItems(categories);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Bemis E-V Charge — Ürün Kataloğu</title>
    <link>${SITE}</link>
    <description>EV şarj ürünleri: AC Wallbox, taşınabilir şarj cihazları, DC hızlı şarj üniteleri, kablolar, V2L adaptörler, OEM ekipmanları.</description>
    ${items.map((p) => `
    <item>
      <g:id>${escape(p.id)}</g:id>
      <g:title>${cdata(p.title)}</g:title>
      <g:description>${cdata(p.description)}</g:description>
      <g:link>${escape(p.link)}</g:link>
      <g:image_link>${escape(p.image_link)}</g:image_link>
      ${p.additional_images.map((u) => `<g:additional_image_link>${escape(u)}</g:additional_image_link>`).join("\n      ")}
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escape(p.brand)}</g:brand>
      <g:product_type>${cdata(p.product_type)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      ${p.price_eur != null ? `<g:price>${p.price_eur.toFixed(2)} EUR</g:price>` : ""}
    </item>`).join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
