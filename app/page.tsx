import type { Metadata } from "next";
import HomeClient from "./HomeClient";

// Anasayfa SERVER sarmalayıcı — yalnız metadata taşır; tüm UI "use client"
// HomeClient'ta. ⚠️ Anasayfa "use client" olduğu için SAYFA-ÖZEL metadata
// veremiyordu; bu ince sarmalayıcı çift-yönlü hreflang için en→/export
// geri-dönen etiketi ekler (Google resiprokal küme şartı: anasayfa<->/export).
// Diğer alanlar (title, OG, robots, verification) root layout'tan miras.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { tr: "/", en: "/export", "x-default": "/" },
  },
};

export default function Page() {
  return <HomeClient />;
}
