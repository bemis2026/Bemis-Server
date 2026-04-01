import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { password, rememberMe } = await req.json();
    const authPath = path.join(process.cwd(), "data", "auth.json");
    const { password: stored } = JSON.parse(readFileSync(authPath, "utf-8"));

    if (password !== stored) {
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8, // 30 gün veya 8 saat
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
