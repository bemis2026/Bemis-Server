import blogJson from "../../data/i18n/blog.json";
import { allPosts, getPost, type BlogPost, type BlogSection } from "../blog/posts";
import { mergeBlogPost, type BlogTranslation } from "./blogI18n";

// Blog yazılarının DİLE GÖRE birleştirilmiş hâli — SUNUCU TARAFI tek kaynak.
//
// ⚠️ NEDEN AYRI DOSYA: `blogI18n.ts` çeviri sözlüğünü TARAYICIDA tembel yükler
// (1,5 MB'ı TR okuyucuya indirmemek için). Sunucuda tembelliğe yer yok: dil kolu
// sayfası içeriği İLK HTML'de o dilde basmalı — aksi hâlde /en ürünlerinde yaşanan
// kusur tekrarlanır, sayfa arama motoruna Türkçe/boş gider (2026-08-26 dersi).
// Birleştirme mantığı KOPYALANMADI: `mergeBlogPost` ortak kaynaktır.
//
// ⓘ Bu dosyayı YALNIZ sunucu bileşenleri import etmeli — blog.json istemci paketine girmesin.

const I18N = blogJson as unknown as Record<string, Record<string, BlogTranslation>>;

/** Yazıyı verilen dile çevir. Çeviri yoksa TR yazı aynen döner. */
export function yaziDilde(post: BlogPost, lang: string): BlogPost {
  if (lang === "tr") return post;
  return mergeBlogPost(post, I18N[lang]?.[post.slug]);
}

/**
 * O dilde yazı GERÇEKTEN tam çevrildi mi?
 *
 * ⚠️ BU KAPI ŞART: `mergeBlogPost` dizi uzunlukları tutmazsa SESSİZCE TR'ye düşer.
 * Kapı olmadan, çevirisi bayat bir yazı için Arapça adres açılır ve o adreste
 * TÜRKÇE gövde yayınlanırdı. Kapı yeni yazı eklendiğinde de kendiliğinden korur:
 * çevirisi gelmemiş yazı Arapça adres ALMAZ (404), yarım çevrilmiş sayfa yayınlanmaz.
 */
export function tamCevrildi(post: BlogPost, lang: string): boolean {
  const t = I18N[lang]?.[post.slug];
  if (!t) return false;
  if (!t.title || !t.description) return false;
  if (!Array.isArray(t.body) || t.body.length !== post.body.length) return false;
  if (post.faq && (!Array.isArray(t.faq) || t.faq.length !== post.faq.length)) return false;
  if (post.related && (!Array.isArray(t.related) || t.related.length !== post.related.length)) return false;
  return true;
}

/** O dilde tam çevrilmiş yazılar (TR sırası korunur). */
export function yazilarDilde(lang: string): BlogPost[] {
  return allPosts().filter((p) => tamCevrildi(p, lang)).map((p) => yaziDilde(p, lang));
}

/** Tek yazı — YALNIZ tam çevrilmişse döner, aksi hâlde null (rota 404 verir). */
export function yaziBulDilde(slug: string, lang: string): BlogPost | null {
  const p = getPost(slug);
  if (!p || !tamCevrildi(p, lang)) return null;
  return yaziDilde(p, lang);
}

// ── Arapça kolda iç linkler ─────────────────────────────────────────────────
// TR adresleri Arapça karşılıklarına çevirir. Karşılığı OLMAYAN yerel/TR sayfalar
// (üretici hikâyesi, OEM, bayilik, şehir sayfası) Arapça GİRİŞ sayfasına (/ar) bağlanır —
// orada üretici anlatısı, ihracat/OEM iletişimi ve teklif formu zaten var.
// ⚠️ Amaç: Arapça sayfadan TR köke sızıntı OLMAMASI (2026-09-09 /ar ürün kolu kuralı).

/** TR iç adresini Arapça koldaki karşılığına çevirir; karşılığı yoksa null
 *  (yalnız çevirisi olmayan blog yazısı) ya da Arapça giriş sayfası döner.
 *  ⚠️ Sözlük terim sayfası da BUNU kullanır — eşleme tek yerde kalsın. */
export function arAdresi(href: string): string | null {
  if (href.startsWith("/products")) return `/ar${href}`;
  if (href === "/sozluk" || href.startsWith("/sozluk/")) return `/ar${href}`;
  const m = /^\/blog\/([^/#?]+)$/.exec(href);
  if (m) {
    const p = getPost(m[1]);
    // Arapçası olmayan rehbere Arapça sayfadan link VERİLMEZ (Türkçe içeriğe düşerdi).
    return p && tamCevrildi(p, "ar") ? `/ar/blog/${m[1]}` : null;
  }
  return "/ar"; // /uretici · /b2b · /bayilik · /operator · /#dealer · şehir sayfaları
}

/** Yazının related + cta linklerini Arapça kola taşı (karşılıksız related düşer). */
export function arLinkleriDuzelt(post: BlogPost): BlogPost {
  const body: BlogSection[] = post.body.map((s) =>
    s.type === "cta" ? { ...s, href: arAdresi(s.href) ?? "/ar" } : s,
  );

  const gorulen = new Set<string>();
  const related = (post.related ?? [])
    .map((r) => ({ r, h: arAdresi(r.href) }))
    .filter((x): x is { r: { label: string; href: string }; h: string } => x.h !== null)
    // ⚠️ Birden çok TR adresi /ar'a düşebilir → aynı href iki çip olmasın (React key çakışması).
    .filter((x) => (gorulen.has(x.h) ? false : (gorulen.add(x.h), true)))
    .map((x) => ({ ...x.r, href: x.h }));

  return { ...post, body, related: related.length > 0 ? related : undefined };
}

/**
 * Kategori sayfasındaki "İlgili Rehberler" çiplerinin ARAPÇA kol karşılığı.
 *
 * ⚠️ Kural: yalnız Arapçası TAM olan blog yazısı kalır — başlığı Arapça, adresi
 * `/ar/blog/<slug>`. Arapça karşılığı olmayan rehber (çevirisi eksik yazı ya da
 * `/arac-sarj-uyumlulugu` gibi Arapça adresi hiç olmayan TR sayfa) LİSTEDEN DÜŞER.
 * `arAdresi`'nin genel yedeği burada KULLANILMAZ: "hangi araca hangi kablo uyar"
 * etiketli bir çipi Arapça giriş sayfasına bağlamak okuyucuyu yanıltırdı.
 */
export function arRehberleri(rehberler: { label: string; href: string }[]): { label: string; href: string }[] {
  const cikti: { label: string; href: string }[] = [];
  for (const r of rehberler) {
    const m = /^\/blog\/([^/#?]+)$/.exec(r.href);
    if (!m) continue;
    const p = yaziBulDilde(m[1], "ar");
    if (!p) continue;
    cikti.push({ label: p.title, href: `/ar/blog/${m[1]}` });
  }
  return cikti;
}
