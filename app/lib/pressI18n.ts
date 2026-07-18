// Basın/haber i18n katmanı — data/i18n/press.json'daki title+summary çevirilerini
// PressItem üstüne uygular. GÖVDE (body) kasıtlı TR kalır: bunlar Türk basınından
// özgün alıntılardır; başlık+özet çevrilir, kaynak metin orijinal dilinde okunur.
// Çeviri yoksa TR'ye düşer (blogI18n ile aynı güvenli-düşüş felsefesi).
import type { PressItem } from "../blog/press";
import PRESS_I18N from "../../data/i18n/press.json";

type PressTr = { title?: string; summary?: string };
type PressMap = Record<string, Record<string, PressTr>>;

const MAP = PRESS_I18N as unknown as PressMap;

export function trPress(item: PressItem, lang: string): PressItem {
  if (lang === "tr") return item;
  const t = MAP[item.id]?.[lang];
  if (!t) return item; // çeviri yok → TR göster (uydurma/boş göstermekten iyi)
  return {
    ...item,
    title: t.title?.trim() || item.title,
    summary: t.summary?.trim() || item.summary,
  };
}

export function trPressList(items: PressItem[], lang: string): PressItem[] {
  if (lang === "tr") return items;
  return items.map((i) => trPress(i, lang));
}
