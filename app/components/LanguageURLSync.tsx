"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageURLSync() {
  const { lang, setLang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // On mount: read ?lang= from URL
  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (urlLang === "en" || urlLang === "tr") setLang(urlLang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When lang changes: update URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === "en") {
      params.set("lang", "en");
    } else {
      params.delete("lang");
    }
    const newUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [lang, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
