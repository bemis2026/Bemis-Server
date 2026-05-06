import { NextRequest, NextResponse } from "next/server";
import { readBin, writeBin } from "../../../../lib/jsonbin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

type MessageItem = {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  topic?: string;
  topicLabel?: string;
  message?: string;
  ip?: string;
  receivedAt?: string;
};

type MessageState = { read?: boolean; archived?: boolean };

type MessagesBin = {
  items?: MessageItem[];
  state?: Record<string, MessageState>;
};

async function loadBin(): Promise<{ items: MessageItem[]; state: Record<string, MessageState> }> {
  try {
    const cur = (await readBin("messages", { fresh: true })) as MessagesBin;
    return {
      items: Array.isArray(cur?.items) ? cur.items : [],
      state: cur?.state ?? {},
    };
  } catch {
    return { items: [], state: {} };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { items, state } = await loadBin();
  const messages = items.map((m) => ({
    ...m,
    read: state[m.id]?.read ?? false,
    archived: state[m.id]?.archived ?? false,
  }));
  messages.sort((a, b) => String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")));
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const body = (await req.json()) as { id?: string; read?: boolean; archived?: boolean };
    if (!body.id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

    const { items, state } = await loadBin();
    state[body.id] = {
      read: body.read ?? state[body.id]?.read ?? false,
      archived: body.archived ?? state[body.id]?.archived ?? false,
    };
    await writeBin("messages", { items, state });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/messages] save error:", e);
    return NextResponse.json({ error: "Kayıt hatası" }, { status: 500 });
  }
}
