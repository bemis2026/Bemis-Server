"use client";

// Catches errors that fall through the root layout — e.g. a render
// failure in a top-level provider, a bug in layout.tsx itself, or a
// runtime exception before any nested error boundary mounts. Next.js
// hands those errors straight here, bypassing app/error.tsx (which
// only catches nested-segment failures).
//
// Both files now pipe into Sentry; the difference is what they're
// allowed to render. global-error has to render its own <html> +
// <body> because the layout failed.

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { digest: error.digest ?? "none", scope: "global-error" } });
    console.error("[global-error.tsx]", error);
  }, [error]);

  return (
    <html lang="tr">
      <body style={{
        margin: 0,
        background: "linear-gradient(160deg, #141414 0%, #0e0e0e 50%, #161616 100%)",
        color: "#f0f0f4",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#FCA5A5",
            margin: 0,
          }}>Kritik Hata</p>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: "12px 0 16px", lineHeight: 1.1 }}>
            Site geçici olarak<br/>kullanılamıyor.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,240,244,0.5)", margin: "0 0 28px", lineHeight: 1.6 }}>
            Beklenmedik bir hata oluştu. Sorun ekibimize otomatik olarak iletildi.
            Lütfen birkaç dakika sonra tekrar deneyin.
          </p>
          <a href="/" style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 12,
            background: "#3B82F6",
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}>Ana Sayfaya Dön</a>
          {error.digest && (
            <p style={{ fontSize: 10, color: "rgba(240,240,244,0.3)", marginTop: 24, fontFamily: "monospace" }}>
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
