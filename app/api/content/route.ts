import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(path.join(process.cwd(), "data", "content.json"), "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "İçerik yüklenemedi" }, { status: 500 });
  }
}
