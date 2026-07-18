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
  /** Kısa, son-kullanıcı odaklı açıklama — kart + ürün sayfasında hover tooltip'inde gösterilir. */
  desc?: string;
};

export const PRODUCT_FEATURES: ProductFeature[] = [
  { id: "ocpp",        label: "OCPP",                 icon: "RiCloudLine",        accent: "#8B5CF6", mockup: "browser", desc: "Açık OCPP protokolü ile şarj ağı yönetim sistemlerine bağlanır." },
  { id: "app",         label: "Mobil Uygulama",       icon: "RiSmartphoneLine",   accent: "#10B981", mockup: "phone", desc: "Şarjı telefondan başlatın, durdurun ve anlık takip edin." },
  { id: "wifi",        label: "WiFi",                 icon: "RiWifiLine",         accent: "#3B82F6", desc: "Kablosuz ağ üzerinden internete bağlanır." },
  { id: "rfid",        label: "RFID Kart Okuyucu",    icon: "RiBankCardLine",     accent: "#F59E0B", desc: "RFID kart ile yetkili erişim ve tek dokunuşta başlatma." },
  { id: "screen",      label: "LCD Ekran",             icon: "RiTv2Line",          accent: "#EC4899", desc: "Şarj durumunu gösteren aydınlatmalı LCD ekran." },
  { id: "ip65",        label: "IP65 Koruma",          icon: "RiShieldCheckLine",  accent: "#64748B", desc: "Toz ve suya karşı IP65 koruma; dış mekana uygun." },
  { id: "load",        label: "Dinamik Yük Dengeleme", icon: "RiBarChart2Line",    accent: "#06B6D4", desc: "Abonelik gücünü aşmadan yükü otomatik dengeler." },
  { id: "schedule",    label: "Planlı Şarj",          icon: "RiCalendarCheckLine",accent: "#EAB308", desc: "Ucuz tarife saatlerine planlı şarj programlayın." },
  { id: "shared",      label: "Ortak Kullanım",       icon: "RiTeamLine",         accent: "#818CF8", desc: "Ortak alanlarda çok kullanıcılı yönetim ve raporlama." },
  // Broşür-2026 highlight rozetleri (2026-07-13). Admin bunları PRODUCT_FEATURES'tan
  // otomatik checkbox olarak listeler (senkron). İkonlar Detail + FeaturedProducts
  // ikon haritalarına da eklendi (RiDashboard3Line / RiHammerLine / RiEqualizerLine yeni).
  { id: "autostart",   label: "Otomatik Şarj Başlatma", icon: "RiFlashlightLine",  accent: "#F97316", desc: "Kablo takılınca şarj kendiliğinden başlar." },
  { id: "mid",         label: "MID Sayaç (Opsiyonel)", icon: "RiDashboard3Line",  accent: "#14B8A6", desc: "Sertifikalı MID enerji sayacı ile doğru ölçüm (opsiyonel)." },
  { id: "plugplay",    label: "Tak-Çalıştır",         icon: "RiPlugLine",         accent: "#22C55E", desc: "Kur-tak-çalıştır; ek ayar gerektirmez." },
  { id: "safety",      label: "Güvenlik Korumaları",  icon: "RiShieldCheckLine",  accent: "#EF4444", desc: "Aşırı akım, kısa devre ve kaçak akıma karşı korumalar." },
  { id: "ik10",        label: "IK10 Darbe Dayanımı",  icon: "RiHammerLine",       accent: "#78716C", desc: "IK10 darbe dayanımlı sağlam gövde." },
  { id: "amp6",        label: "6 Kademe Amper",       icon: "RiEqualizerLine",    accent: "#6366F1", desc: "6 kademeli amper ayarı (6–32A) ile esnek güç." },
  // Yenilenen dış kasa — içi açılmadan dıştan klemens + dış montaj kulakları (2026-07-13).
  { id: "montaj",      label: "Kolay Montaj",         icon: "RiToolsLine",        accent: "#0EA5E9", desc: "Yenilenen dış kasa ile hızlı, dıştan bağlantılı montaj." },
  // type2 / ccs2 / v2l are technical attributes (connector / capability),
  // not general feature flags — they belong in the Çevresel/Bağlantı spec
  // groups instead. Existing products that still carry these ids in
  // product.features just no-op gracefully because featureById returns
  // undefined and the renderers skip nullish lookups.
];

export const featureById = (id: string) => PRODUCT_FEATURES.find(f => f.id === id);
