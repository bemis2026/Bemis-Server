import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, productSchema } from "../../../lib/seo";
import { getServerProducts, getServerCategoriesMeta } from "../../../lib/server-content";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const [categories, catsMeta] = await Promise.all([
    getServerProducts(),
    getServerCategoriesMeta(),
  ]);
  const category = categories.find(c => c.id === id);
  const product = category?.products?.find(p => p.id === productId);
  if (!category || !product) return <ProductDetailClient />;
  const meta = catsMeta[id] ?? {};
  const categoryName = meta.name || category.name;
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tüm Ürünler", url: "/products" },
      { name: categoryName, url: `/products/${id}` },
      { name: product.name, url: `/products/${id}/${productId}` },
    ]),
    productSchema({ product, categoryName, categoryId: id }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient />
    </>
  );
}
