"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiArrowRightLine, RiShieldCheckLine, RiGlobalLine, RiBuilding2Line,
  RiStackLine, RiTruckLine,
} from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import SearchOverlay from "../components/SearchOverlay";
import Footer from "../components/Footer";

const BLUE = "#3B82F6";
const VIEWPORT = { once: true, margin: "-60px" } as const;

const TRUST = [
  "Manufacturer since 1994",
  "CE · IP65 / IP66",
  "Type 2 · Mode 3 (IEC 62196)",
  "OCPP-ready",
  "Export to 60+ countries",
  "OEM / ODM / Private Label",
];

const WHY = [
  { icon: RiBuilding2Line, t: "A real factory — not a trading company", d: "Produced in our own 16,000 m² facility in Bursa, Türkiye (Bemis Teknik Elektrik A.Ş., since 1994). You buy direct from the manufacturer." },
  { icon: RiGlobalLine, t: "EU standards, EU-adjacent location", d: "Type 2 / Mode 3 (IEC 62196), CE, IP65/IP66. Türkiye sits at Europe's doorstep — typically shorter lead times and simpler logistics to the EU than China." },
  { icon: RiStackLine, t: "OEM / ODM / private label", d: "Your brand, our production. Custom branding, packaging and configurations for distributors and importers." },
  { icon: RiTruckLine, t: "Full range from one supplier", d: "AC wallboxes, portable chargers, Type 2 cables, DC fast chargers, V2L/C2L adapters and charging equipment — one reliable source." },
];

const PRODUCTS = [
  { t: "AC Wallbox", d: "7.4–22 kW, Type 2, OCPP-ready.", href: "/products/wallbox" },
  { t: "Type 2 Charging Cables", d: "Mode 2 & Mode 3, 16A/32A, 1- & 3-phase.", href: "/products/cables" },
  { t: "Portable Chargers", d: "Plug-and-charge, adjustable current.", href: "/products/portable" },
  { t: "DC Fast Charging", d: "CCS2 units (e.g. 40 kW BEVDC).", href: "/products/dc-units" },
  { t: "V2L / C2L Adapters", d: "Vehicle-to-load power solutions.", href: "/products/v2l-c2l" },
  { t: "Charging Equipment", d: "Type 2 sockets, holsters, accessories.", href: "/products/charger-equipment" },
];

const FAQ = [
  { q: "Are you a manufacturer or a trader?", a: "A manufacturer. Bemis E-V Charge is the EV-charging brand of Bemis Teknik Elektrik A.Ş., producing in its own facility in Bursa, Türkiye since 1994." },
  { q: "Do you offer OEM / ODM / private label?", a: "Yes. We produce under your brand with custom branding, packaging and configurations for distributors, importers and EV-charging operators." },
  { q: "Which standards and certifications do you have?", a: "Our products are CE marked, rated IP65/IP66, built to Type 2 / Mode 3 (IEC 62196) and are OCPP-ready. Documentation is provided for import." },
  { q: "Do you ship to Europe and my country?", a: "We export to 60+ countries. Send us your country in the quote form and we will confirm shipping, lead time and terms." },
  { q: "What is the minimum order quantity?", a: "It depends on the product and configuration. Contact us with your requirement and we will share wholesale / bulk terms." },
  { q: "How fast is delivery to Europe?", a: "As an EU-adjacent manufacturer in Türkiye, lead times to Europe are typically shorter than from China. Exact timing depends on the order; we confirm in the quote." },
];

export default function ExportLandingClient() {
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
    const country = String(fd.get("country") ?? "");
    const note = String(fd.get("message") ?? "");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), company: fd.get("company"), email: fd.get("email"), phone: fd.get("phone"),
          topic: "export", message: `Country: ${country}\n\n${note}`,
          website: hpRef.current?.value ?? "", elapsed: Date.now() - startedAtRef.current,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "Could not send. Please email info@bemisevcharge.com.");
      } else setSubmitted(true);
    } catch {
      setErr("Network error. Please email info@bemisevcharge.com.");
    } finally { setSending(false); }
  };

  const card = "rounded-2xl p-5";
  const cardStyle = { background: surface, border: `1px solid ${border}` };
  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none";
  const inputStyle = { background: inputBg, border: `1px solid ${border}`, color: textPrimary };
  const eyebrow = (
    <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: d ? "#93C5FD" : BLUE }}>
      <RiGlobalLine size={14} /> EV Charging Manufacturer · Türkiye / Europe
    </p>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-10 px-5 sm:px-6 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 w-[480px] h-[480px] rounded-full" style={{ background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{eyebrow}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: textPrimary }}>
            EV Charging Cable &amp; Charger <span style={{ color: d ? "#93C5FD" : BLUE }}>Manufacturer</span> in Türkiye / Europe
          </motion.h1>
          <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }} className="h-px w-24 origin-left mb-5" style={{ background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)` }} />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }} className="text-base sm:text-lg leading-relaxed max-w-3xl mb-7" style={{ color: textMuted }}>
            Bemis E-V Charge is a <strong style={{ color: textPrimary }}>real EU-adjacent manufacturer</strong> (since 1994). Type 2 / Mode 3 charging cables, AC wallboxes, DC fast chargers and adapters — CE, IP65/IP66, OCPP-ready. <strong style={{ color: textPrimary }}>OEM / ODM / private label</strong>, export to 60+ countries.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }} className="flex flex-wrap gap-3">
            <a href="#quote" className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95" style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}>
              Request a Quote <RiArrowRightLine size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95" style={{ color: textPrimary, background: surface, border: `1px solid ${border}` }}>
              View Products
            </Link>
          </motion.div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-1.5" style={{ color: d ? "#cfe1ff" : BLUE, background: d ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.08)", border: `1px solid ${d ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)"}` }}>
                <RiShieldCheckLine size={13} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bemis */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl font-black mb-2" style={{ color: textPrimary }}>
            Why source from Bemis, not a Chinese trader?
          </motion.h2>
          <p className="mb-7 max-w-2xl" style={{ color: textMuted }}>A direct, EU-standard manufacturer with the proximity and flexibility importers and distributors need.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY.map((w, i) => (
              <motion.div key={w.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.45, delay: i * 0.05 }} className={card} style={cardStyle}>
                <w.icon size={22} style={{ color: BLUE }} className="mb-2" />
                <h3 className="font-bold text-base mb-1.5" style={{ color: textPrimary }}>{w.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{w.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product range */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl font-black mb-7" style={{ color: textPrimary }}>Product range</motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <Link key={p.t} href={p.href} className={`${card} block transition-transform hover:scale-[1.02]`} style={cardStyle}>
                <h3 className="font-bold text-base mb-1" style={{ color: d ? "#93C5FD" : BLUE }}>{p.t}</h3>
                <p className="text-sm" style={{ color: textMuted }}>{p.d}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm" style={{ color: textMuted }}>For OEM / distributors: private label &amp; custom branding, bulk &amp; wholesale pricing, CE documentation, technical support and reliable lead times. <Link href="/b2b" className="underline" style={{ color: d ? "#93C5FD" : BLUE }}>OEM / B2B details →</Link></p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl font-black mb-7" style={{ color: textPrimary }}>Export FAQ</motion.h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <div key={f.q} className={card} style={cardStyle}>
                <h3 className="font-bold text-[15px] mb-1.5" style={{ color: textPrimary }}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto rounded-3xl p-6 sm:p-10" style={{ background: d ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.05)", border: `1px solid ${border}` }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: textPrimary }}>Request a Quote</h2>
          <p className="mb-7 max-w-xl" style={{ color: textMuted }}>Tell us what you need — product, quantity and your country. We reply with pricing, lead time and OEM options.</p>
          {submitted ? (
            <div className={card} style={cardStyle}>
              <p className="font-bold text-lg mb-1" style={{ color: textPrimary }}>Thank you — your request was received. ✅</p>
              <p className="text-sm" style={{ color: textMuted }}>Our export team will reply by email shortly. Urgent? WhatsApp +90 533 956 25 46.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label>Website (leave empty)<input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
              </div>
              <input name="name" required placeholder="Full name *" className={inputCls} style={inputStyle} />
              <input name="company" placeholder="Company" className={inputCls} style={inputStyle} />
              <input name="email" required type="email" placeholder="Email *" className={inputCls} style={inputStyle} />
              <input name="country" required placeholder="Country *" className={inputCls} style={inputStyle} />
              <input name="phone" placeholder="Phone / WhatsApp (optional)" className={`${inputCls} sm:col-span-2`} style={inputStyle} />
              <textarea name="message" required rows={4} placeholder="What do you need? (product, quantity, OEM…) *" className={`${inputCls} sm:col-span-2 resize-none`} style={inputStyle} />
              {err && <p className="sm:col-span-2 text-sm" style={{ color: "#f87171" }}>{err}</p>}
              <button type="submit" disabled={sending} className="sm:col-span-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white disabled:opacity-60 hover:brightness-110 transition" style={{ background: BLUE, boxShadow: `0 6px 22px ${BLUE}45` }}>
                {sending ? "Sending…" : "Send Request"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
