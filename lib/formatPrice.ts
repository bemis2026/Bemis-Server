// Price-string formatter for the product detail page's price rows.
//
// IMPORTANT: stored values are in **EUR** (operator uploads list prices
// in EUR — e.g. "350", "€350", "350 EUR"). We parse the number out and
// reformat under the active currency without touching surrounding
// non-numeric content (so admin notes like "Sorunuz" or "Var" pass
// through unchanged).

export type Currency = "TRY" | "EUR";

const NUM_RE = /(\d{1,3}(?:[.,]\d{3})+|\d+)([.,]\d+)?/;

/**
 * Convert a raw price string (assumed EUR base) to the active currency.
 *
 * - tryPerEur: live TCMB rate (TRY per 1 EUR).
 * - If a number can't be parsed, the original string is returned
 *   unchanged.
 */
export function formatPrice(raw: string | undefined | null, currency: Currency, tryPerEur: number): string {
  if (!raw) return "";
  const m = raw.match(NUM_RE);
  if (!m) return raw;
  // Turkish/European number format: thousands separator may be "." or ",".
  // Normalize to a JS-parseable form.
  const whole = m[1].replace(/[.,]/g, "");
  const frac = m[2] ? m[2].replace(/[.,]/, ".") : "";
  const eurAmount = Number(whole + frac);
  if (!isFinite(eurAmount) || eurAmount <= 0) return raw;

  if (currency === "EUR") {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
      .format(eurAmount);
  }
  const tryAmount = eurAmount * tryPerEur;
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })
    .format(tryAmount);
}
