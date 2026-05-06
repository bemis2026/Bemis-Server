import { NextRequest, NextResponse } from "next/server";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const SITE = "https://www.bemisevcharge.com.tr";
const SITEMAP = `${SITE}/sitemap.xml`;
const INDEXNOW_KEY = "7c2e1b4d8a3f6c9e2b1d4a7f8c3e6b9d";

// Pages whose OG / preview cards we want recrawled when the OG image changes.
const URLS_TO_PING = [
  `${SITE}/`,
  `${SITE}/products`,
  `${SITE}/b2b`,
  `${SITE}/kurumsal`,
  `${SITE}/operator`,
  `${SITE}/bayilik`,
];

// Fire-and-forget — we don't block the admin response on these.
async function pingIndexNow() {
  // IndexNow covers Bing, Yandex, Naver, DuckDuckGo, Seznam.
  // Google does NOT participate in IndexNow but reads the sitemap.
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList: URLS_TO_PING,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function pingGoogleSitemap() {
  // Google deprecated the sitemap-ping endpoint in mid-2023, but the URL
  // still resolves and Search Console sees the hit. Also pings Bing.
  const targets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
  ];
  const results = await Promise.allSettled(
    targets.map((u) => fetch(u, { method: "GET" }))
  );
  return results.map((r, i) => ({
    target: targets[i],
    ok: r.status === "fulfilled" && r.value.ok,
  }));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const [indexNow, sitemap] = await Promise.all([
    pingIndexNow(),
    pingGoogleSitemap(),
  ]);

  return NextResponse.json({ indexNow, sitemap });
}
