'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { submitContact } from './actions';
import { EMPTY_FORM_STATE, HONEYPOT_FIELD } from '@/lib/formState';
import { FormError, FormSuccess, SubmitButton, useSuccessPanel } from '@/components/FormFeedback';

/* The error keeps the legacy contact.php place inside the form above the
 * fields. On success the form is replaced by a confirmation panel.
 * Required fields match submitContact: name, email and message. */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, EMPTY_FORM_STATE);
  const { showSuccess, formRef, sendAnother } = useSuccessPanel(state);
  const kept = (name: string) => state.values?.[name] ?? '';

  if (showSuccess) {
    return (
      <FormSuccess
        title="Message sent"
        message={state.success}
        email={state.sentTo}
        againLabel="Send another message"
        onAgain={sendAnother}
      />
    );
  }

  return (
    <form className="card form-card" ref={formRef} action={formAction}>
      <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-2)' }}>
        Send a message
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-5)' }}>
        For a freight price, the <Link href="/quote">quote form</Link> gets you a faster answer.
      </p>

      {state.error && <FormError>{state.error}</FormError>}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="cname">Name</label>
          <input id="cname" name="name" type="text" required maxLength={100} autoComplete="name" defaultValue={kept('name')} />
        </div>
        <div className="field">
          <label htmlFor="cphone">Phone <span className="optional">Optional</span></label>
          <input id="cphone" name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="07 0000 0000" defaultValue={kept('phone')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cemail">Email</label>
        <input id="cemail" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@business.com.au" defaultValue={kept('email')} />
      </div>
      <div className="field">
        <label htmlFor="cmsg">Message</label>
        <textarea id="cmsg" name="message" rows={4} required maxLength={4000} placeholder="How can we help?" defaultValue={kept('message')} />
      </div>
      {/* Honeypot: hidden from people, filled in by spam bots (see isBot). */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <SubmitButton pendingLabel="Sending…">Send message</SubmitButton>
      <p className="form-note">We only use your details to reply — <Link href="/privacy-compliance#privacy">privacy policy</Link>.</p>
    </form>
  );
}
