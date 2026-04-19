const { list, del } = require("@vercel/blob");

const TOKEN = process.argv[2];
if (!TOKEN) { console.error("Kullanim: node scripts/delete-blobs.cjs TOKEN"); process.exit(1); }

process.env.BLOB_READ_WRITE_TOKEN = TOKEN;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  let deleted = 0;
  let cursor;
  do {
    const result = await list({ cursor, limit: 100 });
    const urls = result.blobs.map(b => b.url);
    if (urls.length === 0) break;
    let retries = 3;
    while (retries > 0) {
      try {
        await del(urls);
        deleted += urls.length;
        console.log("Silindi: " + deleted + " blob");
        await sleep(2000);
        break;
      } catch (e) {
        if (e.message && e.message.includes("Too many requests")) {
          console.log("Rate limit - 65 saniye bekleniyor...");
          await sleep(65000);
          retries--;
        } else {
          throw e;
        }
      }
    }
    cursor = result.cursor;
  } while (cursor);
  console.log("Tamamlandi. Toplam " + deleted + " blob silindi.");
}

run().catch(e => { console.error("Hata:", e.message); process.exit(1); });
