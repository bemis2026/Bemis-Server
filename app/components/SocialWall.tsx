"use client";

// Instagram paylaşım duvarı — müşterilerin Bemis E-V Charge gönderileri.
//
// ⚠️ TASARIM KARARI (2026-09-08, kullanıcı seçimi "yalnız Instagram gömme"):
// Video DOSYASI barındırmıyoruz. Her kart bir Instagram gönderisine/reel'ine
// bakar; gömme (embed) yalnız ZİYARETÇİ TIKLAYINCA yüklenir.
//
// 🔴 NEDEN CEPHE (facade) DESENİ — doğrudan iframe basmak yerine:
// Instagram gömmesi kart başına ~0,5 MB indiriyor ve Meta çerezi kuruyor.
// 8 kartlık bir bantta bu 4 MB + 8 üçüncü-taraf çerçeve demek. Sitede
// YouTube tarafında aynı ders alınmıştı (bkz. useBackgroundVideo.ts —
// mobilde 2,2 MB'lık sessiz yükleme). Bu yüzden kart = kapak görseli;
// iframe yalnız tıklamada, tek bir örnek olarak mount edilir.
//
// 🔴 ÇEREZ KAPISI: Instagram gömmesi üçüncü-taraf çerez kurar → KVKK gereği
// pazarlama onayı yoksa BASILMAZ. Onay yoksa kart Instagram'da açılır
// (yeni sekme) — içerik erişilebilir kalır, çerez kurulmaz.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { RiInstagramLine, RiPlayFill, RiCloseLine, RiExternalLinkLine } from "react-icons/ri";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useContent, type SocialWallPost } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { pickText } from "../lib/ui";
import { useKaydirmaDurumu, yumusakKaydir } from "./YatayKaydirma";
import Image from "./Img";
import E from "./E";

const CONSENT_KEY = "bemis-cookie-consent";

/** Instagram adresinden gönderi kodunu ve türünü çıkarır.
 *  Kabul edilen biçimler: /p/<kod>/ · /reel/<kod>/ · /reels/<kod>/ · /tv/<kod>/
 *  ⚠️ HESAP ADI ÖNEKLİ biçim de kabul edilir: /bemis.evcharge/p/<kod>/ — Instagram
 *  web arayüzündeki "bağlantıyı kopyala" TAM BU biçimi verir; desteklenmezse
 *  operatörün yapıştırdığı adres sessizce kart üretmez.
 *  ⚠️ Kod çıkmazsa kart RENDER EDİLMEZ — bozuk gömme basmaktansa hiç basmamak iyi. */
export function instagramKodu(url: string): { kod: string; tur: string } | null {
  if (!url) return null;
  const m = /instagram\.com\/(?:[A-Za-z0-9._]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i.exec(url);
  if (!m) return null;
  // Gömme yolunda "reels" çalışmaz, "reel" çalışır.
  const tur = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
  return { kod: m[2], tur };
}

/** Gömme adresi. `captioned` açıklamayı da gösterir (metin = alıntılanabilir içerik). */
function gommeAdresi(p: { kod: string; tur: string }) {
  return `https://www.instagram.com/${p.tur}/${p.kod}/embed/captioned/`;
}

/** Kartın kapak görseli.
 *  Operatör admin'den kapak yüklediyse O kullanılır; yüklemediyse gönderinin
 *  KENDİ Instagram kapağı aynı-köken vekilden gelir (app/api/social-cover).
 *  ⚠️ Instagram'ın ham CDN adresi imzalı + süreli olduğu için veriye YAZILMAZ;
 *  vekil her seferinde taze adresi çözüp görseli akıtır ve CDN'de önbelleklenir. */
export function kapakAdresi(post: SocialWallPost): string | null {
  const elle = post.cover?.trim();
  if (elle) return elle;
  return instagramKodu(post.url) ? `/api/social-cover?u=${encodeURIComponent(post.url)}` : null;
}

function pazarlamaOnayi(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

// ── Işık kutusu (tek örnek, portal ile body'ye) ──────────────────────────────

function IsikKutusu({ post, onClose }: { post: SocialWallPost; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = (tr: string, en: string) => pickText(lang, tr, en);
  const [monte, setMonte] = useState(false);
  const [onay, setOnay] = useState(false);
  const ig = instagramKodu(post.url);

  useEffect(() => {
    setMonte(true);
    setOnay(pazarlamaOnayi());
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    const eskiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = eskiOverflow;
    };
  }, [onClose]);

  if (!monte || !ig) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("Instagram gönderisi", "Instagram post")}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("Kapat", "Close")}
        className="absolute top-4 right-4 w-11 h-11 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff" }}
      >
        <RiCloseLine size={22} />
      </button>

      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(420px, 100%)" }}>
        {onay ? (
          // Gömme — YALNIZ burada, yalnız onay varken.
          <iframe
            src={gommeAdresi(ig)}
            title={post.caption?.trim() || t("Instagram gönderisi", "Instagram post")}
            allowTransparency
            allow="encrypted-media"
            loading="lazy"
            style={{ width: "100%", height: "min(78vh, 720px)", border: 0, borderRadius: 16, background: "#fff" }}
          />
        ) : (
          // Onay yok → çerez kurma; Instagram'a yönlendir.
          <div className="rounded-2xl p-6 text-center" style={{ background: "#141418", border: "1px solid rgba(255,255,255,0.12)" }}>
            <RiInstagramLine size={34} style={{ color: "#E1306C", margin: "0 auto 12px" }} />
            <p className="text-sm mb-1 font-bold" style={{ color: "#fff" }}>
              {t("Bu içerik Instagram'da barındırılıyor", "This content is hosted on Instagram")}
            </p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.62)" }}>
              {t(
                "Gönderiyi burada göstermek Instagram çerezlerini çalıştırır. Çerez tercihinizde pazarlama çerezlerine izin vermediğiniz için gömmüyoruz.",
                "Showing the post here would run Instagram cookies. Since you did not allow marketing cookies, we do not embed it."
              )}
            </p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: "#E1306C", color: "#fff" }}
            >
              <RiExternalLinkLine size={16} />
              {t("Instagram'da aç", "Open on Instagram")}
            </a>
          </div>
        )}

        {post.caption?.trim() && (
          <p className="text-sm text-center mt-3" style={{ color: "rgba(255,255,255,0.72)" }}>{post.caption}</p>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Tek kart ─────────────────────────────────────────────────────────────────

function Kart({ post, onOpen, d, surface, border, textPrimary, textMuted }: {
  post: SocialWallPost; onOpen: () => void; d: boolean;
  surface: string; border: string; textPrimary: string; textMuted: string;
}) {
  const { lang } = useLanguage();
  const t = (tr: string, en: string) => pickText(lang, tr, en);
  // Vekil kapak alınamazsa (Instagram kesintisi / gönderi kaldırılmış) yer tutucuya düş.
  const [kapakHatasi, setKapakHatasi] = useState(false);
  const kapak = kapakHatasi ? null : kapakAdresi(post);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative rounded-2xl overflow-hidden flex-shrink-0 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
      style={{
        width: "clamp(190px, 22vw, 250px)",
        background: surface,
        border: `1px solid ${border}`,
        boxShadow: d ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
      }}
      aria-label={`${post.caption?.trim() || t("Müşteri paylaşımı", "Customer post")} — ${t("Instagram'da izle", "Watch on Instagram")}`}
    >
      {/* 9:16 — Instagram reel oranı. Kapak yoksa markalı yer tutucu. */}
      <div className="relative w-full" style={{ aspectRatio: "9 / 16", background: d ? "#0f0f13" : "#f1f1f4" }}>
        {kapak ? (
          <Image
            src={kapak}
            alt={post.caption?.trim() || "Bemis E-V Charge kullanıcı paylaşımı"}
            width={500}
            height={889}
            className="w-full h-full object-cover"
            style={{ objectPosition: post.imagePos || "center" }}
            onError={() => setKapakHatasi(true)}
            unoptimized={kapak.startsWith("/api/social-cover")}
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <RiInstagramLine size={38} style={{ color: d ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)" }} />
          </div>
        )}

        {/* Oynat rozeti */}
        <span
          className="absolute inset-0 grid place-items-center transition-opacity"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)" }}
        >
          <span
            className="grid place-items-center rounded-full transition-transform group-hover:scale-110"
            style={{ width: 46, height: 46, background: "rgba(255,255,255,0.92)", color: "#111" }}
          >
            <RiPlayFill size={22} style={{ marginLeft: 2 }} />
          </span>
        </span>

        {/* Instagram rozeti */}
        <span
          className="absolute top-2.5 right-2.5 grid place-items-center rounded-lg"
          style={{ width: 28, height: 28, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        >
          <RiInstagramLine size={15} style={{ color: "#fff" }} />
        </span>
      </div>

      {post.caption?.trim() && (
        <span className="block px-3 py-2.5">
          <span className="block text-sm font-semibold leading-snug line-clamp-2" style={{ color: textPrimary }}>
            {post.caption}
          </span>
          <span className="block text-sm mt-0.5" style={{ color: textMuted }}>
            {t("Instagram'da izle", "Watch on Instagram")}
          </span>
        </span>
      )}
    </button>
  );
}

// ── Ortak liste (ızgara veya bant) ───────────────────────────────────────────

function Liste({ items, bant }: { items: SocialWallPost[]; bant: boolean }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [acik, setAcik] = useState<SocialWallPost | null>(null);
  const surface = d ? "#1a1a1c" : "#ffffff";
  const border = d ? "#2a2a2a" : "#e5e5e5";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";

  // ⚠️ ÇOĞALTMA YOK: eski marquee deseni kesintisiz akış için listeyi 2× basıyordu →
  // az sayıda gönderiyle AYNI VİDEO ekranda iki kez görünüyordu (kullanıcı bildirdi,
  // 2026-09-09). Otomatik kayma yerine oklar + doğal kaydırma; her gönderi TEK kez.
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sol, sag, olc } = useKaydirmaDurumu(scrollRef);
  const animRef = useRef(0);
  const kaydir = (mesafe: number) => yumusakKaydir(scrollRef.current, mesafe, olc, animRef);
  const kapat = useCallback(() => setAcik(null), []);

  const kartlar = items.map((item, i) => (
    <Kart
      key={`${item.id}-${i}`}
      post={item}
      onOpen={() => setAcik(item)}
      d={d}
      surface={surface}
      border={border}
      textPrimary={textPrimary}
      textMuted={textMuted}
    />
  ));

  if (!bant) {
    return (
      <>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-center">{kartlar}</div>
        {acik && <IsikKutusu post={acik} onClose={kapat} />}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        type="button" onClick={() => kaydir(-320)} aria-label="Önceki paylaşımlar"
        className={`${sol ? "hidden sm:flex" : "hidden"} absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer`}
        style={{ background: d ? "rgba(20,20,24,0.88)" : "rgba(255,255,255,0.92)", border: `1px solid ${border}`, boxShadow: d ? "0 4px 16px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" }}
      >
        <HiChevronLeft size={20} style={{ color: textPrimary }} />
      </button>
      <button
        type="button" onClick={() => kaydir(320)} aria-label="Sonraki paylaşımlar"
        className={`${sag ? "hidden sm:flex" : "hidden"} absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer`}
        style={{ background: d ? "rgba(20,20,24,0.88)" : "rgba(255,255,255,0.92)", border: `1px solid ${border}`, boxShadow: d ? "0 4px 16px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" }}
      >
        <HiChevronRight size={20} style={{ color: textPrimary }} />
      </button>

      <div
        ref={scrollRef}
        tabIndex={0} role="region" aria-label="Müşteri paylaşımları — yatay kaydırılabilir liste"
        className="overflow-x-auto scrollbar-hide focus:outline-none"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="flex gap-4 px-4 sm:px-6 justify-center" style={{ minWidth: "max-content" }}>{kartlar}</div>
      </div>

      {acik && <IsikKutusu post={acik} onClose={kapat} />}
    </div>
  );
}

/** Geçerli (kodu çözülebilen) gönderiler. Bozuk adres kart üretmez.
 *  ⚠️ TEKİLLEŞTİRİR: aynı gönderi kodu birden çok kez eklendiyse (farklı yazımla —
 *  /p/, /reel/, hesap adı önekli, sondaki ?igsh parametresi) YALNIZ İLKİ gösterilir.
 *  Filtre burada olduğu için anasayfa bandı, /musteri-videolari ve ürün sayfası
 *  aynı kuralı paylaşır. */
export function gecerliPaylasimlar(items: SocialWallPost[] | undefined): SocialWallPost[] {
  const gorulen = new Set<string>();
  const cikti: SocialWallPost[] = [];
  for (const p of items ?? []) {
    const ig = p?.url ? instagramKodu(p.url) : null;
    if (!ig || gorulen.has(ig.kod)) continue;
    gorulen.add(ig.kod);
    cikti.push(p);
  }
  return cikti;
}

// ── Anasayfa bandı ───────────────────────────────────────────────────────────

export default function SocialWall() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const { socialWallSection: section } = useContent();
  const { lang } = useLanguage();
  const t = (tr: string, en: string) => pickText(lang, tr, en);
  const d = theme === "dark";

  // Operatör admin'den metin girmediyse 6 dilli yedek kullanılır.
  const etiket = section?.sectionLabel?.trim() || t("Sosyal Medya", "Social media");
  const baslik = section?.heading?.trim() || t("Kullanıcılarımızın Paylaşımları", "Posts from our users");
  const altBaslik = section?.subheading?.trim() || t(
    "Bemis E-V Charge kullanan sürücülerin ve bayilerimizin Instagram'da paylaştığı kurulum ve kullanım anları.",
    "Installation and everyday-use moments shared on Instagram by Bemis E-V Charge drivers and dealers."
  );

  const items = useMemo(() => gecerliPaylasimlar(section?.items), [section?.items]);
  // Operatör hiç paylaşım eklemediyse bölüm HİÇ görünmez (referans projelerdeki desen).
  if (items.length === 0) return null;

  const sectionBg = d
    ? "linear-gradient(140deg, #0d0d11 0%, #111116 60%, #0e0e12 100%)"
    : "linear-gradient(140deg, #f7f8fb 0%, #f3f4f8 60%, #f7f8fb 100%)";
  const textPrimary = d ? "#ffffff" : "#111111";
  const textMuted = d ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)";
  const ACCENT = "#E1306C";

  return (
    <section id="socialwall" style={{ background: sectionBg }} className="relative py-8 lg:py-12 overflow-hidden">
      <div ref={ref} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 px-4"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: ACCENT }}
          >
            <RiInstagramLine size={14} />
            <E field="socialWallSection.sectionLabel" tag="span">{etiket}</E>
          </span>
          <h2 className="text-2xl lg:text-3xl font-black" style={{ color: textPrimary }}>
            <E field="socialWallSection.heading">{baslik}</E>
          </h2>
          {altBaslik && (
            <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: textMuted }}>
              <E field="socialWallSection.subheading" tag="span">{altBaslik}</E>
            </p>
          )}
        </motion.div>

        <Liste items={items} bant />

        {/* Tam listeye köprü — bant yalnız son paylaşımları gösterir. */}
        <div className="flex justify-center mt-6">
          <a
            href="/musteri-videolari"
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-transform hover:translate-x-0.5 cursor-pointer"
            style={{ color: ACCENT }}
          >
            {t("Tüm paylaşımları gör", "See all posts")} →
          </a>
        </div>
      </div>
    </section>
  );
}

/** Sayfa / ürün sayfası için ızgara. Başlık dışarıdan verilir. */
export function SocialGrid({ items }: { items: SocialWallPost[] }) {
  const gecerli = useMemo(() => gecerliPaylasimlar(items), [items]);
  if (gecerli.length === 0) return null;
  return <Liste items={gecerli} bant={false} />;
}
