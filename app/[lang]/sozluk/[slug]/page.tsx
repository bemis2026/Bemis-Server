import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbSchema, definedTermSchema, faqSchema, ogImage, OG_URL, SITE_URL } from "../../../lib/seo";
import { GLOSSARY_UPDATED, TERM_SEE_ALSO, glossaryMetaDescription } from "../../../lib/glossary";
import { glossarySluglariDilde, terimBulDilde, terimlerDilde } from "../../../lib/serverGlossaryLang";
import { arAdresi } from "../../../lib/serverBlogLang";

import GlossaryClient from "../../../sozluk/GlossaryClient";

// Arapça terim sayfası — /ar/sozluk/<slug>. 15 terimin Arapçası hazırdı, adresi yoktu.
//
// ⚠️ generateStaticParams YALNIZ Arapça ÇEVİRİSİ OLAN terimleri üretir. Çevirisi olmayan
// bir terim için Arapça adres açmak, o adreste TÜRKÇE içerik yayınlamak demek olurdu.
// (Şu an 15/15 çevrili; kontrol ileride terim eklendiğinde koruyucu olsun diye duruyor.)

export const dynamicParams = false;
export const revalidate = 86400;

const SET_ADI = "قاموس مصطلحات شحن السيارات الكهربائية";

export function generateStaticParams() {
  return glossarySluglariDilde("ar").map((slug) => ({ lang: "ar", slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (lang !== "ar") return {};
  const t = terimBulDilde(slug, "ar");
  if (!t) return { title: "غير موجود" };
  const canonical = `/ar/sozluk/${t.slug}`;
  // ⓘ Arapça çeviride `term` alanı zaten soru biçiminde geliyor ("ما هو Type 2؟"),
  //    yani TR'deki "Nedir?" kalıbını burada ELLE kurmaya gerek yok.
  // ⚠️ `t.metaTitle` / `t.metaDescription` KULLANILMAZ: bu iki alan çeviri kümesinde YOK
  //    (çeviri yalnız term/abbr/short/definition/faq taşır) → birleştirmeden TÜRKÇE olarak
  //    geçerler ve iki terimde (kw-kwh, ip65-ip66) Arapça sayfaya Türkçe başlık basarlardı.
  const baslik = t.term;
  const aciklama = glossaryMetaDescription(t);
  return {
    title: { absolute: `${baslik} | Bemis E-V Charge` },
    description: aciklama,
    // ⓘ `keywords` BİLEREK yok: o alan TR kaynaktan gelir (çeviri kümesinde karşılığı
    //    yok) → Arapça sayfaya Türkçe kelimeler basardı. Google zaten yok sayıyor.
    alternates: {
      canonical,
      // ⚠️ Karşılıklı: TR terim sayfası da ar girişini verir.
      languages: { tr: `/sozluk/${t.slug}`, ar: canonical, "x-default": `/sozluk/${t.slug}` },
    },
    openGraph: {
      title: baslik, description: aciklama, type: "article", url: canonical,
      locale: "ar_AE", siteName: "Bemis E-V Charge",
      modifiedTime: GLOSSARY_UPDATED, images: ogImage(t.abbr),
    },
    twitter: { card: "summary_large_image", title: baslik, description: aciklama, images: [OG_URL] },
  };
}

export default async function ArapcaTerimPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (lang !== "ar") notFound();
  const ham = terimBulDilde(slug, "ar");
  if (!ham) notFound();

  // ⚠️ "İlgili içerik" linkleri TR adreslerine gidiyordu (/blog/... · /products/...):
  // Arapça sayfadan TR köke sızıntı. Arapça karşılığı olanlar dil koluna taşınır,
  // olmayan rehber DÜŞER (Arapça sayfadan Türkçe gövdeye link verilmez).
  const gorulenAdres = new Set<string>();
  const ilgili = (ham.related ?? [])
    .map((r) => ({ r, h: arAdresi(r.href) }))
    .filter((x): x is { r: { label: string; href: string }; h: string } => x.h !== null)
    .filter((x) => (gorulenAdres.has(x.h) ? false : (gorulenAdres.add(x.h), true)))
    .map((x) => ({ ...x.r, href: x.h }));
  const t = { ...ham, related: ilgili.length > 0 ? ilgili : undefined };

  const url = `/ar/sozluk/${t.slug}`;
  const jsonLd = [
    breadcrumbSchema([
      { name: "الرئيسية", url: "/" },
      { name: "المصطلحات", url: "/ar/sozluk" },
      { name: t.abbr, url },
    ]),
    // seeAlso mesh'i de Arapça kolda kalır — TR adresine sızmamalı.
    definedTermSchema(
      t,
      (TERM_SEE_ALSO[t.slug] ?? []).map((s) => `${SITE_URL}/ar/sozluk/${s}`),
      { taban: "/ar/sozluk", dil: "ar", setAdi: SET_ADI },
    ),
    ...(t.faq && t.faq.length > 0 ? [faqSchema(t.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <GlossaryClient mode="term" term={t} terms={terimlerDilde("ar")} />
    </>
  );
}
