// Client-side Sentry init. DSN comes from NEXT_PUBLIC_SENTRY_DSN (public env
// var). Sentry stays silent when the DSN is unset, so local dev / preview
// deploys without env stay clean.
//
// ⚡ PERF (2026-07-11): Sentry artık STATİK import edilmiyor — init, tarayıcı
// BOŞTA kalınca (requestIdleCallback, en geç ~6sn) dinamik import ile yapılır.
// Böylece Sentry chunk'ı (+replay) kritik ilk-yük JS'inden ve ana-iş
// penceresinden çıkar (TBT azalır). Init'ten ÖNCE oluşan hatalar kaybolmasın
// diye mini bir kuyruk tutulur: window error/unhandledrejection dinlenir,
// Sentry gelince kuyruk flush edilir. Görünür hiçbir değişiklik yok.

type QueuedErr =
  | { kind: "error"; ev: ErrorEvent }
  | { kind: "rejection"; ev: PromiseRejectionEvent };

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Router geçiş hook'u senkron export edilmek zorunda (Next sözleşmesi).
// Sentry yüklenene kadar no-op; yüklenince gerçek fonksiyona bağlanır.
let realRouterTransitionStart:
  | ((href: string, navigationType: string) => void)
  | undefined;
export const onRouterTransitionStart = (href: string, navigationType: string) => {
  realRouterTransitionStart?.(href, navigationType);
};

if (dsn && typeof window !== "undefined") {
  const queue: QueuedErr[] = [];
  const onErr = (ev: ErrorEvent) => { if (queue.length < 20) queue.push({ kind: "error", ev }); };
  const onRej = (ev: PromiseRejectionEvent) => { if (queue.length < 20) queue.push({ kind: "rejection", ev }); };
  window.addEventListener("error", onErr);
  window.addEventListener("unhandledrejection", onRej);

  let started = false;
  const init = async () => {
    if (started) return;
    started = true;
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",

        // Reduce sampling on perf traces — 10% on prod, 100% on dev.
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

        // Session replay — captures the user's last ~50s of UI before the
        // error. Free tier 500 replays/month; 1% normal, 100% error sessions.
        replaysSessionSampleRate: 0.01,
        replaysOnErrorSampleRate: 1.0,

        integrations: [
          Sentry.replayIntegration({
            // Privacy-by-default — never capture text input or images.
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],

        // Drop verbose ResizeObserver / hydration noise.
        ignoreErrors: [
          "ResizeObserver loop completed with undelivered notifications.",
          "ResizeObserver loop limit exceeded",
          "Hydration failed because the initial UI does not match",
          "There was an error while hydrating",
        ],
      });
      realRouterTransitionStart = Sentry.captureRouterTransitionStart;

      // Init öncesi biriken hataları aktar, geçici dinleyicileri kaldır
      // (Sentry kendi global handler'larını kurdu).
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
      for (const q of queue) {
        if (q.kind === "error") Sentry.captureException(q.ev.error ?? new Error(String(q.ev.message)));
        else Sentry.captureException(q.ev.reason ?? new Error("Unhandled promise rejection"));
      }
      queue.length = 0;
    } catch {
      // Sentry yüklenemedi (ör. engelleyici) — sessiz kal, site etkilenmez.
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    }
  };

  // Eski Safari'de requestIdleCallback yok → setTimeout'a düş.
  const ric = (window as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(() => { void init(); }, { timeout: 6000 });
  else window.setTimeout(() => { void init(); }, 4000);
}
