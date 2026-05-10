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

// True when the visible (alpha > 0) pixels are mostly bright. sharp's
// channel stats average across transparent pixels too, which dragged the
// mean way down on white-on-transparent PNGs and missed the case we
// actually need to invert.
async function isMostlyBrightLogo(input: Buffer): Promise<boolean> {
  try {
    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.channels < 4) return false;
    let visible = 0;
    let sumLum = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 64) continue;
      visible++;
      sumLum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return visible > 0 && sumLum / visible > 200;
  } catch {
    return false;
  }
}

async function normalizeFavicon(bytes: ArrayBuffer): Promise<Buffer> {
  const input = Buffer.from(bytes);
  // Negate first if the visible pixels are mostly bright; that flips the
  // logo from white-on-transparent to dark-on-transparent (alpha is kept,
  // so the inner shape that was carved out of the mark stays transparent).
  let layer = sharp(input);
  if (await isMostlyBrightLogo(input)) layer = layer.negate({ alpha: false });
  // 56×56 leaves a 4px breathing margin inside the 64×64 favicon — Google
  // and most browser tabs crop a bit off the edges so the mark needs slack.
  const resized = await layer
    .resize(56, 56, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: 64,
      height: 64,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized }])
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
