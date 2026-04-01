import { NextRequest, NextResponse } from "next/server";
import path from "path";

function getStoredPassword(): string {
  // Önce environment variable'a bak (Vercel / production)
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  // Yoksa local dosyadan oku
  try {
    const { readFileSync } = require("fs");
    const authPath = path.join(process.cwd(), "data", "auth.json");
    const { password } = JSON.parse(readFileSync(authPath, "utf-8"));
    return password;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, rememberMe } = await req.json();
    const stored = getStoredPassword();

    if (!stored || password !== stored) {
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
