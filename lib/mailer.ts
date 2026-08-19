import 'server-only';
import nodemailer from 'nodemailer';

/*
 * Replaces the legacy PHP mail() calls in quote.php and contact.php.
 * Recipients, sender and subjects are unchanged from the legacy site;
 * SMTP credentials come from the environment (see .env.example).
 */
export const MAIL_TO = 'info@roadlinxtransport.com.au';
export const MAIL_FROM = '"Road Linx Transport" <admin@roadlinxtransport.com.au>';

/** Header values must not carry CR/LF — a submitted address ends up in Reply-To. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} — cannot send mail`);
  return value;
}

export async function sendMail(opts: { subject: string; text: string; replyTo: string }) {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port,
    secure: port === 465,
    auth: { user: requireEnv('SMTP_USER'), pass: requireEnv('SMTP_PASS') },
  });

  await transport.sendMail({
    to: MAIL_TO,
    from: MAIL_FROM,
    replyTo: headerSafe(opts.replyTo),
    subject: opts.subject,
    text: opts.text,
  });
}
