import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "documents.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { documents } = JSON.parse(raw);
    // Only return visible documents to public
    const visible = (documents ?? []).filter((d: { visible: boolean }) => d.visible !== false);
    return NextResponse.json(visible);
  } catch {
    return NextResponse.json([]);
  }
}
