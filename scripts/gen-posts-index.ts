/**
 * app/blog/postsIndex.ts üretir — blog yazılarının SADECE hafif alanları
 * (slug/title/category/datePublished/image). Amaç: anasayfadaki Reviews bölümü
 * "son 3 rehber" linkini göstermek için 346 KB'lık posts.ts'i (30 yazının tüm
 * gövde+FAQ metni) client bundle'ına çekmesin (ölçüldü: anasayfada 93 KB brotli).
 *
 * DRIFT KORUMASI: build script'inde `next build`'ten ÖNCE çalışır (package.json).
 * Yani yeni blog eklenince indeks otomatik güncellenir — elle senkron GEREKMEZ.
 * Üretilen dosya yine de commit'lenir (build-gen kaldırılsa bile mevcut kalsın).
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { allPosts } from "../app/blog/posts";

const slim = allPosts().map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  datePublished: p.datePublished,
  // image alanı bazı yazılarda var; Reviews şu an kullanmıyor ama ucuz, tutarlılık için
  ...(("image" in p && (p as { image?: string }).image) ? { image: (p as { image?: string }).image } : {}),
}));

const header = `// ⚠️ OTOMATİK ÜRETİLİR — ELLE DÜZENLEME. Kaynak: app/blog/posts.ts
// Üretici: scripts/gen-posts-index.ts (build'de \`next build\` öncesi çalışır).
// Amaç: anasayfa (Reviews) son rehberleri gösterirken 346 KB posts.ts'i client
// bundle'ına ÇEKMESİN — yalnız hafif alanlar. allPosts() ile AYNI sırada (tarih desc).
export type PostIndexItem = { slug: string; title: string; category: string; datePublished: string; image?: string };
export const POSTS_INDEX: PostIndexItem[] = ${JSON.stringify(slim, null, 2)};
`;

const out = join(__dirname, "..", "app", "blog", "postsIndex.ts");
writeFileSync(out, header, "utf-8");
console.log(`postsIndex.ts yazıldı — ${slim.length} yazı, ${(header.length / 1024).toFixed(1)} KB`);
