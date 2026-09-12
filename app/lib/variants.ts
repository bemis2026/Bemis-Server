/**
 * VARYANT ŞEMASI YARDIMCILARI — `ProductGroup` / `isVariantOf` için.
 *
 * ⚠️⚠️ GRUPLAMA BURADA YAPILMAZ. Katalogda varyant gruplaması `lib/productGroups.ts`
 * (`groupVariantsByName` / `findVariantGroup`) tarafından YAPILIYOR ve o dosyanın
 * kendi kuralları var (ör. addaki `IP44`/`IP66` gruplama anahtarından ÇIKARILIR →
 * Otomatlı IP44 ve IP66 Kombinasyon AYNI aile; sıralama alt başlıktaki sayılardan,
 * dil-nötr). İlk sürümde burada ikinci bir gruplama yazmıştım — iki kural zamanla
 * ayrışır ve şema sayfadaki seçiciyle çelişirdi (bu oturumda benzer "ayrışan ikiz"
 * kusuru `InternationalGlobe`/`InternationalMap2D` ve `featured` çevirilerinde
 * bizzat çıktı). Bu dosya YALNIZ şu iki şeyi ekler:
 *   1. grup içinde hangi spec alanlarının DEĞİŞTİĞİ (varyant ekseni / `variesBy`),
 *   2. her varyantı ayırt eden ÇAKIŞMASIZ etiket.
 *
 * NEDEN GEREKLİ (2026-09-12, ÖLÇÜLDÜ): 41 grup aynı adı paylaşıyor, bu gruplardaki
 * 131 ürünün 133'ü BİREBİR AYNI açıklamayı taşıyor ve her biri KENDİNE canonical
 * veriyordu → Google için yinelenen sayfa. `isVariantOf` + `ProductGroup` ile
 * Google bunları tek ürün ailesi sayar. (Sayfa silinmedi — kullanıcı kararı.)
 */

import { findVariantGroup, type ProductLike } from "../../lib/productGroups";

export type SpecItem = { label?: string; value?: string };
export type SpecGroup = { group?: string; items?: SpecItem[] };

/** Fiyat grubu varyant ekseni sayılmaz (fiyat farkı ürünü farklı ürün yapmaz). */
const FIYAT = /fiyat|price/i;

const specDegeri = (p: ProductLike, label: string): string | undefined =>
  ((p.specs ?? []) as SpecGroup[])
    .filter((g) => !FIYAT.test(g.group ?? ""))
    .flatMap((g) => g.items ?? [])
    .find((it) => it?.label === label)?.value;

const tumEtiketler = (urunler: ProductLike[]): string[] => {
  const s = new Set<string>();
  for (const p of urunler)
    for (const g of (p.specs ?? []) as SpecGroup[]) {
      if (FIYAT.test(g.group ?? "")) continue;
      for (const it of g.items ?? []) if (it?.label) s.add(it.label);
    }
  return [...s];
};

const slug = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type VaryantSema = {
  groupId: string;
  variesBy: string[];
  members: { id: string; label: string }[];
};

/** Tek bir spec değerini etikete uygun hâle getirir (parantez içi açıklamayı atar). */
const temiz = (v: string) => v.replace(/\s*\([^)]*\)/g, "").trim();

/**
 * Ürünün varyant şeması. Grup tek üyeliyse (varyant yoksa) `undefined`.
 *
 * @param kategoriUrunleri aynı kategorideki TÜM ürünler
 * @param categoryId kategori kimliği (grup @id'sinde kullanılır)
 */
export function varyantSema(
  kategoriUrunleri: ProductLike[],
  urunId: string,
  categoryId: string,
): VaryantSema | undefined {
  const bulunan = findVariantGroup(kategoriUrunleri, urunId);
  if (!bulunan || bulunan.group.variants.length < 2) return undefined;
  const uyeler = bulunan.group.variants;

  // Varyant ekseni: etiket TÜM üyelerde DOLU ve değerleri FARKLI olmalı.
  // ⚠️ Yalnız bir üyede bulunan alan teknik olarak "farklı"dır ama ayırt edici
  //    etiket üretmez — ilk sürümde wallbox gruplarında etiketi şişiriyordu
  //    ("5m. Kablolu · Type 2 (IEC 62196-2)", Konnektör bir üyede yoktu).
  const variesBy = tumEtiketler(uyeler).filter((label) => {
    const degerler = uyeler.map((p) => (specDegeri(p, label) ?? "").trim());
    if (degerler.some((v) => !v)) return false;
    return new Set(degerler).size > 1;
  });

  const etiketle = (p: ProductLike): string => {
    const parcalar = variesBy.map((l) => specDegeri(p, l)).filter(Boolean).map((v) => temiz(v as string)).filter(Boolean);
    if (parcalar.length) return parcalar.join(" · ");
    // Değişen spec yoksa ayrım alt başlıkta duruyor (katalogda böyle).
    const alt = String(p.subtitle ?? "").split("·").map((x) => x.trim()).filter(Boolean);
    return alt.at(-1) ?? p.code ?? p.id;
  };

  // ⚠️ ÇAKIŞMA ÇÖZÜMÜ: bazı gruplarda iki üye aynı spec değerlerini taşıyor ve fark
  // yalnız alt başlıkta duruyor (ör. `pano-prizi-kilit-motorsuz-*-30cm-nyaff` çifti).
  // Çakışan etiket seçicide AYNI görünen iki satır demek olurdu.
  const taban = new Map(uyeler.map((p) => [p.id, etiketle(p)]));
  const sayim = new Map<string, number>();
  for (const v of taban.values()) sayim.set(v, (sayim.get(v) ?? 0) + 1);

  const members = uyeler.map((p) => {
    let label = taban.get(p.id)!;
    if ((sayim.get(label) ?? 0) > 1) {
      const kuyruk = String(p.subtitle ?? "").split("·").map((x) => x.trim()).filter(Boolean).at(-1);
      label = kuyruk && !label.includes(kuyruk) ? `${label} · ${kuyruk}` : `${label} · ${p.code ?? p.id}`;
    }
    return { id: p.id, label };
  });

  return { groupId: `${categoryId}-${slug(bulunan.group.key)}`, variesBy, members };
}
