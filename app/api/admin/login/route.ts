import { NextRequest, NextResponse } from "next/server";
import path from "path";
import bcrypt from "bcryptjs";
import { checkRateLimit, recordFailure, clearRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminSession } from "@/lib/adminAuth";

const RL_OPTS = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockMs: 15 * 60 * 1000,
};

function isBcryptHash(v: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(v);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type StoredSource = "env" | "file" | "none";
function getStoredPassword(): { value: string; source: StoredSource } {
  if (process.env.ADMIN_PASSWORD) return { value: process.env.ADMIN_PASSWORD, source: "env" };
  try {
    const { readFileSync } = require("fs");
    const authPath = path.join(process.cwd(), "data", "auth.json");
    const { password } = JSON.parse(readFileSync(authPath, "utf-8"));
    if (password) return { value: password, source: "file" };
  } catch {}
  return { value: "", source: "none" };
}

function migrateFileToHash(plaintext: string) {
  try {
    const { writeFileSync } = require("fs");
    const authPath = path.join(process.cwd(), "data", "auth.json");
    const hash = bcrypt.hashSync(plaintext, 10);
    writeFileSync(authPath, JSON.stringify({ password: hash }, null, 2) + "\n", "utf-8");
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rlKey = `login:${ip}`;

    const pre = checkRateLimit(rlKey, RL_OPTS);
    if (!pre.ok) {
      return NextResponse.json(
        { error: `Çok fazla hatalı deneme. ${Math.ceil(pre.retryAfterSec / 60)} dakika sonra tekrar deneyin.` },
        { status: 429, headers: { "Retry-After": String(pre.retryAfterSec) } }
      );
    }

    const { password, rememberMe } = await req.json();
    const { value: stored, source } = getStoredPassword();

    if (!stored || !password) {
      const rf = recordFailure(rlKey, RL_OPTS);
      if (!rf.ok) {
        return NextResponse.json(
          { error: `Çok fazla hatalı deneme. ${Math.ceil(rf.retryAfterSec / 60)} dakika sonra tekrar deneyin.` },
          { status: 429, headers: { "Retry-After": String(rf.retryAfterSec) } }
        );
      }
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    let ok = false;
    if (isBcryptHash(stored)) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = timingSafeEqual(password, stored);
      if (ok && source === "file") migrateFileToHash(password);
    }

    if (!ok) {
      const rf = recordFailure(rlKey, RL_OPTS);
      if (!rf.ok) {
        return NextResponse.json(
          { error: `Çok fazla hatalı deneme. ${Math.ceil(rf.retryAfterSec / 60)} dakika sonra tekrar deneyin.` },
          { status: 429, headers: { "Retry-After": String(rf.retryAfterSec) } }
        );
      }
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    clearRateLimit(rlKey);

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", createAdminSession(maxAge), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
