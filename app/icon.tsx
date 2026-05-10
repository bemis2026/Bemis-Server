import { ImageResponse } from "next/og";
import sharp from "sharp";
import { readBin } from "../lib/jsonbin";

// Same-origin route for <link rel="icon">. Google ignores cross-origin
// favicon URLs, and the PNG users upload is often white-on-transparent
// (invisible on Google's white search row), so this route also normalizes
// the image: mostly-white logos are inverted to black before being
// flattened onto a white background.

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const runtime = "nodejs";
export const revalidate = 3600;

async function getFaviconUrl(): Promise<string | null> {
  try {
    const data = await readBin("content") as Record<string, unknown>;
    const url = (data?.faviconUrl as string) || "";
    return url || null;
  } catch {
    return null;
  }
}

async function normalizeFavicon(bytes: ArrayBuffer): Promise<Buffer> {
  const input = Buffer.from(bytes);
  const stats = await sharp(input).stats().catch(() => null);
  const isWhiteLogo = !!stats && stats.channels.length >= 3 &&
    stats.channels.slice(0, 3).every((c) => c.mean > 220);
  let pipe = sharp(input);
  if (isWhiteLogo) pipe = pipe.negate({ alpha: false });
  return pipe
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(64, 64, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
}

export default async function Icon() {
  const faviconUrl = await getFaviconUrl();

  if (faviconUrl) {
    try {
      const res = await fetch(faviconUrl, { cache: "no-store" });
      if (res.ok) {
        const out = await normalizeFavicon(await res.arrayBuffer());
        return new Response(new Uint8Array(out), {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      }
    } catch {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E11D48",
          color: "white",
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: "-0.05em",
        }}
      >
        B
      </div>
    ),
    size
  );
}
