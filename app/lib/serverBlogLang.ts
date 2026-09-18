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

/** Blog ADRESİ olan yabancı diller. `/en` ayrı statik ağaçta (app/en/blog). */
export const BLOG_LANGS = ["en", "de", "es", "ru", "nl", "ar"] as const;
export type BlogLang = (typeof BLOG_LANGS)[number];

/** Yazıyı verilen dile çevir. Çeviri yoksa TR yazı aynen döner. */
export function yaziDilde(post: BlogPost, lang: string): BlogPost {
  if (lang === "tr") return post;
  return mergeBlogPost(post, I18N[lang]?.[post.slug]);
}

/**
 * O dilde yazı GERÇEKTEN tam çevrildi mi?
 *
 * ⚠️ BU KAPI ŞART: `mergeBlogPost` dizi uzunlukları tutmazsa SESSİZCE TR'ye düşer.
 * Kapı olmadan, çevirisi bayat bir yazı için o dilde adres açılır ve o adreste
 * TÜRKÇE gövde yayınlanırdı. Kapı yeni yazı eklendiğinde de kendiliğinden korur:
 * çevirisi gelmemiş yazı o dilde adres ALMAZ (404), yarım çevrilmiş sayfa yayınlanmaz.
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

/** Bir yazının hangi dillerde ADRESİ var (hreflang kümesi bunu kullanır). */
export function yaziDilleri(post: BlogPost): BlogLang[] {
  return BLOG_LANGS.filter((l) => tamCevrildi(post, l));
}

// ── Dil kollarında iç linkler ───────────────────────────────────────────────
// TR adreslerini o dilin koluna taşır. Karşılığı OLMAYAN yerel/TR sayfalar
// (üretici hikâyesi, OEM, bayilik, şehir sayfası) o dilin GİRİŞ sayfasına bağlanır.
// ⚠️ Amaç: dil kolundan TR köke sızıntı OLMAMASI (2026-09-09 /ar ürün kolu kuralı).

/**
 * ⚠️ SÖZLÜK YALNIZ ARAPÇADA VAR — ÖLÇÜLDÜ.
 * `app/[lang]/sozluk/**` generateStaticParams YALNIZ "ar" üretir; /de/sozluk,
 * /es/sozluk … HİÇ YOK. Bu yüzden başka dillerde sözlük linki VERİLMEZ (404 olurdu).
 * Sözlük başka dillere açılırsa bu kümeye o dili de ekle.
 */
const SOZLUK_DILLERI = new Set<string>(["ar"]);

/** TR iç adresini `lang` kolundaki karşılığına çevirir; karşılığı yoksa null
 *  (çevirisi olmayan blog yazısı / o dilde olmayan sözlük) ya da giriş sayfası döner.
 *  ⚠️ Sözlük terim sayfası da BUNU kullanır — eşleme tek yerde kalsın. */
export function dilAdresi(href: string, lang: string): string | null {
  if (href.startsWith("/products")) return `/${lang}${href}`;
  if (href === "/sozluk" || href.startsWith("/sozluk/")) {
    return SOZLUK_DILLERI.has(lang) ? `/${lang}${href}` : null;
  }
  const m = /^\/blog\/([^/#?]+)$/.exec(href);
  if (m) {
    const p = getPost(m[1]);
    // O dilde çevirisi olmayan rehbere link VERİLMEZ (Türkçe içeriğe düşerdi).
    return p && tamCevrildi(p, lang) ? `/${lang}/blog/${m[1]}` : null;
  }
  return `/${lang}`; // /uretici · /b2b · /bayilik · /operator · /#dealer · şehir sayfaları
}

/** Yazının related + cta linklerini `lang` koluna taşı (karşılıksız related düşer). */
export function dilLinkleriDuzelt(post: BlogPost, lang: string): BlogPost {
  const body: BlogSection[] = post.body.map((s) =>
    s.type === "cta" ? { ...s, href: dilAdresi(s.href, lang) ?? `/${lang}` } : s,
  );

  const gorulen = new Set<string>();
  const related = (post.related ?? [])
    .map((r) => ({ r, h: dilAdresi(r.href, lang) }))
    .filter((x): x is { r: { label: string; href: string }; h: string } => x.h !== null)
    // ⚠️ Birden çok TR adresi giriş sayfasına düşebilir → aynı href iki çip olmasın
    //    (React key çakışması).
    .filter((x) => (gorulen.has(x.h) ? false : (gorulen.add(x.h), true)))
    .map((x) => ({ ...x.r, href: x.h }));

  return { ...post, body, related: related.length > 0 ? related : undefined };
}

/**
 * Kategori sayfasındaki "İlgili Rehberler" çiplerinin dil kolu karşılığı.
 *
 * ⚠️ Kural: yalnız o dilde TAM çevrilmiş blog yazısı kalır — başlığı o dilde, adresi
 * `/<lang>/blog/<slug>`. Karşılığı olmayan rehber (çevirisi eksik yazı ya da
 * `/arac-sarj-uyumlulugu` gibi o dilde adresi hiç olmayan TR sayfa) LİSTEDEN DÜŞER.
 * `dilAdresi`'nin genel yedeği burada KULLANILMAZ: "hangi araca hangi kablo uyar"
 * etiketli bir çipi giriş sayfasına bağlamak okuyucuyu yanıltırdı.
 */
export function dilRehberleri(
  rehberler: { label: string; href: string }[],
  lang: string,
): { label: string; href: string }[] {
  const cikti: { label: string; href: string }[] = [];
  for (const r of rehberler) {
    const m = /^\/blog\/([^/#?]+)$/.exec(r.href);
    if (!m) continue;
    const p = yaziBulDilde(m[1], lang);
    if (!p) continue;
    cikti.push({ label: p.title, href: `/${lang}/blog/${m[1]}` });
  }
  return cikti;
}

// ── Geriye uyumlu Arapça sarmalayıcılar ─────────────────────────────────────
// Mevcut çağıranlar (sözlük terim sayfası vb.) değişmeden çalışsın diye duruyor.
export const arAdresi = (href: string) => dilAdresi(href, "ar");
export const arLinkleriDuzelt = (post: BlogPost) => dilLinkleriDuzelt(post, "ar");
export const arRehberleri = (rehberler: { label: string; href: string }[]) =>
  dilRehberleri(rehberler, "ar");
