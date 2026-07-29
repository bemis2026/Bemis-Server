// ⚠️ "merkez" coğrafi bir bölge DEĞİL — Bursa merkez (genel müdürlük) bölgesi.
// Haritada kendi kırmızı pin'i var (DealerNetwork BURSA_HQ) ve kendi bölge
// temsilcisini gösterir. 2026-07-29'da kullanıcı isteğiyle Bursa ve Eskişehir
// bayileri Marmara / İç Anadolu'dan alınıp bu bölgeye bağlandı.
export type TurkeyRegionId =
  | "marmara"
  | "ege"
  | "akdeniz"
  | "ic_anadolu"
  | "karadeniz"
  | "dogu"
  | "guneydogu"
  | "merkez";

export type TurkeyRegion = { id: TurkeyRegionId; label: string };

export type TurkeyCity = { id: string; label: string; region: TurkeyRegionId };

export const TURKEY_REGIONS: TurkeyRegion[] = [
  { id: "marmara",    label: "Marmara"          },
  { id: "ege",        label: "Ege"              },
  { id: "akdeniz",    label: "Akdeniz"          },
  { id: "ic_anadolu", label: "İç Anadolu"       },
  { id: "karadeniz",  label: "Karadeniz"        },
  { id: "dogu",       label: "Doğu Anadolu"     },
  { id: "guneydogu",  label: "Güneydoğu"        },
  { id: "merkez",     label: "Bursa Merkez"     },
];

export const TURKEY_CITIES: TurkeyCity[] = [
  // Marmara (11)
  { id: "balikesir",      label: "Balıkesir",      region: "marmara" },
  { id: "bilecik",        label: "Bilecik",        region: "marmara" },
  { id: "bursa",          label: "Bursa",          region: "merkez" },
  { id: "canakkale",      label: "Çanakkale",      region: "marmara" },
  { id: "edirne",         label: "Edirne",         region: "marmara" },
  { id: "istanbul",       label: "İstanbul",       region: "marmara" },
  { id: "kirklareli",     label: "Kırklareli",     region: "marmara" },
  { id: "kocaeli",        label: "Kocaeli",        region: "marmara" },
  { id: "sakarya",        label: "Sakarya",        region: "marmara" },
  { id: "tekirdag",       label: "Tekirdağ",       region: "marmara" },
  { id: "yalova",         label: "Yalova",         region: "marmara" },
  // Ege (8)
  { id: "afyonkarahisar", label: "Afyonkarahisar", region: "ege" },
  { id: "aydin",          label: "Aydın",          region: "ege" },
  { id: "denizli",        label: "Denizli",        region: "ege" },
  { id: "izmir",          label: "İzmir",          region: "ege" },
  { id: "kutahya",        label: "Kütahya",        region: "ege" },
  { id: "manisa",         label: "Manisa",         region: "ege" },
  { id: "mugla",          label: "Muğla",          region: "ege" },
  { id: "usak",           label: "Uşak",           region: "ege" },
  // Akdeniz (8)
  { id: "adana",          label: "Adana",          region: "akdeniz" },
  { id: "antalya",        label: "Antalya",        region: "akdeniz" },
  { id: "burdur",         label: "Burdur",         region: "akdeniz" },
  { id: "hatay",          label: "Hatay",          region: "akdeniz" },
  { id: "isparta",        label: "Isparta",        region: "akdeniz" },
  { id: "kahramanmaras",  label: "Kahramanmaraş",  region: "akdeniz" },
  { id: "mersin",         label: "Mersin",         region: "akdeniz" },
  { id: "osmaniye",       label: "Osmaniye",       region: "akdeniz" },
  // İç Anadolu (13)
  { id: "aksaray",        label: "Aksaray",        region: "ic_anadolu" },
  { id: "ankara",         label: "Ankara",         region: "ic_anadolu" },
  { id: "cankiri",        label: "Çankırı",        region: "ic_anadolu" },
  { id: "eskisehir",      label: "Eskişehir",      region: "merkez" },
  { id: "karaman",        label: "Karaman",        region: "ic_anadolu" },
  { id: "kayseri",        label: "Kayseri",        region: "ic_anadolu" },
  { id: "kirikkale",      label: "Kırıkkale",      region: "ic_anadolu" },
  { id: "kirsehir",       label: "Kırşehir",       region: "ic_anadolu" },
  { id: "konya",          label: "Konya",          region: "ic_anadolu" },
  { id: "nevsehir",       label: "Nevşehir",       region: "ic_anadolu" },
  { id: "nigde",          label: "Niğde",          region: "ic_anadolu" },
  { id: "sivas",          label: "Sivas",          region: "ic_anadolu" },
  { id: "yozgat",         label: "Yozgat",         region: "ic_anadolu" },
  // Karadeniz (18)
  { id: "amasya",         label: "Amasya",         region: "karadeniz" },
  { id: "artvin",         label: "Artvin",         region: "karadeniz" },
  { id: "bartin",         label: "Bartın",         region: "karadeniz" },
  { id: "bayburt",        label: "Bayburt",        region: "karadeniz" },
  { id: "bolu",           label: "Bolu",           region: "karadeniz" },
  { id: "corum",          label: "Çorum",          region: "karadeniz" },
  { id: "duzce",          label: "Düzce",          region: "karadeniz" },
  { id: "giresun",        label: "Giresun",        region: "karadeniz" },
  { id: "gumushane",      label: "Gümüşhane",      region: "karadeniz" },
  { id: "karabuk",        label: "Karabük",        region: "karadeniz" },
  { id: "kastamonu",      label: "Kastamonu",      region: "karadeniz" },
  { id: "ordu",           label: "Ordu",           region: "karadeniz" },
  { id: "rize",           label: "Rize",           region: "karadeniz" },
  { id: "samsun",         label: "Samsun",         region: "karadeniz" },
  { id: "sinop",          label: "Sinop",          region: "karadeniz" },
  { id: "tokat",          label: "Tokat",          region: "karadeniz" },
  { id: "trabzon",        label: "Trabzon",        region: "karadeniz" },
  { id: "zonguldak",      label: "Zonguldak",      region: "karadeniz" },
  // Doğu Anadolu (14)
  { id: "agri",           label: "Ağrı",           region: "dogu" },
  { id: "ardahan",        label: "Ardahan",        region: "dogu" },
  { id: "bingol",         label: "Bingöl",         region: "dogu" },
  { id: "bitlis",         label: "Bitlis",         region: "dogu" },
  { id: "elazig",         label: "Elazığ",         region: "dogu" },
  { id: "erzincan",       label: "Erzincan",       region: "dogu" },
  { id: "erzurum",        label: "Erzurum",        region: "dogu" },
  { id: "hakkari",        label: "Hakkari",        region: "dogu" },
  { id: "igdir",          label: "Iğdır",          region: "dogu" },
  { id: "kars",           label: "Kars",           region: "dogu" },
  { id: "malatya",        label: "Malatya",        region: "dogu" },
  { id: "mus",            label: "Muş",            region: "dogu" },
  { id: "tunceli",        label: "Tunceli",        region: "dogu" },
  { id: "van",            label: "Van",            region: "dogu" },
  // Güneydoğu Anadolu (9)
  { id: "adiyaman",       label: "Adıyaman",       region: "guneydogu" },
  { id: "batman",         label: "Batman",         region: "guneydogu" },
  { id: "diyarbakir",     label: "Diyarbakır",     region: "guneydogu" },
  { id: "gaziantep",      label: "Gaziantep",      region: "guneydogu" },
  { id: "kilis",          label: "Kilis",          region: "guneydogu" },
  { id: "mardin",         label: "Mardin",         region: "guneydogu" },
  { id: "siirt",          label: "Siirt",          region: "guneydogu" },
  { id: "sanliurfa",      label: "Şanlıurfa",      region: "guneydogu" },
  { id: "sirnak",         label: "Şırnak",         region: "guneydogu" },
];

export const CITY_BY_ID: Record<string, TurkeyCity> = Object.fromEntries(
  TURKEY_CITIES.map((c) => [c.id, c])
);

export const REGION_BY_ID: Record<string, TurkeyRegion> = Object.fromEntries(
  TURKEY_REGIONS.map((r) => [r.id, r])
);

export function getCityRegion(cityId: string): TurkeyRegionId | undefined {
  return CITY_BY_ID[cityId]?.region;
}

export function getCityLabel(cityId: string): string {
  return CITY_BY_ID[cityId]?.label ?? cityId;
}

// Bursa Merkez (genel müdürlük) listelerde en başta gelir.
export const REGION_ORDER: Record<TurkeyRegionId, number> = {
  merkez: 0, marmara: 1, ege: 2, akdeniz: 3, ic_anadolu: 4, karadeniz: 5, dogu: 6, guneydogu: 7,
};

export function compareCityIds(a: string, b: string): number {
  const ra = CITY_BY_ID[a]?.region;
  const rb = CITY_BY_ID[b]?.region;
  if (ra && rb && ra !== rb) return REGION_ORDER[ra] - REGION_ORDER[rb];
  const la = CITY_BY_ID[a]?.label ?? a;
  const lb = CITY_BY_ID[b]?.label ?? b;
  return la.localeCompare(lb, "tr");
}
