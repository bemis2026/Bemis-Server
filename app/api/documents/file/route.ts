import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../../lib/jsonbin";

// Same-origin PDF/dosya vekili (proxy).
//
// Döküman dosyaları Cloudinary (res.cloudinary.com) ve Cloudflare R2
// (*.r2.dev) üzerinde duruyor. Bu dosyaları doğrudan <iframe>'e/indirmeye
// vermek kırılgan: CSP frame-src/connect-src, cross-origin iframe kuralları,
// R2'ye erişim, mobil tarayıcı davranışı… hepsi PDF'in "açılmamasına" yol
// açabiliyor. Bu route dosyayı SUNUCUDA çekip KENDİ alan adımızdan akıtır →
// tarayıcı için her şey same-origin olur; CSP 'self' yeter, mobilde de açılır.
//
// Güvenlik: yalnızca `id` alınır (kullanıcı keyfi URL veremez); URL bizim
// döküman verimizden gelir ve host bir allow-list'e karşı doğrulanır → açık
// proxy / SSRF yok.

export const runtime = "nodejs";

const fallbackPath = path.join(process.cwd(), "data", "documents.json");

type Doc = { id: string; url?: string; filename?: string; title?: string; visible?: boolean };

function toList(raw: unknown): Doc[] {
  if (Array.isArray(raw)) return raw as Doc[];
  const d = raw as { documents?: unknown[]; record?: { documents?: unknown[] } | unknown[] };
  if (Array.isArray(d?.documents)) return d.documents as Doc[];
  if (Array.isArray(d?.record)) return d.record as Doc[];
  if (Array.isArray((d?.record as { documents?: unknown[] })?.documents)) {
    return (d.record as { documents: unknown[] }).documents as Doc[];
  }
  return [];
}

async function getDocs(): Promise<Doc[]> {
  try {
    return toList(await readBin("documents"));
  } catch {}
  try {
    return toList(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return [];
  }
}

function hostAllowed(u: string): boolean {
  try {
    const h = new URL(u).hostname.toLowerCase();
    return (
      h === "res.cloudinary.com" ||
      h.endsWith(".r2.dev") ||
      h.endsWith(".r2.cloudflarestorage.com") ||
      h.endsWith(".public.blob.vercel-storage.com") ||
      h.endsWith(".vercel-storage.com") ||
      h.endsWith(".ibb.co")
    );
  } catch {
    return false;
  }
}

// Content-Disposition header injection'ı önle + ASCII fallback ver.
function asciiName(name: string): string {
  return (name.replace(/[\r\n"]/g, "").replace(/[^\x20-\x7E]/g, "_").slice(0, 200) || "dokuman.pdf");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  const download = searchParams.get("dl") === "1";
  if (!id) return new Response("Missing id", { status: 400 });

  const doc = (await getDocs()).find((d) => d.id === id && d.visible !== false);
  if (!doc || !doc.url) return new Response("Not found", { status: 404 });
  if (!hostAllowed(doc.url)) return new Response("Forbidden host", { status: 403 });

  let upstream: Response;
  try {
    upstream = await fetch(doc.url, { redirect: "follow" });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }
  const body = upstream.body;
  if (!upstream.ok || !body) return new Response("Upstream error", { status: 502 });

  const contentType = upstream.headers.get("content-type") || "application/pdf";
  const rawName = doc.filename || `${doc.title || "dokuman"}.pdf`;
  const disposition =
    `${download ? "attachment" : "inline"}; filename="${asciiName(rawName)}"; ` +
    `filename*=UTF-8''${encodeURIComponent(rawName)}`;

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", disposition);
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set("X-Content-Type-Options", "nosniff");
  // CDN'de URL başına (id + dl) önbellekle — tekrar tekrar proxy'lemeyelim.
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");

  return new Response(body, { status: 200, headers });
}
