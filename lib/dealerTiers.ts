// Dealer-status tier shared between the public dealer list and the admin
// editor. Each tier maps to a colour that backs the brand-mark badge shown
// next to the dealer entry, so visitors can spot at a glance which Charge
// programme tier a listing belongs to.
//
// Tier ID'leri korunmuştur ("standart" / "stratejik" / "partner") —
// bin'deki mevcut dealer.tier değerleri kırılmasın. Label + renk
// güncellenerek üç-kademeli Charge programına remap edildi.
export type DealerTier = "standart" | "stratejik" | "partner";

export const DEALER_TIERS: { id: DealerTier; label: string; sub: string; color: string }[] = [
  { id: "standart",  label: "Charge Bayi",     sub: "Yetkili Bayi",        color: "#64748B" }, // slate-500
  { id: "stratejik", label: "Charge + Bayi",   sub: "Yetkili Bayi+",       color: "#3B82F6" }, // brand blue
  { id: "partner",   label: "Charge Pro Bayi", sub: "Premium Yetkili Bayi", color: "#F59E0B" }, // amber-500 — premium accent
];

export const TIER_META: Record<DealerTier, { label: string; sub: string; color: string }> = {
  standart:  { label: "Charge Bayi",     sub: "Yetkili Bayi",         color: "#64748B" },
  stratejik: { label: "Charge + Bayi",   sub: "Yetkili Bayi+",        color: "#3B82F6" },
  partner:   { label: "Charge Pro Bayi", sub: "Premium Yetkili Bayi", color: "#F59E0B" },
};

export function tierColor(tier?: string): string {
  return TIER_META[(tier as DealerTier)]?.color ?? TIER_META.standart.color;
}

export function tierLabel(tier?: string): string {
  return TIER_META[(tier as DealerTier)]?.label ?? TIER_META.standart.label;
}
