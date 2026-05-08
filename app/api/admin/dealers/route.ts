import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

const fallbackPath = path.join(process.cwd(), "data", "dealers.json");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    return NextResponse.json(await readBin("dealers", { fresh: true }));
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    await writeBin("dealers", body);
    // Bust the public /api/dealers + homepage cache so edits reflect at
    // once instead of waiting for the 60s revalidate window.
    try { revalidatePath("/api/dealers"); } catch {}
    try { revalidatePath("/"); } catch {}
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("dealers save error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
