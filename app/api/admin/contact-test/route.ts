import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyAdminSession } from "@/lib/adminAuth";

function isAuthed(req: NextRequest) {
  return verifyAdminSession(req.cookies.get("admin_auth")?.value);
}

function maskEmail(value: string | undefined): string | null {
  if (!value) return null;
  const at = value.indexOf("@");
  if (at < 1) return value.slice(0, 2) + "…";
  return value.slice(0, 1) + "***" + value.slice(at);
}

function maskHost(value: string | undefined): string | null {
  if (!value) return null;
  return value;
}

// GET — returns which providers are configured (no secrets leaked)
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const resendKey  = process.env.RESEND_API_KEY?.trim();
  const fromEmail  = process.env.RESEND_FROM_EMAIL?.trim();
  const toEmail    = process.env.CONTACT_TO_EMAIL?.trim();
  const smtpHost   = process.env.SMTP_HOST?.trim();
  const smtpUser   = process.env.SMTP_USER?.trim();
  const smtpPass   = process.env.SMTP_PASS?.trim();
  const smtpPort   = process.env.SMTP_PORT?.trim();

  return NextResponse.json({
    to: maskEmail(toEmail),
    resend: {
      configured: Boolean(resendKey && toEmail),
      apiKeySet: Boolean(resendKey),
      from: fromEmail ?? "onboarding@resend.dev (varsayılan)",
    },
    smtp: {
      configured: Boolean(smtpHost && smtpUser && smtpPass && (toEmail || smtpUser)),
      host: maskHost(smtpHost),
      port: smtpPort ?? "587",
      user: maskEmail(smtpUser),
    },
  });
}

// POST — actually try to send a test email and report which provider succeeded
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const subject = "[Bemis Test] Mail sistemi diagnostik testi";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#111">
      <h2>Test e-postası alındı ✅</h2>
      <p>Bemis admin panelinden gönderilmiş diagnostik testidir. Bu maili aldıysanız, contact form gönderimi çalışıyor demektir.</p>
      <p style="color:#666;font-size:12px">Gönderim zamanı: ${new Date().toISOString()}</p>
    </div>`;

  const resendKey  = process.env.RESEND_API_KEY?.trim();
  const fromEmail  = process.env.RESEND_FROM_EMAIL?.trim() || "Bemis Website <onboarding@resend.dev>";
  const toEmail    = process.env.CONTACT_TO_EMAIL?.trim();

  // Try Resend first
  if (resendKey && toEmail) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({ from: fromEmail, to: [toEmail], subject, html }),
      });
      if (res.ok) {
        return NextResponse.json({ ok: true, provider: "resend", to: maskEmail(toEmail) });
      }
      const errText = await res.text();
      // Fall through to SMTP if Resend fails — but record the error
      console.error("[contact-test] Resend error:", errText);
      const errSummary = `Resend: HTTP ${res.status} — ${errText.slice(0, 200)}`;
      const smtpResult = await trySmtp(subject, html);
      if (smtpResult.ok) {
        return NextResponse.json({ ok: true, provider: "smtp", to: smtpResult.to, resendError: errSummary });
      }
      return NextResponse.json({ ok: false, error: errSummary, smtpError: smtpResult.error }, { status: 502 });
    } catch (e) {
      console.error("[contact-test] Resend exception:", e);
      const smtpResult = await trySmtp(subject, html);
      if (smtpResult.ok) {
        return NextResponse.json({ ok: true, provider: "smtp", to: smtpResult.to, resendError: String(e) });
      }
      return NextResponse.json({ ok: false, error: String(e), smtpError: smtpResult.error }, { status: 502 });
    }
  }

  // Resend not configured — try SMTP
  const smtpResult = await trySmtp(subject, html);
  if (smtpResult.ok) {
    return NextResponse.json({ ok: true, provider: "smtp", to: smtpResult.to });
  }
  return NextResponse.json(
    { ok: false, error: smtpResult.error ?? "Hiçbir e-posta sağlayıcısı yapılandırılmamış. Vercel env: RESEND_API_KEY + CONTACT_TO_EMAIL veya SMTP_HOST/USER/PASS gerekli." },
    { status: 500 },
  );
}

async function trySmtp(subject: string, html: string): Promise<{ ok: boolean; to?: string | null; error?: string }> {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = Number(process.env.SMTP_PORT?.trim() ?? 587);
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const toEmail  = process.env.CONTACT_TO_EMAIL?.trim() ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
    return { ok: false, error: "SMTP yapılandırılmamış" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost, port: smtpPort, secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"Bemis EV Charge Website" <${smtpUser}>`,
      to: toEmail, subject, html,
    });
    return { ok: true, to: maskEmail(toEmail) };
  } catch (e) {
    return { ok: false, error: `SMTP: ${String(e).slice(0, 200)}` };
  }
}
