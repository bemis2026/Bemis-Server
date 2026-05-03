"use client";

import { useLanguage } from "../app/context/LanguageContext";

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

  // ── Calculator headline strings (most user-visible) ──
  calc_select_vehicle:    { tr: "Araç Seçin",                  en: "Select a Vehicle" },
  calc_search_vehicle:    { tr: "Araç ara…",                   en: "Search vehicle…" },
  calc_manual:            { tr: "Manuel Giriş",                en: "Manual Entry" },
  calc_battery:           { tr: "Batarya (kWh)",               en: "Battery (kWh)" },
  calc_consumption:       { tr: "Tüketim (kWh/100km)",         en: "Consumption (kWh/100km)" },
  calc_charge_kw:         { tr: "Şarj Gücü (kW)",              en: "Charging Power (kW)" },
  calc_from:              { tr: "Mevcut",                      en: "Current" },
  calc_to:                { tr: "Hedef",                       en: "Target" },
  calc_charge_time:       { tr: "Şarj Süresi",                 en: "Charging Time" },
  calc_total_energy:      { tr: "Eklenecek Enerji",            en: "Energy Added" },
  calc_cost:              { tr: "Maliyet",                     en: "Cost" },
  calc_range_added:       { tr: "Eklenen Menzil",              en: "Range Added" },
  calc_savings_year:      { tr: "Yıllık Tasarruf",             en: "Annual Savings" },
  calc_savings_month:     { tr: "Aylık Tasarruf",              en: "Monthly Savings" },
  calc_km_per_year:       { tr: "Yıllık km",                   en: "Annual km" },
  calc_fuel_price:        { tr: "Yakıt fiyatı (TL/lt)",        en: "Fuel price (TL/L)" },
  calc_elec_price:        { tr: "Elektrik fiyatı (TL/kWh)",    en: "Electricity price (TL/kWh)" },
  calc_ice_consumption:   { tr: "İçten yanmalı tüketim (lt/100km)", en: "ICE consumption (L/100km)" },
  calc_co2_saved:         { tr: "CO₂ Tasarrufu",               en: "CO₂ Saved" },
  calc_per_year:          { tr: "yılda",                       en: "per year" },
  calc_compare:           { tr: "EV vs İçten Yanmalı Karşılaştırma", en: "EV vs ICE Comparison" },
  calc_select_brand:      { tr: "Marka",                       en: "Brand" },

  // ── Hours/minutes ──
  hour_short:             { tr: "s",                            en: "h" },
  min_short:              { tr: "dk",                           en: "min" },

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
} satisfies Record<string, Pair>;

export type UiStringKey = keyof typeof STRINGS;

export function useUiStrings() {
  const { lang } = useLanguage();
  return (key: UiStringKey): string => STRINGS[key][lang];
}
