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

/** Admin-managed template overrides. Each field optional — empty falls
 *  back to the hardcoded default below. Variables {name}, {topicLabel},
 *  {formKind}, {contactEmail} are substituted before HTML rendering. */
export type AutoReplyTemplate = {
  subject?: string;
  heading?: string;
  greeting?: string;
  intro1?: string;
  intro2?: string;
  quoteHeading?: string;
  footerNote?: string;
  companyAddress?: string;
  contactEmail?: string;
};

const DEFAULT_TEMPLATE: Required<AutoReplyTemplate> = {
  subject: "Başvurunuz alındı — Bemis E-V Charge",
  heading: "Başvurunuz alındı",
  greeting: "Sayın {name},",
  intro1: "\"{topicLabel}\" konulu başvurunuz tarafımıza ulaşmıştır.",
  intro2: "İlgili birimimiz başvurunuzu inceleyerek iş günleri içerisinde — genellikle 24 saat içinde — sizinle iletişime geçecektir.",
  quoteHeading: "Tarafımıza İlettiğiniz Mesaj",
  footerNote: "Bu otomatik bir bilgilendirme e-postasıdır. Ek bilgi paylaşmak isterseniz {contactEmail} adresine yazabilirsiniz.",
  companyAddress: "Bursa, Türkiye",
  contactEmail: "info@bemisevcharge.com",
};

function mergeTemplate(t?: AutoReplyTemplate): Required<AutoReplyTemplate> {
  if (!t) return DEFAULT_TEMPLATE;
  return {
    subject:        (t.subject        || "").trim() || DEFAULT_TEMPLATE.subject,
    heading:        (t.heading        || "").trim() || DEFAULT_TEMPLATE.heading,
    greeting:       (t.greeting       || "").trim() || DEFAULT_TEMPLATE.greeting,
    intro1:         (t.intro1         || "").trim() || DEFAULT_TEMPLATE.intro1,
    intro2:         (t.intro2         || "").trim() || DEFAULT_TEMPLATE.intro2,
    quoteHeading:   (t.quoteHeading   || "").trim() || DEFAULT_TEMPLATE.quoteHeading,
    footerNote:     (t.footerNote     || "").trim() || DEFAULT_TEMPLATE.footerNote,
    companyAddress: (t.companyAddress || "").trim() || DEFAULT_TEMPLATE.companyAddress,
    contactEmail:   (t.contactEmail   || "").trim() || DEFAULT_TEMPLATE.contactEmail,
  };
}

function substitute(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export function buildAutoReplyHtml(opts: {
  name: string;
  topicLabel: string;
  originalMessage: string;
  formKind?: string;
  template?: AutoReplyTemplate;
}): string {
  const accent = "#3B82F6";
  const formKind = opts.formKind ?? "İletişim formu";
  const t = mergeTemplate(opts.template);
  const vars = {
    name: opts.name,
    topicLabel: opts.topicLabel,
    formKind,
    contactEmail: t.contactEmail,
  };
  const heading     = substitute(t.heading, vars);
  const greeting    = substitute(t.greeting, vars);
  const intro1      = substitute(t.intro1, vars);
  const intro2      = substitute(t.intro2, vars);
  const footerNote  = substitute(t.footerNote, vars);
  // Brand logo: on-black variant (siyah opak kare + beyaz B) so the
  // mark stays readable even when an email client renders our dark
  // header strip on a light background. White-on-transparent would
  // disappear there. Same domain as the site → SPF/DKIM alignment
  // covers the image origin.
  const logoUrl = "https://www.bemisevcharge.com.tr/favicon-on-black-192.png";
  const year = new Date().getFullYear();
  const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  // Email-safe: tablo-bazlı outer wrapper (Outlook için), tüm stiller
  // inline. max-width 640px, açık-gri sayfa zemini → beyaz kart hissi.
  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(heading)}</title>
    <style>
      /* Mobile overrides — gmail iOS/Android, Apple Mail, Outlook iOS bunları
         destekler. Outlook desktop ignore eder, default padding kalır. */
      @media only screen and (max-width: 520px) {
        .em-wrap     { padding: 12px 4px !important; }
        .em-card     { border-radius: 10px !important; }
        .em-pad      { padding: 22px 18px !important; }
        .em-pad-sm   { padding: 16px 18px 6px !important; }
        .em-pad-tight{ padding: 14px 18px 0 !important; }
        .em-pad-cta  { padding: 20px 18px 4px !important; }
        .em-pad-foot { padding: 22px 18px 20px !important; }
        .em-pad-head { padding: 22px 18px !important; }
        .em-logo     { width: 42px !important; height: 42px !important; }
        .em-brand    { font-size: 15px !important; }
        .em-brand-sub{ font-size: 10.5px !important; }
        .em-eyebrow  { font-size: 10px !important; letter-spacing: 1.4px !important; }
        .em-h1       { font-size: 21px !important; }
        .em-greet    { font-size: 14.5px !important; }
        .em-p        { font-size: 13.5px !important; line-height: 1.65 !important; }
        .em-quote    { font-size: 13px !important; }
        .em-card-pad { padding: 16px 16px !important; }
        .em-cta-link { padding: 12px 22px !important; font-size: 13px !important; }
        .em-contact-label { display: block !important; width: 100% !important; padding-bottom: 2px !important; padding-top: 8px !important; }
        .em-contact-val   { display: block !important; width: 100% !important; padding-bottom: 4px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:${FONT};color:#1a1a1a;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;width:100%">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
      ${escapeHtml(heading)} — ${escapeHtml(formKind)}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f5f7" class="em-wrap-table">
      <tr>
        <td align="center" class="em-wrap" style="padding:28px 14px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" class="em-card" style="max-width:640px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06)">
            <!-- Top brand band -->
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${accent} 0%,#1D4ED8 100%);background-color:${accent}">&nbsp;</td>
            </tr>
            <!-- Header: logo + brand mark -->
            <tr>
              <td class="em-pad-head" style="background:#0f172a;padding:28px 32px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="vertical-align:middle;width:60px;padding-right:14px">
                      <img src="${logoUrl}" alt="Bemis E-V Charge" width="48" height="48" class="em-logo" style="display:block;width:48px;height:48px;object-fit:contain;border-radius:10px" />
                    </td>
                    <td style="vertical-align:middle">
                      <div class="em-brand" style="color:#ffffff;font-size:17px;font-weight:700;line-height:1.2;letter-spacing:0.2px">Bemis E-V Charge</div>
                      <div class="em-brand-sub" style="color:rgba(255,255,255,0.62);font-size:11.5px;font-weight:500;margin-top:3px;letter-spacing:0.5px;text-transform:uppercase">Türkiye'nin EV Şarj Üreticisi</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Heading section -->
            <tr>
              <td class="em-pad-sm" style="padding:32px 32px 8px">
                <div class="em-eyebrow" style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${accent};margin-bottom:10px">
                  ${escapeHtml(formKind)}
                </div>
                <h1 class="em-h1" style="margin:0 0 6px;font-size:25px;font-weight:800;line-height:1.25;color:#0f172a;letter-spacing:-0.3px">
                  ${escapeHtml(heading)}
                </h1>
                <div style="height:3px;width:40px;background:${accent};border-radius:999px;margin-top:12px"></div>
              </td>
            </tr>
            <!-- Body copy -->
            <tr>
              <td class="em-pad-tight" style="padding:22px 32px 6px">
                <p class="em-greet" style="margin:0 0 16px;font-size:15px;font-weight:600;line-height:1.55;color:#0f172a">
                  ${escapeHtml(greeting)}
                </p>
                <p class="em-p" style="margin:0 0 12px;font-size:14.5px;line-height:1.7;color:#475569">
                  ${escapeHtml(intro1)}
                </p>
                <p class="em-p" style="margin:0;font-size:14.5px;line-height:1.7;color:#475569">
                  ${escapeHtml(intro2)}
                </p>
              </td>
            </tr>
            <!-- User's original message (quote block) -->
            <tr>
              <td class="em-pad-tight" style="padding:22px 32px 10px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid ${accent};border-radius:10px">
                  <tr>
                    <td class="em-card-pad" style="padding:18px 20px">
                      <div class="em-eyebrow" style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#64748b;margin-bottom:10px">
                        ${escapeHtml(t.quoteHeading)}
                      </div>
                      <div class="em-quote" style="font-size:14px;line-height:1.65;color:#0f172a;white-space:pre-wrap;font-style:italic;word-break:break-word">${escapeHtml(opts.originalMessage)}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Contact details card -->
            <tr>
              <td class="em-pad-tight" style="padding:16px 32px 0">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px">
                  <tr>
                    <td class="em-card-pad" style="padding:18px 20px">
                      <div class="em-eyebrow" style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#64748b;margin-bottom:12px">
                        İletişim
                      </div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:13.5px;color:#334155">
                        <tr>
                          <td class="em-contact-label" style="padding:5px 0;width:90px;color:#94a3b8;font-weight:600">E-posta</td>
                          <td class="em-contact-val" style="padding:5px 0;word-break:break-word">
                            <a href="mailto:${escapeHtml(t.contactEmail)}" style="color:${accent};text-decoration:none;font-weight:600">${escapeHtml(t.contactEmail)}</a>
                          </td>
                        </tr>
                        <tr>
                          <td class="em-contact-label" style="padding:5px 0;color:#94a3b8;font-weight:600">Web</td>
                          <td class="em-contact-val" style="padding:5px 0;word-break:break-word">
                            <a href="https://www.bemisevcharge.com.tr" style="color:${accent};text-decoration:none;font-weight:600">www.bemisevcharge.com.tr</a>
                          </td>
                        </tr>
                        <tr>
                          <td class="em-contact-label" style="padding:5px 0;color:#94a3b8;font-weight:600">Adres</td>
                          <td class="em-contact-val" style="padding:5px 0;color:#334155;word-break:break-word">${escapeHtml(t.companyAddress)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- CTA button -->
            <tr>
              <td align="center" class="em-pad-cta" style="padding:26px 32px 6px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background:${accent};border-radius:8px">
                      <a href="https://www.bemisevcharge.com.tr" class="em-cta-link" style="display:inline-block;padding:13px 26px;font-size:13.5px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px">Ürünlerimizi İnceleyin &nbsp;→</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td class="em-pad-foot" style="padding:30px 32px 26px">
                <div style="border-top:1px solid #e2e8f0;padding-top:22px">
                  <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">Bemis Teknik Elektrik A.Ş.</div>
                  <div style="font-size:12px;color:#94a3b8;line-height:1.6">
                    ${escapeHtml(t.companyAddress)} · 1994'ten bu yana endüstriyel elektrik üretimi
                  </div>
                  <div style="font-size:11px;color:#cbd5e1;margin-top:14px;line-height:1.6">
                    © ${year} Bemis Teknik Elektrik A.Ş. Tüm hakları saklıdır.
                  </div>
                  <div style="font-size:11px;color:#cbd5e1;margin-top:8px;line-height:1.6">
                    ${escapeHtml(footerNote)}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendAutoReply(opts: {
  toUser: string;
  name: string;
  topicLabel: string;
  originalMessage: string;
  formKind?: string;
  /** Operator-managed copy from CMS (admin → İletişim → Mail Şablonu).
   *  Boş/undefined ise lib/email.ts'deki sabit fallback'lere düşer. */
  template?: AutoReplyTemplate;
}): Promise<SendResult> {
  // Send from no-reply but route replies to the staffed inbox.
  // Best practice: noreply@ as sender (so users don't accidentally
  // reply into a black-hole mailbox), info@ as Reply-To so anyone
  // who *does* hit reply lands at a monitored address.
  const replyTo = process.env.REPLY_TO_EMAIL || "info@bemisevcharge.com";
  const merged = mergeTemplate(opts.template);
  return sendEmail({
    to: opts.toUser,
    subject: merged.subject,
    html: buildAutoReplyHtml({
      name: opts.name,
      topicLabel: opts.topicLabel,
      originalMessage: opts.originalMessage,
      formKind: opts.formKind,
      template: opts.template,
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
