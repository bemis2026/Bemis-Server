import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const data = await readBin("documents", { fresh: true }) as { documents?: unknown[] };
    return NextResponse.json({ documents: data?.documents ?? [] });
  } catch {
    return NextResponse.json({ documents: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = await req.json();
    await writeBin("documents", body);
    // Public /api/documents revalidate=3600 ile cache'li; kayıttan sonra anında
    // temizle ki yeni döküman + KAPAK GÖRSELİ (coverUrl) /documents sayfasında
    // hemen görünsün (yoksa 1 saate kadar bayat liste servis ediliyordu).
    try { revalidatePath("/api/documents"); revalidatePath("/documents"); } catch {}
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
