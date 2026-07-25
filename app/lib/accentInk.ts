// Accent rengini AYDINLIK modda beyaz zeminde okunur (WCAG AA ~4.5:1) hale getirir.
// Koyu modda parlak accent olduğu gibi döner (koyu zeminde iyi okunur). Aydınlıkta
// hue korunarak siyaha doğru adım adım karartılır (ör. #F59E0B amber → koyu kehribar).
//
// ⚠️ YALNIZ METİN (color:) için. Arka plan/rozet-dolgu/border PARLAK accent'te kalmalı
//    (badge bg, buton dolgusu, üst çubuk) — onlara accentInk UYGULAMA.
const _cache: Record<string, string> = {};

function hexToRgb(h: string): [number, number, number] {
  let s = h.replace("#", "").trim();
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function toHex(r: number, g: number, b: number): string {
  const h = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
function relLum(r: number, g: number, b: number): number {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
// beyaz (#fff, lum=1) zemine karşı kontrast
const contrastOnWhite = (r: number, g: number, b: number) => 1.05 / (relLum(r, g, b) + 0.05);

/**
 * @param hex   accent rengi (#RRGGBB veya #RGB)
 * @param isDark tema koyu mu (useTheme().theme === "dark")
 * @returns koyu modda hex; aydınlıkta beyaz zeminde ≥4.6:1 olacak kadar karartılmış hex
 */
export function accentInk(hex: string, isDark: boolean): string {
  if (isDark || !hex || hex[0] !== "#") return hex;
  const key = hex.toLowerCase();
  if (_cache[key]) return _cache[key];
  const [r, g, b] = hexToRgb(hex);
  if (contrastOnWhite(r, g, b) >= 4.6) { _cache[key] = hex; return hex; }
  let out = toHex(r, g, b);
  for (let t = 0.06; t <= 0.9; t += 0.06) {
    const rr = r * (1 - t), gg = g * (1 - t), bb = b * (1 - t);
    out = toHex(rr, gg, bb);
    if (contrastOnWhite(rr, gg, bb) >= 4.6) break;
  }
  _cache[key] = out;
  return out;
}
