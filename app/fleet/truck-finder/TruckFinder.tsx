'use client';

/*
 * "Which truck do I need?" — suggests a vehicle from a few answers about the
 * load. The sizing follows what the Fleet and service pages say: utes and
 * vans for a couple of pallets, 4–12 t rigids and 3–12 t tail-lift trucks
 * for the bulk of metro freight, 22/24-pallet semis for full loads (22 when
 * heavy freight hits the mass limit first), flat-tops and drop-decks for
 * craned, oversize or tall freight.
 */
import Link from 'next/link';
import { useState } from 'react';

const UTE_MAX_PALLETS = 2;
/** Typical capacity of a 12-tonne rigid. Not stated on the site: confirm with the business. */
const RIGID_MAX_PALLETS = 12;
const SEMI_MAX_PALLETS = 24;
const MAX_PALLETS = 60;

type Kind = 'pallets' | 'items' | 'oversize';
type Weight = 'light' | 'heavy';
type Access = 'dock' | 'ground' | 'crane';
type Timing = 'booked' | 'urgent';
type Height = 'standard' | 'tall';

interface Answers { kind: Kind; pallets: number; weight: Weight; access: Access; timing: Timing; height: Height }

interface Service { href: string; name: string; quoteOption: string }

/* quoteOption must match an option in app/quote/QuoteForm.tsx. */
const SERVICES = {
  taxi: { href: '/services/taxi-truck-hire', name: 'Taxi truck hire', quoteOption: 'Taxi truck' },
  tailLift: { href: '/services/tail-lift-tailgate-delivery', name: 'Tail-lift delivery', quoteOption: 'Tail-lift delivery' },
  general: { href: '/services/general-freight-transport', name: 'General freight', quoteOption: 'General freight' },
  ftl: { href: '/services/full-truck-load-ftl', name: 'Full truck load (FTL)', quoteOption: 'Full truck load (FTL)' },
  flatbed: { href: '/services/flatbed-drop-deck-transport', name: 'Flatbed & drop-deck transport', quoteOption: 'Flatbed / drop-deck' },
} satisfies Record<string, Service>;

const HOT_SHOT_QUOTE_OPTION = 'Hot shot / same-day';

interface Suggestion { vehicle: string; why: string; service: Service; notes: string[] }

const NO_FORKLIFT_FOR_SEMI =
  'Semi-trailers are unloaded by forklift or at a dock. If the delivery site has neither, call us and we’ll plan how to get it there.';

function suggest(a: Answers): Suggestion {
  if (a.kind === 'oversize') {
    const notes = a.access === 'ground'
      ? ['Tell us how it will come off at the delivery end: flat-tops and drop-decks are unloaded by crane or forklift.']
      : [];
    return a.height === 'tall'
      ? { vehicle: 'Drop-deck trailer', why: 'A drop-deck sits lower over the rear axles, so a tall load stays within the legal height limit.', service: SERVICES.flatbed, notes }
      : { vehicle: 'Flat-top truck or trailer', why: 'Flat-tops are loaded by crane or forklift from the top or sides, which suits steel, timber, machinery and oversize items.', service: SERVICES.flatbed, notes };
  }

  if (a.access === 'crane') {
    return { vehicle: 'Flat-top truck or trailer', why: 'Freight that is craned on and off needs an open deck, so a flat-top is the right fit.', service: SERVICES.flatbed, notes: [] };
  }

  const heavy = a.weight === 'heavy';
  const ground = a.access === 'ground';

  if (a.kind === 'items') {
    if (ground && heavy) {
      return { vehicle: 'Tail-lift truck', why: 'Its powered platform lowers heavy items to the ground, so there’s no need for a forklift or dock at the delivery end.', service: SERVICES.tailLift, notes: [] };
    }
    return {
      vehicle: 'Ute or van',
      why: 'A one-tonne ute or van is the quick, economical choice for a few cartons or small items.',
      service: SERVICES.taxi,
      notes: heavy ? ['If the items are heavy we may step up to a small truck. We’ll confirm when we quote.'] : [],
    };
  }

  const n = a.pallets;
  const pallets = `${n} pallet${n === 1 ? '' : 's'}`;

  if (n <= UTE_MAX_PALLETS) {
    if (ground) {
      return { vehicle: 'Tail-lift truck', why: `With no forklift or dock at the delivery end, a tail-lift truck lowers your ${pallets} to the ground.`, service: SERVICES.tailLift, notes: [] };
    }
    return {
      vehicle: 'Ute or van',
      why: `A one-tonne ute or van handles ${pallets} around the metro quickly and economically.`,
      service: SERVICES.taxi,
      notes: heavy ? ['Heavy pallets may need a small truck instead. We’ll confirm when we quote.'] : [],
    };
  }

  if (n <= RIGID_MAX_PALLETS) {
    return ground
      ? { vehicle: 'Tail-lift truck, 3 to 12 tonnes', why: `For ${pallets} with no forklift at the delivery end, a tail-lift truck lowers each pallet to the ground.`, service: SERVICES.tailLift, notes: [] }
      : { vehicle: 'Rigid truck, 4 to 12 tonnes', why: `Rigid trucks carry the bulk of metro freight, and ${pallets} sits comfortably in that range.`, service: SERVICES.general, notes: [] };
  }

  const notes = ground ? [NO_FORKLIFT_FOR_SEMI] : [];
  if (n > SEMI_MAX_PALLETS) {
    return { vehicle: 'Two or more semi-trailers', why: `${pallets} is more than a full 24-pallet trailer, so we’d run more than one semi or split it over several runs.`, service: SERVICES.ftl, notes };
  }
  return heavy
    ? { vehicle: '22-pallet semi-trailer', why: `Heavy, dense freight usually reaches the legal mass limit before the deck is full, so a 22-pallet trailer can suit ${pallets} better.`, service: SERVICES.ftl, notes }
    : { vehicle: '24-pallet semi-trailer', why: `A 24-pallet tautliner takes 24 standard pallets in a single layer and side-loads by forklift, so your ${pallets} go in one dedicated run.`, service: SERVICES.ftl, notes };
}

/** One line for the quote form's "What are you sending?" field. */
function loadSummary(a: Answers, s: Suggestion): string {
  const parts = [
    a.kind === 'pallets' ? `${a.pallets} pallet${a.pallets === 1 ? '' : 's'}` : a.kind === 'items' ? 'Cartons or small items' : 'Long or oversize items',
  ];
  if (a.kind === 'oversize') { if (a.height === 'tall') parts.push('tall'); }
  else parts.push(a.weight === 'heavy' ? 'heavy' : 'light');
  parts.push({ dock: 'forklift or dock', ground: 'no forklift at one end', crane: 'crane loading' }[a.access]);
  return `${parts.join(', ')}. Truck finder: ${s.vehicle}`;
}

interface Option<T extends string> { value: T; label: string; hint?: string }

function Choice<T extends string>({ legend, name, value, options, onChange }: {
  legend: string; name: string; value: T; options: Option<T>[]; onChange: (v: T) => void;
}) {
  return (
    <fieldset className="tf-group">
      <legend>{legend}</legend>
      <div className={`tf-options${options.length === 2 ? ' tf-options--pair' : ''}`}>
        {options.map((o) => (
          <label key={o.value} className="tf-option">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="tf-card"><strong>{o.label}</strong>{o.hint && <small>{o.hint}</small>}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TruckFinder() {
  const [answers, setAnswers] = useState<Answers>({ kind: 'pallets', pallets: 4, weight: 'light', access: 'dock', timing: 'booked', height: 'standard' });
  const set = <K extends keyof Answers>(key: K) => (value: Answers[K]) => setAnswers((a) => ({ ...a, [key]: value }));
  const setPallets = (n: number) => set('pallets')(Math.min(MAX_PALLETS, Math.max(1, Math.round(n) || 1)));

  const s = suggest(answers);
  const urgent = answers.timing === 'urgent';
  const quoteHref = `/quote?${new URLSearchParams({
    service: urgent ? HOT_SHOT_QUOTE_OPTION : s.service.quoteOption,
    load: loadSummary(answers, s),
  })}`;

  return (
    <div className="tf-layout">
      <div className="card tf-questions">
        <Choice legend="What are you sending?" name="tf-kind" value={answers.kind} onChange={set('kind')} options={[
          { value: 'pallets', label: 'Pallets', hint: 'Standard pallets or skids' },
          { value: 'items', label: 'Cartons or a few items', hint: 'Boxes, appliances, gear' },
          { value: 'oversize', label: 'Long or oversize', hint: 'Steel, timber, machinery' },
        ]} />

        {answers.kind === 'pallets' && (
          <div className="tf-group">
            <label className="tf-label" htmlFor="tf-pallets">How many pallets?</label>
            <div className="tf-stepper">
              <button type="button" aria-label="One fewer pallet" onClick={() => setPallets(answers.pallets - 1)}>−</button>
              <input id="tf-pallets" type="number" inputMode="numeric" min={1} max={MAX_PALLETS} value={answers.pallets} onChange={(e) => setPallets(Number(e.target.value))} />
              <button type="button" aria-label="One more pallet" onClick={() => setPallets(answers.pallets + 1)}>+</button>
            </div>
          </div>
        )}

        {answers.kind === 'oversize' ? (
          <Choice legend="Is it taller than usual?" name="tf-height" value={answers.height} onChange={set('height')} options={[
            { value: 'standard', label: 'Standard height' },
            { value: 'tall', label: 'Tall', hint: 'Height could be an issue' },
          ]} />
        ) : (
          <Choice legend="How heavy is it?" name="tf-weight" value={answers.weight} onChange={set('weight')} options={[
            { value: 'light', label: 'Light or bulky', hint: 'e.g. packaging, furniture' },
            { value: 'heavy', label: 'Heavy or dense', hint: 'e.g. tiles, steel, drinks' },
          ]} />
        )}

        <Choice legend="How is it loaded and unloaded?" name="tf-access" value={answers.access} onChange={set('access')} options={[
          { value: 'dock', label: 'Forklift or dock', hint: 'At both ends' },
          { value: 'ground', label: 'No forklift at one end', hint: 'e.g. a shopfront or house' },
          { value: 'crane', label: 'Crane or top-loaded', hint: 'e.g. steel, machinery' },
        ]} />

        <Choice legend="When does it need to move?" name="tf-timing" value={answers.timing} onChange={set('timing')} options={[
          { value: 'booked', label: 'Booked ahead' },
          { value: 'urgent', label: 'Today — it’s urgent' },
        ]} />
      </div>

      <div className="card tf-result" aria-live="polite">
        <span className="overline">Our suggestion</span>
        <h2>{s.vehicle}</h2>
        <p>{s.why}</p>
        {(s.notes.length > 0 || urgent) && (
          <ul className="tf-notes">
            {s.notes.map((note) => <li key={note}>{note}</li>)}
            {urgent && (
              <li>Needs to move today? Our <Link href="/services/hot-shot-same-day-freight">hot shot service</Link> runs urgent freight direct, including after-hours.</li>
            )}
          </ul>
        )}
        <div className="tf-actions">
          <Link className="btn btn-accent btn-block" href={quoteHref}>Get a quote for this</Link>
          <Link className="btn btn-ghost btn-block" href={s.service.href}>About {s.service.name.toLowerCase()}</Link>
        </div>
        <p className="tf-fineprint">A starting point, not a booking. We confirm the right vehicle when we quote, or call <a href="tel:0731797072">07 3179 7072</a>.</p>
      </div>
    </div>
  );
}
