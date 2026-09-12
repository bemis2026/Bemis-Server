/**
 * app/lib/lastmod.json üretir — sitemap'in GERÇEK `lastmod` tarihleri.
 *
 * ⚠️⚠️ NEDEN VAR: sitemap'teki 35 girdinin 32'si `lastModified: now` yazıyordu,
 * yani her build'de "bugün değişti" diyorduk. Google SAHTE lastmod'u yok sayar —
 * ve yok saydığı an, GERÇEKTEN güncellediğimiz sayfa da öne çıkamaz. Blog ve
 * basın zaten gerçek tarih kullanıyordu; bu betik kalan statik sayfaları ve
 * veri dosyalarını kapatır.
 *
 * YÖNTEM: her dosyanın SON COMMIT tarihi (`git log -1 --format=%cI -- <yol>`).
 * ⚠️ Vercel sığ klon yaptığı için build sırasında git geçmişi GÜVENİLMEZ →
 *    tarihler BURADA (yerelde) hesaplanır, JSON commit'lenir, build yalnız okur.
 *    Aynı desen `gen-posts-index.ts`te zaten kullanılıyor.
 * ⚠️ CMS (R2) düzenlemeleri commit üretmez → kategori/ürün sayfalarının tarihi
 *    sitemap.ts içinde R2 objesinin kendi LastModified'ıyla EZİLİR; buradaki
 *    değer o okuma başarısız olursa devreye giren yedektir.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

/** rota yolu → tarihi belirleyen kaynak dosya(lar) */
const HARITA: Record<string, string[]> = {
  "/": ["app/page.tsx", "app/HomeClient.tsx"],
  "/products": ["app/products/page.tsx"],
  "/uretici": ["app/uretici/page.tsx"],
  "/kurumsal": ["app/kurumsal/page.tsx"],
  "/documents": ["app/documents/page.tsx"],
  "/b2b": ["app/b2b/page.tsx"],
  "/bayilik": ["app/bayilik/page.tsx"],
  "/operator": ["app/operator/page.tsx"],
  "/export": ["app/export/page.tsx"],
  "/ar": ["app/[lang]/page.tsx"],
  "/ar/middle-east": ["app/[lang]/middle-east/page.tsx"],
  "/iletisim": ["app/iletisim/page.tsx"],
  "/gizlilik": ["app/gizlilik/page.tsx"],
  "/cerez-politikasi": ["app/cerez-politikasi/page.tsx"],
  "/destek": ["app/destek/page.tsx"],
  "/arac-sarj-uyumlulugu": ["app/arac-sarj-uyumlulugu/page.tsx"],
  "/musteri-videolari": ["app/musteri-videolari/page.tsx"],
  "/blog": ["app/blog/posts.ts"],
  "/sozluk": ["app/lib/glossary.ts"],
  // veri kümeleri (R2 okunamazsa yedek)
  "_urunler": ["data/products.json"],
  "_icerik": ["data/content.json"],
  "_sozluk": ["app/lib/glossary.ts"],
  "_sehir": ["app/lib/cities.ts"],
};

const sonCommit = (yol: string): string | null => {
  try {
    const c = execFileSync("git", ["log", "-1", "--format=%cI", "--", yol], { encoding: "utf8" }).trim();
    return c || null;
  } catch {
    return null;
  }
};

const out: Record<string, string> = {};
let bulunan = 0, eksik = 0;
for (const [rota, dosyalar] of Object.entries(HARITA)) {
  const tarihler = dosyalar.map(sonCommit).filter(Boolean) as string[];
  if (!tarihler.length) { eksik++; continue; }
  // birden fazla kaynak varsa EN YENİ tarih
  out[rota] = tarihler.sort().at(-1)!;
  bulunan++;
}

const hedef = join(process.cwd(), "app", "lib", "lastmod.json");
writeFileSync(hedef, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log(`lastmod.json yazıldı — ${bulunan} rota${eksik ? ` · ${eksik} rota için git tarihi yok` : ""}`);
