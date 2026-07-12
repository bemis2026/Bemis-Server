// /blog/rss.xml — blog yazıları + basın/fuar haberleri için RSS 2.0 beslemesi.
// AI tarayıcıları, haber toplayıcılar ve RSS takipçileri için standart dağıtım
// kanalı. İçerik kod tarafındaki posts.ts + press.ts'ten türetilir (llms.txt
// deseniyle aynı: her zaman güncel, uydurma yok) → statik servis edilir.
import { allPosts } from "../posts";
import { allPress } from "../press";

export const dynamic = "force-static";

const SITE = "https://www.bemisevcharge.com.tr";

// RSS/XML içinde güvenli metin (başlık/açıklama alanları).
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso?: string): string | undefined {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return undefined;
  const d = new Date(iso + (iso.length === 10 ? "T09:00:00+03:00" : ""));
  return isNaN(d.getTime()) ? undefined : d.toUTCString();
}

function build(): string {
  type Item = { title: string; link: string; description: string; pubDate?: string; category: string };
  const items: Item[] = [];

  for (const p of allPosts()) {
    items.push({
      title: p.title,
      link: `${SITE}/blog/${p.slug}`,
      description: p.description,
      pubDate: rfc822(p.dateModified || p.datePublished),
      category: p.category,
    });
  }
  for (const n of allPress()) {
    if (n.type === "social") continue;
    items.push({
      title: n.title,
      link: `${SITE}/blog/haber/${n.id}`,
      description: n.summary,
      pubDate: rfc822(n.date),
      category: n.type === "fair" ? "Fuar" : "Haber",
    });
  }
  // Tarihli olanlar önce, en yeni üstte (tarihsiz haberler sona).
  items.sort((a, b) => (b.pubDate ? Date.parse(b.pubDate) : 0) - (a.pubDate ? Date.parse(a.pubDate) : 0));

  const xmlItems = items
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <description>${esc(i.description)}</description>
      <category>${esc(i.category)}</category>${i.pubDate ? `\n      <pubDate>${i.pubDate}</pubDate>` : ""}
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bemis E-V Charge — Blog &amp; Haberler</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Elektrikli araç şarj rehberleri, teknik yazılar ve Bemis E-V Charge haberleri — yerli EV şarj üreticisinden.</description>
    <language>tr</language>
${xmlItems}
  </channel>
</rss>`;
}

const RSS = build();

export async function GET() {
  return new Response(RSS, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
