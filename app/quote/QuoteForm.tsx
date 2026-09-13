'use client';

import { useActionState } from 'react';
import { submitQuote } from './actions';
import { EMPTY_FORM_STATE } from '@/lib/formState';
import { FormError, FormSuccess, SubmitButton, useSuccessPanel } from '@/components/FormFeedback';

/* Field set, labels, placeholders and select options are verbatim from
 * legacy quote.php. The error keeps its legacy position below the form; on
 * success the form is replaced by a confirmation panel. */
const serviceOptions = [
  'General freight',
  'Full truck load (FTL)',
  'Taxi truck',
  'Tail-lift delivery',
  'Hot shot / same-day',
  'Semi-trailer hire',
  'Distribution run',
  'Warehouse relocation',
  'Interstate / Northern NSW',
  'Relief driver',
];

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
      <form className="card" ref={formRef} action={formAction} style={{ padding: 'var(--space-7)' }}>
        <div className="form-grid">
          <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" type="text" required placeholder="Full name" defaultValue={kept('name')} /></div>
          <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" type="text" placeholder="Business name" defaultValue={kept('company')} /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@business.com.au" defaultValue={kept('email')} /></div>
          <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required placeholder="07 0000 0000" defaultValue={kept('phone')} /></div>
          <div className="field"><label htmlFor="pickup">Pickup suburb</label><input id="pickup" name="pickup" type="text" required placeholder="e.g. Wacol" defaultValue={kept('pickup')} /></div>
          <div className="field"><label htmlFor="delivery">Delivery suburb</label><input id="delivery" name="delivery" type="text" required placeholder="e.g. Gold Coast" defaultValue={kept('delivery')} /></div>
        </div>
        <div className="field"><label htmlFor="service">Service needed</label>
          <select id="service" name="service" defaultValue={kept('service')}>
            <option value="">Not sure — recommend one</option>
            {serviceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="form-grid">
          <div className="field"><label htmlFor="load">What are you sending?</label><input id="load" name="load" type="text" placeholder="e.g. 6 pallets of stock" defaultValue={kept('load')} /></div>
          <div className="field"><label htmlFor="when">When does it need to move?</label><input id="when" name="when" type="text" placeholder="e.g. Thursday AM" defaultValue={kept('when')} /></div>
        </div>
        <div className="field"><label htmlFor="notes">Anything else? (access, dock, forklift, urgency)</label><textarea id="notes" name="notes" placeholder="Tell us about site access, delivery windows or anything unusual about the load." defaultValue={kept('notes')} /></div>
        <SubmitButton pendingLabel="Sending…">Send quote request</SubmitButton>
        <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-3) 0 0' }}>Prefer to talk? Call <a href="tel:0731797072">07 3179 7072</a> — we answer the phone.</p>
      </form>

      {state.error && <FormError>{state.error}</FormError>}
    </div>
  );
}
