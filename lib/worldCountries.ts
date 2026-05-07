// Curated world country list for the admin "Ülke Ekle" picker. Covers all
// UN member states the user is likely to target. Coordinates are rough
// country centroids (visual placement only — admin can fine-tune).
//
// Names are in Turkish (the public site uses TR by default; EN comes from
// the auto-translate flow at save time).
export type WorldCountry = {
  code: string;       // ISO-2 uppercase
  name: string;       // localized name (Turkish)
  lat: number;
  lng: number;
};

export const WORLD_COUNTRIES: WorldCountry[] = [
  // Europe
  { code: "DE", name: "Almanya",                    lat: 51.2,  lng: 10.4 },
  { code: "AT", name: "Avusturya",                  lat: 47.5,  lng: 14.5 },
  { code: "BE", name: "Belçika",                    lat: 50.5,  lng: 4.5  },
  { code: "BY", name: "Belarus",                    lat: 53.7,  lng: 27.9 },
  { code: "BG", name: "Bulgaristan",                lat: 42.7,  lng: 25.5 },
  { code: "CZ", name: "Çek Cumhuriyeti",            lat: 49.8,  lng: 15.5 },
  { code: "DK", name: "Danimarka",                  lat: 56.3,  lng: 9.5  },
  { code: "EE", name: "Estonya",                    lat: 58.6,  lng: 25.0 },
  { code: "FI", name: "Finlandiya",                 lat: 61.9,  lng: 25.7 },
  { code: "FR", name: "Fransa",                     lat: 46.6,  lng: 2.2  },
  { code: "HR", name: "Hırvatistan",                lat: 45.1,  lng: 15.2 },
  { code: "NL", name: "Hollanda",                   lat: 52.1,  lng: 5.3  },
  { code: "GB", name: "İngiltere (Birleşik Krallık)", lat: 55.4, lng: -3.4 },
  { code: "IE", name: "İrlanda",                    lat: 53.1,  lng: -8.2 },
  { code: "ES", name: "İspanya",                    lat: 40.5,  lng: -3.7 },
  { code: "SE", name: "İsveç",                      lat: 60.1,  lng: 18.6 },
  { code: "CH", name: "İsviçre",                    lat: 46.8,  lng: 8.2  },
  { code: "IT", name: "İtalya",                     lat: 41.9,  lng: 12.6 },
  { code: "IS", name: "İzlanda",                    lat: 64.9,  lng: -19.0 },
  { code: "LV", name: "Letonya",                    lat: 56.9,  lng: 24.6 },
  { code: "LT", name: "Litvanya",                   lat: 55.2,  lng: 23.9 },
  { code: "LU", name: "Lüksemburg",                 lat: 49.8,  lng: 6.1  },
  { code: "HU", name: "Macaristan",                 lat: 47.2,  lng: 19.5 },
  { code: "MT", name: "Malta",                      lat: 35.9,  lng: 14.4 },
  { code: "MD", name: "Moldova",                    lat: 47.4,  lng: 28.4 },
  { code: "NO", name: "Norveç",                     lat: 60.5,  lng: 8.5  },
  { code: "PL", name: "Polonya",                    lat: 51.9,  lng: 19.1 },
  { code: "PT", name: "Portekiz",                   lat: 39.4,  lng: -8.2 },
  { code: "RO", name: "Romanya",                    lat: 45.9,  lng: 24.9 },
  { code: "RU", name: "Rusya",                      lat: 61.5,  lng: 105.3 },
  { code: "SK", name: "Slovakya",                   lat: 48.7,  lng: 19.7 },
  { code: "SI", name: "Slovenya",                   lat: 46.1,  lng: 14.8 },
  { code: "UA", name: "Ukrayna",                    lat: 48.4,  lng: 31.2 },
  { code: "GR", name: "Yunanistan",                 lat: 39.1,  lng: 21.8 },

  // Balkans
  { code: "AL", name: "Arnavutluk",                 lat: 41.2,  lng: 20.0 },
  { code: "BA", name: "Bosna Hersek",               lat: 43.9,  lng: 17.7 },
  { code: "ME", name: "Karadağ",                    lat: 42.7,  lng: 19.4 },
  { code: "XK", name: "Kosova",                     lat: 42.6,  lng: 20.9 },
  { code: "MK", name: "Kuzey Makedonya",            lat: 41.6,  lng: 21.7 },
  { code: "RS", name: "Sırbistan",                  lat: 44.0,  lng: 21.0 },
  { code: "CY", name: "Kıbrıs",                     lat: 35.1,  lng: 33.4 },

  // Middle East & Caucasus
  { code: "AE", name: "Birleşik Arap Emirlikleri",  lat: 23.4,  lng: 53.8 },
  { code: "BH", name: "Bahreyn",                    lat: 26.0,  lng: 50.5 },
  { code: "IR", name: "İran",                       lat: 32.4,  lng: 53.7 },
  { code: "IQ", name: "Irak",                       lat: 33.2,  lng: 43.7 },
  { code: "IL", name: "İsrail",                     lat: 31.0,  lng: 34.9 },
  { code: "JO", name: "Ürdün",                      lat: 30.6,  lng: 36.2 },
  { code: "KW", name: "Kuveyt",                     lat: 29.3,  lng: 47.5 },
  { code: "LB", name: "Lübnan",                     lat: 33.9,  lng: 35.9 },
  { code: "OM", name: "Umman",                      lat: 21.5,  lng: 55.9 },
  { code: "PS", name: "Filistin",                   lat: 31.9,  lng: 35.2 },
  { code: "QA", name: "Katar",                      lat: 25.4,  lng: 51.2 },
  { code: "SA", name: "Suudi Arabistan",            lat: 23.9,  lng: 45.1 },
  { code: "SY", name: "Suriye",                     lat: 34.8,  lng: 38.9 },
  { code: "YE", name: "Yemen",                      lat: 15.6,  lng: 48.5 },
  { code: "AM", name: "Ermenistan",                 lat: 40.1,  lng: 45.0 },
  { code: "AZ", name: "Azerbaycan",                 lat: 40.1,  lng: 47.6 },
  { code: "GE", name: "Gürcistan",                  lat: 42.3,  lng: 43.4 },

  // Turkic / Central Asia
  { code: "KZ", name: "Kazakistan",                 lat: 48.0,  lng: 66.9 },
  { code: "KG", name: "Kırgızistan",                lat: 41.2,  lng: 74.8 },
  { code: "TJ", name: "Tacikistan",                 lat: 38.9,  lng: 71.3 },
  { code: "TM", name: "Türkmenistan",               lat: 38.9,  lng: 59.6 },
  { code: "UZ", name: "Özbekistan",                 lat: 41.4,  lng: 64.6 },
  { code: "MN", name: "Moğolistan",                 lat: 46.9,  lng: 103.8 },
  { code: "AF", name: "Afganistan",                 lat: 33.9,  lng: 67.7 },
  { code: "PK", name: "Pakistan",                   lat: 30.4,  lng: 69.3 },

  // North Africa
  { code: "DZ", name: "Cezayir",                    lat: 28.0,  lng: 1.6  },
  { code: "EG", name: "Mısır",                      lat: 26.8,  lng: 30.8 },
  { code: "LY", name: "Libya",                      lat: 26.3,  lng: 17.2 },
  { code: "MA", name: "Fas",                        lat: 31.8,  lng: -7.1 },
  { code: "SD", name: "Sudan",                      lat: 12.9,  lng: 30.2 },
  { code: "TN", name: "Tunus",                      lat: 33.9,  lng: 9.5  },

  // Sub-Saharan Africa
  { code: "ET", name: "Etiyopya",                   lat: 9.1,   lng: 40.5 },
  { code: "GH", name: "Gana",                       lat: 7.9,   lng: -1.0 },
  { code: "KE", name: "Kenya",                      lat: -0.0,  lng: 37.9 },
  { code: "NG", name: "Nijerya",                    lat: 9.1,   lng: 8.7  },
  { code: "ZA", name: "Güney Afrika",               lat: -30.6, lng: 22.9 },
  { code: "TZ", name: "Tanzanya",                   lat: -6.4,  lng: 34.9 },
  { code: "UG", name: "Uganda",                     lat: 1.4,   lng: 32.3 },
  { code: "SN", name: "Senegal",                    lat: 14.5,  lng: -14.5 },
  { code: "CI", name: "Fildişi Sahili",             lat: 7.5,   lng: -5.5 },
  { code: "AO", name: "Angola",                     lat: -11.2, lng: 17.9 },

  // Asia
  { code: "BD", name: "Bangladeş",                  lat: 23.7,  lng: 90.4 },
  { code: "BT", name: "Bhutan",                     lat: 27.5,  lng: 90.4 },
  { code: "CN", name: "Çin",                        lat: 35.9,  lng: 104.2 },
  { code: "HK", name: "Hong Kong",                  lat: 22.3,  lng: 114.2 },
  { code: "ID", name: "Endonezya",                  lat: -0.8,  lng: 113.9 },
  { code: "IN", name: "Hindistan",                  lat: 20.6,  lng: 79.0 },
  { code: "JP", name: "Japonya",                    lat: 36.2,  lng: 138.3 },
  { code: "KR", name: "Güney Kore",                 lat: 35.9,  lng: 127.8 },
  { code: "KP", name: "Kuzey Kore",                 lat: 40.3,  lng: 127.5 },
  { code: "LA", name: "Laos",                       lat: 19.9,  lng: 102.5 },
  { code: "MM", name: "Myanmar",                    lat: 21.9,  lng: 95.9 },
  { code: "MY", name: "Malezya",                    lat: 4.2,   lng: 101.9 },
  { code: "NP", name: "Nepal",                      lat: 28.4,  lng: 84.1 },
  { code: "PH", name: "Filipinler",                 lat: 12.9,  lng: 121.8 },
  { code: "SG", name: "Singapur",                   lat: 1.4,   lng: 103.8 },
  { code: "LK", name: "Sri Lanka",                  lat: 7.9,   lng: 80.8 },
  { code: "TW", name: "Tayvan",                     lat: 23.7,  lng: 121.0 },
  { code: "TH", name: "Tayland",                    lat: 15.87, lng: 100.99 },
  { code: "VN", name: "Vietnam",                    lat: 14.1,  lng: 108.3 },

  // Oceania
  { code: "AU", name: "Avustralya",                 lat: -25.3, lng: 133.8 },
  { code: "NZ", name: "Yeni Zelanda",               lat: -40.9, lng: 174.9 },

  // North America
  { code: "CA", name: "Kanada",                     lat: 56.1,  lng: -106.3 },
  { code: "MX", name: "Meksika",                    lat: 23.6,  lng: -102.6 },
  { code: "US", name: "Amerika Birleşik Devletleri", lat: 39.83, lng: -98.58 },

  // Central America & Caribbean
  { code: "CR", name: "Kosta Rika",                 lat: 9.7,   lng: -83.8 },
  { code: "CU", name: "Küba",                       lat: 21.5,  lng: -77.8 },
  { code: "DO", name: "Dominik Cumhuriyeti",        lat: 18.7,  lng: -70.2 },
  { code: "GT", name: "Guatemala",                  lat: 15.8,  lng: -90.2 },
  { code: "HN", name: "Honduras",                   lat: 15.2,  lng: -86.2 },
  { code: "JM", name: "Jamaika",                    lat: 18.1,  lng: -77.3 },
  { code: "PA", name: "Panama",                     lat: 8.5,   lng: -80.8 },

  // South America
  { code: "AR", name: "Arjantin",                   lat: -38.4, lng: -63.6 },
  { code: "BO", name: "Bolivya",                    lat: -16.3, lng: -63.6 },
  { code: "BR", name: "Brezilya",                   lat: -14.2, lng: -51.9 },
  { code: "CL", name: "Şili",                       lat: -35.7, lng: -71.5 },
  { code: "CO", name: "Kolombiya",                  lat: 4.6,   lng: -74.3 },
  { code: "EC", name: "Ekvador",                    lat: -1.8,  lng: -78.2 },
  { code: "PE", name: "Peru",                       lat: -9.2,  lng: -75.0 },
  { code: "PY", name: "Paraguay",                   lat: -23.4, lng: -58.4 },
  { code: "UY", name: "Uruguay",                    lat: -32.5, lng: -55.8 },
  { code: "VE", name: "Venezuela",                  lat: 6.4,   lng: -66.6 },
];
