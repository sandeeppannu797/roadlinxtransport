'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { submitContact } from './actions';
import { EMPTY_FORM_STATE } from '@/lib/formState';
import { FormError, FormSuccess, SubmitButton, useSuccessPanel } from '@/components/FormFeedback';

/* Fields and copy are verbatim from legacy contact.php, and the error keeps
 * its legacy place inside the form above the fields. On success the form is
 * replaced by a confirmation panel rather than legacy's strip below it. */
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
    <form className="card" ref={formRef} action={formAction} style={{ padding: 'var(--space-7)' }}>
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
          <input id="cname" name="name" type="text" required placeholder="Full name" defaultValue={kept('name')} />
        </div>
        <div className="field">
          <label htmlFor="cphone">Phone</label>
          <input id="cphone" name="phone" type="tel" placeholder="07 0000 0000" defaultValue={kept('phone')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cemail">Email</label>
        <input id="cemail" name="email" type="email" required placeholder="you@business.com.au" defaultValue={kept('email')} />
      </div>
      <div className="field">
        <label htmlFor="cmsg">Message</label>
        <textarea id="cmsg" name="message" required placeholder="How can we help?" defaultValue={kept('message')} />
      </div>
      <SubmitButton pendingLabel="Sending…">Send message</SubmitButton>
    </form>
  );
}
