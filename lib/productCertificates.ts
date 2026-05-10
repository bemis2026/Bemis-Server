// Product certification catalog — used by admin to toggle which quality
// marks a product carries, and by the public detail page to render small
// brand chips just under the description.
//
// IP ratings (IP54/IP65/IP67) are deliberately NOT here — they're a
// technical attribute that already lives in the Çevresel spec group, not a
// third-party certification.

export type ProductCertificate = {
  id: string;
  label: string;        // displayed in tooltip + admin row
  fullLabel: string;    // displayed in admin alongside the chip
  image: string;        // /public path
};

export const PRODUCT_CERTIFICATES: ProductCertificate[] = [
  { id: "ce",   label: "CE",   fullLabel: "CE Uygunluk İşareti",        image: "/certifications/ce.svg"   },
  { id: "tse",  label: "TSE",  fullLabel: "Türk Standartları Enstitüsü", image: "/certifications/tse.webp" },
  { id: "tuv",  label: "TÜV",  fullLabel: "TÜV Onaylı",                  image: "/certifications/tuv.svg"  },
  { id: "rohs", label: "RoHS", fullLabel: "RoHS Uyumlu",                 image: "/certifications/rohs.svg" },
];

export const certificateById = (id: string) =>
  PRODUCT_CERTIFICATES.find((c) => c.id === id);
