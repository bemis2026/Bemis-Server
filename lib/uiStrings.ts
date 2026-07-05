"use client";

import { useLanguage } from "../app/context/LanguageContext";
import { pickText } from "../app/lib/ui";

type Pair = { tr: string; en: string };

// Hardcoded UI labels that don't live in the editable content. Add new keys
// here whenever you embed a literal user-facing string in a component.
const STRINGS = {
  // ── SmartCharger: app store buttons ──
  smc_app_top:        { tr: "App Store'dan İndir",       en: "Download on the" },
  smc_app_label:      { tr: "App Store",                  en: "App Store" },
  smc_play_top:       { tr: "Google Play'den İndir",      en: "Get it on" },
  smc_play_label:     { tr: "Google Play",                en: "Google Play" },

  // ── SmartCharger: phone mockup demo UI ──
  smc_brand:          { tr: "BEMİS CHARGE",              en: "BEMIS CHARGE" },
  smc_mng:            { tr: "Şarj Yönetimi",             en: "Charging Management" },
  smc_connected:      { tr: "Bağlı",                     en: "Connected" },
  smc_charging:       { tr: "Şarj Oluyor",               en: "Charging" },
  smc_power:          { tr: "Güç",                       en: "Power" },
  smc_time:           { tr: "Süre",                      en: "Time" },
  smc_units:          { tr: "Üniteler",                  en: "Units" },
  smc_unit:           { tr: "Ünite",                     en: "Unit" },
  smc_available:      { tr: "Müsait",                    en: "Available" },

  // ── SmartCharger: web mockup ──
  smc_web_panel:      { tr: "Şarj Yönetim Paneli",       en: "Charging Management Panel" },
  smc_live:           { tr: "Canlı",                     en: "Live" },
  smc_active:         { tr: "Aktif",                     en: "Active" },
  smc_revenue:        { tr: "Gelir",                     en: "Revenue" },
  smc_daily_usage:    { tr: "Günlük Kullanım (kWh)",     en: "Daily Usage (kWh)" },
  smc_charge_short:   { tr: "Şarj",                      en: "Charging" },
  smc_floor:          { tr: "Kat",                       en: "Floor" },
  smc_entrance:       { tr: "Giriş",                     en: "Entrance" },
  smc_garden:         { tr: "Bahçe",                     en: "Garden" },
  smc_web_label:      { tr: "Web Yönetim Paneli",        en: "Web Management Panel" },

  // ── SmartCharger: platform highlight ──
  smc_browser:        { tr: "Web Tarayıcı",              en: "Web Browser" },
  smc_browser_sub:    { tr: "Her cihazdan erişim",       en: "Access from any device" },
  smc_mobile:         { tr: "Mobil Uygulama",            en: "Mobile App" },

  // Carousel pill labels
  smc_pill_mobile:    { tr: "Mobil",                     en: "Mobile" },
  smc_pill_web:       { tr: "Web",                       en: "Web" },

  // ── Contact form ──
  contact_name:       { tr: "Ad Soyad",                  en: "Full Name" },
  contact_email:      { tr: "E-posta",                   en: "Email" },
  contact_phone:      { tr: "Telefon",                   en: "Phone" },
  contact_company:    { tr: "Şirket",                    en: "Company" },
  contact_subject:    { tr: "Konu",                      en: "Subject" },
  contact_message:    { tr: "Mesajınız",                 en: "Your Message" },
  contact_send:       { tr: "Mesajı Gönder",             en: "Send Message" },
  contact_sending:    { tr: "Gönderiliyor…",             en: "Sending…" },
  contact_success:    { tr: "Mesajınız iletildi. En kısa sürede dönüş yapacağız.",
                        en: "Your message has been sent. We'll get back to you shortly." },
  contact_error:      { tr: "Mesaj iletilemedi. Lütfen tekrar deneyin.",
                        en: "Could not send the message. Please try again." },
  contact_topic_label:{ tr: "Hangi konuda yazıyorsunuz?", en: "What is your inquiry about?" },
  contact_topic_general:  { tr: "Genel Bilgi",            en: "General Information" },
  contact_topic_dealer:   { tr: "Bayilik Başvurusu",       en: "Dealer Application" },
  contact_topic_corporate:{ tr: "Kurumsal / OEM",          en: "Corporate / OEM" },
  contact_topic_support:  { tr: "Teknik Destek",           en: "Technical Support" },
  contact_phone_optional: { tr: "(opsiyonel)",             en: "(optional)" },
  contact_required_hint:  { tr: "* zorunlu alanlar",       en: "* required fields" },
  contact_form_title:     { tr: "Mesaj Gönderin",          en: "Send a Message" },
  contact_name_ph:        { tr: "Adınız",                  en: "Your name" },
  contact_company_ph:     { tr: "Şirket adı",              en: "Company name" },
  contact_phone_ph:       { tr: "+90 5XX XXX XX XX",       en: "+90 5XX XXX XX XX" },
  contact_email_ph:       { tr: "email@sirket.com",        en: "email@company.com" },
  contact_message_ph:     { tr: "Mesajınızı buraya yazın...", en: "Write your message here..." },
  contact_topic_select:   { tr: "Konu seçin",              en: "Select a topic" },
  contact_kvkk:           { tr: "Verileriniz KVKK ve gizlilik politikamız kapsamında korunmaktadır.",
                            en: "Your data is protected under our privacy policy and applicable regulations." },
  contact_err_generic:    { tr: "Bir hata oluştu, lütfen tekrar deneyin.",
                            en: "An error occurred — please try again." },
  contact_err_network:    { tr: "Bağlantı hatası. Lütfen tekrar deneyin.",
                            en: "Connection error. Please try again." },
  contact_send_short:     { tr: "Mesaj Gönder",            en: "Send Message" },

  // Contact info card labels
  contact_label_address:  { tr: "Adres",                   en: "Address" },
  contact_label_phone:    { tr: "Telefon",                 en: "Phone" },
  contact_label_email:    { tr: "E-Posta",                 en: "Email" },
  contact_label_hours:    { tr: "Çalışma Saatleri",        en: "Working Hours" },
  contact_email_sub:      { tr: "Genel bilgi ve sorular",  en: "General info and inquiries" },

  // Contact topic dropdown
  topic_product:          { tr: "Ürün Bilgisi",            en: "Product Information" },
  topic_quote:            { tr: "Fiyat Teklifi",           en: "Price Quote" },
  topic_corp:             { tr: "Kurumsal Satış",          en: "Corporate Sales" },
  topic_export:           { tr: "İhracat / Export",        en: "Export" },
  topic_tech:             { tr: "Teknik Destek",           en: "Technical Support" },
  topic_install:          { tr: "Kurulum Yardımı",         en: "Installation Help" },
  topic_partnership:      { tr: "İş Ortaklığı",            en: "Partnership" },
  topic_other:            { tr: "Diğer",                   en: "Other" },
  contact_received:       { tr: "Mesajınız Alındı!",       en: "Message received!" },
  contact_received_sub:   { tr: "En kısa sürede size geri dönüş yapacağız.",
                            en: "We'll get back to you as soon as possible." },
  contact_send_another:   { tr: "Yeni mesaj gönder",       en: "Send another message" },

  // (consolidated calculator strings live in the Calculator section below)

  // ── Hours/minutes ──
  hour_short:             { tr: "s",                            en: "h" },
  min_short:              { tr: "d",                            en: "min" },

  // ── B2B page headline ──
  b2b_eyebrow:            { tr: "OEM & Kurumsal",              en: "OEM & Corporate" },
  b2b_heading:            { tr: "Profesyonel EV Şarj Çözümleri", en: "Professional EV Charging Solutions" },
  b2b_subheading:         { tr: "Üreticiler, operatörler ve filo yöneticileri için OEM çözümleri, OCPP entegre platformlar ve özel üretim.",
                            en: "OEM solutions, OCPP-integrated platforms and custom manufacturing for producers, operators and fleet managers." },
  b2b_oem_title:          { tr: "OEM Üretim",                  en: "OEM Manufacturing" },
  b2b_oem_desc:           { tr: "Markanıza özel beyaz etiket ürünler, özelleştirilmiş tasarım ve toplu üretim.",
                            en: "White-label products, custom design and high-volume manufacturing for your brand." },
  b2b_charge_title:       { tr: "Şarj İstasyonu Operatörü",    en: "Charging Network Operator" },
  b2b_charge_desc:        { tr: "AC/DC istasyon ekipmanları, OCPP 2.0 entegrasyonu ve filo yönetim çözümleri.",
                            en: "AC/DC station equipment, OCPP 2.0 integration and fleet-management solutions." },
  b2b_fleet_title:        { tr: "Filo & Lojistik",             en: "Fleet & Logistics" },
  b2b_fleet_desc:         { tr: "Depo ve dağıtım merkezleri için yüksek kapasiteli toplu şarj altyapısı.",
                            en: "High-capacity bulk charging infrastructure for warehouses and distribution centers." },
  b2b_cta_label:          { tr: "Bize Ulaşın",                  en: "Contact Us" },
  b2b_cta_oem:            { tr: "OEM Teklifi Al",               en: "Request an OEM Quote" },
  b2b_cta_operator:       { tr: "Operatör Çözümleri",           en: "Operator Solutions" },
  b2b_cta_fleet:          { tr: "Filo Görüşmesi",               en: "Fleet Discussion" },
  b2b_back:               { tr: "Ana Sayfaya Dön",              en: "Back to Home" },

  // ── Generic ──
  loading:                { tr: "Yükleniyor…",                  en: "Loading…" },
  back:                   { tr: "Geri",                         en: "Back" },
  close:                  { tr: "Kapat",                        en: "Close" },

  // ── Calculator: banner ──
  calc_b_modes:           { tr: "Şarj Modları",                  en: "Charging Modes" },
  calc_b_time_sub:        { tr: "Hesaplama",                     en: "Calculation" },
  calc_b_models:          { tr: "50+ Model",                     en: "50+ Models" },
  calc_b_ev:              { tr: "EV Araç",                       en: "EV Cars" },
  calc_b_co2:             { tr: "CO₂",                           en: "CO₂" },
  calc_b_co2_sub:         { tr: "Tasarrufu",                     en: "Savings" },
  calc_b_savings:         { tr: "Tasarruf",                      en: "Savings" },
  calc_b_savings_sub:     { tr: "Analizi",                       en: "Analysis" },
  calc_b_fuelvs:          { tr: "Yakıt vs",                      en: "Fuel vs" },
  calc_b_elec:            { tr: "Elektrik",                      en: "Electricity" },

  // ── Calculator: form labels ──
  calc_vehicle_label:     { tr: "Araç Modeli (isteğe bağlı)",   en: "Vehicle Model (optional)" },
  calc_manual_entry:      { tr: "— Manuel gir —",                en: "— Manual entry —" },
  calc_battery:           { tr: "Batarya:",                       en: "Battery:" },
  calc_ac_max:            { tr: "AC maks:",                       en: "AC max:" },
  calc_dc_max:            { tr: "DC maks:",                       en: "DC max:" },
  calc_ac_charge:         { tr: "AC Şarj",                        en: "AC Charging" },
  calc_dc_fast:           { tr: "DC Hızlı Şarj",                  en: "DC Fast Charging" },
  calc_battery_cap:       { tr: "Batarya Kapasitesi",             en: "Battery Capacity" },
  calc_vehicle_data:      { tr: "araç verisi",                    en: "vehicle data" },
  calc_current_soc:       { tr: "Mevcut Doluluk",                 en: "Current Charge" },
  calc_target_soc:        { tr: "Hedef Doluluk",                  en: "Target Charge" },
  calc_ac_power:          { tr: "AC Şarj Gücü",                   en: "AC Charging Power" },
  calc_dc_power:          { tr: "DC İstasyon Gücü",               en: "DC Station Power" },
  calc_vehicle_max:       { tr: "Araç maks:",                     en: "Vehicle max:" },
  calc_usage_info:        { tr: "Kullanım Bilgileri",             en: "Usage Information" },
  calc_annual_km:         { tr: "Yıllık Sürüş Mesafesi",          en: "Annual Driving Distance" },
  calc_ev_consumption:    { tr: "EV Tüketimi",                    en: "EV Consumption" },
  calc_elec_price:        { tr: "Elektrik Fiyatı",                en: "Electricity Price" },
  calc_fuel_consumption:  { tr: "Araç Yakıt Tüketimi",            en: "Vehicle Fuel Consumption" },
  calc_fuel_price:        { tr: "Akaryakıt Fiyatı",               en: "Fuel Price" },

  // ── Calculator: result ──
  calc_estimated_time:    { tr: "TAHMİNİ SÜRE",                   en: "ESTIMATED TIME" },
  calc_energy:            { tr: "Enerji",                          en: "Energy" },
  calc_range_added:       { tr: "Eklenecek Menzil",                en: "Range Added" },
  calc_efficiency:        { tr: "Verimlilik",                      en: "Efficiency" },
  calc_elec_cost:         { tr: "Elektrik Maliyeti",               en: "Electricity Cost" },
  calc_elec_tariff:       { tr: "Elektrik Tarifesi",               en: "Electricity Tariff" },
  calc_annual_fuel_save:  { tr: "Yıllık Yakıt Tasarrufu",          en: "Annual Fuel Savings" },
  calc_fuel_vs_elec:      { tr: "yakıt vs. elektrik farkı",        en: "fuel vs. electricity difference" },
  calc_ev_cost:           { tr: "EV Maliyeti",                     en: "EV Cost" },
  calc_fuel_cost:         { tr: "Yakıt Maliyeti",                  en: "Fuel Cost" },
  calc_monthly_save:      { tr: "Aylık Tasarruf",                  en: "Monthly Savings" },
  calc_co2_save:          { tr: "CO₂ Tasarrufu",                   en: "CO₂ Savings" },
  calc_per_year_unit:     { tr: "ton/yıl",                         en: "tons/yr" },
  calc_ev_per_year:       { tr: "EV / yıl",                        en: "EV / yr" },
  calc_fuel_per_year:     { tr: "Yakıt / yıl",                     en: "Fuel / yr" },
  calc_disclaimer:        { tr: "Hesaplamalar tahmini değerlerdir. Gerçek sonuçlar araç modeli, kullanım alışkanlıkları ve güncel tarife fiyatlarına göre farklılık gösterebilir.",
                            en: "Calculations are estimates. Actual results vary depending on vehicle model, driving habits and current tariff prices." },

  // ── Calculator: tariff presets ──
  calc_tariff_home:       { tr: "Ev Elektriği (TEDAŞ)",            en: "Home Electricity" },
  calc_tariff_home_desc:  { tr: "~5-6 ₺/kWh · Mesken tarifesi",    en: "~5-6 ₺/kWh · Residential rate" },
  calc_tariff_ac:         { tr: "AC Kamu İstasyonu",                en: "AC Public Station" },
  calc_tariff_ac_desc:    { tr: "~9-11 ₺/kWh · Kamuya açık",        en: "~9-11 ₺/kWh · Public" },
  calc_tariff_dc:         { tr: "DC Hızlı Şarj",                    en: "DC Fast Charging" },
  calc_tariff_dc_desc:    { tr: "~13-16 ₺/kWh · CCS2/CHAdeMO",      en: "~13-16 ₺/kWh · CCS2/CHAdeMO" },
  calc_tariff_night:      { tr: "Gece Tarifesi (TEDAŞ)",            en: "Night Tariff" },
  calc_tariff_night_desc: { tr: "~3-4 ₺/kWh · 22:00–06:00",         en: "~3-4 ₺/kWh · 22:00–06:00" },

  calc_constrained_dc:    { tr: "kW'e kısıtlandı",                  en: "kW (vehicle limit)" },
  calc_constrained_ac:    { tr: "kW'e kısıtlandı",                  en: "kW (vehicle limit)" },

  // ── B2B page ──
  b2b_back_home:          { tr: "Ana sayfaya dön",                  en: "Back to home" },
  b2b_back_short:         { tr: "Geri",                              en: "Back" },
  b2b_default_eyebrow:    { tr: "Kurumsal & OEM Çözümler",           en: "Corporate & OEM Solutions" },
  b2b_default_h1:         { tr: "EV Altyapısı için",                 en: "For EV Infrastructure" },
  b2b_default_h2:         { tr: "Profesyonel Çözümler",              en: "Professional Solutions" },
  b2b_default_desc:       { tr: "Şarj ağı operatörleri, OEM üreticiler ve sistem entegratörleri için teknik ürün portföyü.",
                            en: "Technical product portfolio for charging-network operators, OEM manufacturers and system integrators." },
  b2b_sector_oem:         { tr: "OEM Üretici",                        en: "OEM Manufacturer" },
  b2b_sector_op:          { tr: "Şarj Ağı Operatörü",                 en: "Charging Network Operator" },
  b2b_sector_int:         { tr: "Sistem Entegratörü",                 en: "System Integrator" },
  b2b_sector_proj:        { tr: "Proje Müteahhidi",                   en: "Project Contractor" },

  // Advantages
  b2b_adv_made_title:     { tr: "Türkiye'de Üretim",                  en: "Made in Turkey" },
  b2b_adv_made_body:      { tr: "Bursa'daki tesislerimizde üretim; kısa tedarik süresi ve gümrüksüz lojistik.",
                            en: "Production in our Bursa facilities; short lead times and customs-free logistics." },
  b2b_adv_serial_title:   { tr: "Seri Üretim Kapasitesi",              en: "Serial Production Capacity" },
  b2b_adv_serial_body:    { tr: "Aylık yüksek hacimli AC / DC şarj kablosu ve şarj prizi üretim kapasitesi.",
                            en: "High monthly volume capacity for AC / DC charging cables and charging sockets." },
  b2b_adv_certs_title:    { tr: "Uluslararası Sertifikalar",           en: "International Certifications" },
  b2b_adv_certs_body:     { tr: "CE, TÜV ve IEC 62196 uyumlu ürünler — Avrupa ihracatına hazır portföy.",
                            en: "CE, TÜV and IEC 62196 compliant products — portfolio ready for European export." },
  b2b_adv_custom_title:   { tr: "Özel Konfigürasyon",                  en: "Custom Configuration" },
  b2b_adv_custom_body:    { tr: "İstenilen uzunluk, renk ve konnektör seçenekleri (Type 2 / CCS2 / GB-T).",
                            en: "Custom length, color and connector options (Type 2 / CCS2 / GB-T)." },
  b2b_adv_sample_title:   { tr: "Hızlı Numune & Doküman",              en: "Fast Samples & Documentation" },
  b2b_adv_sample_body:    { tr: "Prototip için hızlı numune; datasheet, 3D model ve test raporu paylaşımı.",
                            en: "Fast prototype samples; datasheet, 3D model and test report sharing." },
  b2b_adv_aftersale_title:{ tr: "OEM Satış Sonrası",                   en: "OEM After-Sales" },
  b2b_adv_aftersale_body: { tr: "Garanti, yedek parça ve mühendislik düzeyinde teknik destek.",
                            en: "Warranty, spare parts and engineering-level technical support." },

  // B2B sectors / interests / form
  b2b_sec_oem:            { tr: "EV Üreticisi (OEM)",                  en: "EV Manufacturer (OEM)" },
  b2b_sec_op:             { tr: "Şarj Ağı Operatörü",                  en: "Charging Network Operator" },
  b2b_sec_epc:            { tr: "Proje Müteahhidi / EPC",              en: "Project Contractor / EPC" },
  b2b_sec_int:            { tr: "Sistem Entegratörü",                  en: "System Integrator" },
  b2b_sec_dist:           { tr: "Distribütör / Bayi",                  en: "Distributor / Dealer" },
  b2b_sec_pub:            { tr: "Kamu / Belediye",                     en: "Public / Municipality" },
  b2b_sec_other:          { tr: "Diğer",                                en: "Other" },
  b2b_int_dc:             { tr: "DC Hızlı Şarj Ünitesi",               en: "DC Fast Charging Unit" },
  b2b_int_panel:          { tr: "Şarj Panosu & Dağıtım",                en: "Charging Panel & Distribution" },
  b2b_int_cable:          { tr: "DC Şarj Kablosu (CCS2)",               en: "DC Charging Cable (CCS2)" },
  b2b_int_ecu:            { tr: "Elektronik Kontrol Kartı (ECU)",       en: "Electronic Control Unit (ECU)" },

  // Form labels
  b2b_section_advantages: { tr: "Neden Bemis?",                          en: "Why Bemis?" },
  b2b_section_form:       { tr: "Tedarik & İşbirliği Talebi",            en: "Supply & Partnership Inquiry" },
  b2b_form_intro:         { tr: "Üreticilere özel fiyatlandırma, teknik dokümanlar ve numune talepleri için formu doldurun.",
                            en: "Fill the form for OEM-specific pricing, technical documents and sample requests." },
  b2b_form_name:          { tr: "Ad Soyad *",                            en: "Full Name *" },
  b2b_form_company:       { tr: "Şirket *",                              en: "Company *" },
  b2b_form_email:         { tr: "E-Posta *",                              en: "Email *" },
  b2b_form_phone:         { tr: "Telefon",                                en: "Phone" },
  b2b_form_sector:        { tr: "Sektör *",                               en: "Sector *" },
  b2b_form_select_sector: { tr: "Sektörünüzü seçin",                      en: "Select your sector" },
  b2b_form_interests:     { tr: "İlgilenilen Ürün / Hizmet",              en: "Products / Services of Interest" },
  b2b_form_message:       { tr: "Mesaj / Talep Detayı",                   en: "Message / Request Details" },
  b2b_form_message_ph:    { tr: "Proje kapsamı, adet, teknik gereksinimler...",
                            en: "Project scope, quantity, technical requirements..." },
  b2b_form_send:          { tr: "Başvuruyu Gönder",                       en: "Send Application" },
  b2b_form_sending:       { tr: "Gönderiliyor…",                          en: "Sending…" },
  b2b_form_ok_title:      { tr: "Başvurunuz Alındı",                      en: "Application Received" },
  b2b_form_ok_body:       { tr: "Satış mühendisliğimiz en kısa sürede sizinle iletişime geçecek.",
                            en: "Our sales engineering team will contact you shortly." },
  b2b_form_err:           { tr: "Gönderim sırasında hata oluştu.",
                            en: "An error occurred while sending." },
  b2b_section_products:   { tr: "Profesyonel Ürün Portföyü",              en: "Professional Product Portfolio" },
  b2b_products_intro:     { tr: "Operatörler, OEM üreticiler ve filo yöneticileri için teknik ekipman.",
                            en: "Technical equipment for operators, OEM manufacturers and fleet managers." },

  // OEM featured-products section + form-section headings
  b2b_oem_eyebrow:        { tr: "Üretici Portföyü",                       en: "Manufacturer Portfolio" },
  b2b_oem_heading:        { tr: "Şarj Ünitesi Üreticileri için Öne Çıkan Ürünler",
                            en: "Featured Products for Charging Unit Manufacturers" },
  b2b_oem_sub:            { tr: "AC ve DC şarj ünitesi üreten firmalar için şarj kablolarımız ve şarj prizlerimiz — bir ucu açık konfigürasyonlar, farklı uzunluk ve konnektör seçenekleri.",
                            en: "Charging cables and sockets for AC and DC unit manufacturers — open-end configurations, multiple length and connector options." },
  b2b_view_product:       { tr: "Ürünü İncele",                           en: "View Product" },
  b2b_form_eyebrow:       { tr: "Teknik Teklif Başvurusu",                en: "Technical Quote Request" },
  b2b_form_heading:       { tr: "Teklif Alın",                            en: "Get a Quote" },

  // Placeholders
  b2b_form_name_ph:       { tr: "Ali Yıldız",                             en: "John Smith" },
  b2b_form_company_ph:    { tr: "ABC Teknoloji A.Ş.",                     en: "ABC Technology Inc." },
  b2b_form_email_ph:      { tr: "ali@sirket.com",                         en: "john@company.com" },
  b2b_form_phone_ph:      { tr: "+90 5XX XXX XX XX",                      en: "+90 5XX XXX XX XX" },
} satisfies Record<string, Pair>;

export type UiStringKey = keyof typeof STRINGS;

export function useUiStrings() {
  const { lang } = useLanguage();
  // de/es/ar/ru: ui.json çevirisi (yoksa İngilizce yedek); tr/en aynen.
  return (key: UiStringKey): string => {
    const p = STRINGS[key];
    return pickText(lang, p.tr, p.en);
  };
}
