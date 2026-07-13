// Product feature catalog — used by admin to toggle per-product capabilities
// and by FeaturedProducts / product detail pages to render small icon badges.
// `accent` drives the badge color; `mockup: true` flags features that get an
// extra prominent treatment (phone outline, browser frame).
export type ProductFeature = {
  id: string;
  label: string;
  icon: string;       // react-icons name (resolved at component level)
  accent: string;
  mockup?: "phone" | "browser";
};

export const PRODUCT_FEATURES: ProductFeature[] = [
  { id: "ocpp",        label: "OCPP",                 icon: "RiCloudLine",        accent: "#8B5CF6", mockup: "browser" },
  { id: "app",         label: "Mobil Uygulama",       icon: "RiSmartphoneLine",   accent: "#10B981", mockup: "phone" },
  { id: "wifi",        label: "WiFi",                 icon: "RiWifiLine",         accent: "#3B82F6" },
  { id: "rfid",        label: "RFID Kart Okuyucu",    icon: "RiBankCardLine",     accent: "#F59E0B" },
  { id: "screen",      label: "LCD Ekran",             icon: "RiTv2Line",          accent: "#EC4899" },
  { id: "ip65",        label: "IP65 Koruma",          icon: "RiShieldCheckLine",  accent: "#64748B" },
  { id: "load",        label: "Dinamik Yük Dengeleme", icon: "RiBarChart2Line",    accent: "#06B6D4" },
  { id: "schedule",    label: "Planlı Şarj",          icon: "RiCalendarCheckLine",accent: "#EAB308" },
  { id: "shared",      label: "Ortak Kullanım",       icon: "RiTeamLine",         accent: "#818CF8" },
  // Broşür-2026 highlight rozetleri (2026-07-13). Admin bunları PRODUCT_FEATURES'tan
  // otomatik checkbox olarak listeler (senkron). İkonlar Detail + FeaturedProducts
  // ikon haritalarına da eklendi (RiDashboard3Line / RiHammerLine / RiEqualizerLine yeni).
  { id: "autostart",   label: "Otomatik Şarj Başlatma", icon: "RiFlashlightLine",  accent: "#F97316" },
  { id: "mid",         label: "MID Sayaç (Opsiyonel)", icon: "RiDashboard3Line",  accent: "#14B8A6" },
  { id: "plugplay",    label: "Tak-Çalıştır",         icon: "RiPlugLine",         accent: "#22C55E" },
  { id: "safety",      label: "Güvenlik Korumaları",  icon: "RiShieldCheckLine",  accent: "#EF4444" },
  { id: "ik10",        label: "IK10 Darbe Dayanımı",  icon: "RiHammerLine",       accent: "#78716C" },
  { id: "amp6",        label: "6 Kademe Amper",       icon: "RiEqualizerLine",    accent: "#6366F1" },
  // Yenilenen dış kasa — içi açılmadan dıştan klemens + dış montaj kulakları (2026-07-13).
  { id: "montaj",      label: "Kolay Montaj",         icon: "RiToolsLine",        accent: "#0EA5E9" },
  // type2 / ccs2 / v2l are technical attributes (connector / capability),
  // not general feature flags — they belong in the Çevresel/Bağlantı spec
  // groups instead. Existing products that still carry these ids in
  // product.features just no-op gracefully because featureById returns
  // undefined and the renderers skip nullish lookups.
];

export const featureById = (id: string) => PRODUCT_FEATURES.find(f => f.id === id);
