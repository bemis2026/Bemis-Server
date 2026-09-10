// Teknik SVG diyagramların ÇEVRİLMİŞ hâlini i18n dosyalarına yazar.
//   `npm run gen:diagram-i18n`   (kuru çalıştırma: `--kuru`)
//
// NEDEN: diyagramların SVG'si yapısal alandır ve birleştirmede DAİMA TR kaynaktan gelir
// (blogI18n.mergeSection / terimDilde). Bu yüzden etiketleri Türkçe kalıyordu ve 5 yabancı
// dilde de Türkçe görünüyordu. Tek kaynak `app/lib/diagramLabels.ts`; bu betik oradan
// üretip `data/i18n/blog.json` (figure blokları) ve `data/i18n/glossary.json` (term.diagram)
// içine yazar → istemci dil değiştirdiğinde de, sunucu dil kolunda da çevrili görünür.
//
// ⚠️ Etiketleri değiştirdiysen bu betiği TEKRAR ÇALIŞTIR, yoksa JSON'lar bayat kalır.
// ⚠️ Yalnız `diagram`/`figure` alanlarına dokunur; metin çevirilerine ASLA dokunmaz.
// ⚠️ Yazmadan önce JSON round-trip birebir mi diye bakar (biçim korunur).
import fs from "node:fs";
import { allPosts } from "../app/blog/posts";
import { allTerms } from "../app/lib/glossary";
import { diyagram, type DiagramId } from "../app/lib/diagrams";

const KURU = process.argv.includes("--kuru");
const BLOG = "data/i18n/blog.json";
const SOZLUK = "data/i18n/glossary.json";

const NL = String.fromCharCode(10);
const sonNl: Record<string, boolean> = {};
function oku(p: string): Record<string, Record<string, any>> {
  const ham = fs.readFileSync(p, "utf8");
  const j = JSON.parse(ham);
  sonNl[p] = ham.endsWith(NL);                       // biçim korunur (glossary.json satır sonuyla biter)
  if (JSON.stringify(j, null, 2) + (sonNl[p] ? NL : "") !== ham) throw new Error(`${p}: round-trip farkı — YAZILMAZ`);
  return j;
}
const yaz = (p: string, j: unknown) => fs.writeFileSync(p, JSON.stringify(j, null, 2) + (sonNl[p] ? NL : ""), "utf8");

const blog = oku(BLOG);
const sozluk = oku(SOZLUK);

// ---- blog: figure bloklarının svg/alt/caption'ı ----
let bSay = 0;
for (const dil of Object.keys(blog)) {
  for (const post of allPosts()) {
    const t = blog[dil]?.[post.slug];
    if (!t || !Array.isArray(t.body) || t.body.length !== post.body.length) continue; // hizasız çeviriye dokunma
    post.body.forEach((s, i) => {
      if (s.type !== "figure" || !s.id) return;
      const d = diyagram(s.id as DiagramId, dil);
      const hedef = (t.body[i] ??= {});
      hedef.svg = d.svg;
      hedef.alt = d.alt;
      hedef.caption = d.caption;
      bSay++;
    });
  }
}

// ---- sözlük: term.diagram ----
let sSay = 0;
for (const dil of Object.keys(sozluk)) {
  for (const term of allTerms()) {
    if (!term.diagram?.id) continue;
    const t = sozluk[dil]?.[term.slug];
    if (!t) continue;
    t.diagram = diyagram(term.diagram.id as DiagramId, dil);
    sSay++;
  }
}

console.log(`blog.json    : ${bSay} figure bloğu (${Object.keys(blog).join(", ")})`);
console.log(`glossary.json: ${sSay} terim diyagramı (${Object.keys(sozluk).join(", ")})`);

if (KURU) { console.log("\nKURU ÇALIŞTIRMA — yazılmadı"); process.exit(0); }
yaz(BLOG, blog);
yaz(SOZLUK, sozluk);
console.log("\nTAMAM — i18n dosyaları yazıldı");
