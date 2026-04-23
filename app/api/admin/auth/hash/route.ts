import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
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
