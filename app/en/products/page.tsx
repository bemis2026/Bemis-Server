import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, ogImage, OG_URL } from "../../lib/seo";
import { getServerProducts } from "../../lib/server-content";
import ProductsClient from "../../products/ProductsClient";

// İngilizce (indekslenebilir) tüm-ürünler sayfası — /en/products. TR karşılığı
// /products; hreflang ile karşılıklı bağlı. İçerik LanguageContext ile İngilizce
// zorlanır (/en/* ). ProductsClient lang="en" ile /api/products?lang=en çeker.
export const revalidate = 86400;

const TITLE = "EV Charging Equipment Manufacturer — All Products";
const DESCRIPTION =
  "AC wallboxes, portable chargers, DC fast chargers, Type 2 / Mode 3 cables, V2L adapters and OEM equipment. Bemis E-V Charge — manufactured in Türkiye, CE & IP65, OCPP-ready. OEM/ODM & wholesale export.";

export const metadata: Metadata = {
  title: `${TITLE} | Bemis E-V Charge`,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/products",
    languages: { en: "/en/products", tr: "/products", "x-default": "/products" },
  },
  openGraph: {
    title: `${TITLE} | Bemis E-V Charge`,
    description: DESCRIPTION,
    type: "website",
    url: "/en/products",
    locale: "en_US",
    images: ogImage("Bemis E-V Charge — EV charging equipment product catalogue"),
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Bemis E-V Charge`,
    description: DESCRIPTION,
    images: [OG_URL],
  },
};

export default async function EnProductsPage() {
  const categories = await getServerProducts();
  const items = categories.flatMap((cat) =>
    (cat.products ?? []).map((p) => ({ id: p.id, name: p.name, categoryId: cat.id }))
  );
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/en/products" },
    ]),
    collectionPageSchema({
      name: "All Products",
      description: "Bemis E-V Charge product catalogue — all EV charging categories and products.",
      url: "/en/products",
      products: items,
    }),
  ];
  // initialCategories GEÇİLMEZ → client lang="en" ile İngilizce çeker.
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductsClient />
    </>
  );
}
