import { revalidateTag } from "next/cache";

const MASTER_KEY = process.env.JSONBIN_MASTER_KEY ?? "";
const BASE = "https://api.jsonbin.io/v3/b";

const BIN_IDS: Record<string, string> = {
  b2b:         "69e5093d36566621a8cd7509",
  content:     "69e5093daaba88219716e044",
  dealers:     "69e5093e36566621a8cd750f",
  products:    "69e5093e856a6821894eaee8",
  // EN translations live in a separate bin so the TR-only products bin
  // stays under JSONBin's free-tier 100KB-per-record limit.
  productsEn:  "69fbc8a0c0954111d8e8ed31",
  documents:   "69e5093f856a6821894eaeec",
  messages:    "69fb7b59adc21f119a61e79f",
  changelog:   "69fb7b5eadc21f119a61e7c8",
};

const PUBLIC_REVALIDATE_SECONDS = 60;
const tagFor = (name: string) => `jsonbin:${name}`;

export async function readBin(name: string, opts: { fresh?: boolean } = {}): Promise<unknown> {
  const id = BIN_IDS[name];
  if (!id) throw new Error(`Unknown bin: ${name}`);
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
  if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`);
  const data = await res.json();
  return data.record;
}

export async function writeBin(name: string, body: unknown): Promise<void> {
  const id = BIN_IDS[name];
  if (!id) throw new Error(`Unknown bin: ${name}`);
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`JSONBin write failed: ${res.status} ${err}`);
  }
  try { revalidateTag(tagFor(name), "max"); } catch {}
}
