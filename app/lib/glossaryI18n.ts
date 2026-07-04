// Sözlük terimlerinin ÇEVİRİLERİ — kaynak (TR) glossary.ts'te kalır; çeviriler
// burada, dile göre ayrı tutulur (kaynak kod şişmesin + ileride AI-pipeline bu
// dosyayı üretebilsin/güncelleyebilsin). GlossaryClient aktif dile göre bu
// çeviriyi TR terimin üstüne bindirir; ÇEVİRİSİ OLMAYAN terim/alan otomatik
// TR'ye düşer (yarım çeviri kırık görünmez, kademeli tamamlanır).
//
// Yapı: GLOSSARY_I18N[dil][slug] = { term, abbr, short, definition, faq }
// (slug/diagram/related/keywords TR kaynaktan gelir — çevrilmez ya da ayrı ele alınır.)

export type GlossaryTranslation = {
  term?: string;
  abbr?: string;
  short?: string;
  definition?: string;
  faq?: { q: string; a: string }[];
};

// Dil kodu → { slug → çeviri }. Yeni dil eklemek = yeni bir üst-anahtar (ör. "de").
export const GLOSSARY_I18N: Record<string, Record<string, GlossaryTranslation>> = {
  en: {
    "type-2": {
      term: "What Is Type 2?",
      abbr: "Type 2",
      short: "Turkey's and Europe's standard AC charging socket (IEC 62196-2).",
      definition:
        "Type 2 (IEC 62196-2) is the standard AC charging socket in Turkey and Europe. This seven-pin connector supports both single-phase and three-phase power transfer, allowing AC charging from 7.4 kW up to 22 kW. In addition to the power pins, the CP (Control Pilot) and PP (Proximity Pilot) communication lines inside the socket let the vehicle and the station recognise each other, adjust the current safely, and confirm that the cable is properly latched. Because it has been the de facto standard in Europe since 2014, almost every electric vehicle and AC wallbox sold today uses this socket; the seamless operation of different vehicle and station brands is thanks to this common standard. Bemis's locally produced AC chargers and cables are also built to the Type 2 standard. In practice, a home user charges their car overnight with a Type 2 wallbox installed at home, while in a workplace car park the same socket can deliver up to 11 or 22 kW over a three-phase supply. Because the same standard is used, drivers can connect to Type 2 stations in different locations without needing a vehicle-specific adapter.",
      faq: [
        {
          q: "How much power can Type 2 charge at?",
          a: "Type 2 allows AC charging power from 7.4 kW up to 22 kW. The connector supports both single-phase and three-phase connections; on a three-phase supply the same socket can deliver up to 11 or 22 kW. Bemis's locally produced AC devices and cables are also built to this standard.",
        },
        {
          q: "Which vehicles is the Type 2 socket compatible with?",
          a: "Since Type 2 has been the de facto standard in Europe since 2014, almost every electric vehicle and AC wallbox sold today uses this socket. Thanks to this common standard, different vehicle and station brands work together seamlessly, and drivers can connect to different Type 2 stations without a vehicle-specific adapter.",
        },
        {
          q: "What do the CP and PP pins in the Type 2 socket do?",
          a: "Type 2 is a seven-pin connector; in addition to the power pins it has the CP (Control Pilot) and PP (Proximity Pilot) communication lines. These lines let the vehicle and station recognise each other, adjust the current safely, and confirm that the cable is properly latched.",
        },
      ],
    },
    "ccs2": {
      term: "What Is CCS2?",
      abbr: "CCS2",
      short: "Turkey's and Europe's standard DC fast-charging socket (Combo 2).",
      definition:
        "CCS2 (Combined Charging System / Combo 2) is the standard DC fast-charging socket in Turkey and Europe. With two powerful DC pins added below the Type 2 socket, it transfers high-power direct current, so the vehicle charges significantly in minutes compared with AC charging. It takes the name \"combined\" from this: the same connector supports both AC (the Type 2 part on top) and DC charging through a single socket, so the vehicle only needs one charging inlet. In DC charging the current conversion is done inside the station rather than in the vehicle, so power is delivered directly to the vehicle's battery and is not limited by the onboard charger. CCS2 is the common standard for Turkey's public fast-charging networks and new-generation electric vehicles. Bemis's locally produced BEVDC series fast chargers (40–120 kW DC) use the CCS2 connector. In a typical scenario a roadside CCS2 station charges the car substantially during a short break on a long journey, while the same socket provides fast charging during a shopping trip in a mall car park. That is why CCS2 is a solution suited to situations that need speed away from home, complementing overnight AC charging at home.",
      faq: [
        {
          q: "Why is CCS2 called \"combined\"?",
          a: "CCS2 supports both AC (the Type 2 part on top) and DC charging in a single connector, thanks to two powerful DC pins added below the Type 2 socket; that is where the name comes from. This means the vehicle only needs one charging inlet and the driver does not need separate sockets.",
        },
        {
          q: "Why is CCS2 faster than AC charging?",
          a: "In CCS2 the current conversion is done inside the station rather than in the vehicle, so power is delivered directly to the battery and is not limited by the vehicle's onboard charger. As a result the car charges significantly in minutes compared with AC. Bemis's BEVDC series (40–120 kW DC) uses the CCS2 connector.",
        },
        {
          q: "Is CCS2 the standard in Turkey?",
          a: "Yes, CCS2 is the common standard for Turkey's public fast-charging networks and new-generation electric vehicles. A roadside CCS2 station charges the car during a short break on a long trip, while the same socket provides fast charging during a shopping trip in a mall car park.",
        },
      ],
    },
    "ocpp": {
      term: "What Is OCPP?",
      abbr: "OCPP",
      short: "The open communication standard between a charging station and its management software.",
      definition:
        "OCPP (Open Charge Point Protocol) is the open communication standard between charging stations and central management software (CSMS). Regardless of the charger's brand, it enables remote monitoring, user authorisation, billing, firmware updates and load management to be run from a single central point. Its common versions are OCPP 1.6J and 2.0.1. Being an open standard means the operator is not locked into a single manufacturer's closed system: devices from different brands can be managed together in the same management software, and changing software or hardware later becomes easier. That is why OCPP is the de facto industry standard for public stations, fleets and multi-device installations. Bemis's smart (OCPP-compatible) models support this protocol and can connect to standard central management software. For example, in a residential car park dozens of devices can be monitored from a single management screen, each session can be attributed to a user and billed, and the devices' firmware can be updated remotely. In a fleet, consumption is reported per vehicle and load management is set centrally, providing control without visiting the site.",
      faq: [
        {
          q: "What does OCPP do?",
          a: "OCPP is the open communication standard between charging stations and central management software (CSMS). Regardless of the device's brand, it enables remote monitoring, user authorisation, billing, firmware updates and load management to be run from a single central point. Its common versions are OCPP 1.6J and 2.0.1.",
        },
        {
          q: "What advantage does OCPP being an open standard provide?",
          a: "Being an open standard means the operator is not locked into a single manufacturer's closed system. Devices from different brands can be managed together in the same management software, and changing software or hardware later becomes easier. That is why OCPP is the de facto industry standard for public stations, fleets and multi-device installations.",
        },
        {
          q: "Do Bemis devices support OCPP?",
          a: "Bemis's smart (OCPP-compatible) models support this protocol and can connect to standard central management software. For example, in a residential car park dozens of devices can be monitored from a single screen, each session can be attributed to a user and billed, and device firmware can be updated remotely.",
        },
      ],
    },
    "ac-dc-sarj": {
      term: "What Are AC and DC Charging?",
      abbr: "AC / DC charging",
      short: "The difference of whether current conversion happens in the vehicle (AC) or in the station (DC).",
      definition:
        "AC and DC charging differ in where the current conversion takes place. In AC charging the station delivers the alternating current from the grid to the vehicle, and the vehicle's onboard charger converts it into the direct current the battery needs (typically 7.4–22 kW). In DC fast charging the conversion is done by a powerful converter inside the station and direct current is delivered straight to the battery; because the vehicle's small onboard charger is bypassed, much higher power (50 kW and above) is possible. For this reason AC charging suits scenarios that last for hours such as home, workplace and overnight parking, while DC fast charging suits situations such as roadside and fleet use where range must be added within minutes. Bemis offers both its locally produced AC wallbox devices and its CCS2-standard BEVDC series DC fast chargers together. As a concrete comparison, an 11 kW AC wallbox at home fills the car over several hours, while a BEVDC series DC unit (40–120 kW) adds the same range far more quickly at the roadside. That is why, for most users, the practical setup is a combination of AC home charging for daily use and DC fast charging on long trips.",
      faq: [
        {
          q: "What is the difference between AC and DC charging?",
          a: "The difference is where the current is converted. In AC charging the vehicle's onboard charger converts the current (typically 7.4–22 kW); in DC fast charging a converter inside the station does it and direct current is delivered straight to the battery, allowing much higher power (50 kW and above). AC suits hours-long home/workplace charging, DC suits fast roadside top-ups.",
        },
        {
          q: "Which is better for home use, AC or DC?",
          a: "AC charging is the right choice for the home. A 7.4–11 kW AC wallbox fills most cars overnight, is far more affordable than a DC unit, and works with a standard electrical supply. DC fast charging requires a high-power three-phase infrastructure and is intended for public and fleet use, not the home.",
        },
        {
          q: "Does Bemis offer both AC and DC chargers?",
          a: "Yes. Bemis offers both its locally produced AC wallbox devices and its CCS2-standard BEVDC series DC fast chargers (40–120 kW). For most users the practical setup is AC home charging for daily use combined with DC fast charging on long trips.",
        },
      ],
    },
  },
};
