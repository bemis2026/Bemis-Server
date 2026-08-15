import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getServerProducts } from "../../lib/server-content";
import { fiyatMetni, fiyatSayisi } from "../../../lib/productChangeLog";

/**
 * BAYİ KATALOG PARMAK İZİ — "hiçbir eksik kalmasın" garantisinin ikinci yarısı.
 *
 * GET /api/catalog
 *   Her ürün için: kimlik + fiyat + `hash` (o ürünün tüm anlamlı alanlarının özeti)
 *   Katalog geneli: `catalogHash` + `generatedAt` + ürün sayısı.
 *
 * NEDEN: değişiklik günlüğü (/api/catalog/changes) bir sebeple boşluk yaşasa
 * bile, bayi elindeki hash'lerle bunları karşılaştırıp DEĞİŞEN ÜRÜNÜ kesin
 * bulur. Google Merchant da tam olarak böyle çalışır — tüketici kendi diff'ini
 * alır, bizim geçmiş tutmamıza bağımlı kalmaz. İki mekanizma birbirinin yedeği.
 *
 * ⚠️ `catalogHash` DEĞİŞMEDİYSE hiçbir ürün değişmemiştir — bayi tek alan
 *    karşılaştırarak "çekmeye gerek var mı" kararını verebilir.
 * ⚠️ Fiyat metin olarak saklanıyor; `price.amount` ayrıştırılabildiğinde
 *    verilir, aksi hâlde `null` — UYDURULMAZ.
 * ⚠️ GİZLİLİK: yalnız LİSTE fiyatı (zaten /api/products ile açık). Bayiye özel
 *    iskontolu fiyat buraya ASLA konmaz.
 */
export const revalidate = 1800;

const ozet = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kats = (await getServerProducts()) as any[];

  const urunler: unknown[] = [];
  for (const k of (kats ?? [])) {
    for (const p of (k?.products ?? [])) {
      const fm = fiyatMetni(p);
      // Hash'e giren alanlar = bayinin umursadığı alanlar. Sıra sabit
      // tutulur, aksi hâlde aynı veri farklı hash üretir.
      const parmak = JSON.stringify([
        p.id, p.code, p.name, p.subtitle, p.description, p.image,
        fm, p.certificates ?? [], p.features ?? [], p.specs ?? [],
      ]);
      urunler.push({
        id: p.id,
        code: p.code ?? null,
        category: k.id,
        name: p.name,
        subtitle: p.subtitle ?? null,
        url: `https://www.bemisevcharge.com.tr/products/${k.id}/${p.id}`,
        image: p.image || null,
        price: { raw: fm || null, amount: fiyatSayisi(fm), currency: "EUR", vatIncluded: false },
        certificates: p.certificates ?? [],
        hash: ozet(parmak),
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalogHash = ozet(urunler.map((u: any) => u.id + ":" + u.hash).join("|"));

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      productCount: urunler.length,
      catalogHash,
      priceNote: "Liste fiyatı, KDV hariç, EUR. Bayi iskontosu dahil DEĞİLDİR.",
      changesEndpoint: "https://www.bemisevcharge.com.tr/api/catalog/changes?since=YYYY-MM-DD",
      products: urunler,
    },
    { headers: { "Cache-Control": "public, max-age=600, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
