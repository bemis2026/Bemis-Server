"use client";

/**
 * Arapça giriş sayfası (/ar) — Körfez / Orta Doğu odaklı üretici + ihracat sayfası.
 *
 * ⚠️ İÇERİK KURALLARI (bu dosyaya metin eklerken uy):
 *  - Yabancı dilde "Türkiye'nin / yerli" milliyetçi çerçeve YOK → küresel üretici + 80+ ülke.
 *    Olgular (1994, Bursa, 16.000 m²) nötr biçimde kalabilir.
 *  - UYDURMA TİCARİ ŞART YOK: fiyat, asgari sipariş, teslim süresi, bölge münhasırlığı YAZILMAZ.
 *  - Rakip marka adı YOK (build zinciri `check:brands` ile durdurur).
 *  - Yalnız sitede zaten yazılı olgular: CE, IP65/IP66, Type 2 / IEC 62196, CCS2, OCPP,
 *    AC 3,7–22 kW ayarlanabilir, DC 40–200 kW, 2 yıl üretici garantisi.
 *
 * ⚠️ RTL: sayfa dir="rtl" altında çalışır (kök yerleşimdeki DIL_KOLU_SCRIPT + LanguageProvider).
 *    Bu yüzden yön BAĞIMLI Tailwind sınıfı (text-left, ml-*, pl-*) KULLANILMAZ —
 *    mantıksal karşılıkları (text-start, ms-*, ps-*) veya yönsüz (gap, justify-*) kullanılır.
 *    "İleri" oku RTL'de SOLA bakar → RiArrowLeftLine.
 */

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiArrowLeftLine, RiGlobalLine, RiBuilding2Line, RiStackLine,
  RiTruckLine, RiShieldCheckLine, RiWhatsappLine, RiMailLine, RiPhoneLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import Footer from "../components/Footer";
import { AR_SSS } from "./arIcerik";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

// Dış ticaret hattı (content.contactExport) — yurt içi hattı DEĞİL.
const TRADE_EMAIL = "trade@bemis.com.tr";
const TRADE_PHONE = "+90 542 773 72 94";
const TRADE_WA = "905427737294";

const TRUST = [
  "مصنّع منذ 1994",
  "CE · IP65 / IP66",
  "Type 2 · Mode 3 (IEC 62196)",
  "متوافق مع OCPP",
  "تصدير إلى أكثر من 80 دولة",
  "OEM / ODM / علامة خاصة",
];

const WHY = [
  {
    icon: RiBuilding2Line,
    t: "مصنع حقيقي، وليس شركة تجارية",
    d: "الإنتاج يتم في منشأتنا الخاصة بمساحة 16.000 م² في بورصة، ضمن شركة Bemis Teknik Elektrik A.Ş. المؤسَّسة عام 1994. تشترون من المصنّع مباشرة.",
  },
  {
    icon: RiGlobalLine,
    t: "معايير أوروبية وموقع قريب",
    d: "موصّل Type 2 / Mode 3 وفق IEC 62196، شهادة CE، ودرجة حماية IP65/IP66. موقع الإنتاج قريب جغرافياً من الخليج وأوروبا معاً.",
  },
  {
    icon: RiStackLine,
    t: "OEM / ODM وعلامة خاصة",
    d: "علامتكم التجارية وإنتاجنا: تخصيص العلامة والتغليف والتكوين الفني للموزّعين والمستوردين.",
  },
  {
    icon: RiTruckLine,
    t: "مجموعة كاملة من مورّد واحد",
    d: "محطات جدارية AC، شواحن متنقلة، كابلات Type 2، محطات شحن سريع DC، محوّلات V2L/C2L ومكوّنات محطات الشحن — من مصدر واحد.",
  },
];



type Kategori = { id: string; ad: string; ozet: string };

export default function ArLandingClient({ kategoriler }: { kategoriler: Kategori[] }) {
  const { theme } = useTheme();
  const d = theme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const startedAtRef = useRef(Date.now());
  const hpRef = useRef<HTMLInputElement>(null);

  const bg = d ? "linear-gradient(180deg,#0c0c0e 0%,#0f0f11 100%)" : "#f8f8fb";
  const surface = d ? "rgba(255,255,255,0.04)" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = d ? "#f0f0f4" : "#1a1a1a";
  const textMuted = d ? "rgba(240,240,244,0.62)" : "rgba(26,26,26,0.62)";
  const inputBg = d ? "rgba(255,255,255,0.05)" : "#ffffff";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const ulke = String(fd.get("country") ?? "");
    const not = String(fd.get("message") ?? "");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), company: fd.get("company"), email: fd.get("email"), phone: fd.get("phone"),
          topic: "export", message: `Country (AR page): ${ulke}\n\n${not}`,
          // Spam kapıları — /api/contact bunları e-postadan ÖNCE kontrol eder.
          website: hpRef.current?.value ?? "", elapsed: Date.now() - startedAtRef.current,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? `تعذّر الإرسال. يُرجى المراسلة على ${TRADE_EMAIL}`);
      } else setSubmitted(true);
    } catch {
      setErr(`خطأ في الشبكة. يُرجى المراسلة على ${TRADE_EMAIL}`);
    } finally { setSending(false); }
  };

  const cardStyle = { background: surface, border: `1px solid ${border}` };
  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none";
  const inputStyle = { background: inputBg, border: `1px solid ${border}`, color: textPrimary };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3"
               style={{ color: d ? "#93C5FD" : BLUE }}>
              <RiGlobalLine size={14} /> Bemis E-V Charge
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
              مصنّع محطات شحن السيارات الكهربائية
            </h1>
            <p className="text-sm sm:text-base max-w-3xl leading-relaxed mb-6" style={{ color: textMuted }}>
              Bemis E-V Charge علامة تجارية لحلول شحن السيارات الكهربائية، تُنتَج داخل شركة{" "}
              Bemis Teknik Elektrik A.Ş. المؤسَّسة عام 1994. نصنّع في منشأتنا الخاصة بمساحة 16.000 م²
              في بورصة ونصدّر إلى أكثر من 80 دولة. المنتجات تأتي من المصنّع مباشرة: شهادة CE، درجة
              حماية IP65/IP66، وتوافق مع OCPP.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {TRUST.map((t) => (
                <span key={t} className="rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{ background: surface, border: `1px solid ${border}`, color: textMuted }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/ar/products"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: BLUE, color: "#fff" }}>
                تصفّح المنتجات <RiArrowLeftLine size={16} />
              </Link>
              <a href="#تواصل"
                 className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                 style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                طلب عرض سعر
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Neden Bemis ────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>لماذا Bemis E-V Charge؟</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <motion.div key={w.t} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                          className="rounded-2xl p-5" style={cardStyle}>
                <w.icon size={22} style={{ color: d ? "#93C5FD" : BLUE }} />
                <h3 className="text-base font-semibold mt-3 mb-1.5" style={{ color: textPrimary }}>{w.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{w.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kategoriler ────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>فئات المنتجات</h2>
          <p className="text-sm mb-6" style={{ color: textMuted }}>
            أكثر من 150 منتجاً في 8 فئات — جميعها بصفحات ووصف فني باللغة العربية.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kategoriler.map((k, i) => (
              <motion.div key={k.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}>
                <Link href={`/ar/products/${k.id}`}
                      className="block h-full rounded-2xl p-5 cursor-pointer transition-transform hover:-translate-y-1"
                      style={cardStyle}>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: textPrimary }}>{k.ad}</h3>
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: textMuted }}>{k.ozet}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3"
                        style={{ color: d ? "#93C5FD" : BLUE }}>
                    عرض التفاصيل <RiArrowLeftLine size={13} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS ────────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>الأسئلة الشائعة</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {AR_SSS.map((f, i) => (
              <motion.div key={f.q} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                          className="rounded-2xl p-5" style={cardStyle}>
                <h3 className="text-base font-semibold mb-2" style={{ color: textPrimary }}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── İletişim + teklif formu ────────────────────────────────────── */}
      <section id="تواصل" className="py-12 pb-20 scroll-mt-24">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Doğrudan kanallar */}
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>قسم التصدير</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
                للتصدير والبيع بالجملة وطلبات OEM / العلامة الخاصة.
              </p>
              <div className="flex flex-col gap-3">
                <a href={`mailto:${TRADE_EMAIL}`} className="inline-flex items-center gap-2.5 text-sm font-medium cursor-pointer"
                   style={{ color: textPrimary }}>
                  <RiMailLine size={18} style={{ color: d ? "#93C5FD" : BLUE }} /> {TRADE_EMAIL}
                </a>
                <a href={`tel:${TRADE_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 text-sm font-medium cursor-pointer"
                   style={{ color: textPrimary }} dir="ltr">
                  <RiPhoneLine size={18} style={{ color: d ? "#93C5FD" : BLUE }} /> {TRADE_PHONE}
                </a>
                <a href={`https://wa.me/${TRADE_WA}`} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2.5 text-sm font-medium cursor-pointer" style={{ color: textPrimary }}>
                  <RiWhatsappLine size={18} style={{ color: "#25D366" }} /> WhatsApp
                </a>
              </div>
              <p className="inline-flex items-center gap-2 text-xs mt-6" style={{ color: textMuted }}>
                <RiShieldCheckLine size={14} /> ضمان المصنّع سنتان · CE · IP65 / IP66
              </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-base font-semibold mb-4" style={{ color: textPrimary }}>اطلبوا عرض سعر</h3>
              {submitted ? (
                <p className="text-sm leading-relaxed" style={{ color: textPrimary }}>
                  شكراً لكم. وصلنا طلبكم وسيتواصل معكم فريق التصدير.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
                  <input name="name" required placeholder="الاسم" className={inputCls} style={inputStyle} />
                  <input name="company" placeholder="الشركة" className={inputCls} style={inputStyle} />
                  <input name="email" type="email" required placeholder="البريد الإلكتروني" className={inputCls} style={inputStyle} dir="ltr" />
                  <input name="phone" placeholder="الهاتف" className={inputCls} style={inputStyle} dir="ltr" />
                  <input name="country" placeholder="الدولة" className={`${inputCls} sm:col-span-2`} style={inputStyle} />
                  <textarea name="message" rows={4} placeholder="المنتجات والكميات التي تهمّكم"
                            className={`${inputCls} sm:col-span-2`} style={inputStyle} />
                  {/* Bal küpü — görünmez, dolduran = bot (bkz. /api/contact) */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
                    <label>Website (leave empty)
                      <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                    </label>
                  </div>
                  {err && <p className="sm:col-span-2 text-sm" style={{ color: "#ef4444" }}>{err}</p>}
                  <button type="submit" disabled={sending}
                          className="sm:col-span-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                          style={{ background: BLUE, color: "#fff" }}>
                    {sending ? "جارٍ الإرسال…" : "إرسال الطلب"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
