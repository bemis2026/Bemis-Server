import { NextRequest, NextResponse } from "next/server";
import { readBin, writeBin } from "../../../lib/jsonbin";
import { checkRateLimit, recordFailure, getClientIp } from "@/lib/rate-limit";
import { notifyAdmin, sendAutoReply } from "../../../lib/email";

const CONTACT_RL_OPTS = {
  // 3 messages per IP per hour, 1 hour cool-down on the 4th attempt.
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
  blockMs: 60 * 60 * 1000,
};

const topicLabels: Record<string, string> = {
  "product-info":    "Ürün Bilgisi",
  "price-quote":     "Fiyat Teklifi",
  "dealer-apply":    "Bayilik Başvurusu",
  "dealership":      "Bayilik Başvurusu",
  "corporate-sales": "Kurumsal Satış / OEM",
  "operator":        "Şarj Ağı Operatörü",
  "export":          "İhracat / Export",
  "technical":       "Teknik Destek",
  "installation":    "Kurulum Yardımı",
  "partnership":     "İş Ortaklığı",
  "other":           "Diğer",
};

// Kullanıcı girdisini admin e-postasının HTML'ine gömmeden önce kaçışla —
// aksi halde ad/mesaj alanına <script>/<img onerror> enjekte edilebilir.
function esc(v: string): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(fields: Record<string, string>, topicLabelRaw: string, ipRaw: string) {
  const name = esc(fields.name);
  const company = esc(fields.company);
  const email = esc(fields.email);
  const phone = esc(fields.phone);
  const message = esc(fields.message);
  const topicLabel = esc(topicLabelRaw);
  const ip = esc(ipRaw);
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
      <div style="background:#1a1a1a;padding:24px 32px;border-radius:12px 12px 0 0">
        <h2 style="color:#fff;margin:0;font-size:20px">Yeni İletişim Formu Mesajı</h2>
        <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">bemisevcharge.com.tr üzerinden gönderildi</p>
      </div>
      <div style="background:#f8f8f8;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#666;width:130px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          ${company ? `<tr><td style="padding:8px 0;color:#666">Şirket</td><td style="padding:8px 0">${company}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666">E-Posta</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#3B82F6">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${phone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666">Konu</td><td style="padding:8px 0"><span style="background:#3B82F618;color:#3B82F6;padding:2px 10px;border-radius:20px;font-weight:600">${topicLabel}</span></td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e8e8e8">
          <p style="margin:0;font-size:13px;color:#444;line-height:1.7;white-space:pre-wrap">${message}</p>
        </div>
        <p style="margin-top:16px;font-size:11px;color:#aaa">Gönderen IP: ${ip}</p>
      </div>
    </div>`;
}

type MessageItem = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  topicLabel: string;
  message: string;
  ip: string;
  receivedAt: string;
};

type MessagesBin = {
  items?: MessageItem[];
  state?: Record<string, { read?: boolean; archived?: boolean }>;
};

async function appendMessage(item: MessageItem) {
  try {
    const cur = (await readBin("messages", { fresh: true }).catch(() => null)) as MessagesBin | null;
    const items = Array.isArray(cur?.items) ? cur.items : [];
    const state = cur?.state ?? {};
    items.unshift(item); // newest first
    await writeBin("messages", { items, state });
  } catch (e) {
    console.error("[contact] JSONBin save failed:", e);
  }
}

export async function POST(req: NextRequest) {
  // Rate-limit per client IP to prevent form spam (which would otherwise
  // burn through Resend / SMTP quotas and bloat the JSONBin messages bin).
  const ipForRl = getClientIp(req);
  const rlKey = `contact:${ipForRl}`;
  const pre = checkRateLimit(rlKey, CONTACT_RL_OPTS);
  if (!pre.ok) {
    return NextResponse.json(
      { error: `Çok fazla mesaj gönderildi. Lütfen ${Math.ceil(pre.retryAfterSec / 60)} dakika sonra tekrar deneyin.` },
      { status: 429, headers: { "Retry-After": String(pre.retryAfterSec) } }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    recordFailure(rlKey, CONTACT_RL_OPTS);
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Honeypot + zaman-tuzağı: spam'i Blob/e-posta HARCAMADAN sessizce reddet.
  // Botlara "başarılı" (200) görünürüz ki varyasyon deneyip durmasınlar; hiçbir
  // işlem yapılmaz → readBin/writeBin(messages) ÇALIŞMAZ (Blob op tüketilmez).
  //  - website: gizli honeypot alanı (gerçek kullanıcı boş bırakır, bot doldurur)
  //  - elapsed: formun render'ından submit'e geçen süre; < 2 sn = otomasyon
  const b = body as Record<string, unknown>;
  const honeypot = String(b.website ?? "").trim();
  const elapsedMs = Number(b.elapsed);
  if (honeypot || (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2000)) {
    return NextResponse.json({ ok: true });
  }

  const { name, company, email, phone, topic, message } = body as Record<string, string>;
  if (!name || !email || !topic || !message) {
    recordFailure(rlKey, CONTACT_RL_OPTS);
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 422 });
  }

  // Count this submission against the limit. Even successful sends
  // consume budget — that's the spam barrier.
  recordFailure(rlKey, CONTACT_RL_OPTS);

  const topicLabel = topicLabels[topic] ?? topic;
  const ip = req.headers.get("x-forwarded-for") ?? "bilinmiyor";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await appendMessage({
    id,
    name,
    company: company ?? "",
    email,
    phone: phone ?? "",
    topic,
    topicLabel,
    message,
    ip,
    receivedAt: new Date().toISOString(),
  });

  // Two emails go out in parallel:
  //   1. Admin notification → CONTACT_TO_EMAIL (sales@bemis.com.tr)
  //   2. Auto-reply         → the form filler's own address
  // Both use lib/email.ts which picks Resend → SMTP fallback. We don't
  // block the response on either: the user sees "mesajınız alındı" as
  // long as at least one mail dispatch succeeded, and the message has
  // already been saved to the JSONBin in either case.
  const adminHtml = buildHtml({ name, company, email, phone, message }, topicLabel, ip);

  // Pull admin-edited auto-reply copy from the content bin. Errors here
  // never block the form — empty template just means defaults from
  // lib/email.ts kick in.
  let autoReplyTemplate: Record<string, unknown> | undefined;
  try {
    const content = (await readBin("content")) as { emailTemplates?: { autoReply?: Record<string, unknown> } };
    autoReplyTemplate = content?.emailTemplates?.autoReply;
  } catch {
    /* swallow — defaults fine */
  }

  const [adminRes, replyRes] = await Promise.all([
    notifyAdmin({
      subject: `[Bemis Website] ${topicLabel} — ${name}`,
      html: adminHtml,
      fromUserEmail: email,
    }),
    sendAutoReply({
      toUser: email,
      name,
      topicLabel,
      originalMessage: message,
      formKind: "İletişim formu",
      template: autoReplyTemplate,
    }),
  ]);

  if (adminRes.ok || replyRes.ok) {
    return NextResponse.json({
      ok: true,
      adminSent: adminRes.ok,
      autoReplySent: replyRes.ok,
    });
  }

  // Mesaj JSONBin'e kaydedildi ama e-posta gönderilemedi
  console.error("[contact] Both admin notify + auto-reply failed:", { adminRes, replyRes });
  return NextResponse.json({ error: "E-posta gönderilemedi, mesajınız kaydedildi." }, { status: 500 });
}
