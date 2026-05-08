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
  { id: "type2",       label: "Type 2 Konektör",      icon: "RiPlugLine",         accent: "#3B82F6" },
  { id: "ccs2",        label: "CCS2 (DC)",            icon: "RiFlashlightLine",   accent: "#F97316" },
  { id: "schedule",    label: "Planlı Şarj",          icon: "RiCalendarCheckLine",accent: "#EAB308" },
  { id: "shared",      label: "Ortak Kullanım",       icon: "RiTeamLine",         accent: "#818CF8" },
  { id: "v2l",         label: "V2L (Araçtan Yüke)",   icon: "RiLightbulbLine",    accent: "#10B981" },
];

export const featureById = (id: string) => PRODUCT_FEATURES.find(f => f.id === id);
