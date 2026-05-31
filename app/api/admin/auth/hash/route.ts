import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const { password } = await req.json();
    if (typeof password !== "string" || password.length < 4) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 400 });
    }
    const hash = bcrypt.hashSync(password, 10);
    return NextResponse.json({ hash });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
