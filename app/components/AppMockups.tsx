"use client";

/*
 * PAYLAŞILAN MOCKUP EKRANLARI — Bemis E-V Charge uygulama + web panel.
 * ---------------------------------------------------------------------
 * Hem anasayfa (SmartCharger) hem ürün sayfası (ProductDetailClient "Akıllı
 * Yönetim") AYNI ekranı kullanır → "iç görseller birebir aynı" (kullanıcı isteği).
 * Ekranlar SABİT bir taban boyutta tasarlanır, `w` (hedef genişlik) ile orantılı
 * ölçeklenir; her host kendi çerçevesini (telefon kasası / tarayıcı) korur, içine
 * bu ekranı koyar. Marka: Bemis kırmızısı #E31E24 + siyah-beyaz tonlar + logo.
 * Ekranlar DAİMA koyu (gerçek app dark UI) — site temasından bağımsız.
 */
import {
  RiFlashlightFill, RiWifiFill, RiSignalTowerFill, RiBattery2ChargeFill,
  RiMore2Fill, RiArrowRightUpLine,
} from "react-icons/ri";

export const RED = "#E31E24";
export const RED_DEEP = "#DC0E1A";
const LOGO = "/favicon-white-192.png"; // beyaz "B" işareti

// ── Ölçek sarmalayıcı: tasarımı taban boyutta tutar, hedef genişliğe ölçekler ──
function ScreenBox({ w, baseW, baseH, radius = 0, children }: { w: number; baseW: number; baseH: number; radius?: number; children: React.ReactNode }) {
  const s = w / baseW;
  return (
    <div style={{ width: w, height: baseH * s, overflow: "hidden", borderRadius: radius }}>
      <div style={{ width: baseW, height: baseH, transform: `scale(${s})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

function BemisMark({ size = 26 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, borderRadius: size * 0.28,
        background: `linear-gradient(145deg, ${RED} 0%, ${RED_DEEP} 100%)`,
        boxShadow: `0 3px 10px ${RED}55`, flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO} alt="" width={size} height={size} style={{ width: "62%", height: "62%", objectFit: "contain" }} />
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  TELEFON EKRANI — aktif şarj oturumu (taban 220×455)
// ════════════════════════════════════════════════════════════════════════
const PHONE_BASE_W = 220, PHONE_BASE_H = 455;

export function PhoneScreen({ w = 220 }: { w?: number }) {
  return (
    <ScreenBox w={w} baseW={PHONE_BASE_W} baseH={PHONE_BASE_H}>
      <div style={{ width: PHONE_BASE_W, height: PHONE_BASE_H, background: "linear-gradient(180deg,#15161c 0%,#0b0c11 100%)", color: "#fff", padding: "12px 14px", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
        {/* durum çubuğu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          <span>9:41</span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            <RiSignalTowerFill size={9} /><RiWifiFill size={9} /><RiBattery2ChargeFill size={11} style={{ color: RED }} />
          </span>
        </div>

        {/* başlık — logo + marka */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <BemisMark size={26} />
          <div style={{ lineHeight: 1.15, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "-0.01em" }}>Bemis E-V Charge</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Akıllı Şarj Yönetimi</div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 8, fontWeight: 700, color: "#34D399", background: "rgba(52,211,153,0.12)", borderRadius: 999, padding: "3px 7px" }}>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: "#34D399" }} />Bağlı
          </span>
        </div>

        {/* şarj halkası */}
        <div style={{ display: "flex", justifyContent: "center", margin: "14px 0 10px" }}>
          <div style={{ position: "relative", width: 104, height: 104, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="104" height="104" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="52" cy="52" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
              <circle cx="52" cy="52" r="46" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - 0.68)} />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
              <RiFlashlightFill size={16} style={{ color: RED }} />
              <span style={{ fontSize: 26, fontWeight: 900, marginTop: 2 }}>68%</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Şarj oluyor</span>
            </div>
          </div>
        </div>

        {/* oturum istatistikleri */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
          {[["Güç", "11 kW"], ["Süre", "01:22"], ["Tutar", "₺84,20"]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "7px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* ünite listesi */}
        <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>İstasyonlarım</div>
          {[["Ünite #1", "Şarjda", RED], ["Ünite #2", "Müsait", "rgba(255,255,255,0.3)"]].map(([n, st, c]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "7px 9px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: c as string }} />
                <span style={{ fontSize: 9.5, fontWeight: 600 }}>{n}</span>
              </span>
              <span style={{ fontSize: 8.5, color: c as string, fontWeight: 600 }}>{st}</span>
            </div>
          ))}
        </div>

        {/* durdur butonu */}
        <div style={{ marginTop: "auto", paddingTop: 10 }}>
          <div style={{ height: 30, borderRadius: 11, background: `linear-gradient(135deg,${RED} 0%,${RED_DEEP} 100%)`, boxShadow: `0 6px 16px ${RED}45`, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>Şarjı Durdur</span>
          </div>
        </div>
      </div>
    </ScreenBox>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  WEB PANEL EKRANI — şarj yönetim paneli (taban 300×200)
// ════════════════════════════════════════════════════════════════════════
const WEB_BASE_W = 300, WEB_BASE_H = 200;

export function WebScreen({ w = 300 }: { w?: number }) {
  const bars = [46, 62, 52, 78, 58, 88, 70];
  return (
    <ScreenBox w={w} baseW={WEB_BASE_W} baseH={WEB_BASE_H}>
      <div style={{ width: WEB_BASE_W, height: WEB_BASE_H, background: "#0f1015", color: "#fff", padding: 12, display: "flex", flexDirection: "column", gap: 9, fontFamily: "system-ui, sans-serif" }}>
        {/* üst bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BemisMark size={22} />
          <div style={{ flex: 1, lineHeight: 1.1 }}>
            <div style={{ fontSize: 11, fontWeight: 800 }}>Şarj Yönetim Paneli</div>
            <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Bemis E-V Charge · CSMS</div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 8, fontWeight: 700, color: "#34D399", background: "rgba(52,211,153,0.12)", borderRadius: 999, padding: "3px 8px" }}>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: "#34D399" }} />CANLI
          </span>
        </div>

        {/* KPI kartları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
          {[
            { v: "12", l: "Aktif Şarj", accent: true },
            { v: "4", l: "Müsait", accent: false },
            { v: "₺2.480", l: "Bugünkü Gelir", accent: false },
          ].map((k) => (
            <div key={k.l} style={{ background: k.accent ? `${RED}14` : "rgba(255,255,255,0.04)", border: `1px solid ${k.accent ? RED + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "9px 8px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: k.accent ? RED : "#fff", lineHeight: 1 }}>{k.v}</div>
              <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.45)", marginTop: 3, fontWeight: 600 }}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* enerji grafiği */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 9, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>Son 7 Gün · Enerji (kWh)</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 8, fontWeight: 700, color: RED }}>+18% <RiArrowRightUpLine size={9} /></span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 5 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i === 5 ? `linear-gradient(180deg,${RED} 0%,${RED_DEEP} 100%)` : `${RED}3a` }} />
            ))}
          </div>
        </div>

        {/* oturum satırı */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "6px 9px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: RED }} />
            <span style={{ fontSize: 8.5, fontWeight: 600 }}>Ünite #1 · Bursa OSB</span>
          </span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: RED }}>11 kW · Şarjda</span>
          <RiMore2Fill size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </ScreenBox>
  );
}
