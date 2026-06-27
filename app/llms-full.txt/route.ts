// /llms-full.txt — YZ tarayıcıları için TAM içerik (llms.txt'in genişletilmiş hâli):
// marka + üretici/ihracat metni + 15 terimlik sözlük + 10 rehberin TAM gövdesi.
// İçerik kod tarafındaki glossary + blog posts'tan türetilir (data/content.json'dan
// bağımsız) → her zaman güncel, uydurma yok, rakip marka yok. Statik servis edilir.
import { GLOSSARY } from "../lib/glossary";
import { allPosts, type BlogSection } from "../blog/posts";

export const dynamic = "force-static";

function bodyToText(body: BlogSection[]): string {
  const out: string[] = [];
  for (const b of body) {
    if (b.type === "h2") out.push(`\n### ${b.text}`);
    else if (b.type === "h3") out.push(`\n#### ${b.text}`);
    else if (b.type === "p") out.push(b.text);
    else if (b.type === "quote") out.push(`> ${b.text}`);
    else if (b.type === "ul") out.push(b.items.map((i) => `- ${i}`).join("\n"));
    else if (b.type === "table") {
      out.push(`| ${b.headers.join(" | ")} |`);
      out.push(`| ${b.headers.map(() => "---").join(" | ")} |`);
      out.push(b.rows.map((r) => `| ${r.join(" | ")} |`).join("\n"));
    }
    // cta atlanır (buton)
  }
  return out.join("\n\n");
}

// GEO için en değerli 10 rehber (tam gövde).
const GUIDE_SLUGS = [
  "ocpp-nedir",
  "ac-dc-sarj-farki",
  "ev-sarj-soketi-tipleri-type-2-ccs2-chademo",
  "elektrikli-arac-sarj-suresi-kac-saatte-dolar",
  "elektrikli-arac-sarj-yuk-yonetimi",
  "apartmana-sarj-istasyonu-kurulumu",
  "is-yerine-sarj-istasyonu-kurulumu",
  "elektrikli-arac-sarj-istasyonu-nasil-calisir",
  "arac-filosu-elektrikli-sarj-cozumleri",
  "ev-icin-sarj-cihazi-nasil-secilir",
];

function build(): string {
  const posts = allPosts();
  const p: string[] = [];

  p.push(`# Bemis E-V Charge — Tam İçerik (llms-full)

> Bu dosya, yapay zeka tarayıcıları için Bemis E-V Charge'ın sözlük ve rehber içeriğinin tam metnini sunar. Özet sürüm: /llms.txt`);

  p.push(`## Marka ve Üretici

Bemis E-V Charge, Türkiye'de yerli olarak elektrikli araç (EV) şarj çözümleri üreten bir markadır. 1994 kuruluşlu, Bursa'daki kendi tesisinde üretim yapan Bemis Teknik Elektrik A.Ş. bünyesinde geliştirilir; ürünler doğrudan üreticiden sunulur. Ürün gamı: AC Wallbox şarj istasyonları (7,4–22 kW), AC taşınabilir/mobil şarj cihazları, Type 2 şarj kabloları (Mod 2 ve Mod 3), V2L/C2L adaptörler, CEE uzatma ve dönüştürücüler, aksesuarlar, CCS2 DC hızlı şarj üniteleri (BEVDC 40–120 kW) ve şarj ünitesi ekipmanları. Ürünler CE belgeli, IP65/IP66 koruma sınıfında ve OCPP uyumludur (akıllı modeller OCPP 1.6J / 2.0.1).

## İhracat / Export

Bemis, ürünlerini 60+ ülkeye ihraç eden, AB'ye komşu (EU-adjacent) bir üreticidir; OEM / ODM / özel etiket (private label) üretim yapar. Type 2 / Mode 3 (IEC 62196) kablolar, AC wallbox, DC hızlı şarj ve adaptörler. İngilizce ihracat sayfası: /export.

İletişim: Yeşil Cad. No:31, 16140 Bursa, Türkiye · Tel +90 224 433 02 16 · info@bemisevcharge.com`);

  p.push(`# Sözlük — Elektrikli Araç Şarj Terimleri`);
  for (const t of GLOSSARY) {
    p.push(`## ${t.abbr}\n${t.definition}\nDetay: https://www.bemisevcharge.com.tr/sozluk/${t.slug}`);
  }

  p.push(`# Rehberler (Tam Metin)`);
  for (const slug of GUIDE_SLUGS) {
    const post = posts.find((x) => x.slug === slug);
    if (!post) continue;
    p.push(`## ${post.title}\n${post.description}\nKaynak: https://www.bemisevcharge.com.tr/blog/${post.slug}\n${bodyToText(post.body)}`);
    if (post.faq && post.faq.length) {
      p.push(`#### Sıkça Sorulan Sorular\n${post.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}`);
    }
  }

  return p.join("\n\n");
}

const LLMS_FULL = build();

export async function GET() {
  return new Response(LLMS_FULL, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
