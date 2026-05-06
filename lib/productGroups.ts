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

function normaliseKey(name: string): string {
  return name.trim().toLocaleLowerCase("tr");
}

/**
 * Group products by `name`. Order is preserved: the first occurrence
 * of a name fixes the group's position in the output, and variants
 * inside a group keep their original relative order.
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
    const variants = buckets.get(key)!;
    return { key, primary: variants[0], variants };
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
