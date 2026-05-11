// Client-side Sentry init. Runs in the browser bundle; DSN comes from
// NEXT_PUBLIC_SENTRY_DSN (public env var). Sentry stays silent when the
// DSN is unset, so local dev / preview deploys without env stay clean.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",

    // Reduce sampling on perf traces — 10% on prod, 100% on dev.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session replay — captures the user's last ~50s of UI before the
    // error, plus a video-like recording while errors are happening.
    // Free tier includes 500 replays/month; we cap at 1% of normal
    // sessions and 100% of error sessions.
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({
        // Privacy-by-default — never capture text input or images on
        // the contact form. Bemis carries trade-pricing in some specs
        // and we don't want that captured into Sentry either.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Drop verbose ResizeObserver / hydration noise; track only real
    // user-impacting errors.
    ignoreErrors: [
      "ResizeObserver loop completed with undelivered notifications.",
      "ResizeObserver loop limit exceeded",
      "Hydration failed because the initial UI does not match",
      "There was an error while hydrating",
    ],
  });
}
