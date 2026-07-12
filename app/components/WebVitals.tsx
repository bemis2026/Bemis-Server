"use client";
import { useReportWebVitals } from "next/web-vitals";

// Gerçek ziyaretçi Core Web Vitals (LCP/INP/CLS/FCP/TTFB) → GA4 event.
// CrUX saha verisi oluşana kadar kendi saha ölçümümüz olur (Vercel Speed
// Insights'a EK; GA4'te sorgulanabilir). gtag stub'ı erken tanımlı olduğu
// için (GoogleAnalytics consent script'i) buradaki çağrılar dataLayer'da
// KUYRUKLANIR — gtag.js etkileşim/5sn kapısıyla gelince işlenir, veri kaybolmaz.
// Görünür hiçbir etkisi yok.
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (!w.gtag) return;
    w.gtag("event", metric.name, {
      // GA4 raporunda okunabilir olsun diye değer ms/skor olarak yuvarlanır
      // (CLS 0-1 skalası → x1000 kuralı GA topluluk standardı).
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_category: "Web Vitals",
      event_label: metric.id, // sayfa-yükleme başına benzersiz — dağılım analizi için
      non_interaction: true,
    });
  });
  return null;
}
