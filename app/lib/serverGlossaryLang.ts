import glossaryJson from "../../data/i18n/glossary.json";
import { allTerms, getTerm, type GlossaryTerm } from "./glossary";
import type { GlossaryTranslation } from "./glossaryI18n";

// Sözlük terimlerinin DİLE GÖRE birleştirilmiş hâli — SUNUCU TARAFI tek kaynak.
//
// ⚠️ NEDEN AYRI DOSYA: `glossaryI18n.ts` sözlüğü TARAYICIDA tembel yükler (253 KB'ı
// TR okuyucuya indirmemek için). Sunucuda tembelliğe gerek yok ve gerekmemeli:
// dil kolu sayfası içeriği İLK HTML'de o dilde basmalı. Aksi hâlde /en ürünlerinde
// yaşanan kusur tekrarlanır — sayfa arama motoruna boş gider (2026-08-26 dersi).
//
// ⚠️ Birleştirme kuralı GlossaryClient'takiyle AYNI (basit üstüne bindirme):
// slug / diagram / related / keywords TR kaynaktan gelir, yalnız METİN çevrilir;
// çevirisi olmayan alan otomatik TR'ye düşer.
//
// ⓘ Bu dosyayı YALNIZ sunucu bileşenleri import etmeli — JSON istemci paketine girmesin.

const I18N = glossaryJson as unknown as Record<string, Record<string, GlossaryTranslation>>;

/** O dilde çevirisi olan terim slug'ları (hiç yoksa boş dizi). */
export function glossarySluglariDilde(lang: string): string[] {
  return Object.keys(I18N[lang] ?? {});
}

/** Terimi verilen dile çevirir. Çeviri yoksa TR terim aynen döner. */
export function terimDilde(t: GlossaryTerm, lang: string): GlossaryTerm {
  if (lang === "tr") return t;
  const ceviri = I18N[lang]?.[t.slug];
  return ceviri ? ({ ...t, ...ceviri } as GlossaryTerm) : t;
}

/** Tüm terimler, verilen dilde (TR sırası korunur). */
export function terimlerDilde(lang: string): GlossaryTerm[] {
  return allTerms().map((t) => terimDilde(t, lang));
}

/** Tek terim, verilen dilde. Slug yoksa null. */
export function terimBulDilde(slug: string, lang: string): GlossaryTerm | null {
  const t = getTerm(slug);
  return t ? terimDilde(t, lang) : null;
}
