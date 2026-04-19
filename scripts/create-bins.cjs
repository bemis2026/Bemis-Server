const fs = require("fs");
const key = "$2a$10$zWJKdAUgfHbBy/CeORFuGesiyZ/OdkdVHfK9AiQfwg1fAfbTlnCH.";

const files = [
  { name: "b2b",       file: "data/b2b.json" },
  { name: "content",   file: "data/content.json" },
  { name: "dealers",   file: "data/dealers.json" },
  { name: "products",  file: "data/products.json" },
  { name: "documents", file: "data/documents.json" },
];

async function run() {
  const ids = {};
  for (const f of files) {
    let body = {};
    try { body = JSON.parse(fs.readFileSync(f.file, "utf-8")); } catch {}
    const res = await fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": key,
        "X-Access-Key": key,
        "X-Bin-Name": "bemis-" + f.name,
        "X-Bin-Private": "false",
      },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    const id = d.metadata?.id;
    ids[f.name] = id;
    console.log(f.name, "->", id ?? JSON.stringify(d));
  }
  fs.writeFileSync("data/jsonbin-ids.json", JSON.stringify(ids, null, 2));
  console.log("\ndata/jsonbin-ids.json yazildi.");
}

run().catch(console.error);
