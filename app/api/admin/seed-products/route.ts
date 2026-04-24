import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin, writeBin } from "../../../../lib/jsonbin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

type ProductEntry = { id: string; [key: string]: unknown };
type CategoryData = { id: string; products: ProductEntry[]; [key: string]: unknown };

function loadFactory(): CategoryData[] {
  const filePath = path.join(process.cwd(), "data", "products.json");
  return JSON.parse(readFileSync(filePath, "utf-8")) as CategoryData[];
}

// GET — returns only products not yet in JSONBin (pending queue)
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const [factory, live] = await Promise.all([
      Promise.resolve(loadFactory()),
      readBin("products", { fresh: true }) as Promise<CategoryData[]>,
    ]);

    // Build set of existing product IDs in live data
    const liveIds = new Set<string>();
    for (const cat of (Array.isArray(live) ? live : [])) {
      for (const p of (cat.products ?? [])) liveIds.add(`${cat.id}::${p.id}`);
    }

    // Filter factory to only pending (not yet in live)
    const pending: CategoryData[] = [];
    for (const cat of factory) {
      const newProds = cat.products.filter(p => !liveIds.has(`${cat.id}::${p.id}`));
      if (newProds.length > 0) pending.push({ ...cat, products: newProds });
    }

    const total = pending.reduce((s, c) => s + c.products.length, 0);
    return NextResponse.json({ pending, total });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST — merges pending products into JSONBin without touching existing ones
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const [factory, live] = await Promise.all([
      Promise.resolve(loadFactory()),
      readBin("products", { fresh: true }) as Promise<CategoryData[]>,
    ]);

    const liveData: CategoryData[] = Array.isArray(live) ? [...live] : [];

    // Build set of existing IDs
    const liveIds = new Set<string>();
    for (const cat of liveData) {
      for (const p of (cat.products ?? [])) liveIds.add(`${cat.id}::${p.id}`);
    }

    let imported = 0;
    for (const factoryCat of factory) {
      const newProds = factoryCat.products.filter(p => !liveIds.has(`${factoryCat.id}::${p.id}`));
      if (newProds.length === 0) continue;

      const existingCat = liveData.find(c => c.id === factoryCat.id);
      if (existingCat) {
        existingCat.products = [...(existingCat.products ?? []), ...newProds];
      } else {
        liveData.push({ ...factoryCat, products: newProds });
      }
      imported += newProds.length;
    }

    if (imported === 0) return NextResponse.json({ ok: true, imported: 0, message: "Yeni ürün bulunamadı." });

    await writeBin("products", liveData);
    return NextResponse.json({ ok: true, imported });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
