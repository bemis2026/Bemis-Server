// Lightweight price-string formatter used by the product detail page's
// "Fiyat" spec rows. The CMS stores price values as free-form strings
// (operator types "12.500" or "₺12.500" or "12500 TL"). We parse the
// number out and reformat it under the active currency without
// touching the rest of the value (so things like "Var", "Sorunuz" or
// "1.250 — 1.450" stay readable verbatim).

export type Currency = "TRY" | "EUR";

const NUM_RE = /(\d{1,3}(?:[.,]\d{3})+|\d+)([.,]\d+)?/;

/**
 * Convert a raw price string to the active currency.
 *
 * - eurPerTry: live TCMB rate (EUR per 1 TRY).
 * - The input is assumed to be TRY; if a number can't be parsed, the
 *   original string is returned unchanged (preserves admin notes like
 *   "Sorunuz" or "Var").
 */
export function formatPrice(raw: string | undefined | null, currency: Currency, eurPerTry: number): string {
  if (!raw) return "";
  const m = raw.match(NUM_RE);
  if (!m) return raw;
  // Turkish number format: thousands separator "." and decimal ",".
  // Normalize to a JS-parseable form.
  const whole = m[1].replace(/[.,]/g, "");
  const frac = m[2] ? m[2].replace(/[.,]/, ".") : "";
  const tryAmount = Number(whole + frac);
  if (!isFinite(tryAmount) || tryAmount <= 0) return raw;

  if (currency === "TRY") {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })
      .format(tryAmount);
  }
  const eurAmount = tryAmount * eurPerTry;
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
    .format(eurAmount);
}
