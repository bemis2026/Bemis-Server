import { ImageResponse } from "next/og";
import { readBin } from "../lib/jsonbin";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

async function getFaviconUrl(): Promise<string | null> {
  try {
    const data = await readBin("content") as Record<string, unknown>;
    const url = (data?.faviconUrl as string) || "";
    return url || null;
  } catch {
    return null;
  }
}

export default async function Icon() {
  const faviconUrl = await getFaviconUrl();

  if (faviconUrl) {
    try {
      const res = await fetch(faviconUrl, { cache: "no-store" });
      if (res.ok) {
        const bytes = await res.arrayBuffer();
        const ct = res.headers.get("content-type") || "image/png";
        return new Response(bytes, {
          headers: {
            "Content-Type": ct,
            "Cache-Control": "public, max-age=3600",
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
