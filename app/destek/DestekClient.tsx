"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import ContactBar from "../components/ContactBar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { accentInk } from "../lib/accentInk";
import {
  RiToolsLine, RiShieldCheckLine, RiFileList3Line, RiMapPinLine,
  RiWhatsappLine, RiPhoneLine, RiMailLine, RiArrowRightLine, RiAlarmWarningLine,
  RiFlashlightLine, RiPlugLine, RiTimerLine, RiSmartphoneLine, RiBarcodeLine,
  RiCheckLine, RiCloseLine, RiExchangeLine, RiHomeGearLine, RiCustomerService2Line,
} from "react-icons/ri";

// SON KULLANICI DESTEK SAYFASI — /destek
// ⚠️ NEDEN VAR: site denetiminde çıktı ki elinde ARIZALI ürün olan bir kullanıcının
// gidebileceği hiçbir yer yoktu — menüde/footer'da destek yok, ürün sayfasındaki
// "2 Yıl Üretici Garantisi" tıklanamayan ölü metindi, iletişim formunda arıza konusu
// yoktu, 44 kategori SSS'inin hiçbiri "ürünüm bozuldu ne yapmalıyım"ı cevaplamıyordu.
//
// ⚠️ 2026-07-27 YENİDEN TASARIM: sayfa `max-w-3xl` (768px) tek sütundu — içerik
// ekranın ortasında dar bir şeritte toplanıyordu. Artık sitenin standart genişliği
// (`max-w-7xl 2xl:max-w-[1600px]`) + ızgara yerleşim + /uretici ile aynı tasarım dili
// (hero + blob + nabız rozeti + accent çizgi + whileInView reveal).
//
// ⚠️ AKORDEON KALDIRILDI: belirti adımları artık DAİMA görünür. Kapalı akordeon
// içeriği HTML'e basmıyordu → hem kullanıcı hem Google/AI için görünmez oluyordu
// (aynı kusur şehir sayfalarında da yakalandı, bkz. CityLandingClient).
//
// ⚠️ İÇERİK KURALI: Buradaki teknik kontrol adımları GENEL ve doğrulanabilir EV şarj
// bilgisidir (sigorta/kaçak akım, aracın AC şarj limiti, kablo oturması). Bemis'e
// ait TAAHHÜT sadece sitede zaten yazılı olan "2 yıl üretici garantisi" ve satışın
// yetkili bayi üzerinden yürüdüğü gerçeğidir. Süre/tarih taahhüdü VERİLMEZ.
// Elektrik işleri için DAİMA yetkili elektrikçiye yönlendirilir.
const AMBER = "#F59E0B";
const GREEN = "#10B981";
const VIEWPORT = { once: true, margin: "-60px" } as const;

const PHONE = "+90 (224) 433 02 16";
const PHONE_HREF = "tel:+902244330216";
const WA_HREF = "https://wa.me/905339562546?text=" + encodeURIComponent("Merhaba, ürünümle ilgili arıza/garanti desteği almak istiyorum.");
const MAIL_HREF = "mailto:satis@bemis.com.tr?subject=" + encodeURIComponent("Arıza / Garanti Desteği");

type Kontrol = { icon: React.ReactNode; baslik: string; belirti: string; adimlar: string[] };

const HIZLI_KONTROL: Kontrol[] = [
  {
    icon: <RiFlashlightLine />,
    baslik: "Cihaz hiç çalışmıyor, ışık yanmıyor",
    belirti: "Ekran/LED tamamen sönük.",
    adimlar: [
      "Elektrik panonuzdaki cihaza ait sigortanın açık olduğunu kontrol edin.",
      "Kaçak akım rölesi (RCD) atmışsa, tekrar atıyorsa cihazı kullanmayın — yetkili elektrikçi çağırın.",
      "Taşınabilir cihazlarda prizde elektrik olduğunu başka bir cihazla doğrulayın.",
    ],
  },
  {
    icon: <RiPlugLine />,
    baslik: "Cihaz çalışıyor ama şarj başlamıyor",
    belirti: "Işık yanıyor, araç şarja geçmiyor.",
    adimlar: [
      "Soketi araca tam oturana kadar itin; klik sesini duymalısınız.",
      "Aracın şarj zamanlayıcısı/gecikmeli şarj ayarı açık olabilir — araç ekranından kontrol edin.",
      "Aracı kilitleyip tekrar açmayı ve kabloyu yeniden takmayı deneyin.",
    ],
  },
  {
    icon: <RiTimerLine />,
    baslik: "Şarj beklediğimden yavaş",
    belirti: "22 kW cihazda düşük güçle şarj oluyor.",
    adimlar: [
      "Şarj hızını cihaz DEĞİL, aracınızın dahili AC şarj ünitesi belirler; aracınız 7,4 kW ile sınırlıysa 22 kW cihazda da 7,4 kW alır.",
      "Tesisatınız tek fazlıysa üç fazlı cihaz da tek faz güç verir.",
      "Çok soğuk havada ve batarya doluluk oranı yüksekken araç şarj hızını kendisi düşürür.",
    ],
  },
  {
    icon: <RiToolsLine />,
    baslik: "Kablo araçtan çıkmıyor",
    belirti: "Soket araca kilitli kaldı.",
    adimlar: [
      "Şarjı önce araç ekranından veya uygulamadan sonlandırın.",
      "Aracın kapılarının kilidini açın — çoğu araç kilitliyken soketi bırakmaz.",
      "Aracınızın el kitabındaki acil kablo kurtarma kolunu kullanın.",
    ],
  },
  {
    icon: <RiExchangeLine />,
    baslik: "Şarj sırasında kendiliğinden duruyor",
    belirti: "Şarj başlıyor ama bir süre sonra kesiliyor.",
    adimlar: [
      "Aracın şarj limiti (ör. %80) dolmuş olabilir — araç ekranından kontrol edin.",
      "Soketin araca tam oturduğundan ve kablonun gergin durmadığından emin olun.",
      "Kaçak akım rölesi atıyorsa sorun tesisat tarafında olabilir; yetkili elektrikçiye başvurun.",
      "Çok sıcak ortamlarda araç ve cihaz koruma amacıyla gücü düşürebilir veya şarjı duraklatabilir.",
    ],
  },
  {
    icon: <RiSmartphoneLine />,
    baslik: "Uygulama cihazı göremiyor",
    belirti: "Uygulama destekli modellerde cihaz çevrimdışı görünüyor.",
    adimlar: [
      "Cihazın bağlandığı WiFi ağının kapsama alanında olduğundan emin olun; modemi yeniden başlatmayı deneyin.",
      "Uygulamadan çıkıp tekrar giriş yapın ve cihazı yeniden ekleyin.",
      "GSM'li modellerde bulunduğunuz noktada operatör sinyalinin zayıf olması bağlantıyı etkiler.",
      "Cihaz şarj işlevini uygulamadan bağımsız sürdürür; şarj devam ediyorsa acil bir arıza yoktur.",
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

// Süreç anlatımı — SÜRE/GÜN TAAHHÜDÜ İÇERMEZ (bkz. içerik kuralı).
const SUREC = [
  { h: "Başvuru", p: "Bayinize veya bize ulaşırsınız; ürün bilgileriniz ve arıza tarifiniz kaydedilir." },
  { h: "Ön değerlendirme", p: "Belirtiler uzaktan değerlendirilir. Kurulum, tesisat veya araç ayarı kaynaklı durumlar çoğunlukla bu aşamada çözülür." },
  { h: "İnceleme", p: "Gerekirse cihaz teknik ekibimize iletilir ve arıza incelenir." },
  { h: "Sonuç", p: "Garanti kapsamındaki arızalarda onarım veya değişim yapılır. Kapsam dışında kalan bir durum varsa size bilgi verilir." },
];

const GARANTI_ICINDE = [
  "Üretim ve malzeme kaynaklı arızalar",
  "Normal kullanım koşullarında ortaya çıkan işlev kayıpları",
  "Kurulum şartnamesine uygun şekilde monte edilmiş cihazlar",
];

const GARANTI_DISINDA = [
  "Şartnameye aykırı veya yetkisiz kişilerce yapılan kurulum",
  "Cihazın açılması, yetkisiz müdahale veya onarım denemesi",
  "Yıldırım, su baskını, darbe gibi dış etkenler",
  "Uygunsuz şebeke koşullarından kaynaklanan hasarlar",
];

export default function DestekClient() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);

  const bg    = d ? "#131318" : "#f8f8fb";
  const card  = d ? "#1c1c22" : "#ffffff";
  const sub   = d ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.022)";
  const line  = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const text  = d ? "#f0f0f4" : "#1a1a2e";
  const muted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,46,0.62)";
  const faint = d ? "rgba(240,240,244,0.40)" : "rgba(26,26,46,0.42)";
  // ⚠️⚠️ RENK PİLOTU (2026-08-04, kullanıcı isteği) — BU SAYFAYA ÖZEL.
  // Mavi accent YERİNE nötr palet: karanlıkta BEYAZ, aydınlıkta SİYAH, dolgular
  // gri. Amaç: siteyi maviden arındırmayı önce tek sayfada denemek; beğenilirse
  // genele yayılacak. Sitenin geri kalanı DEĞİŞMEDİ.
  // 📌 GERİ ALMAK: bu üç sabiti silip `const BLUE = "#3B82F6"` geri koy ve
  //    `ink`i tekrar accentInk(BLUE, d) yap.
  const NOTR      = d ? "#ffffff" : "#111111";                              // metin + ikon
  const NOTR_DOLGU= d ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";      // ikon kutusu zemini
  const NOTR_CIZGI= d ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";      // accent çizgi / nabız
  const ink   = NOTR;
  const inkAmber = accentInk(AMBER, d);
  const inkGreen = accentInk(GREEN, d);

  const WRAP = "max-w-7xl 2xl:max-w-[1600px] mx-auto";
  const SECTION = "py-9 px-5 sm:px-6 lg:px-8";

  const Baslik = ({ icon, children, alt }: { icon: React.ReactNode; children: React.ReactNode; alt?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.45 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span className="inline-flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 34, height: 34, background: NOTR_DOLGU, color: ink, fontSize: 17 }} aria-hidden>{icon}</span>
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: text }}>{children}</h2>
      </div>
      <div className="h-px w-24 mb-3" style={{ background: `linear-gradient(90deg, ${NOTR_CIZGI} 0%, transparent 100%)` }} />
      {alt && <p className="text-sm leading-relaxed max-w-3xl" style={{ color: muted }}>{alt}</p>}
    </motion.div>
  );

  const Kart = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
      transition={{ duration: 0.45, delay }}
      className={`rounded-2xl p-5 sm:p-6 ${className}`}
      style={{ background: card, border: `1px solid ${line}` }}
    >
      {children}
    </motion.div>
  );

  const CTA = ({ href, icon, children, primary }: { href: string; icon: React.ReactNode; children: React.ReactNode; primary?: boolean }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
      style={primary
        ? { background: NOTR, color: d ? "#111111" : "#ffffff",
            boxShadow: d ? "0 8px 22px rgba(255,255,255,0.18)" : "0 8px 22px rgba(0,0,0,0.28)" }
        : { color: text, border: `1.5px solid ${line}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
      {icon}{children}
    </a>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-8 px-5 sm:px-6 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div className={`relative ${WRAP}`}>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            <div>
              <motion.p
                initial={{ y: 8 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase mb-3"
                style={{ color: ink }}
              >
                <span aria-hidden className="relative flex h-2 w-2">
                  {!reduce && (
                    <motion.span className="absolute inline-flex h-full w-full rounded-full" style={{ background: NOTR_CIZGI }}
                      animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: NOTR_CIZGI }} />
                </span>
                Destek · Arıza &amp; Garanti
              </motion.p>
              <motion.h1
                initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: text }}
              >
                Ürününüzle ilgili bir sorun mu var?
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }}
                className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${NOTR_CIZGI} 0%, transparent 100%)` }}
              />
              <motion.p
                initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.45, delay: 0.22 }}
                className="text-base sm:text-lg leading-relaxed max-w-2xl mb-6" style={{ color: muted }}
              >
                Şarj cihazınız çalışmıyor, beklediğiniz hızda şarj etmiyor ya da garanti kapsamında bir talebiniz mi var?
                Aşağıdaki adımlar çoğu sorunu birkaç dakikada çözer; çözülmezse arıza kaydınızı nasıl açacağınızı adım adım anlattık.
              </motion.p>
              <motion.div
                initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}
                className="flex flex-wrap gap-2.5"
              >
                <CTA href="#hizli-kontrol" icon={<RiToolsLine aria-hidden />} primary>Hızlı Kontrol Adımları</CTA>
                <CTA href="#ariza-kaydi" icon={<RiFileList3Line aria-hidden />}>Arıza Kaydı Aç</CTA>
              </motion.div>
            </div>

            {/* Sağ: hızlı iletişim kartı — kullanıcı acildeyse hemen kanal bulsun */}
            <motion.aside
              initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-2xl p-5 sm:p-6 w-full"
              style={{ background: card, border: `1px solid ${line}`, boxShadow: d ? "0 16px 44px rgba(0,0,0,0.35)" : "0 14px 40px rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <RiCustomerService2Line style={{ color: ink, fontSize: 18 }} aria-hidden />
                <h2 className="text-base font-bold" style={{ color: text }}>Doğrudan destek</h2>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: faint }}>
                Satış sonrası süreç yetkili bayiniz üzerinden yürür. Bayinize ulaşamıyorsanız bu kanallardan bize yazın.
              </p>
              <div className="flex flex-col gap-2">
                <CTA href="/#dealer" icon={<RiMapPinLine aria-hidden />} primary>Size En Yakın Bayi</CTA>
                <CTA href={WA_HREF} icon={<RiWhatsappLine aria-hidden />}>WhatsApp ile yazın</CTA>
                <CTA href={PHONE_HREF} icon={<RiPhoneLine aria-hidden />}>{PHONE}</CTA>
                <CTA href={MAIL_HREF} icon={<RiMailLine aria-hidden />}>E-posta gönderin</CTA>
              </div>
              <p className="text-xs leading-relaxed mt-4 pt-3" style={{ color: faint, borderTop: `1px solid ${line}` }}>
                Hafta içi 08:30 – 18:00 arasında ulaşabilirsiniz.
              </p>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ── Hızlı kontrol (ızgara, adımlar DAİMA görünür) ── */}
      <section id="hizli-kontrol" className={SECTION} style={{ scrollMarginTop: 96 }}>
        <div className={WRAP}>
          <Baslik icon={<RiToolsLine />} alt="Şarj sorunlarının çoğu cihaz arızası değildir — tesisat, araç ayarı veya bağlantı kaynaklıdır. Belirtinizi bulun, adımları sırayla deneyin.">
            Önce bunları deneyin
          </Baslik>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {HIZLI_KONTROL.map((k, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT}
                transition={{ duration: 0.42, delay: 0.05 + (i % 3) * 0.06 }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="rounded-2xl p-5 flex flex-col"
                style={{ background: card, border: `1px solid ${line}` }}
              >
                <span className="inline-flex items-center justify-center rounded-xl mb-3 flex-shrink-0"
                  style={{ width: 36, height: 36, background: NOTR_DOLGU, color: ink, fontSize: 18 }} aria-hidden>{k.icon}</span>
                <h3 className="text-sm font-bold leading-snug mb-1" style={{ color: text }}>{k.baslik}</h3>
                <p className="text-xs mb-3" style={{ color: faint }}>{k.belirti}</p>
                {/* ⚠️ `mt-auto` KULLANMA: ızgarada kartlar eşit yükseklikte esner, adım
                    sayısı az olan kartta liste dibe itilip ortada kocaman boşluk bırakır. */}
                <ol className="list-decimal pl-4 flex flex-col gap-1.5">
                  {k.adimlar.map((a, j) => (
                    <li key={j} className="text-[13px] leading-relaxed" style={{ color: muted }}>{a}</li>
                  ))}
                </ol>
              </motion.article>
            ))}
          </div>

          {/* Güvenlik uyarısı — tam genişlik bant */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.45 }}
            className="mt-4 rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ background: `${AMBER}14`, border: `1px solid ${AMBER}40` }}
          >
            <RiAlarmWarningLine style={{ color: inkAmber, fontSize: 20, flexShrink: 0, marginTop: 1 }} aria-hidden />
            <p className="text-sm leading-relaxed max-w-prose" style={{ color: muted }}>
              <strong style={{ color: text }}>Elektrik güvenliği:</strong> Elektrik panosu, sigorta veya kablolama ile ilgili
              hiçbir işlemi kendiniz yapmayın. Kaçak akım rölesi tekrar tekrar atıyorsa cihazı kullanmayı bırakın ve
              yetkili bir elektrikçiye başvurun.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Arıza kaydı: 3 adım + süreç ── */}
      <section id="ariza-kaydi" className={SECTION} style={{ scrollMarginTop: 96 }}>
        <div className={WRAP}>
          <Baslik icon={<RiFileList3Line />} alt="Hızlı kontroller sorunu çözmediyse kaydınızı şu sırayla açın.">
            Arıza kaydı nasıl açılır?
          </Baslik>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {ADIMLAR.map((a, i) => (
              <Kart key={a.n} delay={0.05 + i * 0.07}>
                <span className="flex items-center justify-center rounded-xl text-base font-black mb-3"
                  style={{ width: 34, height: 34, background: NOTR_DOLGU, color: ink }}>{a.n}</span>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: text }}>{a.h}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: muted }}>{a.p}</p>
              </Kart>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Gerekenler */}
            <Kart>
              <div className="flex items-center gap-2 mb-2">
                <RiBarcodeLine style={{ color: ink, fontSize: 18 }} aria-hidden />
                <h3 className="text-base font-bold" style={{ color: text }}>Başvururken hazır bulundurun</h3>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: muted }}>
                Aşağıdakileri iletirseniz kaydınız tek seferde açılır ve süreç hızlanır:
              </p>
              <ul className="flex flex-col gap-2 mb-4">
                {GEREKENLER.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: muted }}>
                    <RiCheckLine style={{ color: inkGreen, fontSize: 16, flexShrink: 0, marginTop: 2 }} aria-hidden />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl px-4 py-3" style={{ background: sub, border: `1px solid ${line}` }}>
                <p className="text-xs font-bold mb-1" style={{ color: text }}>Ürün kodunu nerede bulurum?</p>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>
                  Kod, cihazın üzerindeki ürün etiketinde ve kutusunda yazar; BEV- ile başlar. Etiket okunmuyorsa
                  faturanızdaki ürün adını iletmeniz de yeterlidir.
                </p>
              </div>
            </Kart>

            {/* Süreç */}
            <Kart delay={0.08}>
              <div className="flex items-center gap-2 mb-3">
                <RiTimerLine style={{ color: ink, fontSize: 18 }} aria-hidden />
                <h3 className="text-base font-bold" style={{ color: text }}>Süreç nasıl işler?</h3>
              </div>
              <ol className="flex flex-col">
                {SUREC.map((s, i) => (
                  <li key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                    {i < SUREC.length - 1 && (
                      <span aria-hidden className="absolute left-[13px] top-7 bottom-0 w-px" style={{ background: line }} />
                    )}
                    <span className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0 relative z-10"
                      style={{ width: 27, height: 27, background: NOTR_DOLGU, color: ink }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold mb-0.5" style={{ color: text }}>{s.h}</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: muted }}>{s.p}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Kart>
          </div>
        </div>
      </section>

      {/* ── Garanti ── */}
      <section className={SECTION}>
        <div className={WRAP}>
          <Baslik icon={<RiShieldCheckLine />}>Garanti</Baslik>

          <Kart className="mb-4">
            <p className="text-sm leading-relaxed max-w-prose" style={{ color: muted }}>
              Bemis E-V Charge ürünleri <strong style={{ color: text }}>2 yıl üretici garantisi</strong> ile sunulur.
              Garanti, üretim ve malzeme kaynaklı arızaları kapsar. Cihazın kurulumu, ürün kurulum şartnamesine uygun
              şekilde yetkili bir elektrikçi tarafından yapılmalıdır. Garanti talepleri, ürünü satın aldığınız yetkili
              bayi üzerinden yürütülür. Ürünlerimiz CE sertifikalıdır ve %94 Yerli Malı Belgesi&apos;ne sahiptir.
            </p>
          </Kart>

          <div className="grid md:grid-cols-2 gap-4">
            <Kart>
              <div className="flex items-center gap-2 mb-3">
                <RiCheckLine style={{ color: inkGreen, fontSize: 18 }} aria-hidden />
                <h3 className="text-base font-bold" style={{ color: text }}>Kapsam içinde</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {GARANTI_ICINDE.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: muted }}>
                    <RiCheckLine style={{ color: inkGreen, fontSize: 15, flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </Kart>
            <Kart delay={0.08}>
              <div className="flex items-center gap-2 mb-3">
                <RiCloseLine style={{ color: inkAmber, fontSize: 18 }} aria-hidden />
                <h3 className="text-base font-bold" style={{ color: text }}>Kapsam dışında</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {GARANTI_DISINDA.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: muted }}>
                    <RiCloseLine style={{ color: inkAmber, fontSize: 15, flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </Kart>
          </div>
        </div>
      </section>

      {/* ── İade & Kurulum ── */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div className="grid lg:grid-cols-2 gap-4">
            <Kart>
              <div className="flex items-center gap-2 mb-3">
                <RiExchangeLine style={{ color: ink, fontSize: 18 }} aria-hidden />
                <h2 className="text-base font-bold" style={{ color: text }}>İade ve değişim</h2>
              </div>
              <p className="text-sm leading-relaxed mb-2.5" style={{ color: muted }}>
                Ürünler yetkili bayi ağı üzerinden satılır. İade ve değişim talepleriniz, satın alma işlemini
                gerçekleştirdiğiniz bayi üzerinden, ilgili mevzuat ve bayinin satış koşulları çerçevesinde değerlendirilir.
              </p>
              <p className="text-sm leading-relaxed max-w-prose" style={{ color: muted }}>
                Ürün kutusunu ve faturanızı saklamanız, iade veya garanti sürecini kolaylaştırır.
                Hangi bayiden aldığınızı hatırlamıyorsanız bize yazın, kaydınızı birlikte bulalım.
              </p>
            </Kart>

            <Kart delay={0.08}>
              <div className="flex items-center gap-2 mb-3">
                <RiHomeGearLine style={{ color: ink, fontSize: 18 }} aria-hidden />
                <h2 className="text-base font-bold" style={{ color: text }}>Kurulum desteği</h2>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: muted }}>
                Cihaz fiyatına kurulum dahil değildir. Yetkili bayimiz keşif yaparak hat çekimi, kablolama ve sigorta
                panosu çalışmaları için ihtiyacınıza özel ayrı bir teklif verir; kurulum maliyeti mevcut altyapınıza göre
                keşifte netleşir.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <CTA href="/#dealer" icon={<RiMapPinLine aria-hidden />} primary>Size En Yakın Bayi</CTA>
                <Link href="/products"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ color: text, border: `1.5px solid ${line}`, background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)" }}>
                  Ürünleri İncele <RiArrowRightLine aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Kart>
          </div>
        </div>
      </section>

      {/* ── Kapanış: hâlâ çözülmediyse ── */}
      <section className="pt-3 pb-14 px-5 sm:px-6 lg:px-8">
        <div className={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }}
            className="rounded-3xl px-6 sm:px-9 py-8 flex flex-col lg:flex-row lg:items-center gap-6 justify-between"
            style={{ background: card, border: `1px solid ${line}`, boxShadow: d ? "0 18px 50px rgba(0,0,0,0.35)" : "0 16px 44px rgba(0,0,0,0.07)" }}
          >
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: text }}>Sorun hâlâ çözülmediyse</h2>
              <p className="text-sm leading-relaxed max-w-prose" style={{ color: muted }}>
                Ürün kodunuz ve kısa bir arıza tarifiyle bize ulaşın; kaydınızı açıp sizi doğru bayiye veya
                teknik ekibimize yönlendirelim.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 flex-shrink-0">
              <CTA href={WA_HREF} icon={<RiWhatsappLine aria-hidden />} primary>WhatsApp</CTA>
              <CTA href={PHONE_HREF} icon={<RiPhoneLine aria-hidden />}>{PHONE}</CTA>
              <CTA href={MAIL_HREF} icon={<RiMailLine aria-hidden />}>E-posta</CTA>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ContactBar />
    </div>
  );
}
