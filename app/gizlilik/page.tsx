import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

// KVKK Aydınlatma Metni — sitenin GERÇEK veri akışına göre yazılmış taslak
// (iletişim/bayilik formu → Resend e-posta + R2'de ŞİFRELİ arşiv; IP rate-limit; consent-mode GA4/
// Meta yalnız onayla; Sentry maskeli hata izleme; Vercel/Cloudflare barındırma).
// Kullanıcı metinleri onayladı (2026-07-12) → indexlenebilir + footer linkli.
export const metadata: Metadata = {
  title: "Gizlilik ve Kişisel Verilerin Korunması",
  description:
    "Bemis E-V Charge web sitesi KVKK aydınlatma metni: hangi kişisel veriler, hangi amaçlarla işlenir, kimlere aktarılır ve haklarınız nelerdir.",
  robots: { index: true, follow: true }, // kullanıcı metni onayladı (2026-07-12)
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <LegalPage
      title="Gizlilik ve Kişisel Verilerin Korunması Aydınlatma Metni"
      updated="12 Temmuz 2026"
      intro="Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, www.bemisevcharge.com.tr web sitesini ziyaret eden ve sitedeki formları kullanan kişilerin kişisel verilerinin nasıl işlendiğini açıklamak amacıyla hazırlanmıştır."
      sections={[
        {
          h: "1. Veri Sorumlusu",
          p: [
            "Bemis Teknik Elektrik A.Ş. (\"Bemis\")",
            "Adres: Bursa OSB, Yeşil Cad. No:31, 16140 Nilüfer / Bursa",
            "E-posta: satis@bemis.com.tr · Telefon: +90 224 433 02 16",
          ],
        },
        {
          h: "2. İşlenen Kişisel Veriler",
          ul: [
            "İletişim ve bayilik başvuru formları üzerinden: ad soyad, e-posta adresi, telefon numarası, varsa firma/şehir bilgisi ve mesaj içeriği.",
            "Güvenlik amacıyla: IP adresi (yalnızca kötüye kullanımı ve istek yoğunluğunu sınırlamak için kısa süreli).",
            "Onayınıza bağlı olarak: çerezler ve benzeri teknolojilerle toplanan kullanım/analitik verileri (ayrıntılar Çerez Politikası'ndadır).",
          ],
        },
        {
          h: "3. İşleme Amaçları",
          ul: [
            "İletişim taleplerinizi yanıtlamak ve teklif/bilgi süreçlerini yürütmek.",
            "Bayilik başvurularını değerlendirmek.",
            "Site güvenliğini sağlamak ve kötüye kullanımı önlemek.",
            "Onay vermeniz hâlinde site kullanımını analiz etmek ve pazarlama etkinliğini ölçmek.",
            "Yasal yükümlülüklerin yerine getirilmesi.",
          ],
        },
        {
          h: "4. Hukuki Sebepler",
          p: [
            "Kişisel verileriniz; KVKK m.5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması), m.5/2-f (veri sorumlusunun meşru menfaati) ve analitik/pazarlama çerezleri bakımından açık rızanız (m.5/1) hukuki sebeplerine dayanılarak işlenir.",
          ],
        },
        {
          h: "5. Aktarım ve Hizmet Sağlayıcılar",
          p: [
            "Form iletileriniz tarafımıza e-posta olarak iletilir ve yönetim panelimizde şifreli olarak arşivlenir; bu iletim, arşivleme ve sitenin barındırılması için aşağıdaki hizmet sağlayıcılar kullanılır. Bu sağlayıcıların sunucuları yurt dışında bulunabilir:",
          ],
          ul: [
            "Barındırma ve içerik dağıtımı: Vercel Inc., Cloudflare Inc.",
            "Form e-posta iletimi: Resend Inc.",
            "Form arşivi: Cloudflare R2 — form iletileri yönetim panelimizde görüntülenebilmesi için şifrelenmiş biçimde saklanır.",
            "Hata izleme: Sentry (form içerikleri ve kişisel metinler maskelenir).",
            "Yalnız onayınızla: Google Analytics 4 / Google Ads (Google LLC) ve Meta Pixel (Meta Platforms) — onay vermezseniz bu araçlara veri gönderilmez.",
          ],
        },
        {
          h: "6. Saklama Süreleri",
          ul: [
            "Form iletileri: talebin sonuçlandırılması ve ticari ilişkinin gerektirdiği makul süre boyunca e-posta kayıtlarımızda ve yönetim panelindeki şifreli form arşivinde tutulur; talebiniz hâlinde silinir.",
            "Güvenlik amaçlı IP kayıtları: kısa süreli (istek sınırlama penceresi kadar) tutulur.",
            "Onaya bağlı analitik veriler: ilgili aracın saklama ayarları çerçevesinde tutulur.",
          ],
        },
        {
          h: "7. KVKK m.11 Kapsamındaki Haklarınız",
          p: [
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, aktarıldığı üçüncü kişileri bilme, otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve zarara uğramanız hâlinde giderilmesini talep etme haklarına sahipsiniz.",
            "Başvurularınızı satis@bemis.com.tr adresine veya yukarıdaki posta adresine iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.",
          ],
        },
        {
          h: "8. Değişiklikler",
          p: [
            "Bu metin gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.",
          ],
        },
      ]}
    />
  );
}
