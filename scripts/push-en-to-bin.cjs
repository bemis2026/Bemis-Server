// One-shot: take local data/content-en.json and write it into the production
// content bin under `_translations.en`. Use whenever you want the curated EN
// to immediately become live (skipping the auto-translate path).

const fs = require("fs");
const KEY = process.env.JSONBIN_MASTER_KEY || "$2a$10$zWJKdAUgfHbBy/CeORFuGesiyZ/OdkdVHfK9AiQfwg1fAfbTlnCH.";
const BIN = "69e5093daaba88219716e044";

async function main() {
  const enLocal = JSON.parse(fs.readFileSync("data/content-en.json", "utf-8"));
  const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN}/latest`, {
    headers: { "X-Master-Key": KEY },
  });
  if (!r.ok) throw new Error(`read failed: ${r.status}`);
  const data = await r.json();
  const cur = data.record;
  const { _translations, ...rest } = cur;
  const next = { ...rest, _translations: { ...(_translations ?? {}), en: enLocal } };

  const w = await fetch(`https://api.jsonbin.io/v3/b/${BIN}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
    body: JSON.stringify(next),
  });
  if (!w.ok) {
    const err = await w.text();
    throw new Error(`write failed: ${w.status} ${err}`);
  }
  console.log("OK — content-en.json embedded into bin._translations.en");
}

main().catch(e => { console.error(e); process.exit(1); });
