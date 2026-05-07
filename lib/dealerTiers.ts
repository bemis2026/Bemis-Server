// Dealer-status tier shared between the public dealer list and the admin
// editor. Each tier maps to a colour that backs the brand-mark badge shown
// next to the dealer entry, so visitors can spot at a glance whether a
// listing is a standard authorised dealer, a strategic partner, or a full
// solution-partner-tier collaboration.
export type DealerTier = "standart" | "stratejik" | "partner";

export const DEALER_TIERS: { id: DealerTier; label: string; sub: string; color: string }[] = [
  { id: "standart",  label: "Standart Bayi",  sub: "Yetkili Bayi",                color: "#64748B" }, // slate-500
  { id: "stratejik", label: "Stratejik Bayi", sub: "Bölge Stratejik İş Ortağı",   color: "#F59E0B" }, // amber-500
  { id: "partner",   label: "Çözüm Ortağı",    sub: "Premium Solution Partner",     color: "#8B5CF6" }, // violet-500
];

export const TIER_META: Record<DealerTier, { label: string; sub: string; color: string }> = {
  standart:  { label: "Standart Bayi",  sub: "Yetkili Bayi",                color: "#64748B" },
  stratejik: { label: "Stratejik Bayi", sub: "Bölge Stratejik İş Ortağı",   color: "#F59E0B" },
  partner:   { label: "Çözüm Ortağı",    sub: "Premium Solution Partner",     color: "#8B5CF6" },
};

export function tierColor(tier?: string): string {
  return TIER_META[(tier as DealerTier)]?.color ?? TIER_META.standart.color;
}

export function tierLabel(tier?: string): string {
  return TIER_META[(tier as DealerTier)]?.label ?? TIER_META.standart.label;
}
