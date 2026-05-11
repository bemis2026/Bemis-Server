// Server-side Sentry init. Runs inside Next.js API routes, server
// components, and the Node runtime. DSN comes from SENTRY_DSN (private)
// so the value never leaks into the client bundle.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "production",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });
}
