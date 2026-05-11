// Edge runtime Sentry init. Runs inside Next.js middleware and any
// route segment with `export const runtime = "edge"`. Smaller surface
// than the Node runtime, so we skip optional integrations.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "production",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });
}
