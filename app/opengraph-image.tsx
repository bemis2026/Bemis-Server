import { ImageResponse } from "next/og";
import { readBin } from "../lib/jsonbin";

export const alt = "Bemis E-V Charge — Yerli EV Şarj Ekipmanı Üreticisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 1 saat — Vercel ISR write limit baskısı için 300s'den arttırıldı.
// Sosyal medya scrape'leri saatte birkaç kere; admin ogImage'i değiştirirse
// custom URL doğrudan kullanılır (regen'e gerek yok).
export const revalidate = 3600;

type ContentRecord = {
  ogImage?: string;
  faviconUrl?: string;
  logos?: { dark?: string; light?: string };
};

async function fetchBranding(): Promise<{
  ogOverride: string | null;
  logoUrl: string | null;
}> {
  try {
    const data = (await readBin("content")) as ContentRecord;
    const ogOverride = data?.ogImage?.trim() || null;
    const logoUrl =
      data?.logos?.dark?.trim() ||
      data?.logos?.light?.trim() ||
      data?.faviconUrl?.trim() ||
      null;
    return { ogOverride, logoUrl };
  } catch {
    return { ogOverride: null, logoUrl: null };
  }
}

export default async function Image() {
  const { ogOverride, logoUrl } = await fetchBranding();

  // If an admin has explicitly uploaded a 1200×630 OG image we honour it
  // by simply rendering it edge-to-edge.
  if (ogOverride) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#0c0c0e",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogOverride}
            alt=""
            width={1200}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ),
      { ...size }
    );
  }

  // Otherwise we synthesise a branded card from the logo + brand colours.
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0a0a0d 0%, #0e1224 35%, #08142e 75%, #0a0a0d 100%)",
          color: "white",
          padding: "70px 90px",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top-right blue glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0) 70%)",
            display: "flex",
          }}
        />
        {/* Bottom-left red accent — brand red so the card carries
            both Bemis colours, not just blue. */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -160,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(225,29,72,0.30) 0%, rgba(225,29,72,0) 70%)",
            display: "flex",
          }}
        />

        {/* Logo + wordmark row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={104}
              height={104}
              style={{ width: 104, height: 104, objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                color: "white",
                fontSize: 50,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              B
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 28,
                color: "#cfe1ff",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              Bemis E-V Charge
            </span>
            <span
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.40)",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Bemis Teknik Elektrik A.Ş. · 1994
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 18,
          }}
        >
          <span
            style={{
              fontSize: 82,
              fontWeight: 900,
              lineHeight: 1.02,
              maxWidth: 980,
              letterSpacing: -1.5,
            }}
          >
            Yerli EV Şarj Çözümleri
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 940,
            }}
          >
            AC Wallbox · DC Hızlı Şarj · V2L / C2L · Type 2 Kablolar · CE Sertifikalı
          </span>
        </div>

        {/* Trust chips row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 26,
            flexWrap: "wrap",
          }}
        >
          {["30+ Yıl Deneyim", "60+ Ülkeye İhracat", "Bursa OSB Üretim", "TSE / CE Onaylı"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#cfe1ff",
                background: "rgba(59,130,246,0.16)",
                border: "1px solid rgba(59,130,246,0.35)",
                padding: "8px 14px",
                borderRadius: 999,
                display: "flex",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 28,
          }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(90deg, #3B82F6 0%, #E11D48 100%)",
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            bemisevcharge.com.tr
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
