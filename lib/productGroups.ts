// Group product entries that share the same `name` into a single
// "variant family". The primary entry (the first one in source order)
// represents the family on listing surfaces; users pick a specific
// variant on the detail page.
//
// `code`, `subtitle`, `description`, `image`, `images`, `specs`,
// `generalFeatures`, `documents`, `badge` are unique per variant and
// preserved as-is. Only `name` is shared across the family.

export type ProductLike = {
  id: string;
  name: string;
  code?: string;
  subtitle?: string;
  badge?: string | null;
  description?: string;
  image?: string;
  images?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type ProductGroup<T extends ProductLike = ProductLike> = {
  /** Stable key (the shared name, normalised) used in React lists. */
  key: string;
  /** First variant in source order — used to render the listing card. */
  primary: T;
  /** All variants belonging to this family, including the primary. */
  variants: T[];
};

// IP rating (IP44, IP66, etc.) is a SPEC of the product, not part of
// its identity — Otomatlı IP44 Kombinasyon and Otomatlı IP66 Kombinasyon
// are the same product family with different ingress-protection
// classes. Strip "IP##" from the grouping key so they collapse onto a
// single card with a variant picker. The product's full name (with the
// IP rating) is still rendered on the detail page.
function normaliseKey(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/\bip\s*\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Varyant sıralama anahtarı — alt başlıktaki SAYILARDAN okunur.
 *
 * ⚠️ NEDEN ALT BAŞLIK: spec grup/etiket adları dile göre değişir ("Kablo Uzunluğu"
 * ↔ "Kabellänge"), alt başlıktaki sayı+birim ise dil-nötrdür (`22 kW`, `80A`, `10m`).
 * Böylece sıralama 6 dilde de aynı çalışır.
 *
 * Sıra: önce güç/akım (küçükten büyüğe), sonra KABLO UZUNLUĞU. Örnekler:
 *   Mini Mobile      → 5 m · 8 m · 10 m
 *   DC Şarj Soketi   → 80A/5m · 80A/8m · 150A/5m · 150A/8m …
 *   Pro Mobile 2     → 11 kW · 22 kW (5 m · 8 m · 10 m)
 */
function variantSiraAnahtari(p: ProductLike): [number, number] {
  // ⚠️ Alt başlık TEK BAŞINA YETMEZ: temel varyantların alt başlığında uzunluk yazmaz
  //    ("Tek Fazlı · 2,3 - 3,7 kW" ← 5 m modeli). Sadece alt başlığa bakılırsa bunlar
  //    "uzunluk yok" sayılıp EN SONA düşüyordu. Bulunamazsa spec değerlerine de bak.
  const metinler = [String(p.subtitle ?? "")];
  for (const g of (p.specs ?? []) as { items?: { value?: unknown }[] }[])
    for (const it of g.items ?? []) metinler.push(String(it.value ?? ""));

  const ilkSayi = (re: RegExp) => {
    for (const t of metinler) {
      const m = t.match(re);
      if (m) return Number(m[1].replace(",", "."));
    }
    return Number.POSITIVE_INFINITY;
  };
  const kw = ilkSayi(/(\d+(?:[.,]\d+)?)\s*kW/i);
  const amper = ilkSayi(/(\d+)\s*A(?![a-zA-Z])/);
  // ⚠️ "30 cm" ve "2,5 mm²" / "900 mm" uzunluk SAYILMAZ:
  //    `\s*m` "cm"yi yakalamaz, `(?!m)` de "mm"yi eler.
  const metre = ilkSayi(/(\d+(?:[.,]\d+)?)\s*(?:m\b(?!m)|met(?:re|er))/i);
  return [Number.isFinite(kw) ? kw : amper, metre];
}

/**
 * Group products by `name`.
 *
 * `primary` DEĞİŞMEDİ: kaynak sırasındaki ilk varyant kart temsilcisidir.
 * `variants` ise güç/uzunluğa göre sıralanır — müşteri alternatifleri
 * 5 m · 8 m · 10 m gibi mantıklı bir sırada görsün diye (eskiden veriye
 * eklenme sırasıydı; yeni uzunluklar sona eklendiği için 5 → 10 → 8 çıkıyordu).
 */
export function groupVariantsByName<T extends ProductLike>(products: T[]): ProductGroup<T>[] {
  const order: string[] = [];
  const buckets = new Map<string, T[]>();
  for (const p of products) {
    const key = normaliseKey(p.name);
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(p);
  }
  return order.map((key) => {
    const kaynak = buckets.get(key)!;
    const primary = kaynak[0];                       // kart temsilcisi: KAYNAK sırası
    const variants = kaynak
      .map((p, i) => ({ p, i, k: variantSiraAnahtari(p) }))
      .sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.i - b.i)   // eşitlikte kaynak sırası
      .map((x) => x.p);
    return { key, primary, variants };
  });
}

/**
 * Find the variant family that contains `productId` within `products`.
 * Returns the matching group and the variant's index inside it.
 */
export function findVariantGroup<T extends ProductLike>(
  products: T[],
  productId: string,
): { group: ProductGroup<T>; index: number } | null {
  for (const group of groupVariantsByName(products)) {
    const index = group.variants.findIndex((v) => v.id === productId);
    if (index >= 0) return { group, index };
  }
  return null;
}
