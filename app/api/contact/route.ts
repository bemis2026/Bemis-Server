import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { put, list } from "@vercel/blob";

const topicLabels: Record<string, string> = {
  "product-info":    "Ürün Bilgisi",
  "price-quote":     "Fiyat Teklifi",
  "dealer-apply":    "Bayilik Başvurusu",
  "corporate-sales": "Kurumsal Satış",
  "export":          "İhracat / Export",
  "technical":       "Teknik Destek",
  "installation":    "Kurulum Yardımı",
  "partnership":     "İş Ortaklığı",
  "other":           "Diğer",
};

function buildHtml(fields: Record<string, string>, topicLabel: string, ip: string) {
  const { name, company, email, phone, message } = fields;
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

async function saveToBlob(data: Record<string, string>) {
  try {
    const key = `contacts/${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
    await put(key, JSON.stringify({ ...data, receivedAt: new Date().toISOString() }, null, 2), {
      access: "public", contentType: "application/json",
    });
  } catch (e) {
    console.error("[contact] Blob save failed:", e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });

  const { name, company, email, phone, topic, message } = body as Record<string, string>;
  if (!name || !email || !topic || !message)
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 422 });

  const topicLabel = topicLabels[topic] ?? topic;
  const ip = req.headers.get("x-forwarded-for") ?? "bilinmiyor";

  // Always save to Blob as backup
  await saveToBlob({ name, company: company ?? "", email, phone: phone ?? "", topic, topicLabel, message, ip });

  // ── Resend (öncelikli) ──────────────────────────────────────────────────
  const resendKey  = process.env.RESEND_API_KEY;
  const toEmail    = process.env.CONTACT_TO_EMAIL;

  if (resendKey && toEmail) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "Bemis Website <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: email,
          subject: `[Bemis Website] ${topicLabel} — ${name}`,
          html: buildHtml({ name, company, email, phone, message }, topicLabel, ip),
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error("[contact] Resend error:", await res.text());
    } catch (e) {
      console.error("[contact] Resend exception:", e);
    }
  }

  // ── SMTP (yedek) ────────────────────────────────────────────────────────
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpTo   = toEmail ?? smtpUser;

  if (smtpHost && smtpUser && smtpPass && smtpTo) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost, port: smtpPort, secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"Bemis EV Charge Website" <${smtpUser}>`,
        to: smtpTo, replyTo: email,
        subject: `[Bemis Website] ${topicLabel} — ${name}`,
        html: buildHtml({ name, company, email, phone, message }, topicLabel, ip),
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[contact] SMTP failed:", err);
      return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
    }
  }

  // No email configured — message saved to Blob, return success
  console.warn("[contact] No email provider configured. Message saved to Blob.");
  return NextResponse.json({ ok: true });
}
