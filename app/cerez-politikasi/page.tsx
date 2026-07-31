import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

// Çerez Politikası — sitenin GERÇEK davranışına göre (Consent Mode v2 varsayılan
// RED; GA4/Ads/Meta yalnız kabulle; tema/dil/tercih localStorage; YouTube nocookie).
// Kullanıcı metinleri onayladı (2026-07-12) → indexlenebilir + footer linkli.
export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "Bemis E-V Charge web sitesinde kullanılan çerezler ve benzeri teknolojiler: zorunlu, analitik ve pazarlama çerezleri ile tercihlerinizi nasıl yöneteceğiniz.",
  robots: { index: true, follow: true }, // kullanıcı metni onayladı (2026-07-12)
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      updated="12 Temmuz 2026"
      intro="Bu politika, www.bemisevcharge.com.tr'de kullanılan çerezler ve benzeri teknolojileri (yerel depolama dâhil) ve bunları nasıl yönetebileceğinizi açıklar. Sitemiz, siz onay vermedikçe analitik ve pazarlama çerezlerini ÇALIŞTIRMAZ (varsayılan: reddedilmiş)."
      sections={[
        {
          h: "1. Çerez Nedir?",
          p: [
            "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Benzer amaçlarla tarayıcının yerel depolama (localStorage) alanı da kullanılabilir.",
          ],
        },
        {
          h: "2. Kullandığımız Kategoriler",
          ul: [
            "Zorunlu / işlevsel (onay gerektirmez): tema tercihi (açık/koyu), dil tercihi ve çerez onay tercihiniz tarayıcınızın yerel depolamasında tutulur. Bu veriler sunucuya gönderilmez, yalnızca deneyiminizi korur.",
            "Analitik (yalnız onayla): Google Analytics 4 — sayfa görüntüleme ve site kullanımı ölçümü. Google Consent Mode v2 kullanılır; onay vermezseniz analitik depolama kapalı kalır.",
            "Pazarlama (yalnız onayla): Google Ads dönüşüm ölçümü ve Meta (Facebook) Pixel. Onay vermezseniz bu piksellere veri gönderilmez; sonradan reddederseniz izleme durdurulur.",
            "Üçüncü taraf gömülü içerik: video oynatıcı olarak YouTube'un gizlilik-geliştirilmiş (youtube-nocookie) alan adı kullanılır; video oynatıldığında YouTube kendi çerezlerini kullanabilir.",
          ],
        },
        {
          h: "3. Tercihlerinizi Yönetme",
          ul: [
            "Sitemize ilk girişte çıkan bantta \"Sadece Gerekli\"yi seçerseniz analitik ve pazarlama çerezleri çalışmaz.",
            "Tercihinizi değiştirmek için tarayıcınızın site verilerini (çerezler ve yerel depolama) temizleyebilirsiniz — bant yeniden gösterilir.",
            "Ayrıca tarayıcı ayarlarınızdan çerezleri tümüyle engelleyebilir veya silebilirsiniz; zorunlu olanların engellenmesi tema/dil tercihlerinin hatırlanmamasına yol açabilir.",
          ],
        },
        {
          h: "4. Daha Fazla Bilgi",
          p: [
            "Kişisel verilerin işlenmesine ilişkin ayrıntılar için Gizlilik ve Kişisel Verilerin Korunması Aydınlatma Metni'ne bakabilirsiniz. Sorularınız için: satis@bemis.com.tr",
          ],
        },
      ]}
    />
  );
}
