'use server';

import { quoteEmailHtml } from '@/lib/emailTemplates';
import { sendMail } from '@/lib/mailer';
import {
  ERR_EMAIL, ERR_REQUIRED, ERR_SEND, field, isBot, isValidEmail, type FormState,
} from '@/lib/formState';

const SUCCESS = 'Thank you! Your quote request has been sent successfully.';

/* Port of the quote.php handler: same required fields, same validation
 * order, same subject and body layout, same user-facing messages. */
export async function submitQuote(_prev: FormState, data: FormData): Promise<FormState> {
  // Bots get the normal success message, so they have nothing to adapt to.
  if (isBot(data)) return { error: '', success: SUCCESS };

  const name = field(data, 'name');
  const company = field(data, 'company');
  const email = field(data, 'email');
  const phone = field(data, 'phone');
  const pickup = field(data, 'pickup');
  const delivery = field(data, 'delivery');
  const service = field(data, 'service');
  const load = field(data, 'load');
  const when = field(data, 'when');
  const notes = field(data, 'notes');

  const values = { name, company, email, phone, pickup, delivery, service, load, when, notes };

  if (!name || !email || !phone || !pickup || !delivery) {
    return { error: ERR_REQUIRED, success: '', values };
  }
  if (!isValidEmail(email)) {
    return { error: ERR_EMAIL, success: '', values };
  }

  const text = `
New Freight Quote Request

------------------------------------

Name: ${name}

Company: ${company}

Email: ${email}

Phone: ${phone}

Pickup Suburb: ${pickup}

Delivery Suburb: ${delivery}

Service Needed: ${service}

Load: ${load}

When: ${when}

Notes:

${notes}
`;

  try {
    await sendMail({
      subject: '💥 New Freight Quote Request - Road Linx Transport',
      text,
      html: quoteEmailHtml(values),
      replyTo: email,
    });
  } catch (err) {
    console.error('quote form send failed', err);
    return { error: ERR_SEND, success: '', values };
  }

  return { error: '', success: SUCCESS, sentTo: email };
}
