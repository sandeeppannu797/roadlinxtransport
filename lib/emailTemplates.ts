import { SITE_URL } from '@/lib/site';

/*
 * HTML bodies for the quote and contact notification emails. The legacy
 * plain-text bodies built in app/quote/actions.ts and app/contact/actions.ts
 * still go out alongside these as the text/plain part.
 *
 * Email clients ignore most modern CSS, so this is table layout with inline
 * styles. Every submitted value comes from an anonymous visitor: it reaches
 * the markup only through esc(), or mailtoHref()/telHref() for links.
 */

const NAVY = '#172E44';
const ORANGE = '#E97B21';
const ORANGE_TEXT = '#CF6A12'; // darker accent for small text on white
const BODY = '#344456';
const MUTED = '#6B7785';
const FAINT = '#9AA4AF';
const LINE = '#E3E7EC';
const TINT = '#F6F8FA';
const PAGE = '#F1F3F6';
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const LOGO_URL = `${SITE_URL}/assets/img/roadlinx-logo.png`;
const SITE_LABEL = 'roadlinxtransport.com.au';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function multiline(value: string): string {
  return esc(value).replace(/\r\n|\r|\n/g, '<br>');
}

function textStyle(size: number, lineHeight: number, weight: number, color: string): string {
  return `font-family:${FONT};font-size:${size}px;line-height:${lineHeight}px;font-weight:${weight};color:${color};`;
}

/** Encoded so a crafted address can't add ?cc=/&bcc= to the reply. */
function mailtoHref(email: string, subject: string): string {
  const to = encodeURIComponent(email).replace(/%40/g, '@');
  return esc(`mailto:${to}?subject=${encodeURIComponent(subject)}`);
}

/** Digits and + only; null when nothing dialable is left. */
function telHref(phone: string): string | null {
  const dialable = phone.replace(/[^\d+]/g, '');
  return /\d{6,}/.test(dialable) ? `tel:${dialable}` : null;
}

type Tone = 'strong' | 'plain' | 'accent';

/** A submitted value as cell HTML, or a muted placeholder when it was left blank. */
function value(v: string, tone: Tone = 'strong', blank = 'Not provided'): string {
  if (!v) return `<span style="${textStyle(15, 22, 400, FAINT)}">${esc(blank)}</span>`;
  const color = tone === 'accent' ? ORANGE_TEXT : NAVY;
  const weight = tone === 'plain' ? 400 : 600;
  return `<span style="${textStyle(15, 22, weight, color)}">${multiline(v)}</span>`;
}

function emailValue(email: string, subject: string): string {
  return `<a href="${mailtoHref(email, subject)}" style="${textStyle(15, 22, 600, ORANGE_TEXT)}text-decoration:none;">${esc(email).replace('@', '@<wbr>')}</a>`;
}

function sectionLabel(text: string): string {
  return `<p style="margin:32px 0 12px;${textStyle(12, 16, 700, ORANGE)}letter-spacing:1.5px;">${esc(text)}</p>`;
}

function detailsTable(rows: { label: string; html: string }[]): string {
  const last = rows.length - 1;
  const body = rows
    .map((row, i) => {
      const divider = i < last ? `border-bottom:1px solid ${LINE};` : '';
      const corners =
        (i === 0 ? 'border-top-left-radius:8px;' : '') + (i === last ? 'border-bottom-left-radius:8px;' : '');
      return (
        '<tr>' +
        `<td class="rl-cell" width="36%" valign="top" bgcolor="${TINT}" style="padding:13px 16px;background:${TINT};${divider}${corners}${textStyle(14, 22, 400, MUTED)}">${esc(row.label)}</td>` +
        `<td class="rl-cell" valign="top" style="padding:13px 16px;${divider}word-break:break-word;">${row.html}</td>` +
        '</tr>'
      );
    })
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border:1px solid ${LINE};border-radius:8px;">${body}</table>`;
}

function messageBox(v: string, blank: string): string {
  const content = v
    ? `<span style="${textStyle(15, 24, 400, BODY)}">${multiline(v)}</span>`
    : `<span style="${textStyle(15, 24, 400, FAINT)}">${esc(blank)}</span>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td bgcolor="${TINT}" style="padding:20px 22px;background:${TINT};border:1px solid ${LINE};border-radius:8px;word-break:break-word;">${content}</td></tr></table>`;
}

/** `href` must already be safe for an attribute (mailtoHref/telHref output). */
function button(label: string, href: string, solid: boolean): string {
  const fill = solid ? ORANGE : '#FFFFFF';
  const edge = solid ? ORANGE : NAVY;
  return (
    '<table class="rl-btn" role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:top;margin:0 12px 12px 0;">' +
    `<tr><td bgcolor="${fill}" style="background:${fill};border:1px solid ${edge};border-radius:6px;">` +
    `<a class="rl-btn-link" href="${href}" style="display:inline-block;padding:13px 28px;${textStyle(15, 20, 700, solid ? '#FFFFFF' : NAVY)}text-decoration:none;border-radius:6px;">${esc(label)}</a>` +
    '</td></tr></table>'
  );
}

/** Call is the primary action when there is a number to call; otherwise email is. */
function customerButtons(phone: string, email: string, replySubject: string): string {
  const tel = telHref(phone);
  const mailto = mailtoHref(email, replySubject);
  return tel
    ? button('Call Customer', tel, true) + button('Email Customer', mailto, false)
    : button('Email Customer', mailto, true);
}

function layout(o: {
  title: string;
  preheader: string;
  overline: string;
  intro: string;
  content: string;
  buttons: string;
  source: string;
}): string {
  const preheader = esc(o.preheader.replace(/\s+/g, ' ').trim());
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(o.title)}</title>
<style>
@media (max-width: 620px) {
  .rl-pad { padding-left: 20px !important; padding-right: 20px !important; }
  .rl-h1 { font-size: 26px !important; line-height: 32px !important; }
  .rl-tagline { font-size: 11px !important; letter-spacing: 1.5px !important; }
  .rl-cell { padding-left: 12px !important; padding-right: 12px !important; }
  .rl-btn { display: table !important; width: 100% !important; margin-right: 0 !important; }
  .rl-btn-link { display: block !important; text-align: center; }
}
</style>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}${'&nbsp;&zwnj;'.repeat(60)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE}" style="background:${PAGE};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:10px;">
<tr><td align="center" bgcolor="${NAVY}" style="padding:28px 24px 22px;background:${NAVY};border-radius:10px 10px 0 0;">
<a href="${SITE_URL}/" style="text-decoration:none;"><img src="${LOGO_URL}" width="144" height="72" alt="ROAD LINX TRANSPORT" style="display:block;margin:0 auto;width:144px;height:72px;border:0;outline:none;${textStyle(16, 20, 700, '#FFFFFF')}"></a>
<p class="rl-tagline" style="margin:16px 0 0;${textStyle(12, 16, 500, '#C5CFDA')}letter-spacing:3px;">BRISBANE &middot; SE QLD &middot; NORTHERN NSW</p>
</td></tr>
<tr><td height="6" bgcolor="${ORANGE}" style="height:6px;background:${ORANGE};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td class="rl-pad" style="padding:40px;">
<p style="margin:0 0 10px;${textStyle(12, 16, 700, ORANGE)}letter-spacing:1.5px;">${esc(o.overline)}</p>
<h1 class="rl-h1" style="margin:0 0 12px;${textStyle(32, 38, 700, NAVY)}letter-spacing:-0.3px;">${esc(o.title)}</h1>
<p style="margin:0;${textStyle(16, 24, 400, MUTED)}">${esc(o.intro)} <strong style="color:${NAVY};font-weight:600;white-space:nowrap;">Road&nbsp;Linx&nbsp;Transport</strong>.</p>
${o.content}
<div style="margin-top:32px;font-size:0;line-height:0;">${o.buttons}</div>
</td></tr>
<tr><td align="center" bgcolor="${NAVY}" style="padding:26px 24px;background:${NAVY};border-radius:0 0 10px 10px;">
<p style="margin:0;${textStyle(15, 20, 700, '#FFFFFF')}letter-spacing:1px;">ROAD LINX TRANSPORT</p>
<p style="margin:8px 0 0;${textStyle(13, 20, 400, '#C5CFDA')}">Sent from the ${esc(o.source)} on <a href="${SITE_URL}/" style="color:#FFFFFF;text-decoration:underline;">${SITE_LABEL}</a>.<br>Reply to this email to respond to the customer directly.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export interface QuoteEmail {
  name: string;
  company: string;
  email: string;
  phone: string;
  pickup: string;
  delivery: string;
  service: string;
  load: string;
  when: string;
  notes: string;
}

export function quoteEmailHtml(q: QuoteEmail): string {
  return layout({
    title: 'New Freight Quote Request',
    preheader: `${q.name} · ${q.pickup} to ${q.delivery}`,
    overline: 'NEW FREIGHT ENQUIRY',
    intro: 'A new freight enquiry has been submitted through',
    content:
      sectionLabel('CUSTOMER DETAILS') +
      detailsTable([
        { label: 'Name', html: value(q.name) },
        { label: 'Company', html: value(q.company) },
        { label: 'Email', html: emailValue(q.email, 'Re: Your freight quote request') },
        { label: 'Phone', html: value(q.phone) },
      ]) +
      sectionLabel('FREIGHT DETAILS') +
      detailsTable([
        { label: 'Pickup Suburb', html: value(q.pickup) },
        { label: 'Delivery Suburb', html: value(q.delivery) },
        // The form's empty option is labelled "Not sure — recommend one".
        { label: 'Service Needed', html: value(q.service, 'strong', 'Not sure — recommend one') },
        { label: 'Load', html: value(q.load, 'plain') },
        { label: 'When', html: value(q.when, 'accent') },
      ]) +
      sectionLabel('CUSTOMER NOTES') +
      messageBox(q.notes, 'No notes provided.'),
    buttons: customerButtons(q.phone, q.email, 'Re: Your freight quote request'),
    source: 'freight quote form',
  });
}

export interface ContactEmail {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function contactEmailHtml(c: ContactEmail): string {
  return layout({
    title: 'New Contact Form Enquiry',
    preheader: `${c.name}: ${c.message.slice(0, 120)}`,
    overline: 'NEW WEBSITE ENQUIRY',
    intro: 'A new enquiry has been submitted through',
    content:
      sectionLabel('CUSTOMER DETAILS') +
      detailsTable([
        { label: 'Name', html: value(c.name) },
        { label: 'Phone', html: value(c.phone) },
        { label: 'Email', html: emailValue(c.email, 'Re: Your enquiry to Road Linx Transport') },
      ]) +
      sectionLabel('MESSAGE') +
      messageBox(c.message, 'No message provided.'),
    buttons: customerButtons(c.phone, c.email, 'Re: Your enquiry to Road Linx Transport'),
    source: 'contact form',
  });
}
