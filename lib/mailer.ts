import 'server-only';
import { Resend } from 'resend';

/*
 * Replaces the legacy PHP mail() calls in quote.php and contact.php.
 * Subjects and body layout are unchanged from the legacy site. Two things
 * deliberately are not:
 *
 * - Recipient. Legacy sent to info@, which does not exist in the business's
 *   Microsoft 365 tenant, so Exchange would reject every submission.
 * - Sender. Mail goes out through Resend from the mail. subdomain, keeping
 *   the apex domain's sending reputation tied to Microsoft 365 alone.
 *   The subdomain must be verified in Resend (see README).
 */
export const MAIL_TO = 'admin@roadlinxtransport.com.au';
export const MAIL_FROM = '"Road Linx Transport" <noreply@mail.roadlinxtransport.com.au>';

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
  const resend = new Resend(requireEnv('RESEND_API_KEY'));

  // The SDK reports API failures in `error` rather than throwing. Throw here
  // so the form actions' catch shows the failure message instead of success.
  const { error } = await resend.emails.send({
    to: MAIL_TO,
    from: MAIL_FROM,
    replyTo: headerSafe(opts.replyTo),
    subject: opts.subject,
    text: opts.text,
  });
  if (error) throw new Error(`Resend rejected the message: ${error.name} — ${error.message}`);
}
