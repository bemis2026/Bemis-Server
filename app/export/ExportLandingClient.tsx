"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

const BLUE = "#3B82F6";
const ACCENT = "#DC0E1A";

const TRUST = [
  "Manufacturer since 1994",
  "CE · IP65 / IP66",
  "Type 2 · Mode 3 (IEC 62196)",
  "OCPP-ready",
  "Export to 60+ countries",
  "OEM / ODM / Private Label",
];

const WHY = [
  { t: "A real factory — not a trading company", d: "Produced in our own 16,000 m² facility in Bursa, Türkiye (Bemis Teknik Elektrik A.Ş., since 1994). You buy direct from the manufacturer." },
  { t: "EU standards, EU-adjacent location", d: "Type 2 / Mode 3 (IEC 62196), CE, IP65/IP66. Türkiye sits at Europe's doorstep — typically shorter lead times and simpler logistics to the EU than China." },
  { t: "OEM / ODM / private label", d: "Your brand, our production. Custom branding, packaging and configurations for distributors and importers." },
  { t: "Full range from one supplier", d: "AC wallboxes, portable chargers, Type 2 cables, DC fast chargers, V2L/C2L adapters and charging equipment — one reliable source." },
];

const PRODUCTS = [
  { t: "AC Wallbox", d: "7.4–22 kW, Type 2, OCPP-ready." },
  { t: "Type 2 Charging Cables", d: "Mode 2 & Mode 3, 16A/32A, 1- & 3-phase." },
  { t: "Portable Chargers", d: "Plug-and-charge, adjustable current." },
  { t: "DC Fast Charging", d: "CCS2 units (e.g. 40 kW BEVDC)." },
  { t: "V2L / C2L Adapters", d: "Vehicle-to-load power solutions." },
  { t: "Charging Equipment", d: "Type 2 sockets, holsters, accessories." },
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
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const startedAtRef = useRef(Date.now());
  const hpRef = useRef<HTMLInputElement>(null);

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
          name: fd.get("name"),
          company: fd.get("company"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          topic: "export",
          message: `Country: ${country}\n\n${note}`,
          website: hpRef.current?.value ?? "", // honeypot
          elapsed: Date.now() - startedAtRef.current,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "Could not send. Please try again or email info@bemisevcharge.com.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setErr("Network error. Please try again or email info@bemisevcharge.com.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/12 focus:border-white/30 focus:outline-none placeholder-white/35";

  return (
    <main className="min-h-screen text-white" style={{ background: "linear-gradient(160deg,#0a0a0d 0%,#0e1224 45%,#08142e 80%,#0a0a0d 100%)" }}>
      {/* Minimal English header */}
      <header className="flex items-center justify-between px-5 sm:px-10 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/favicon-white-192.png" alt="Bemis E-V Charge" width={36} height={36} className="w-9 h-9 object-contain" />
          <span className="font-extrabold tracking-wide text-sm sm:text-base">BEMIS E-V CHARGE</span>
        </Link>
        <a href="#quote" className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ background: BLUE }}>Request a Quote</a>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 pt-8 pb-14">
        <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "#93C5FD" }}>EV Charging Manufacturer · Türkiye / Europe</p>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight max-w-3xl">
          EV Charging Cable &amp; Charger <span style={{ color: "#93C5FD" }}>Manufacturer</span> in Türkiye / Europe
        </h1>
        <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          Bemis E-V Charge is a <strong className="text-white">real EU-adjacent manufacturer</strong> (since 1994). Type 2 / Mode 3 charging cables, AC wallboxes, DC fast chargers and adapters — CE, IP65/IP66, OCPP-ready. <strong className="text-white">OEM / ODM / private label</strong>, export to 60+ countries.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#quote" className="rounded-2xl px-7 py-3.5 text-sm font-bold text-white" style={{ background: BLUE }}>Request a Quote →</a>
          <Link href="/products" className="rounded-2xl px-7 py-3.5 text-sm font-bold text-white/90 border border-white/20">View Products</Link>
        </div>
        <div className="mt-9 flex flex-wrap gap-2.5">
          {TRUST.map((t) => (
            <span key={t} className="text-xs font-semibold rounded-full px-3.5 py-1.5" style={{ color: "#cfe1ff", background: "rgba(59,130,246,0.14)", border: "1px solid rgba(59,130,246,0.3)" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Why Bemis */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">Why source from Bemis, not a Chinese trader?</h2>
        <p className="text-white/60 mb-8 max-w-2xl">A direct, EU-standard manufacturer with the proximity and flexibility importers and distributors need.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {WHY.map((w) => (
            <div key={w.t} className="rounded-2xl p-5 bg-white/4 border border-white/8">
              <h3 className="font-bold text-base mb-1.5">{w.t}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product range */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-8">Product range</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p) => (
            <div key={p.t} className="rounded-2xl p-5 bg-white/4 border border-white/8">
              <h3 className="font-bold text-base mb-1" style={{ color: "#93C5FD" }}>{p.t}</h3>
              <p className="text-sm text-white/65">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">For OEM / distributors: private label &amp; custom branding, bulk &amp; wholesale pricing, CE documentation, technical support and reliable lead times. <Link href="/b2b" className="underline" style={{ color: "#93C5FD" }}>OEM / B2B details →</Link></p>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-8">Export FAQ</h2>
        <div className="space-y-3 max-w-3xl">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl p-5 bg-white/4 border border-white/8">
              <h3 className="font-bold text-[15px] mb-1.5">{f.q}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="max-w-6xl mx-auto px-5 sm:px-10 py-12">
        <div className="rounded-3xl p-6 sm:p-10 border border-white/10" style={{ background: "rgba(59,130,246,0.07)" }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Request a Quote</h2>
          <p className="text-white/65 mb-7 max-w-xl">Tell us what you need — product, quantity and your country. We reply with pricing, lead time and OEM options.</p>
          {submitted ? (
            <div className="rounded-2xl p-6 bg-white/5 border border-white/12">
              <p className="font-bold text-lg mb-1">Thank you — your request was received. ✅</p>
              <p className="text-white/65 text-sm">Our export team will reply by email shortly. For urgent requests: WhatsApp +90 533 956 25 46.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label>Website (leave empty)<input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
              </div>
              <input name="name" required placeholder="Full name *" className={inputCls} />
              <input name="company" placeholder="Company" className={inputCls} />
              <input name="email" required type="email" placeholder="Email *" className={inputCls} />
              <input name="country" required placeholder="Country *" className={inputCls} />
              <input name="phone" placeholder="Phone / WhatsApp (optional)" className={`${inputCls} sm:col-span-2`} />
              <textarea name="message" required rows={4} placeholder="What do you need? (product, quantity, OEM…) *" className={`${inputCls} sm:col-span-2 resize-none`} />
              {err && <p className="sm:col-span-2 text-sm text-red-400">{err}</p>}
              <button type="submit" disabled={sending} className="sm:col-span-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white disabled:opacity-60" style={{ background: BLUE }}>
                {sending ? "Sending…" : "Send Request"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Minimal English footer */}
      <footer className="border-t border-white/10 mt-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-white/55">
          <div>
            <p className="font-bold text-white">Bemis E-V Charge</p>
            <p>Bemis Teknik Elektrik A.Ş. · Bursa, Türkiye · since 1994</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="mailto:info@bemisevcharge.com" className="hover:text-white">info@bemisevcharge.com</a>
            <a href="tel:+902244330216" className="hover:text-white">+90 224 433 02 16</a>
            <a href="https://wa.me/905339562546" target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/" className="hover:text-white">Home</Link>
          </div>
        </div>
        <div className="text-center text-xs text-white/30 pb-6" style={{ borderTop: `2px solid ${ACCENT}22` }}>© Bemis E-V Charge — EV charging manufacturer · OEM / ODM · Export</div>
      </footer>
    </main>
  );
}
