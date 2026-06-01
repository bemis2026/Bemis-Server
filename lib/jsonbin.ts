import { revalidateTag } from "next/cache";

const MASTER_KEY = process.env.JSONBIN_MASTER_KEY ?? "";
const BASE = "https://api.jsonbin.io/v3/b";

const BIN_IDS: Record<string, string> = {
  b2b:              "69e5093d36566621a8cd7509",
  content:          "69e5093daaba88219716e044",
  dealers:          "69e5093e36566621a8cd750f",
  // Products are sharded across two TR + two EN bins because JSONBin's
  // free-tier caps each record at 100KB. Categories live in whichever
  // bin has room; the API merges them transparently. When a bin
  // approaches 80KB, move the next big category into a fresh bin.
  products:         "69e5093e856a6821894eaee8",
  productsExtra:    "69fbcdf1c0954111d8e90670",
  productsEn:       "69fbc8a0c0954111d8e8ed31",
  productsEnExtra:  "69fbcdf2250b1311c313f456",
  documents:        "69e5093f856a6821894eaeec",
  messages:         "69fb7b59adc21f119a61e79f",
  changelog:        "69fb7b5eadc21f119a61e7c8",
};

// 60s -> 1h: JSONBin free tier'da aylık istek kotası var. 60s revalidate
// kotayı hızla tüketiyordu; 1h ile JSONBin okuması ~60x azalır (admin save
// zaten revalidatePath ile anında tazeliyor, bu yüzden bayatlık riski yok).
const PUBLIC_REVALIDATE_SECONDS = 3600;
const tagFor = (name: string) => `jsonbin:${name}`;

// Devre kesici (circuit breaker). JSONBin 403 "Requests exhausted" döndürdüğünde
// her istek o hatayı tekrar tetikliyor → kota daha da eksiye gidiyor + sayfa
// tutarsız render edip "Bir şeyler ters gitti" hatası veriyordu. 403 görür
// görmez bir süre (cooldown) JSONBin'e HİÇ gitmeyiz; çağıranlar data/*.json
// yedeğine düşer (hızlı + tutarlı). Cooldown bitince tekrar dener — kota
// yenilenince/yükseltilince okumalar kendiliğinden geri gelir.
const EXHAUSTED_COOLDOWN_MS = 5 * 60 * 1000;
let exhaustedUntil = 0;

export async function readBin(name: string, opts: { fresh?: boolean } = {}): Promise<unknown> {
  const id = BIN_IDS[name];
  if (!id) throw new Error(`Unknown bin: ${name}`);
  if (Date.now() < exhaustedUntil) {
    throw new Error("JSONBin circuit open (quota exhausted) — using local fallback");
  }
  const fetchInit: RequestInit = {
    headers: { "X-Master-Key": MASTER_KEY },
  };
  if (opts.fresh) {
    fetchInit.cache = "no-store";
  } else {
    (fetchInit as RequestInit & { next?: { revalidate?: number; tags?: string[] } }).next = {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: [tagFor(name)],
    };
  }
  const res = await fetch(`${BASE}/${id}/latest`, fetchInit);
  if (res.status === 403) {
    // Kota tükendi — devre kesiciyi aç, bir süre JSONBin'i dövme.
    exhaustedUntil = Date.now() + EXHAUSTED_COOLDOWN_MS;
    throw new Error("JSONBin read failed: 403 (requests exhausted)");
  }
  if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`);
  const data = await res.json();
  return data.record;
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  const id = BIN_IDS[name];
  if (!id) throw new Error(`Unknown bin: ${name}`);
  // Kota kilitliyken yazma deneme — boşa istek + yarım yazım riskini önler.
  if (Date.now() < exhaustedUntil) {
    throw new Error("JSONBin circuit open (quota exhausted) — write blocked");
  }
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
    body: JSON.stringify(body),
  });
  if (res.status === 403) {
    exhaustedUntil = Date.now() + EXHAUSTED_COOLDOWN_MS;
    throw new Error("JSONBin write failed: 403 (requests exhausted)");
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`JSONBin write failed: ${res.status} ${err}`);
  }
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
