'use server';

import { sendMail } from '@/lib/mailer';
import {
  ERR_EMAIL, ERR_REQUIRED, ERR_SEND, field, isValidEmail, type FormState,
} from '@/lib/formState';

/* Port of the contact.php handler: name/email/message required (phone
 * optional), same subject and body layout, same user-facing messages. */
export async function submitContact(_prev: FormState, data: FormData): Promise<FormState> {
  const name = field(data, 'name');
  const phone = field(data, 'phone');
  const email = field(data, 'email');
  const message = field(data, 'message');

  const values = { name, phone, email, message };

  if (!name || !email || !message) {
    return { error: ERR_REQUIRED, success: '', values };
  }
  if (!isValidEmail(email)) {
    return { error: ERR_EMAIL, success: '', values };
  }

  const text = `
New Contact Form Submission

------------------------------------

Name: ${name}

Phone: ${phone}

Email: ${email}

Message:

${message}
`;

  try {
    await sendMail({
      subject: '💥 New Contact Form Enquiry - Road Linx Transport',
      text,
      replyTo: email,
    });
  } catch (err) {
    console.error('contact form send failed', err);
    return { error: ERR_SEND, success: '', values };
  }

  return { error: '', success: 'Thank you! Your message has been sent successfully.' };
}
