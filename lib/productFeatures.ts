// Product feature catalog — used by admin to toggle per-product capabilities
// and by FeaturedProducts / product detail pages to render small icon badges.
// `accent` drives the badge color; `mockup: true` flags features that get an
// extra prominent treatment (phone outline, browser frame).
export type ProductFeature = {
  id: string;
  label: string;
  /** İngilizce etiket — pickText anahtarı; ui.json'da de/es/ar/ru/nl karşılıkları. */
  labelEn?: string;
  descEn?: string;
  icon: string;       // react-icons name (resolved at component level)
  accent: string;
  mockup?: "phone" | "browser";
  /** Kısa, son-kullanıcı odaklı açıklama — kart + ürün sayfasında hover tooltip'inde gösterilir. */
  desc?: string;
};

export const PRODUCT_FEATURES: ProductFeature[] = [
  { id: "ocpp",        label: "OCPP",                 icon: "RiCloudLine",        accent: "#8B5CF6", mockup: "browser", desc: "Açık OCPP protokolü ile şarj ağı yönetim sistemlerine bağlanır.", labelEn: "OCPP", descEn: "Connects to charging network management systems via the open OCPP protocol." },
  { id: "app",         label: "Mobil Uygulama",       icon: "RiSmartphoneLine",   accent: "#10B981", mockup: "phone", desc: "Şarjı telefondan başlatın, durdurun ve anlık takip edin.", labelEn: "Mobile App", descEn: "Start, stop and monitor charging in real time from your phone." },
  { id: "wifi",        label: "WiFi",                 icon: "RiWifiLine",         accent: "#3B82F6", desc: "Kablosuz ağ üzerinden internete bağlanır.", labelEn: "WiFi", descEn: "Connects to the internet over a wireless network." },
  { id: "bluetooth",   label: "Bluetooth",            icon: "RiBluetoothLine",    accent: "#2563EB", desc: "Telefonla doğrudan Bluetooth bağlantısı; ağ olmadan cihaz ayarlarına erişim.", labelEn: "Bluetooth", descEn: "Direct Bluetooth connection to your phone; access device settings without a network." },
  { id: "rfid",        label: "RFID Kart Okuyucu",    icon: "RiBankCardLine",     accent: "#F59E0B", desc: "RFID kart ile yetkili erişim ve tek dokunuşta başlatma.", labelEn: "RFID Card Reader", descEn: "Authorised access and one-touch start with an RFID card." },
  { id: "screen",      label: "LCD Ekran",             icon: "RiTv2Line",          accent: "#EC4899", desc: "Şarj durumunu gösteren aydınlatmalı LCD ekran.", labelEn: "LCD Display", descEn: "Backlit LCD display showing the charging status." },
  { id: "ip65",        label: "IP65 Koruma",          icon: "RiShieldCheckLine",  accent: "#64748B", desc: "Toz ve suya karşı IP65 koruma; dış mekana uygun.", labelEn: "IP65 Protection", descEn: "IP65 protection against dust and water; suitable for outdoor use." },
  { id: "load",        label: "Dinamik Yük Dengeleme", icon: "RiBarChart2Line",    accent: "#06B6D4", desc: "Abonelik gücünü aşmadan yükü otomatik dengeler.", labelEn: "Dynamic Load Balancing", descEn: "Balances the load automatically without exceeding the subscribed power." },
  { id: "schedule",    label: "Planlı Şarj",          icon: "RiCalendarCheckLine",accent: "#EAB308", desc: "Ucuz tarife saatlerine planlı şarj programlayın.", labelEn: "Scheduled Charging", descEn: "Schedule charging for off-peak tariff hours." },
  { id: "shared",      label: "Ortak Kullanım",       icon: "RiTeamLine",         accent: "#818CF8", desc: "Ortak alanlarda çok kullanıcılı yönetim ve raporlama.", labelEn: "Shared Access", descEn: "Multi-user management and reporting in shared areas." },
  // Broşür-2026 highlight rozetleri (2026-07-13). Admin bunları PRODUCT_FEATURES'tan
  // otomatik checkbox olarak listeler (senkron). İkonlar Detail + FeaturedProducts
  // ikon haritalarına da eklendi (RiDashboard3Line / RiHammerLine / RiEqualizerLine yeni).
  { id: "autostart",   label: "Otomatik Şarj Başlatma", icon: "RiFlashlightLine",  accent: "#F97316", desc: "Kablo takılınca şarj kendiliğinden başlar.", labelEn: "Automatic Charge Start", descEn: "Charging starts automatically when the cable is plugged in." },
  { id: "mid",         label: "MID Sayaç (Opsiyonel)", icon: "RiDashboard3Line",  accent: "#14B8A6", desc: "Sertifikalı MID enerji sayacı ile doğru ölçüm (opsiyonel).", labelEn: "MID Meter (Optional)", descEn: "Accurate measurement with a certified MID energy meter (optional)." },
  // ⚠️ "MID Sayaçlı" modellerde sayaç DAHİLİDİR — o 8 üründe `mid` rozetinin
  // "(Opsiyonel)" etiketi yanlış okunuyordu: bayi sayfaya bakınca sayacın fiyata
  // dahil olup olmadığını anlayamıyordu. Sayaçsız kardeş modellerde `mid` AYNEN
  // kalır (orada gerçekten opsiyonel). İkon zaten ikon haritalarında kayıtlı.
  { id: "midDahili",   label: "Dahili MID Sayaç",     icon: "RiDashboard3Line",  accent: "#14B8A6", desc: "Kasaya entegre sertifikalı MID enerji sayacı; ölçüm bazlı faturalandırmaya uygun.", labelEn: "Built-in MID Meter", descEn: "Certified MID energy meter integrated in the housing; suitable for metered billing." },
  { id: "plugplay",    label: "Tak-Çalıştır",         icon: "RiPlugLine",         accent: "#22C55E", desc: "Kur-tak-çalıştır; ek ayar gerektirmez.", labelEn: "Plug & Play", descEn: "Install, plug in and charge; no extra configuration needed." },
  { id: "safety",      label: "Güvenlik Korumaları",  icon: "RiShieldCheckLine",  accent: "#EF4444", desc: "Aşırı akım, kısa devre ve kaçak akıma karşı korumalar.", labelEn: "Safety Protections", descEn: "Protection against overcurrent, short circuit and residual current." },
  { id: "ik10",        label: "IK10 Darbe Dayanımı",  icon: "RiHammerLine",       accent: "#78716C", desc: "IK10 darbe dayanımlı sağlam gövde.", labelEn: "IK10 Impact Resistance", descEn: "Robust IK10 impact-resistant housing." },
  { id: "amp6",        label: "6 Kademe Amper",       icon: "RiEqualizerLine",    accent: "#6366F1", desc: "6 kademeli amper ayarı (6–32A) ile esnek güç.", labelEn: "6-Step Current Setting", descEn: "Flexible power with a 6-step current setting (6–32A)." },
  // Yenilenen dış kasa — içi açılmadan dıştan klemens + dış montaj kulakları (2026-07-13).
  { id: "montaj",      label: "Kolay Montaj",         icon: "RiToolsLine",        accent: "#0EA5E9", desc: "Yenilenen dış kasa ile hızlı, dıştan bağlantılı montaj.", labelEn: "Easy Installation", descEn: "Fast installation with the redesigned housing and external connections." },
  // type2 / ccs2 / v2l are technical attributes (connector / capability),
  // not general feature flags — they belong in the Çevresel/Bağlantı spec
  // groups instead. Existing products that still carry these ids in
  // product.features just no-op gracefully because featureById returns
  // undefined and the renderers skip nullish lookups.
];

export const featureById = (id: string) => PRODUCT_FEATURES.find(f => f.id === id);
