import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ── Auth check ─────────────────────────────────────────────────────────────
async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "1";
}

// ── GA4 client ─────────────────────────────────────────────────────────────
function getClient() {
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey  = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) return null;
  return new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
}

const PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? "";

// ── GET /api/admin/analytics?range=7 ──────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getClient();
  if (!client || !PROPERTY_ID) {
    return NextResponse.json({ error: "GA4_NOT_CONFIGURED" }, { status: 200 });
  }

  const range = req.nextUrl.searchParams.get("range") ?? "28";
  const startDate = `${range}daysAgo`;

  try {
    const property = `properties/${PROPERTY_ID}`;

    // 1 — Overview metrics
    const [overviewRes] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate: "today" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    });

    // 2 — Daily sessions + users trend
    const [trendRes] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    // 3 — Top pages
    const [pagesRes] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    // 4 — Traffic channels
    const [channelsRes] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    });

    // 5 — Key events
    const [eventsRes] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    });

    // ── Parse helpers ──────────────────────────────────────────────────────
    const overview = overviewRes.rows?.[0];
    const metrics = {
      sessions:            Number(overview?.metricValues?.[0]?.value ?? 0),
      users:               Number(overview?.metricValues?.[1]?.value ?? 0),
      pageViews:           Number(overview?.metricValues?.[2]?.value ?? 0),
      avgSessionDuration:  Number(overview?.metricValues?.[3]?.value ?? 0),
      bounceRate:          Number(overview?.metricValues?.[4]?.value ?? 0),
    };

    const trend = (trendRes.rows ?? []).map((row) => ({
      date:     row.dimensionValues?.[0]?.value ?? "",
      sessions: Number(row.metricValues?.[0]?.value ?? 0),
      users:    Number(row.metricValues?.[1]?.value ?? 0),
    }));

    const pages = (pagesRes.rows ?? []).map((row) => ({
      path:     row.dimensionValues?.[0]?.value ?? "",
      views:    Number(row.metricValues?.[0]?.value ?? 0),
      avgTime:  Number(row.metricValues?.[1]?.value ?? 0),
    }));

    const channels = (channelsRes.rows ?? []).map((row) => ({
      channel:  row.dimensionValues?.[0]?.value ?? "",
      sessions: Number(row.metricValues?.[0]?.value ?? 0),
      users:    Number(row.metricValues?.[1]?.value ?? 0),
    }));

    const events = (eventsRes.rows ?? []).map((row) => ({
      name:  row.dimensionValues?.[0]?.value ?? "",
      count: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    return NextResponse.json({ metrics, trend, pages, channels, events });
  } catch (err) {
    console.error("GA4 API error:", err);
    return NextResponse.json({ error: "GA4_API_ERROR" }, { status: 500 });
  }
}
