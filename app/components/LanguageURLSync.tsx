"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { forcedLangForPath } from "../lib/languages";

export default function LanguageURLSync() {
  const { lang, setLang, autoLang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // İngilizce-only sayfalarda (bkz. ENGLISH_ONLY_PATHS) dil zorlanır, ziyaretçi
  // tercihi DEĞİLDİR → URL'e yazma. Yazsaydık: ?lang=en eklenir, sayfa yenilenince
  // aşağıdaki mount effect'i onu okuyup setLang("en") çağırır ve Türk ziyaretçinin
  // tercihi localStorage'da kalıcı İngilizce'ye dönerdi.
  // 2026-09-03: /en /de /es /ru kolları da zorlanmış dil → URL'e yazma (aynı gerekçe).
  const skip = forcedLangForPath(pathname) !== null;

  // On mount: read ?lang= from URL
  useEffect(() => {
    if (skip) return;
    const urlLang = searchParams.get("lang");
    if (urlLang === "en" || urlLang === "tr") setLang(urlLang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When lang changes: update URL — but only if URL is actually out of sync.
  // Firing router.replace during in-flight navigation (e.g. after a router.push)
  // locks the app router in Next 16.
  // ⚠️ 2026-09-18: `autoLang` (tarayıcıdan otomatik seçilen dil) URL'e YAZILMAZ.
  // Yazsaydık: İngilizce tarayıcılı ziyaretçi `/` açtığında adres `/?lang=en`
  // olur, sayfayı yenilediğinde yukarıdaki mount effect'i onu okuyup
  // setLang("en") çağırır ve localStorage'a KALICI tercih yazardı. Böylece
  // "tercih yoksa uygulanan varsayılan" sessizce kullanıcı tercihine dönüşür,
  // ziyaretçi Türkçe'ye dönmek istediğinde de bir daha otomatik algılama çalışmazdı.
  useEffect(() => {
    if (skip || autoLang) return;
    const currentLang = searchParams.get("lang");
    const urlInSync = lang === "en" ? currentLang === "en" : currentLang == null;
    if (urlInSync) return;

    const params = new URLSearchParams(searchParams.toString());
    if (lang === "en") params.set("lang", "en");
    else params.delete("lang");
    const newUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [lang, pathname, searchParams, autoLang]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
