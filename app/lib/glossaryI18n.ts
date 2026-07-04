// Sözlük terimlerinin ÇEVİRİLERİ — kaynak (TR) glossary.ts'te kalır; çeviriler
// dile göre `data/i18n/glossary.json` dosyasında tutulur (kaynak kod şişmesin +
// AI-pipeline bu dosyayı üretir/günceller: `npm run translate`).
//
// GlossaryClient aktif dile göre bu çeviriyi TR terimin üstüne bindirir;
// ÇEVİRİSİ OLMAYAN terim/alan otomatik TR'ye düşer (yarım çeviri kırık görünmez).
//
// Yapı: GLOSSARY_I18N[dil][slug] = { term, abbr, short, definition, faq }
// (slug/diagram/related/keywords TR kaynaktan gelir — çevrilmez.)
// Yeni dil eklemek = `npm run translate` (data/i18n/glossary.json'a yazar); burada iş yok.

import glossaryData from "../../data/i18n/glossary.json";

export type GlossaryTranslation = {
  term?: string;
  abbr?: string;
  short?: string;
  definition?: string;
  faq?: { q: string; a: string }[];
};

// Dil kodu → { slug → çeviri }.
export const GLOSSARY_I18N: Record<string, Record<string, GlossaryTranslation>> =
  glossaryData as Record<string, Record<string, GlossaryTranslation>>;
