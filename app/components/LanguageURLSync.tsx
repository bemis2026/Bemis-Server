"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { isEnglishOnlyPath } from "../lib/languages";

export default function LanguageURLSync() {
  const { lang, setLang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // İngilizce-only sayfalarda (bkz. ENGLISH_ONLY_PATHS) dil zorlanır, ziyaretçi
  // tercihi DEĞİLDİR → URL'e yazma. Yazsaydık: ?lang=en eklenir, sayfa yenilenince
  // aşağıdaki mount effect'i onu okuyup setLang("en") çağırır ve Türk ziyaretçinin
  // tercihi localStorage'da kalıcı İngilizce'ye dönerdi.
  const skip = isEnglishOnlyPath(pathname);

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
  useEffect(() => {
    if (skip) return;
    const currentLang = searchParams.get("lang");
    const urlInSync = lang === "en" ? currentLang === "en" : currentLang == null;
    if (urlInSync) return;

    const params = new URLSearchParams(searchParams.toString());
    if (lang === "en") params.set("lang", "en");
    else params.delete("lang");
    const newUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [lang, pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
