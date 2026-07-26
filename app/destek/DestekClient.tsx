"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import { useTheme } from "../context/ThemeContext";
import { accentInk } from "../lib/accentInk";
import {
  RiToolsLine, RiShieldCheckLine, RiFileList3Line, RiMapPinLine,
  RiWhatsappLine, RiPhoneLine, RiMailLine, RiArrowRightLine, RiAlarmWarningLine,
} from "react-icons/ri";

// SON KULLANICI DESTEK SAYFASI (2026-07-26).
// ⚠️ NEDEN VAR: site denetiminde çıktı ki elinde ARIZALI ürün olan bir kullanıcının
// gidebileceği hiçbir yer yoktu — menüde/footer'da destek yok, ürün sayfasındaki
// "2 Yıl Üretici Garantisi" tıklanamayan ölü metindi, iletişim formunda arıza konusu
// yoktu, 44 kategori SSS'inin hiçbiri "ürünüm bozuldu ne yapmalıyım"ı cevaplamıyordu.
//
// ⚠️ İÇERİK KURALI: Buradaki teknik kontrol adımları GENEL ve doğrulanabilir EV şarj
// bilgisidir (sigorta/kaçak akım, aracın AC şarj limiti, kablo oturması). Bemis'e
// ait TAAHHÜT sadece sitede zaten yazılı olan "2 yıl üretici garantisi" ve satışın
// yetkili bayi üzerinden yürüdüğü gerçeğidir. Elektrik işleri için DAİMA yetkili
// elektrikçiye yönlendirilir — kullanıcıya kendi başına müdahale önerilmez.
const BLUE = "#3B82F6";

const PHONE = "+90 (224) 433 02 16";
const PHONE_HREF = "tel:+902244330216";
const WA_HREF = "https://wa.me/905339562546?text=" + encodeURIComponent("Merhaba, ürünümle ilgili arıza/garanti desteği almak istiyorum.");
const MAIL_HREF = "mailto:info@bemisevcharge.com?subject=" + encodeURIComponent("Arıza / Garanti Desteği");

type Kontrol = { baslik: string; belirti: string; adimlar: string[] };

const HIZLI_KONTROL: Kontrol[] = [
  {
    baslik: "Cihaz hiç çalışmıyor, ışık yanmıyor",
    belirti: "Ekran/LED tamamen sönük.",
    adimlar: [
      "Elektrik panonuzdaki cihaza ait sigortanın açık olduğunu kontrol edin.",
      "Kaçak akım rölesi (RCD) atmışsa, tekrar atıyorsa cihazı kullanmayın — yetkili elektrikçi çağırın.",
      "Taşınabilir cihazlarda prizde elektrik olduğunu başka bir cihazla doğrulayın.",
    ],
  },
  {
    baslik: "Cihaz çalışıyor ama şarj başlamıyor",
    belirti: "Işık yanıyor, araç şarja geçmiyor.",
    adimlar: [
      "Soketi araca tam oturana kadar itin; klik sesini duymalısınız.",
      "Aracın şarj zamanlayıcısı/gecikmeli şarj ayarı açık olabilir — araç ekranından kontrol edin.",
      "Aracı kilitleyip tekrar açmayı ve kabloyu yeniden takmayı deneyin.",
    ],
  },
  {
    baslik: "Şarj beklediğimden yavaş",
    belirti: "22 kW cihazda düşük güçle şarj oluyor.",
    adimlar: [
      "Şarj hızını cihaz DEĞİL, aracınızın dahili AC şarj ünitesi belirler; aracınız 7,4 kW ile sınırlıysa 22 kW cihazda da 7,4 kW alır.",
      "Tesisatınız tek fazlıysa üç fazlı cihaz da tek faz güç verir.",
      "Çok soğuk havada ve batarya doluluk oranı yüksekken araç şarj hızını kendisi düşürür.",
    ],
  },
  {
    baslik: "Kablo araçtan çıkmıyor",
    belirti: "Soket araca kilitli kaldı.",
    adimlar: [
      "Şarjı önce araç ekranından veya uygulamadan sonlandırın.",
      "Aracın kapılarının kilidini açın — çoğu araç kilitliyken soketi bırakmaz.",
      "Aracınızın el kitabındaki acil kablo kurtarma kolunu kullanın.",
    ],
  },
];

const ADIMLAR = [
  {
    n: "1",
    h: "Önce yukarıdaki hızlı kontrolleri yapın",
    p: "Şarj sorunlarının önemli bölümü cihaz arızası değil; tesisat, araç ayarı veya bağlantı kaynaklıdır. Bu adımlar çoğu durumu birkaç dakikada çözer.",
  },
  {
    n: "2",
    h: "Ürünü aldığınız yetkili bayiye başvurun",
    p: "Satış ve satış sonrası süreç yetkili bayi üzerinden yürür. Bayiniz arıza kaydını açar, garanti kapsamını değerlendirir ve gerekirse ürünü bize iletir.",
  },
  {
    n: "3",
    h: "Bayinize ulaşamıyorsanız doğrudan bize yazın",
    p: "Aşağıdaki kanallardan bize ulaşın; kaydınızı açıp sizi doğru bayiye veya teknik ekibimize yönlendirelim.",
  },
];

const GEREKENLER = [
  "Ürün adı ve ürün kodu (ör. BEV-1011-0005) — ürün etiketinde veya kutusunda yazar",
  "Satın alma faturası veya bayi bilgisi",
  "Arızanın kısa açıklaması: ne zaman, hangi durumda oluyor",
  "Mümkünse cihazın ışık/ekran durumunu gösteren fotoğraf veya kısa video",
  "Aracınızın marka ve modeli (şarj uyumu için)",
];

export default function DestekClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [acik, setAcik] = useState<number | null>(0);

  const bg    = d ? "#131318" : "#f8f8fb";
  const card  = d ? "#1c1c22" : "#ffffff";
  const line  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const text  = d ? "#f0f0f4" : "#1a1a2e";
  const muted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,46,0.62)";
  const faint = d ? "rgba(240,240,244,0.40)" : "rgba(26,26,46,0.42)";
  const ink   = accentInk(BLUE, d);

  const CTA = ({ href, icon, children, primary }: { href: string; icon: React.ReactNode; children: React.ReactNode; primary?: boolean }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      style={primary
        ? { background: BLUE, color: "#fff", boxShadow: `0 8px 22px ${BLUE}40` }
        : { color: text, border: `1.5px solid ${line}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
      {icon}{children}
    </a>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-3xl mx-auto px-5 sm:px-8" style={{ paddingTop: 120, paddingBottom: 64 }}>
        {/* Giriş */}
        <p className="inline-flex text-[11px] font-bold tracking-[0.16em] uppercase mb-3 px-2.5 py-1 rounded-full"
          style={{ color: ink, background: `${BLUE}14`, border: `1px solid ${BLUE}2e` }}>
          Destek
        </p>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2.5" style={{ color: text }}>
          Ürününüzle ilgili bir sorun mu var?
        </h1>
        <p className="text-sm leading-relaxed mb-7" style={{ color: muted }}>
          Şarj cihazınız çalışmıyor, beklediğiniz hızda şarj etmiyor ya da garanti kapsamında bir talebiniz mi var?
          Aşağıdaki adımlar çoğu sorunu birkaç dakikada çözer; çözülmezse arıza kaydınızı nasıl açacağınızı adım adım anlattık.
        </p>

        {/* Hızlı kontrol */}
        <section className="rounded-2xl px-5 sm:px-6 py-5 mb-5" style={{ background: card, border: `1px solid ${line}` }}>
          <div className="flex items-center gap-2 mb-1">
            <RiToolsLine style={{ color: ink, fontSize: 18 }} aria-hidden />
            <h2 className="text-base font-bold" style={{ color: text }}>Önce bunları deneyin</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: faint }}>
            Şarj sorunlarının çoğu cihaz arızası değildir — tesisat, araç ayarı veya bağlantı kaynaklıdır.
          </p>

          <div className="flex flex-col gap-2">
            {HIZLI_KONTROL.map((k, i) => {
              const open = acik === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${line}` }}>
                  <button
                    type="button"
                    onClick={() => setAcik(open ? null : i)}
                    aria-expanded={open}
                    className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 cursor-pointer transition-colors"
                    style={{ background: open ? (d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)") : "transparent" }}
                  >
                    <span>
                      <span className="block text-sm font-bold" style={{ color: text }}>{k.baslik}</span>
                      <span className="block text-xs mt-0.5" style={{ color: faint }}>{k.belirti}</span>
                    </span>
                    <span className="text-lg leading-none flex-shrink-0 transition-transform duration-200"
                      style={{ color: ink, transform: open ? "rotate(45deg)" : "none" }} aria-hidden>+</span>
                  </button>
                  {open && (
                    <ol className="list-decimal pl-9 pr-4 pb-4 flex flex-col gap-1.5">
                      {k.adimlar.map((a, j) => (
                        <li key={j} className="text-sm leading-relaxed" style={{ color: muted }}>{a}</li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs leading-relaxed mt-4 px-3 py-2.5 rounded-lg flex items-start gap-2"
            style={{ background: d ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.10)", color: muted, border: "1px solid rgba(245,158,11,0.25)" }}>
            <RiAlarmWarningLine style={{ color: accentInk("#F59E0B", d), fontSize: 15, flexShrink: 0, marginTop: 1 }} aria-hidden />
            <span>
              Elektrik panosu, sigorta veya kablolama ile ilgili hiçbir işlemi kendiniz yapmayın.
              Kaçak akım rölesi tekrar tekrar atıyorsa cihazı kullanmayı bırakın ve yetkili bir elektrikçiye başvurun.
            </span>
          </p>
        </section>

        {/* 3 adım */}
        <section className="rounded-2xl px-5 sm:px-6 py-5 mb-5" style={{ background: card, border: `1px solid ${line}` }}>
          <div className="flex items-center gap-2 mb-4">
            <RiFileList3Line style={{ color: ink, fontSize: 18 }} aria-hidden />
            <h2 className="text-base font-bold" style={{ color: text }}>Arıza kaydı nasıl açılır?</h2>
          </div>
          <div className="flex flex-col gap-4">
            {ADIMLAR.map((a) => (
              <div key={a.n} className="flex gap-3">
                <span className="flex items-center justify-center flex-shrink-0 rounded-lg text-sm font-black"
                  style={{ width: 28, height: 28, background: `${BLUE}16`, color: ink }}>{a.n}</span>
                <div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: text }}>{a.h}</p>
                  <p className="text-sm leading-relaxed" style={{ color: muted }}>{a.p}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <CTA href="/#dealer" icon={<RiMapPinLine aria-hidden />} primary>Bayi Bul</CTA>
            <CTA href={WA_HREF} icon={<RiWhatsappLine aria-hidden />}>WhatsApp</CTA>
            <CTA href={PHONE_HREF} icon={<RiPhoneLine aria-hidden />}>{PHONE}</CTA>
            <CTA href={MAIL_HREF} icon={<RiMailLine aria-hidden />}>E-posta</CTA>
          </div>
        </section>

        {/* Bize iletirken gerekenler */}
        <section className="rounded-2xl px-5 sm:px-6 py-5 mb-5" style={{ background: card, border: `1px solid ${line}` }}>
          <h2 className="text-base font-bold mb-3" style={{ color: text }}>Başvururken hazır bulundurun</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: muted }}>
            Aşağıdakileri iletirseniz kaydınız tek seferde açılır ve süreç hızlanır:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            {GEREKENLER.map((g, i) => (
              <li key={i} className="text-sm leading-relaxed" style={{ color: muted }}>{g}</li>
            ))}
          </ul>
        </section>

        {/* Garanti */}
        <section className="rounded-2xl px-5 sm:px-6 py-5 mb-5" style={{ background: card, border: `1px solid ${line}` }}>
          <div className="flex items-center gap-2 mb-3">
            <RiShieldCheckLine style={{ color: ink, fontSize: 18 }} aria-hidden />
            <h2 className="text-base font-bold" style={{ color: text }}>Garanti</h2>
          </div>
          <p className="text-sm leading-relaxed mb-2.5" style={{ color: muted }}>
            Bemis E-V Charge ürünleri <strong style={{ color: text }}>2 yıl üretici garantisi</strong> ile sunulur.
            Garanti, üretim ve malzeme kaynaklı arızaları kapsar.
          </p>
          <p className="text-sm leading-relaxed mb-2.5" style={{ color: muted }}>
            Cihazın kurulumu, ürün kurulum şartnamesine uygun şekilde yetkili bir elektrikçi tarafından yapılmalıdır.
            Şartnameye aykırı kurulum, yetkisiz müdahale ve dış etkenlerden (yıldırım, su baskını, darbe, uygunsuz
            şebeke koşulları) kaynaklanan hasarlar garanti dışındadır.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            Garanti talepleri, ürünü satın aldığınız yetkili bayi üzerinden yürütülür.
            Ürünlerimiz CE sertifikalıdır ve %94 Yerli Malı Belgesi'ne sahiptir.
          </p>
        </section>

        {/* İade / değişim */}
        <section className="rounded-2xl px-5 sm:px-6 py-5 mb-5" style={{ background: card, border: `1px solid ${line}` }}>
          <h2 className="text-base font-bold mb-3" style={{ color: text }}>İade ve değişim</h2>
          <p className="text-sm leading-relaxed mb-2.5" style={{ color: muted }}>
            Ürünler yetkili bayi ağı üzerinden satılır. İade ve değişim talepleriniz, satın alma işlemini
            gerçekleştirdiğiniz bayi üzerinden, ilgili mevzuat ve bayinin satış koşulları çerçevesinde değerlendirilir.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            Ürün kutusunu ve faturanızı saklamanız, iade veya garanti sürecini kolaylaştırır.
            Hangi bayiden aldığınızı hatırlamıyorsanız bize yazın, kaydınızı birlikte bulalım.
          </p>
        </section>

        {/* Kurulum */}
        <section className="rounded-2xl px-5 sm:px-6 py-5" style={{ background: card, border: `1px solid ${line}` }}>
          <h2 className="text-base font-bold mb-3" style={{ color: text }}>Kurulum desteği</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: muted }}>
            Cihaz fiyatına kurulum dahil değildir. Yetkili bayimiz keşif yaparak hat çekimi, kablolama ve sigorta
            panosu çalışmaları için ihtiyacınıza özel ayrı bir teklif verir; kurulum maliyeti mevcut altyapınıza göre
            keşifte netleşir.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <CTA href="/#dealer" icon={<RiMapPinLine aria-hidden />} primary>Size En Yakın Bayi</CTA>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ color: text, border: `1.5px solid ${line}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
              Ürünleri İncele <RiArrowRightLine aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <ContactBar />
    </div>
  );
}
