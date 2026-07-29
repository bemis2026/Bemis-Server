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
  // ⚠️ Init ÖNCESİ kuyruk: buradaki hatalar sonradan captureException ile
  // gönderiliyor → yığın izi BİZİM handler'ımız oluyor, bu yüzden Sentry'nin
  // denyUrls'i onlara işlemiyor. Eklenti/uygulama-içi tarayıcı kaynaklı olanları
  // KAYNAĞINDA (ev.filename) eleyelim; yoksa gürültü kotayı yakıyor.
  const DIS_KAYNAK = /^(chrome|moz|safari(-web)?)-extension:\/\/|^chrome:\/\//i;
  const onErr = (ev: ErrorEvent) => {
    if (ev.filename && DIS_KAYNAK.test(ev.filename)) return;
    if (queue.length < 20) queue.push({ kind: "error", ev });
  };
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

        // ⚠️⚠️ SESSION REPLAY KAPATILDI (2026-07-29) — PERFORMANS KARARI.
        // Eskiden: replaysSessionSampleRate 0.01 + replaysOnErrorSampleRate 1.0.
        // Tuzak: onError oranı 0'dan büyük olduğunda Sentry, kaydediciyi TAMPON
        // modunda TÜM ziyaretçilerde çalıştırır (hata çıkarsa son ~50 sn'yi
        // gönderebilmek için sürekli DOM kaydı tutar). Bu sitede bunun bedeli iki
        // katmanlı: (a) rrweb kaydedicisi üretim paketinde ~528 KB'lık chunk,
        // (b) framer-motion animasyonları her karede satır-içi stil değiştirdiği
        // için kaydedicinin seri hâle getirmesi gereken mutasyon akışı hiç bitmiyor
        // → sayfa açıldıktan sonraki kaydırma/gezinme akıcılığı düşüyordu.
        // (Sentry ~4 sn'de boşta yüklendiği için LCP'yi bozmuyordu; şikayet zaten
        // "açılış yavaş" değil "gezerken kasıyor" idi — belirti birebir uyuyor.)
        // ⚠️ next.config'deki bundleSizeOptimizations bunu ÇÖZMEZ: o yalnız
        // shadow-DOM/iframe/worker alt parçalarını çıkarır, kaydedicinin kendisini
        // değil (replayIntegration açıkça çağrıldığı için paketten düşmez).
        // KAYBEDİLEN: hata anında "kullanıcı ne yapmıştı" videosu.
        // KORUNAN: hata bildirimi, yığın izi, breadcrumb, performans örneklemesi.
        // Gerekirse replayIntegration + iki oran geri eklenerek aynen dönülür.
        integrations: [],

        // Drop verbose ResizeObserver / hydration noise.
        ignoreErrors: [
          "ResizeObserver loop completed with undelivered notifications.",
          "ResizeObserver loop limit exceeded",
          "Hydration failed because the initial UI does not match",
          "There was an error while hydrating",

          // ⚠️ 2026-07-25 — ÜÇÜNCÜ-TARAF ENJEKSİYON GÜRÜLTÜSÜ (Sentry raporunda
          // 110+ olay). Hiçbiri bizim kodumuzda/paketlerimizde YOK; sayfaya
          // dışarıdan enjekte edilen scriptlerden geliyor (tarayıcı eklentileri,
          // iOS uygulama-içi tarayıcılar). Kotayı bunlar yakıyordu.
          //   · "a.getDuration is not a function" → video/medya eklentisi bir
          //     oynatıcı nesnesinde getDuration arıyor (bizde böyle bir çağrı yok)
          /getDuration is not a function/,
          //   · window.webkit.messageHandlers → iOS WKWebView köprüsü; Instagram/
          //     Facebook gibi uygulama-içi tarayıcıların enjekte ettiği script
          /webkit\.messageHandlers/,
          //   · r["@context"].toLowerCase → JSON-LD okuyan eklenti. ⓘ Bizim 14
          //     şema fonksiyonumuzun 14'ünde de "@context" VAR (doğrulandı).
          /\["@context"\]\.toLowerCase/,
        ],

        // Eklenti kaynaklı yığın izleri — hiç işlenmesin.
        denyUrls: [
          /^chrome-extension:\/\//i,
          /^moz-extension:\/\//i,
          /^safari-(web-)?extension:\/\//i,
          /^chrome:\/\//i,
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
