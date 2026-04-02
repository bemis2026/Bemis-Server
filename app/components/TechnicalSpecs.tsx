"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { HiArrowRight } from "react-icons/hi";
import {
  RiChargingPile2Line,
  RiBatteryChargeLine,
  RiFlashlightLine,
  RiPlugLine,
  RiCarLine,
  RiCpuLine,
} from "react-icons/ri";

const products = [
  {
    id: "wallbox",
    icon: RiChargingPile2Line,
    name: "AC Wallbox",
    subtitle: "Duvar Tipi Şarj İstasyonu",
    badge: "En Çok Satan",
    description:
      "Konut, iş yeri ve ticari parkinglar için geliştirilmiş, IP65 korumalı akıllı AC şarj istasyonu. Tek ve üç fazlı modelleriyle geniş uygulama yelpazesi.",
    specs: [
      { group: "Elektriksel", items: [
        { label: "Güç Seçenekleri", value: "7,4 kW · 11 kW · 22 kW" },
        { label: "Giriş Gerilimi", value: "230V (1F) / 400V (3F) ± %10" },
        { label: "Faz", value: "Monofaze & Trifaze" },
        { label: "Maksimum Akım", value: "16A · 32A" },
        { label: "Güç Faktörü", value: "> 0,98" },
        { label: "Verimlilik", value: "> %95" },
      ]},
      { group: "Konnektör & Kablo", items: [
        { label: "Konnektör Tipi", value: "Type 2 (IEC 62196-2)" },
        { label: "Kablo Uzunluğu", value: "4m (opsiyonel 6m)" },
        { label: "Kablo Kesiti", value: "5 × 4 mm²" },
        { label: "Kablo Tipi", value: "Spiralli esnek" },
      ]},
      { group: "Koruma & Güvenlik", items: [
        { label: "Koruma Sınıfı", value: "IP65" },
        { label: "Darbe Koruması", value: "IK10" },
        { label: "Çalışma Sıcaklığı", value: "-40°C / +55°C" },
        { label: "Topraklama Koruması", value: "Var (PE)" },
        { label: "Kaçak Akım", value: "6 mA DC / 30 mA AC" },
        { label: "Aşırı Akım Koruması", value: "Dahili MCB" },
      ]},
      { group: "İletişim & Kontrol", items: [
        { label: "Protokol", value: "OCPP 1.6 / OCPP 2.0" },
        { label: "Bağlantı", value: "4G / Wi-Fi / LAN (modele göre)" },
        { label: "Kullanıcı Arayüzü", value: "LED gösterge / RFID okuyucu" },
        { label: "Uzaktan Yönetim", value: "Evet (bulut tabanlı)" },
        { label: "Yük Dengeleme", value: "Dinamik (DLM)" },
      ]},
      { group: "Mekanik", items: [
        { label: "Ağırlık", value: "Yaklaşık 4,5 kg" },
        { label: "Boyutlar", value: "275 × 175 × 110 mm" },
        { label: "Montaj", value: "Duvar / direk montajı" },
        { label: "Renk", value: "Beyaz / Siyah (opsiyonel)" },
        { label: "Malzeme", value: "UV dayanımlı ABS" },
      ]},
      { group: "Sertifikalar", items: [
        { label: "Elektriksel", value: "CE · IEC 61851-1 · IEC 62196" },
        { label: "Kalite", value: "ISO 9001:2015" },
        { label: "Üretim", value: "Yerli Üretim (Bursa OSB)" },
        { label: "Garanti", value: "2 yıl" },
      ]},
    ],
  },
  {
    id: "portable",
    icon: RiBatteryChargeLine,
    name: "Taşınabilir Şarj",
    subtitle: "Plug & Play Şarj Cihazı",
    badge: "Yeni",
    description:
      "Sabit kurulum gerektirmeyen, standart ev prizinden çalışan taşınabilir EV şarj cihazı. İş seyahatleri, uzun yolculuklar ve yedek şarj için ideal.",
    specs: [
      { group: "Elektriksel", items: [
        { label: "Güç", value: "2,3 kW · 3,7 kW · 7,4 kW" },
        { label: "Giriş", value: "230V AC, 50Hz" },
        { label: "Akım", value: "10A / 16A / 32A (ayarlanabilir)" },
        { label: "Verimlilik", value: "> %93" },
      ]},
      { group: "Konnektör", items: [
        { label: "Araç Tarafı", value: "Type 2 (IEC 62196-2)" },
        { label: "Şebeke Tarafı", value: "Schuko (CEE 7/4)" },
        { label: "Kablo Uzunluğu", value: "5m (dahili)" },
        { label: "Kablo Kesiti", value: "3 × 2,5 mm²" },
      ]},
      { group: "Koruma & Güvenlik", items: [
        { label: "Koruma Sınıfı", value: "IP54" },
        { label: "Topraklama Tespiti", value: "Aktif — şarj engellenir" },
        { label: "Sıcaklık Koruması", value: "Termal kesme" },
        { label: "Kaçak Akım", value: "6 mA DC izleme" },
        { label: "Aşırı Yük", value: "Otomatik kesme" },
      ]},
      { group: "Kullanım & Taşınabilirlik", items: [
        { label: "Ağırlık", value: "Yaklaşık 700 g" },
        { label: "Boyutlar", value: "195 × 75 × 45 mm" },
        { label: "LED Gösterge", value: "5 renk durum LED'i" },
        { label: "Sertlik", value: "Dayanıklı ABS muhafaza" },
        { label: "Garanti", value: "2 yıl" },
      ]},
    ],
  },
  {
    id: "dc-cable",
    icon: RiFlashlightLine,
    name: "DC Şarj Kablosu",
    subtitle: "CCS / CHAdeMO Hızlı Şarj",
    badge: null,
    description:
      "DC hızlı şarj istasyonları ile elektrikli araçlar arasında güvenilir ve yüksek performanslı güç aktarımı sağlayan profesyonel şarj kablosu.",
    specs: [
      { group: "Elektriksel Özellikler", items: [
        { label: "Maksimum Güç", value: "350 kW" },
        { label: "Maksimum Gerilim", value: "1000V DC" },
        { label: "Maksimum Akım", value: "500A" },
        { label: "Konnektör Isıtması", value: "Aktif su soğutmalı (500A model)" },
        { label: "İletken Kesiti", value: "70 mm² (güç) · 0,5 mm² (sinyal)" },
        { label: "İletken Malzeme", value: "Tinsil bakır alaşımı" },
      ]},
      { group: "Konnektör Tipleri", items: [
        { label: "CCS Combo 2", value: "IEC 62196-3 Tip 2 DC" },
        { label: "CHAdeMO", value: "JEVS G105-1993 (rev. 2.0)" },
        { label: "GB/T DC", value: "GB/T 20234.3 (opsiyonel)" },
        { label: "İstasyon Tarafı", value: "Sabit fişli (fabrika montajı)" },
      ]},
      { group: "Kablo Yapısı", items: [
        { label: "İzolasyon", value: "TPE (TPU + XLPE + PVC çok katmanlı)" },
        { label: "Ekran", value: "Örgülü çelik + alüminyum folyo" },
        { label: "Kılıf", value: "Soğuk ortam dayanımlı elastomer" },
        { label: "Bükülme Yarıçapı", value: "Min. 10 × çap (kalıcı)" },
        { label: "Çekme Dayanımı", value: "≥ 200 N" },
        { label: "Uzunluk Seçenekleri", value: "1,5m · 3m · 5m · 7m · özel" },
      ]},
      { group: "Koruma & Dayanım", items: [
        { label: "Koruma Sınıfı", value: "IP67 (konnektör bağlıyken)" },
        { label: "Darbe Dayanımı", value: "IK08" },
        { label: "Çalışma Sıcaklığı", value: "-40°C / +90°C" },
        { label: "UV Dayanımı", value: "Evet (dış mekan sertifikalı)" },
        { label: "Kimyasal Direnç", value: "Yağ · tuz · asit dirençli" },
        { label: "Bükülme Ömrü", value: "> 20.000 döngü" },
      ]},
      { group: "Sinyal & Kontrol", items: [
        { label: "Pilot Hat", value: "CP / PP sinyalleme hattı" },
        { label: "Haberleşme", value: "CAN Bus / PLC (CHAdeMO)" },
        { label: "Konnektör Kilidi", value: "Elektromanyetik (opsiyonel)" },
        { label: "Sıcaklık Sensörü", value: "Konnektör içi NTC sensör" },
      ]},
      { group: "Sertifikalar", items: [
        { label: "Standartlar", value: "IEC 62893-4 · IEC 62196-3" },
        { label: "Güvenlik", value: "CE · TÜV · UL (modele göre)" },
        { label: "Garanti", value: "2 yıl" },
      ]},
    ],
  },
  {
    id: "ac-cable",
    icon: RiPlugLine,
    name: "AC Şarj Kablosu",
    subtitle: "Type 2 — Type 2 Modu 3",
    badge: null,
    description:
      "AC şarj istasyonu ile araç arasında güvenli ve verimli güç aktarımı sağlayan Modu 3 uyumlu şarj kablosu. Ev ve ticari kullanıma uygun.",
    specs: [
      { group: "Elektriksel", items: [
        { label: "Maksimum Güç", value: "22 kW (3 × 32A)" },
        { label: "Gerilim", value: "230V (1F) / 400V (3F)" },
        { label: "Maksimum Akım", value: "16A / 32A (model seçimine göre)" },
        { label: "İletken Kesiti", value: "5 × 2,5 mm² · 5 × 4 mm² · 5 × 6 mm²" },
        { label: "İletken", value: "Tinsil bakır esnek tel" },
      ]},
      { group: "Konnektör", items: [
        { label: "Her İki Uç", value: "Type 2 (IEC 62196-2)" },
        { label: "Konnektör Gövdesi", value: "Cam elyaf takviyeli PA (GF30)" },
        { label: "Kontakt Malzeme", value: "Gümüş kaplı bakır" },
        { label: "Kilitleme", value: "Mekanik mandal + PP koruyucu kapak" },
        { label: "Tutma Kuvveti", value: "≥ 80 N (IEC 62196 uyumu)" },
      ]},
      { group: "Kablo Yapısı", items: [
        { label: "İzolasyon", value: "XLPE birincil izolasyon" },
        { label: "Kılıf", value: "Soğuk bükülür elastomer (TPE)" },
        { label: "Ekran", value: "Alüminyum folyo + örgü (EMC)" },
        { label: "Renk", value: "Siyah / Gri (modele göre)" },
        { label: "Uzunluk", value: "5m · 7m · 10m · özel" },
        { label: "Bükülme Ömrü", value: "> 15.000 döngü" },
      ]},
      { group: "Koruma", items: [
        { label: "Koruma Sınıfı", value: "IP54 (kullanımda)" },
        { label: "Çalışma Sıcaklığı", value: "-30°C / +50°C" },
        { label: "UV Dayanımı", value: "Evet" },
        { label: "Bükülme Yarıçapı", value: "Min. 7,5 × çap" },
      ]},
      { group: "Sertifikalar", items: [
        { label: "Standart", value: "IEC 62893-2 · IEC 62196-2" },
        { label: "Güvenlik", value: "CE · VDE · TÜV" },
        { label: "Garanti", value: "2 yıl" },
      ]},
    ],
  },
  {
    id: "v2l",
    icon: RiCarLine,
    name: "V2L / C2L Aksesuar",
    subtitle: "Vehicle-to-Load & Charger-to-Load",
    badge: "İnovatif",
    description:
      "Elektrikli araç bataryasını veya şarj cihazını harici güç kaynağına dönüştüren adaptör sistemi. Kamp, acil güç ve iş sahası uygulamaları için.",
    specs: [
      { group: "V2L (Vehicle to Load)", items: [
        { label: "Çalışma Prensibi", value: "Type 2 → şebeke çıkışı (araç inverteri kullanır)" },
        { label: "Maksimum Çıkış Gücü", value: "3,6 kW (araç kapasitesine göre değişir)" },
        { label: "Çıkış Gerilimi", value: "230V AC, 50Hz" },
        { label: "Maksimum Akım", value: "16A" },
        { label: "Uyumlu Araçlar", value: "Hyundai Ioniq 5/6, Kia EV6, Ford Mustang vb." },
      ]},
      { group: "C2L (Charger to Load)", items: [
        { label: "Çalışma Prensibi", value: "Şarj cihazı → Type 2 → cihaza güç" },
        { label: "Uygulamalar", value: "Saha aydınlatma, alet kullanımı, kamp" },
        { label: "Konnektör", value: "Type 2 erkek giriş · Schuko çıkış" },
        { label: "Güvenlik", value: "Topraklama izleme · aşırı akım koruması" },
      ]},
      { group: "Mekanik", items: [
        { label: "Gövde Malzeme", value: "Cam elyaf takviyeli PA66-GF30" },
        { label: "Koruma Sınıfı", value: "IP44 (kullanımda)" },
        { label: "Kablo Uzunluğu", value: "1,5m" },
        { label: "Ağırlık", value: "Yaklaşık 350g" },
        { label: "Çalışma Sıcaklığı", value: "-20°C / +45°C" },
      ]},
      { group: "Sertifikalar", items: [
        { label: "Standart", value: "IEC 62196-2 · IEC 61851-1" },
        { label: "Güvenlik", value: "CE" },
        { label: "Garanti", value: "2 yıl" },
      ]},
    ],
  },
  {
    id: "electronics",
    icon: RiCpuLine,
    name: "Elektronik Kart",
    subtitle: "Dahili Kontrol Ünitesi (ECU)",
    badge: "Tescilli Tasarım",
    description:
      "Bemis E-V Charge cihazlarının kalbinde yeralan yerli tasarım elektronik kontrol kartı. OCPP protokolü, güç yönetimi ve güvenlik işlevlerinin tamamı bu kart üzerinde çalışır.",
    specs: [
      { group: "İşlemci & Bellek", items: [
        { label: "MCU", value: "32-bit ARM Cortex-M4 (180 MHz)" },
        { label: "Flash Bellek", value: "1 MB (firmware + OTA)" },
        { label: "RAM", value: "256 KB SRAM" },
        { label: "RTC", value: "Gerçek zamanlı saat (pil yedekli)" },
        { label: "Güncelleme", value: "OTA (Over-the-Air) firmware update" },
      ]},
      { group: "İletişim Arayüzleri", items: [
        { label: "Ethernet", value: "10/100 Mbps (opsiyonel)" },
        { label: "Wi-Fi", value: "IEEE 802.11 b/g/n" },
        { label: "4G/LTE", value: "Cat-M1 modem (dahili, modele göre)" },
        { label: "RFID", value: "ISO 14443 / 15693 okuyucu (13,56 MHz)" },
        { label: "RS-485", value: "Modbus RTU (harici sayaç entegrasyonu)" },
        { label: "CAN Bus", value: "Enerji yönetim sistemi bağlantısı" },
      ]},
      { group: "Güç Yönetimi", items: [
        { label: "Güç Ölçümü", value: "Aktif, reaktif, görünür güç (±1% doğruluk)" },
        { label: "Enerji Sayacı", value: "Kümülatif kWh (IEC 62053-21)" },
        { label: "Dinamik Yük Denge", value: "DLM — çoklu istasyon koordinasyonu" },
        { label: "Zamanlamalı Şarj", value: "Programlanabilir şarj tarifesi" },
        { label: "Güç Kısıtlama", value: "Uzaktan veya lokal %10–%100 ayar" },
      ]},
      { group: "Güvenlik & Koruma", items: [
        { label: "CP Hattı İzleme", value: "IEC 61851-1 Durum A/B/C/D/E/F" },
        { label: "PE (Toprak) İzleme", value: "Sürekli aktif izleme" },
        { label: "DC Kaçak Akım", value: "6 mA DC ayrık sensör" },
        { label: "Sıcaklık İzleme", value: "Kart + konnektör NTC sensörleri" },
        { label: "Aşırı gerilim koruması", value: "TVS diyot + MOV" },
        { label: "Güvenli Boot", value: "Şifreli firmware imzalama" },
      ]},
      { group: "OCPP & Bulut", items: [
        { label: "Desteklenen Protokol", value: "OCPP 1.6J · OCPP 2.0.1" },
        { label: "TLS Şifreleme", value: "TLS 1.2 / 1.3" },
        { label: "Heartbeat", value: "Yapılandırılabilir (varsayılan 60s)" },
        { label: "İşlem Depolama", value: "Yerel 500 işlem (offline mode)" },
        { label: "Yapılandırma", value: "Uzaktan OCPP ChangeConfiguration" },
      ]},
      { group: "Üretim & Sertifikasyon", items: [
        { label: "PCB Üretimi", value: "Türkiye (Bursa OSB tesisi)" },
        { label: "Montaj", value: "SMT + THT otomatik hat" },
        { label: "Test", value: "ICT + fonksiyonel test (100%)" },
        { label: "EMC", value: "EN 55032 · EN 61000-4 serisi" },
        { label: "Kalite", value: "IPC-A-610 Sınıf 2" },
      ]},
    ],
  },
];

const BLUE = "#3B82F6";

export default function TechnicalSpecs() {
  const [activeProduct, setActiveProduct] = useState("wallbox");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const d = theme === "dark";

  const current = products.find((p) => p.id === activeProduct) || products[0];

  return (
    <section id="tech-specs" className="py-12 lg:py-16 bg-[#0A0A0A] overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white"
            >
              Ürün Detayları
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/35 text-sm max-w-xs sm:text-right"
            >
              Her ürünün tam teknik dokümanını indirmek için irtibata geçin
            </motion.p>
          </div>
        </div>

        {/* Product Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide"
        >
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(p.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeProduct === p.id
                  ? "bg-[#1e1e1e] text-white border border-white/20"
                  : "bg-[#111111] border border-[#1e1e1e] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <p.icon className="text-base flex-shrink-0" />
              <span className="whitespace-nowrap">{p.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Product detail */}
        <motion.div
          key={activeProduct}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Product header */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                <current.icon className="text-2xl text-white/60" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-xl">{current.name}</h3>
                  {current.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/6 text-white/50 border border-white/12">
                      {current.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mb-2">{current.subtitle}</p>
                <p className="text-white/60 text-sm leading-relaxed">{current.description}</p>
              </div>
            </div>
          </div>

          {/* Spec groups grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {current.specs.map((group, gi) => (
              <div
                key={gi}
                className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden"
              >
                {/* Group header */}
                <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center gap-2">
                  <div className="w-1.5 h-4 rounded-full bg-white/20" />
                  <span className="text-white font-semibold text-sm">{group.group}</span>
                </div>
                {/* Items */}
                <div className="divide-y divide-[#161616]">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="px-4 py-2.5 flex items-start justify-between gap-3">
                      <span className="text-white/40 text-xs leading-relaxed flex-shrink-0 max-w-[45%]">
                        {item.label}
                      </span>
                      <span className="text-white text-xs font-medium text-right leading-relaxed">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Download CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
              style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
            >
              Teknik Doküman Talep Et
              <HiArrowRight />
            </button>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
              style={{ background: d ? `${BLUE}15` : `${BLUE}10`, border: d ? `1px solid ${BLUE}35` : `1px solid ${BLUE}28`, color: d ? "#93C5FD" : BLUE }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}25` : `${BLUE}18`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = d ? `${BLUE}15` : `${BLUE}10`; }}
            >
              Fiyat Teklifi Al
              <HiArrowRight />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
