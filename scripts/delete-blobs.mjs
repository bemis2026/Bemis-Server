import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { list, del } = require("@vercel/blob");

const TOKEN = process.argv[2];
if (!TOKEN) { console.error("Kullanım: node scripts/delete-blobs.mjs TOKEN"); process.exit(1); }

process.env.BLOB_READ_WRITE_TOKEN = TOKEN;

let deleted = 0;
let cursor;

do {
  const result = await list({ cursor, limit: 100 });
  const urls = result.blobs.map(b => b.url);
  if (urls.length) {
    await del(urls);
    deleted += urls.length;
    console.log(`Silindi: ${deleted} blob`);
  }
  cursor = result.cursor;
} while (cursor);

console.log(`Tamamlandı. Toplam ${deleted} blob silindi.`);
