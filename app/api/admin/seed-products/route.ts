import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { writeBin } from "../../../../lib/jsonbin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    await writeBin("products", data);
    return NextResponse.json({ ok: true, categories: data.length, products: data.reduce((s: number, c: {products: unknown[]}) => s + c.products.length, 0) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
