#!/usr/bin/env node
/**
 * Monthly SEO snapshot — runs alongside the deep audit workflow.
 *
 * Three quick checks, no auth needed (so we don't have to set up
 * Google Search Console OAuth for this baseline):
 *   1. Sitemap reachable + URL/image counts
 *   2. PageSpeed Insights snapshot (Core Web Vitals on mobile +
 *      desktop) for the homepage and one product detail page
 *   3. robots.txt sanity check
 *
 * Output: plain text, piped into notify-finding.cjs by the workflow.
 */

const SITE = "https://www.bemisevcharge.com.tr";
const PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const TARGETS = [
  { label: "Home",    url: SITE + "/" },
  { label: "Catalog", url: SITE + "/products" },
];

function fmt(n) {
  if (n == null) return "—";
  if (n < 1) return (n * 100).toFixed(0);
  return Math.round(n);
}

async function fetchSitemapStats() {
  const r = await fetch(SITE + "/sitemap.xml", { redirect: "follow" });
  if (!r.ok) return { ok: false, status: r.status };
  const xml = await r.text();
  const urls = (xml.match(/<loc>/g) || []).length;
  const images = (xml.match(/<image:loc>/g) || []).length;
  return { ok: true, urls, images, bytes: xml.length };
}

async function fetchRobots() {
  const r = await fetch(SITE + "/robots.txt");
  if (!r.ok) return { ok: false, status: r.status };
  const txt = await r.text();
  return { ok: true, hasSitemap: /sitemap:/i.test(txt), bytes: txt.length };
}

async function psi(url, strategy) {
  try {
    const u = `${PSI}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=seo&category=accessibility`;
    const r = await fetch(u);
    if (!r.ok) return { ok: false, status: r.status };
    const j = await r.json();
    const cats = j.lighthouseResult?.categories ?? {};
    return {
      ok: true,
      perf: cats.performance?.score,
      seo:  cats.seo?.score,
      a11y: cats.accessibility?.score,
      lcp:  j.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue,
      cls:  j.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue,
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

(async () => {
  const month = new Date().toISOString().slice(0, 7);
  console.log(`# SEO Durum Anlık Görüntüsü — ${month}\n`);
  console.log(`Site: ${SITE}\n`);

  // Sitemap
  const s = await fetchSitemapStats();
  console.log("## Sitemap");
  if (!s.ok) console.log(`  ✗ FAIL — HTTP ${s.status}`);
  else console.log(`  ✓ ${s.urls} URL · ${s.images} image · ${(s.bytes/1024).toFixed(1)} KB`);

  // Robots
  const r = await fetchRobots();
  console.log("\n## Robots.txt");
  if (!r.ok) console.log(`  ✗ FAIL — HTTP ${r.status}`);
  else console.log(`  ✓ ${r.bytes} byte · sitemap satırı: ${r.hasSitemap ? "var" : "YOK!"}`);

  // PageSpeed
  console.log("\n## PageSpeed Insights (Lighthouse)");
  for (const t of TARGETS) {
    for (const strategy of ["mobile", "desktop"]) {
      const p = await psi(t.url, strategy);
      const tag = `${t.label} / ${strategy}`;
      if (!p.ok) { console.log(`  ${tag}: ✗ ${p.error ?? "HTTP " + p.status}`); continue; }
      console.log(`  ${tag}: perf ${fmt(p.perf)} · seo ${fmt(p.seo)} · a11y ${fmt(p.a11y)} · LCP ${(p.lcp/1000).toFixed(2)}s · CLS ${p.cls?.toFixed(3)}`);
    }
  }

  console.log("\n_Aylık snapshot — değişimleri görmek için önceki aylık raporlarla karşılaştır._");
})();
