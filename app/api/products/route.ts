import { NextResponse } from "next/server";
import { readBin } from "../../../lib/jsonbin";
import { readFileSync } from "fs";
import path from "path";

const fallbackPath = path.join(process.cwd(), "data", "products.json");

export const revalidate = 60;

export async function GET() {
  try {
    const data = await readBin("products");
    return NextResponse.json(data);
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({ error: "Ürünler yüklenemedi" }, { status: 500 });
  }
}
