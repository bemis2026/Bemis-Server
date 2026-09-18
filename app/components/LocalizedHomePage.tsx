import { ContentProvider } from "../context/ContentContext";
import HomeClient from "../HomeClient";
import { getContentForLang } from "../../lib/contentLang";
import type { HomeLang } from "../lib/homeSeo";

/**
 * Yabancı dil ANASAYFASI — /en /de /es /ru /nl için TEK gövde.
 *
 * ⚠️ NEDEN TEK DOSYA: `/en` STATİK segmentte (app/en/page.tsx), diğer dörtlü
 * DİNAMİK segmentte (app/[lang]/page.tsx) yaşamak ZORUNDA — `app/de/page.tsx`
 * gibi statik bir segment açmak app/[lang]/products kolunu gölgeler ve o dilin
 * 159 ürün sayfasını kırar (kayıtlı ders, 2026-09-03). İki rota dosyası bu
 * bileşeni çağırır; gövde kopyalanmaz, ayrışamaz.
 *
 * ⚠️ İÇ İÇE ContentProvider — BİLEREK: kök yerleşimdeki provider sunucuda rotayı
 * bilemez (`usePathname` yok, `headers()` tüm siteyi dinamikleştirir) ve içeriği
 * DAİMA Türkçe basar. O hâliyle Google `/de` adresinde TÜRKÇE gövde görürdü.
 * Buradaki iç provider, o dilin içeriğini SUNUCUDA verir → ilk HTML gerçekten
 * Almanca/Rusça/… olur. React'te iç provider kendi alt ağacı için dıştakini ezer.
 * Kabuk (menü/footer) `forcedLangForPath()` sayesinde zaten o dile kilitlenir.
 *
 * ⓘ Bedeli: `/api/content?lang=<dil>` iki kez çekilir (kök + iç provider). İkisi
 * de aynı dili ister, sonuç aynı; SEO kazancı bu küçük israftan büyük.
 */
export default async function LocalizedHomePage({ lang }: { lang: HomeLang }) {
  const icerik = await getContentForLang(lang);

  return (
    <ContentProvider initialContent={icerik}>
      <HomeClient />
    </ContentProvider>
  );
}
