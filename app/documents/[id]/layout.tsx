import type { Metadata } from "next";

// Döküman görüntüleyici — Bemis domain'inde markalı PDF görüntüleme.
// Tarayıcı sekmesi Bemis favicon'unu (root layout) + temiz bemis URL'ini gösterir,
// ham Cloudinary/R2 URL'i kullanıcıya görünmez. Yardımcı sayfa → indexlenmez.
export const metadata: Metadata = {
  title: "Döküman Görüntüleyici",
  robots: { index: false, follow: true },
};

export default function DocumentViewerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
