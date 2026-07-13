import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readFileSync } from "fs";
import path from "path";
import { readBin, writeBin } from "../../../../lib/jsonbin";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const data = await readBin("documents", { fresh: true }) as { documents?: unknown[] };
    if (Array.isArray(data?.documents)) return NextResponse.json({ documents: data.documents });
  } catch {}
  // ⚠️ R2 bin boş/erişilemez → repo yedeğinden (data/documents.json) SEED et. Aksi halde
  // editör BOŞ açılır ve ilk kayıt writeBin ile yedekteki dökümanları kalıcı siler
  // (2026-07-13'te yaşandı: public site fallback'ten 12 döküman gösteriyordu, admin
  // boş açıldı, 3 yeni yüklenince R2 bin'i 3'e sabitlendi → eski 12 "kayboldu").
  try {
    const fb = JSON.parse(readFileSync(path.join(process.cwd(), "data", "documents.json"), "utf-8")) as { documents?: unknown[] };
    return NextResponse.json({ documents: fb?.documents ?? [] });
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
