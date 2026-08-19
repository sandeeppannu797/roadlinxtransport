'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { submitContact } from './actions';
import { EMPTY_FORM_STATE } from '@/lib/formState';

/* Verbatim from legacy contact.php, including the message placement:
 * the error renders inside the form above the fields, the success below it. */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, EMPTY_FORM_STATE);
  const kept = (name: string) => state.values?.[name] ?? '';

  return (
    <div>
      <form className="card" action={formAction} style={{ padding: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-2)' }}>
          Send a message
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-5)' }}>
          For a freight price, the <Link href="/quote">quote form</Link> gets you a faster answer.
        </p>

        {state.error && (
          <div role="alert" style={{ background: '#fdeaea', border: '1px solid #e74c3c', color: '#c0392b', padding: 15, borderRadius: 8, marginBottom: 20 }}>
            {state.error}
          </div>
        )}

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
        <button className="btn btn-accent btn-lg btn-block" type="submit">Send message
        </button>
      </form>

      {state.success && (
        <div role="status" style={{ background: '#e8f8ef', border: '1px solid #27ae60', color: '#1e8449', padding: 15, borderRadius: 8, marginBottom: 20 }}>
          {state.success}
        </div>
      )}
    </div>
  );
}
