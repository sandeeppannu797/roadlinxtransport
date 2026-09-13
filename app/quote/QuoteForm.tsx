'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { submitQuote } from './actions';
import { EMPTY_FORM_STATE, HONEYPOT_FIELD } from '@/lib/formState';
import { FormError, FormSuccess, SubmitButton, useSuccessPanel } from '@/components/FormFeedback';

/* The error keeps the legacy quote.php position below the form; on success
 * the form is replaced by a confirmation panel. Required fields match
 * submitQuote: name, email, phone, pickup and delivery. */
const serviceOptions = [
  'General freight',
  'Full truck load (FTL)',
  'Taxi truck',
  'Tail-lift delivery',
  'Hot shot / same-day',
  'Semi-trailer hire',
  'Curtainsider / tautliner hire',
  'Flatbed / drop-deck',
  'Distribution run',
  'B2B transport',
  'After-hours / time-slot delivery',
  'Warehouse relocation',
  'Interstate / Northern NSW',
  'Relief driver',
];

const Optional = () => <span className="optional">Optional</span>;

export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuote, EMPTY_FORM_STATE);
  const { showSuccess, formRef, sendAnother } = useSuccessPanel(state);
  const kept = (name: string) => state.values?.[name] ?? '';

  if (showSuccess) {
    return (
      <FormSuccess
        title="Quote request sent"
        message={state.success}
        email={state.sentTo}
        againLabel="Request another quote"
        onAgain={sendAnother}
      />
    );
  }

  return (
    <div>
      <form className="card form-card" ref={formRef} action={formAction}>
        <div className="form-grid">
          <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" type="text" required maxLength={100} autoComplete="name" defaultValue={kept('name')} /></div>
          <div className="field"><label htmlFor="company">Company <Optional /></label><input id="company" name="company" type="text" maxLength={120} autoComplete="organization" defaultValue={kept('company')} /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@business.com.au" defaultValue={kept('email')} /></div>
          <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="07 0000 0000" defaultValue={kept('phone')} /></div>
          <div className="field"><label htmlFor="pickup">Pickup suburb</label><input id="pickup" name="pickup" type="text" required maxLength={100} placeholder="e.g. Wacol" defaultValue={kept('pickup')} /></div>
          <div className="field"><label htmlFor="delivery">Delivery suburb</label><input id="delivery" name="delivery" type="text" required maxLength={100} placeholder="e.g. Gold Coast" defaultValue={kept('delivery')} /></div>
          <div className="field"><label htmlFor="load">What are you sending? <Optional /></label><input id="load" name="load" type="text" maxLength={200} placeholder="e.g. 6 pallets of stock" defaultValue={kept('load')} /></div>
          <div className="field"><label htmlFor="when">When does it need to move? <Optional /></label><input id="when" name="when" type="text" maxLength={200} placeholder="e.g. Thursday morning" defaultValue={kept('when')} /></div>
        </div>
        <div className="field"><label htmlFor="service">Service needed <Optional /></label>
          <select id="service" name="service" defaultValue={kept('service')}>
            <option value="">Not sure — recommend one</option>
            {serviceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="notes">Anything else? <Optional /></label><textarea id="notes" name="notes" rows={3} maxLength={4000} placeholder="Site access, dock or forklift, delivery windows, urgency…" defaultValue={kept('notes')} /></div>
        {/* Honeypot: hidden from people, filled in by spam bots (see isBot). */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="quote-website">Website</label>
          <input id="quote-website" name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <SubmitButton pendingLabel="Sending…">Send quote request</SubmitButton>
        <p className="form-note">
          Prefer to talk? Call <a href="tel:0731797072">07 3179 7072</a>. We only use your details to reply —{' '}
          <Link href="/privacy-compliance#privacy">privacy policy</Link>.
        </p>
      </form>

      {state.error && <FormError>{state.error}</FormError>}
    </div>
  );
}
