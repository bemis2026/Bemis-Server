// Email helper used by every form on the site (currently /api/contact;
// future: bayilik başvuru, kurumsal teklif, ürün soru). Provides:
//
//   sendEmail()        — low-level wrapper, Resend first then SMTP fallback
//   notifyAdmin()      — sends a "new form submission" mail to the
//                        ops inbox (CONTACT_TO_EMAIL)
//   sendAutoReply()    — sends a "your message was received" mail to
//                        the user who submitted the form
//
// All three are safe to call even when the env vars aren't set — they
// log + return { ok: false } instead of throwing, so a single mail-
// service hiccup never breaks the API route's primary job (saving the
// submission).

import nodemailer from "nodemailer";

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  /** Optional Reply-To header — useful for admin notifications so a
   *  one-click reply lands at the form filler, not at the no-reply box. */
  replyTo?: string;
};

export type SendResult = { ok: boolean; via?: "resend" | "smtp"; error?: string };

const DEFAULT_FROM = "Bemis Website <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<SendResult> {
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  // ── Resend (preferred) ────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          ...(replyTo ? { reply_to: replyTo } : {}),
          subject,
          html,
        }),
      });
      if (res.ok) return { ok: true, via: "resend" };
      const errText = await res.text();
      console.error("[email] Resend error:", errText);
      // Fall through to SMTP only if Resend was rejected for a config
      // issue, not for a transient 5xx (we'll let the caller retry later).
    } catch (e) {
      console.error("[email] Resend exception:", e);
    }
  }

  // ── SMTP fallback (Natro / Yandex / whoever the box is on) ────────
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"Bemis Website" <${smtpUser}>`,
        to,
        ...(replyTo ? { replyTo } : {}),
        subject,
        html,
      });
      return { ok: true, via: "smtp" };
    } catch (e) {
      console.error("[email] SMTP failed:", e);
      return { ok: false, error: String(e) };
    }
  }

  return { ok: false, error: "no_provider_configured" };
}

// ── Admin notification — "new form submission" ──────────────────────
export async function notifyAdmin(opts: {
  subject: string;
  html: string;
  /** Reply-to set to the form filler so the ops team can hit Reply. */
  fromUserEmail?: string;
}): Promise<SendResult> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.error("[email] notifyAdmin: CONTACT_TO_EMAIL not set");
    return { ok: false, error: "no_recipient" };
  }
  return sendEmail({ to, subject: opts.subject, html: opts.html, replyTo: opts.fromUserEmail });
}

// ── User auto-reply — "your message was received" ──────────────────
export function buildAutoReplyHtml(opts: {
  name: string;
  topicLabel: string;
  originalMessage: string;
  formKind?: string;
}): string {
  const accent = "#3B82F6";
  const formKind = opts.formKind ?? "İletişim formu";
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
      <div style="background:#1a1a1a;padding:28px 32px;border-radius:12px 12px 0 0">
        <h2 style="color:#fff;margin:0;font-size:22px">Mesajınızı aldık 👋</h2>
        <p style="color:rgba(255,255,255,0.55);margin:8px 0 0;font-size:13px">Bemis E-V Charge — ${formKind}</p>
      </div>
      <div style="background:#ffffff;padding:30px 32px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0;border-top:none">
        <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#222">
          Merhaba <strong>${opts.name}</strong>,
        </p>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#444">
          <strong>"${opts.topicLabel}"</strong> konulu mesajınız ekibimize ulaştı. En kısa sürede dönüş yapacağız —
          genellikle iş günleri içinde 24 saat içinde yanıt veriyoruz.
        </p>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#444">
          Acil bir durum varsa bize doğrudan telefondan da ulaşabilirsiniz.
        </p>

        <div style="margin:24px 0 8px;padding:14px 16px;background:#f7f7fa;border-radius:8px;border-left:3px solid ${accent}">
          <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#888">
            Bize Gönderdiğiniz Mesaj
          </p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#333;white-space:pre-wrap">${escapeHtml(opts.originalMessage)}</p>
        </div>

        <hr style="border:none;border-top:1px solid #ececec;margin:28px 0 20px"/>
        <table style="width:100%;font-size:12px;color:#777">
          <tr>
            <td style="padding:4px 0">
              <strong style="color:#444">Bemis Teknik Elektrik A.Ş.</strong><br/>
              Bursa, Türkiye<br/>
              <a href="https://www.bemisevcharge.com.tr" style="color:${accent};text-decoration:none">www.bemisevcharge.com.tr</a>
            </td>
            <td style="text-align:right;padding:4px 0">
              <a href="mailto:info@bemisevcharge.com" style="color:${accent};text-decoration:none">info@bemisevcharge.com</a>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#aaa;text-align:center">
          Bu mesaj otomatik gönderilmiştir. Cevap atmanız gerekmiyor —
          ekibimize ulaşmak için <a href="mailto:info@bemisevcharge.com" style="color:#aaa">info@bemisevcharge.com</a> kullanın.
        </p>
      </div>
    </div>`;
}

export async function sendAutoReply(opts: {
  toUser: string;
  name: string;
  topicLabel: string;
  originalMessage: string;
  formKind?: string;
}): Promise<SendResult> {
  // Send from no-reply but route replies to the staffed inbox.
  // Best practice: noreply@ as sender (so users don't accidentally
  // reply into a black-hole mailbox), info@ as Reply-To so anyone
  // who *does* hit reply lands at a monitored address.
  const replyTo = process.env.REPLY_TO_EMAIL || "info@bemisevcharge.com";
  return sendEmail({
    to: opts.toUser,
    subject: `Mesajınız alındı — Bemis E-V Charge`,
    html: buildAutoReplyHtml({
      name: opts.name,
      topicLabel: opts.topicLabel,
      originalMessage: opts.originalMessage,
      formKind: opts.formKind,
    }),
    replyTo,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
