import type { ComponentProps } from "react";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "../lib/seo";
import { getServerProducts } from "../lib/server-content";
import ProductsClient from "./ProductsClient";

type ClientCategories = NonNullable<ComponentProps<typeof ProductsClient>["initialCategories"]>;

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
