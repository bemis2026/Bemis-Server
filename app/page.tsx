import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import JsonLd from "./components/JsonLd";
import { featuredListSchema, categoryListSchema, categoryH1 } from "./lib/seo";
import { getServerSiteContent, getServerProducts } from "./lib/server-content";

// Anasayfa SERVER sarmalayıcı — metadata + anasayfaya ÖZEL JSON-LD taşır; tüm UI
// "use client" HomeClient'ta. ⚠️ Anasayfa "use client" olduğu için SAYFA-ÖZEL
// metadata veremiyordu; bu ince sarmalayıcı çift-yönlü hreflang için en→/export
// geri-dönen etiketi ekler (Google resiprokal küme şartı: anasayfa<->/export).
// Diğer alanlar (title, OG, robots, verification) root layout'tan miras.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { tr: "/", en: "/export", "x-default": "/" },
  },
};

export default async function Page() {
  // ⚠️ Aşağıdaki şemalar 2026-08-01'e kadar KÖK YERLEŞİMDEYDİ (app/layout.tsx)
  // → HER sayfada basılıyordu. Öne çıkan 4 ürün TAM Product+Offer olarak
  // yazıldığı ve ürün detay sayfası kendi Product'ını da eklediği için sayfa
  // başına 5 Product oluşuyordu; Search Console "brand alanı yineleniyor"
  // kritik uyarısı verdi. İki değişiklik yapıldı: (1) buraya taşındı,
  // (2) öne çıkanlar TAM Product yerine ItemList oldu (bkz. featuredListSchema).
  // ⓘ readBin unstable_cache'li → layout ile aynı turda ek R2 okuması yapılmaz.
  const [initialContent, products] = await Promise.all([
    getServerSiteContent(),
    getServerProducts(),
  ]);

  // Öne çıkanlar vitrini — ListItem'lar ürünün KENDİ detay sayfasına işaret eder;
  // tam Product+Offer (brand/fiyat/stok) orada yayınlanır, burada DEĞİL.
  const featuredCfg = (((initialContent as { featured?: Array<{ categoryId: string; productId: string; visible?: boolean }> } | null)?.featured) ?? []).filter((f) => f && f.visible !== false);
  const featuredItems = featuredCfg
    .map((f) => {
      const cat = products.find((c) => c.id === f.categoryId);
      const prod = cat?.products?.find((p) => p.id === f.productId);
      if (!cat || !prod) return null;
      return { categoryId: cat.id, product: prod };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const featured = featuredListSchema({ name: "Öne Çıkan Ürünler", items: featuredItems });

  // Kategori HATTI = ItemList (kategori Product DEĞİL — audit). Kategori
  // sayfaları kendi CollectionPage şemasını kullanır; bu liste anasayfadaki
  // kategori vitrinine karşılık gelir.
  const categoryListSchemas = products
    .map((cat) =>
      cat.products?.length
        ? categoryListSchema({
            categoryId: cat.id,
            name: categoryH1(cat.id) ?? cat.name,
            products: cat.products,
          })
        : null
    )
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const jsonLd = [...(featured ? [featured] : []), ...categoryListSchemas];

  return (
    <>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      <HomeClient />
    </>
  );
}
