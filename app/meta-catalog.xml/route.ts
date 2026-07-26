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

export const revalidate = 86400; // 1 gün — platformlar zaten günde birkaç kez çeker

const BRAND = "Bemis E-V Charge";

/** "EUR 374,00" · "€ 286,00" · "7.161,00 € (KDV hariç)" → "374.00 EUR" */
function parsePrice(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  // Sayı bloğunu al (binlik ".", ondalık ","), para birimi metinden bağımsız (hepsi EUR).
  const m = raw.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?/);
  if (!m) return null;
  const whole = m[1].replace(/\./g, "");
  const frac = (m[2] ?? "00").padEnd(2, "0");
  const val = Number(`${whole}.${frac}`);
  if (!Number.isFinite(val) || val <= 0) return null;
  return `${val.toFixed(2)} EUR`;
}

function priceOf(product: { specs?: { group?: string; items?: { label?: string; value?: string }[] }[] }): string | null {
  for (const g of product.specs ?? []) {
    if (!/fiyat|price/i.test(g.group ?? "")) continue;
    for (const it of g.items ?? []) {
      const p = parsePrice(it?.value);
      if (p) return p;
    }
  }
  return null;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Varyantları tek ürün ailesinde toplamak için ad-tabanlı grup anahtarı. */
const groupKey = (name: unknown) =>
  String(name ?? "").toLocaleLowerCase("tr").replace(/[^a-z0-9ğüşiöç]+/gi, "-").replace(/(^-|-$)/g, "").slice(0, 60);

const abs = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

export async function GET() {
  const withPrice = (process.env.CATALOG_PRICES ?? "on").toLowerCase() !== "off";
  const [categories, catsMeta] = await Promise.all([getServerProducts(), getServerCategoriesMeta()]);

  const items: string[] = [];
  let skippedNoPrice = 0;

  for (const cat of categories) {
    const catName = catsMeta[cat.id]?.name || cat.name;
    for (const p of cat.products ?? []) {
      const price = priceOf(p);
      if (withPrice && !price) { skippedNoPrice++; continue; } // fiyatsız ürün platformca reddedilir
      const img = (p.image || p.images?.[0] || "").trim();
      if (!img) { skippedNoPrice++; continue; }               // görsel de zorunlu
      const link = `${SITE_URL}/products/${cat.id}/${p.id}`;
      const title = [p.name, p.subtitle].filter(Boolean).join(" · ").slice(0, 190);
      const desc = (p.description || `${p.name} — ${catName}. ${BRAND} üretimi.`).replace(/\s+/g, " ").slice(0, 4900);
      const extra = (p.images ?? []).filter((u) => u && u !== img).slice(0, 10);

      items.push(
        `    <item>
      <g:id>${esc(p.id)}</g:id>
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
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Platform çekicileri için makul önbellek; ürün sayısı loglanmaz.
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "noindex", // feed arama sonuçlarında çıkmasın
      "X-Item-Count": String(items.length),
      "X-Skipped": String(skippedNoPrice),
    },
  });
}
