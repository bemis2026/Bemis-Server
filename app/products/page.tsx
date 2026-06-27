import type { ComponentProps } from "react";
import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema, ogImage, OG_URL } from "../lib/seo";
import { getServerProducts } from "../lib/server-content";
import ProductsClient from "./ProductsClient";

type ClientCategories = NonNullable<ComponentProps<typeof ProductsClient>["initialCategories"]>;

// Kendi self-canonical + başlık/açıklaması olmadan bu sayfa root layout'tan
// '/' canonical + ana sayfa title'ını miras alıyordu (duplicate sinyali).
export const metadata: Metadata = {
  title: "Tüm Ürünler — EV Şarj Ekipmanları Kataloğu",
  description:
    "AC Wallbox, taşınabilir şarj, DC üniteleri, Type 2 kablolar, V2L adaptörleri ve OEM ekipmanları. Bemis E-V Charge yerli üretim, CE & IP65 sertifikalı.",
  alternates: { canonical: "/products", languages: { tr: "/products", "x-default": "/products" } },
  openGraph: {
    title: "Tüm Ürünler — EV Şarj Ekipmanları Kataloğu",
    description:
      "AC Wallbox, taşınabilir şarj, DC üniteleri, Type 2 kablolar, V2L adaptörleri ve OEM ekipmanları. Bemis E-V Charge yerli üretim, CE & IP65 sertifikalı.",
    type: "website",
    url: "/products",
    images: ogImage("Bemis E-V Charge — elektrikli araç şarj ekipmanları ürün kataloğu"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tüm Ürünler — EV Şarj Ekipmanları Kataloğu",
    description:
      "AC Wallbox, taşınabilir şarj, DC üniteleri, Type 2 kablolar, V2L adaptörleri ve OEM ekipmanları. Bemis E-V Charge yerli üretim, CE & IP65 sertifikalı.",
    images: [OG_URL],
  },
};

export default async function ProductsPage() {
  const categories = await getServerProducts();
  const items = categories.flatMap(cat =>
    (cat.products ?? []).map(p => ({ id: p.id, name: p.name, categoryId: cat.id }))
  );
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tüm Ürünler", url: "/products" },
    ]),
    collectionPageSchema({
      name: "Tüm Ürünler",
      description: "Bemis E-V Charge ürün kataloğu — tüm kategoriler ve ürünler.",
      url: "/products",
      products: items,
    }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductsClient initialCategories={categories as unknown as ClientCategories} />
    </>
  );
}
