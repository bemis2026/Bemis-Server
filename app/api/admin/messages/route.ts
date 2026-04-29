import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const STATE_KEY = "data/messages-state.json";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

type MessageState = { read?: boolean; archived?: boolean };

async function loadState(): Promise<Record<string, MessageState>> {
  try {
    const { blobs } = await list({ prefix: STATE_KEY });
    const blob = blobs.find((b) => b.pathname === STATE_KEY);
    if (blob) {
      const res = await fetch(blob.url, { cache: "no-store" });
      return (await res.json()) as Record<string, MessageState>;
    }
  } catch {}
  return {};
}

async function saveState(state: Record<string, MessageState>) {
  await put(STATE_KEY, JSON.stringify(state, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const { blobs } = await list({ prefix: "contacts/" });
    const state = await loadState();
    const messages = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          const data = (await res.json()) as Record<string, unknown>;
          return {
            id: b.pathname,
            ...data,
            uploadedAt: b.uploadedAt,
            read: state[b.pathname]?.read ?? false,
            archived: state[b.pathname]?.archived ?? false,
          };
        } catch {
          return null;
        }
      })
    );
    const valid = messages.filter(Boolean) as Array<Record<string, unknown>>;
    valid.sort((a, b) => String(b.receivedAt ?? b.uploadedAt).localeCompare(String(a.receivedAt ?? a.uploadedAt)));
    return NextResponse.json({ messages: valid });
  } catch (e) {
    console.error("[admin/messages] list error:", e);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string; read?: boolean; archived?: boolean };
    if (!body.id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
    const state = await loadState();
    state[body.id] = {
      read: body.read ?? state[body.id]?.read ?? false,
      archived: body.archived ?? state[body.id]?.archived ?? false,
    };
    await saveState(state);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/messages] save error:", e);
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
