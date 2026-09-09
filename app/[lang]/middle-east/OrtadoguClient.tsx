"use client";

/**
 * /ar/middle-east — Körfez (KKİK) + Mısır iniş sayfası.
 *
 * ⚠️ İÇERİK KURALLARI + 50/60 Hz teyidi: bkz. `ortadoguIcerik.ts` başlığı.
 * ⚠️ RTL: sayfa dir="rtl" altında çalışır → yön BAĞIMLI Tailwind sınıfı
 *    (text-left, ml-*, pl-*) KULLANILMAZ; mantıksal karşılıkları (text-start, ms-*, ps-*)
 *    veya yönsüz (gap, justify-*). "İleri" oku RTL'de SOLA bakar → RiArrowLeftLine.
 * ⚠️ Tasarım dili ArLandingClient ile BİREBİR aynı tutuldu (aynı yüzey/kenarlık/
 *    tipografi token'ları) — iki Arapça sayfa arasında görünüm sıçraması olmasın.
 */

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiArrowLeftLine, RiGlobalLine, RiBuilding2Line, RiFlashlightLine,
  RiStackLine, RiShieldCheckLine, RiWhatsappLine, RiMailLine, RiPhoneLine, RiHandCoinLine,
} from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import SearchOverlay from "../../components/SearchOverlay";
import Footer from "../../components/Footer";
import { ORTADOGU_SSS, PAZARLAR, COZUMLER } from "./ortadoguIcerik";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

// Dış ticaret hattı (content.contactExport) — yurt içi hattı DEĞİL.
const TRADE_EMAIL = "trade@bemis.com.tr";
const TRADE_PHONE = "+90 542 773 72 94";
const TRADE_WA = "905427737294";

const TRUST = [
  "مصنّع منذ 1994",
  "50 / 60 هرتز",
  "CE · IP65 / IP66",
  "Type 2 · CCS2",
  "متوافق مع OCPP",
  "تصدير إلى أكثر من 80 دولة",
];

const NEDEN = [
  {
    icon: RiFlashlightLine,
    t: "50 / 60 هرتز — الخليج كلّه",
    d: "تعمل أجهزتنا على ترددَي 50 و 60 هرتز، فلا حاجة إلى طراز منفصل للسعودية (60 هرتز) وآخر لبقية دول المنطقة (50 هرتز). مخزون واحد يغطّي السوق كاملاً.",
  },
  {
    icon: RiBuilding2Line,
    t: "مصنع حقيقي، وليس شركة تجارية",
    d: "الإنتاج في منشأتنا الخاصة بمساحة 16.000 م² في بورصة، ضمن شركة Bemis Teknik Elektrik A.Ş. المؤسَّسة عام 1994. تشترون من المصنّع مباشرة.",
  },
  {
    icon: RiStackLine,
    t: "OEM / ODM وعلامة خاصة",
    d: "علامتكم التجارية وإنتاجنا: تخصيص العلامة والتغليف والتكوين الفني للموزّعين والمستوردين في المنطقة.",
  },
  {
    icon: RiGlobalLine,
    t: "قريبون جغرافياً",
    d: "موقع الإنتاج قريب من الخليج ومصر معاً، ما يقصّر مسار الشحن مقارنةً بالتوريد من الشرق الأقصى. معايير أوروبية: CE و IEC 62196.",
  },
];

export default function OrtadoguClient() {
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
    const rol = String(fd.get("role") ?? "");
    const not = String(fd.get("message") ?? "");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), company: fd.get("company"), email: fd.get("email"), phone: fd.get("phone"),
          topic: "export",
          message: `Country (AR Middle East page): ${ulke}\nInterest: ${rol}\n\n${not}`,
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
              <RiGlobalLine size={14} /> الخليج والشرق الأوسط
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
              مورّد معدات شحن السيارات الكهربائية للخليج ومصر
            </h1>
            <p className="text-sm sm:text-base max-w-3xl leading-relaxed mb-6" style={{ color: textMuted }}>
              Bemis E-V Charge مصنّع لمعدات شحن السيارات الكهربائية منذ 1994. نورّد الموزّعين
              والمستوردين والمقاولين في الإمارات والسعودية وقطر والكويت والبحرين وعُمان ومصر:
              محطات جدارية AC قابلة للضبط من 3,7 إلى 22 kW، ومحطات شحن سريع DC من 40 إلى 200 kW
              بموصّل CCS2، وكابلات Type 2، ومحوّلات V2L/C2L. الأجهزة تعمل على 50/60 هرتز، وحاصلة
              على شهادة CE بدرجة حماية IP65/IP66.
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
              <a href="#talep"
                 className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                 style={{ background: BLUE, color: "#fff" }}>
                طلب عرض سعر <RiArrowLeftLine size={16} />
              </a>
              <Link href="/ar/products"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: surface, border: `1px solid ${border}`, color: textPrimary }}>
                تصفّح المنتجات
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pazarlar ───────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>الأسواق التي نورّدها في المنطقة</h2>
          <p className="text-sm mb-6 max-w-3xl leading-relaxed" style={{ color: textMuted }}>
            الشحن يتم من المصنع في بورصة. نستقبل طلبات الموزّعين والمستوردين والمقاولين من دول
            الخليج ومصر، ونقيّم كل بلد على حدة.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAZARLAR.map((p, i) => (
              <motion.div key={p.kod} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                          className="rounded-2xl p-5" style={cardStyle}>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: textPrimary }}>{p.ad}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{p.not}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Neden biz ──────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>لماذا Bemis E-V Charge للمنطقة؟</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {NEDEN.map((w, i) => (
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

      {/* ── Proje tipine göre çözümler ─────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>الحلول بحسب نوع المشروع</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {COZUMLER.map((c, i) => (
              <motion.div key={c.t} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}>
                <Link href={c.href} className="block h-full rounded-2xl p-5 cursor-pointer transition-transform hover:-translate-y-1"
                      style={cardStyle}>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: textPrimary }}>{c.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{c.d}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3"
                        style={{ color: d ? "#93C5FD" : BLUE }}>
                    {c.cta} <RiArrowLeftLine size={13} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distribütör daveti ─────────────────────────────────────────────
          ⚠️ Ticari şart YAZILMAZ (iskonto / asgari sipariş / bölge münhasırlığı /
          süre taahhüdü). Yalnız davet + değerlendirme kriterleri. */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3"
               style={{ color: d ? "#93C5FD" : BLUE }}>
              <RiHandCoinLine size={14} /> شراكة التوزيع
            </p>
            <h2 className="text-2xl font-bold mb-3" style={{ color: textPrimary }}>كونوا موزّعنا في بلدكم</h2>
            <p className="text-sm leading-relaxed max-w-3xl mb-5" style={{ color: textMuted }}>
              نبحث عن شركاء توزيع في دول الخليج ومصر. تُقيَّم الطلبات لكل بلد على حدة؛ راسلونا
              مع ذكر البلد ومجال النشاط والبنية الحالية وحجم الأعمال المتوقّع، وسيتواصل معكم فريق
              التصدير لمناقشة التفاصيل.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: textPrimary }}>ما الذي ننظر إليه</h3>
                <ul className="text-sm leading-relaxed space-y-1.5" style={{ color: textMuted }}>
                  <li>• شركة قائمة في قطاع الكهرباء أو السيارات أو الطاقة</li>
                  <li>• نقطة بيع أو مستودع فعلي</li>
                  <li>• فريق فني قادر على التركيب أو خدمة ما بعد البيع</li>
                  <li>• القدرة على تغطية السوق المحلي</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: textPrimary }}>ما الذي نوفّره</h3>
                <ul className="text-sm leading-relaxed space-y-1.5" style={{ color: textMuted }}>
                  <li>• مجموعة كاملة من المصنّع مباشرة (أكثر من 150 منتجاً)</li>
                  <li>• إنتاج OEM / ODM وعلامة خاصة</li>
                  <li>• وثائق فنية وصفحات منتجات باللغة العربية</li>
                  <li>• ضمان المصنّع سنتان · CE · IP65 / IP66</li>
                </ul>
              </div>
            </div>
            <a href="#talep"
               className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98] mt-6"
               style={{ background: BLUE, color: "#fff" }}>
              تقديم طلب توزيع <RiArrowLeftLine size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── SSS ────────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>الأسئلة الشائعة</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {ORTADOGU_SSS.map((f, i) => (
              <motion.div key={f.q} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={VIEWPORT} transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                          className="rounded-2xl p-5" style={cardStyle}>
                <h3 className="text-base font-semibold mb-2" style={{ color: textPrimary }}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm mt-6" style={{ color: textMuted }}>
            مزيد من المعلومات:{" "}
            <Link href="/ar" className="font-semibold cursor-pointer" style={{ color: d ? "#93C5FD" : BLUE }}>عن المصنّع</Link>
            {" · "}
            <Link href="/ar/blog" className="font-semibold cursor-pointer" style={{ color: d ? "#93C5FD" : BLUE }}>الأدلة التقنية</Link>
            {" · "}
            <Link href="/ar/sozluk" className="font-semibold cursor-pointer" style={{ color: d ? "#93C5FD" : BLUE }}>مسرد المصطلحات</Link>
          </p>
        </div>
      </section>

      {/* ── İletişim + teklif formu ────────────────────────────────────── */}
      <section id="talep" className="py-12 pb-20 scroll-mt-24">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>قسم التصدير</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>
                للتصدير والبيع بالجملة وطلبات التوزيع و OEM / العلامة الخاصة في الخليج ومصر.
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
                <RiShieldCheckLine size={14} /> ضمان المصنّع سنتان · CE · IP65 / IP66 · 50/60 هرتز
              </p>
            </div>

            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-base font-semibold mb-4" style={{ color: textPrimary }}>اطلبوا عرض سعر أو شراكة توزيع</h3>
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
                  <select name="country" required className={inputCls} style={inputStyle} defaultValue="">
                    <option value="" disabled>الدولة</option>
                    {PAZARLAR.map((p) => <option key={p.kod} value={p.ad}>{p.ad}</option>)}
                    <option value="أخرى">أخرى</option>
                  </select>
                  <select name="role" required className={inputCls} style={inputStyle} defaultValue="">
                    <option value="" disabled>نوع الطلب</option>
                    <option value="distributor">شراكة توزيع</option>
                    <option value="project">مشروع / شراء بالجملة</option>
                    <option value="oem">OEM / علامة خاصة</option>
                  </select>
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
