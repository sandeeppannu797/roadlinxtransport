'use client';

import { useActionState } from 'react';
import { submitQuote } from './actions';
import { EMPTY_FORM_STATE } from '@/lib/formState';

/* Field set, labels, placeholders and select options are verbatim from
 * legacy quote.php. Status messages keep their legacy position: below the
 * form, success first. */
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
  const kept = (name: string) => state.values?.[name] ?? '';

  return (
    <div>
      <form className="card" action={formAction} style={{ padding: 'var(--space-7)' }}>
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
        <button className="btn btn-accent btn-lg btn-block" type="submit">Send quote request</button>
        <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-3) 0 0' }}>Prefer to talk? Call <a href="tel:0731797072">07 3179 7072</a> — we answer the phone.</p>
      </form>

      {state.success && (
        <div role="status" style={{ background: '#e8f8ef', border: '1px solid #27ae60', color: '#1e8449', padding: 15, borderRadius: 8, marginBottom: 20 }}>
          {state.success}
        </div>
      )}

      {state.error && (
        <div role="alert" style={{ background: '#fdeaea', border: '1px solid #e74c3c', color: '#c0392b', padding: 15, borderRadius: 8, marginBottom: 20 }}>
          {state.error}
        </div>
      )}
    </div>
  );
}
