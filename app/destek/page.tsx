import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, faqSchema, ogImage, OG_URL } from "../lib/seo";
import DestekClient from "./DestekClient";

// SON KULLANICI DESTEK SAYFASI — /destek
// Denetimde (2026-07-26) çıkan boşluk: elinde arızalı ürün olan kullanıcının
// gidebileceği hiçbir sayfa yoktu. Bu sayfa o yolculuğun karşılığıdır.
// FAQ şeması, "şarj cihazım çalışmıyor" gibi sorularda AI/Google alıntısı için.
export const metadata: Metadata = {
  title: "Destek, Arıza ve Garanti",
  description:
    "Şarj cihazınız çalışmıyor veya yavaş şarj ediyorsa önce deneyebileceğiniz adımlar, arıza kaydı açma yolu, 2 yıl üretici garantisi kapsamı ve iade süreci.",
  keywords: [
    "şarj cihazı çalışmıyor", "ev şarj cihazı arıza", "şarj istasyonu garanti",
    "bemis servis", "şarj cihazı yavaş şarj ediyor", "wallbox arıza",
  ],
  alternates: { canonical: "/destek", languages: { tr: "/destek", "x-default": "/destek" } },
  openGraph: {
    title: "Destek, Arıza ve Garanti | Bemis E-V Charge",
    description:
      "Şarj cihazınızla ilgili sorun mu var? Hızlı kontrol adımları, arıza kaydı, garanti kapsamı ve iade süreci.",
    type: "website",
    url: "/destek",
    images: ogImage("Bemis E-V Charge — Destek, Arıza ve Garanti"),
  },
  twitter: { card: "summary_large_image", title: "Destek, Arıza ve Garanti", description: "Şarj cihazınızla ilgili sorun mu var? Adım adım destek.", images: [OG_URL] },
};

// ⚠️ Cevaplar sayfadaki metinle AYNI olmalı (Google yapılandırılmış veri kuralı:
// şemadaki içerik sayfada GÖRÜNÜR olmalı).
const FAQ = [
  {
    q: "Şarj cihazım hiç çalışmıyor, ne yapmalıyım?",
    a: "Önce elektrik panonuzdaki cihaza ait sigortanın açık olduğunu kontrol edin. Kaçak akım rölesi (RCD) attıysa ve tekrar atıyorsa cihazı kullanmayı bırakın ve yetkili bir elektrikçiye başvurun. Taşınabilir cihazlarda prizde elektrik olduğunu başka bir cihazla doğrulayın. Sorun sürerse ürünü aldığınız yetkili bayiye başvurarak arıza kaydı açtırın.",
  },
  {
    q: "Aracım beklediğimden yavaş şarj oluyor, cihaz arızalı mı?",
    a: "Şarj hızını cihaz değil, aracınızın dahili AC şarj ünitesi belirler. Aracınız 7,4 kW ile sınırlıysa 22 kW bir cihazda da 7,4 kW ile şarj olur. Ayrıca tesisatınız tek fazlıysa üç fazlı cihaz da tek faz güç verir; çok soğuk havada ve batarya doluluğu yüksekken araç şarj hızını kendisi düşürür. Bu durumlar arıza değildir.",
  },
  {
    q: "Şarj kablosu aracımdan çıkmıyor, ne yapmalıyım?",
    a: "Şarjı önce araç ekranından veya mobil uygulamadan sonlandırın, ardından aracın kapı kilitlerini açın — çoğu araç kilitliyken soketi bırakmaz. Çıkmazsa aracınızın el kitabında yer alan acil kablo kurtarma kolunu kullanın.",
  },
  {
    q: "Bemis şarj ürünlerinin garanti süresi ne kadar?",
    a: "Bemis E-V Charge ürünleri 2 yıl üretici garantisi ile sunulur. Garanti, üretim ve malzeme kaynaklı arızaları kapsar. Kurulumun ürün kurulum şartnamesine uygun şekilde yetkili bir elektrikçi tarafından yapılmış olması gerekir; şartnameye aykırı kurulum, yetkisiz müdahale ve dış etkenlerden kaynaklanan hasarlar garanti dışındadır.",
  },
  {
    q: "Arıza kaydı açarken hangi bilgiler gerekiyor?",
    a: "Ürün adı ve ürün kodu (ör. BEV-1011-0005), satın alma faturası veya bayi bilgisi, arızanın kısa açıklaması, mümkünse cihazın ışık/ekran durumunu gösteren fotoğraf veya kısa video ve aracınızın marka-modeli. Bu bilgilerle kaydınız tek seferde açılır.",
  },
  {
    q: "Ürünü nasıl iade veya değişim yapabilirim?",
    a: "Ürünler yetkili bayi ağı üzerinden satılır. İade ve değişim talepleriniz, satın alma işlemini gerçekleştirdiğiniz bayi üzerinden, ilgili mevzuat ve bayinin satış koşulları çerçevesinde değerlendirilir. Ürün kutusunu ve faturanızı saklamanız süreci kolaylaştırır.",
  },
];

export default function DestekPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Destek", url: "/destek" },
    ]),
    faqSchema(FAQ),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <DestekClient />
    </>
  );
}
