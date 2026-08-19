import Link from 'next/link';
import { staticPages } from '@/content/pages';
import { pageMetadata } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { QuoteForm } from './QuoteForm';

/* Page chrome ported from legacy quote.php; the form itself is a client
 * component wired to the submitQuote server action. */
const page = staticPages.quote;

export const metadata = pageMetadata(page.head);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);

const benefits = [
  'A straight price, matched to your load',
  'One accountable team, no subcontractors',
  'Load-rated, NHVR-compliant, tracked',
  'After-hours & short-notice capacity',
];

export default function Quote() {
  return (
    <>
      <JsonLd blocks={page.head.jsonLd} />
      <main id="main">
        <section className="page-hero has-media">
          <div className="container">
            <div className="ph-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Get a Quote</span></nav>
              <span className="overline" style={{ color: 'var(--orange-300)' }}>Get a quote</span>
              <h1>Tell us what you&apos;re moving</h1>
              <p className="ph-lead">Give us the pickup, delivery, load and timing. We&apos;ll match the right truck to the job and come back with a straight price — no run-around.</p>
            </div>
            <div className="ph-media" style={{ aspectRatio: 'unset' }}><img src="/assets/img/get-in-touch-img.jpg" alt="" /></div>
          </div>
        </section>

        <section className="section">
          <div className="container layout-aside">
            <QuoteForm />

            <aside>
              <div className="aside-card">
                <span className="overline">Why Road Linx</span>
                <h3>What you get</h3>
                {benefits.map((b, i) => (
                  <div className="contact-row" key={b} style={i === 0 ? { borderTop: 'none' } : undefined}>
                    <Check />
                    <span style={{ fontSize: 'var(--fs-small)' }}>{b}</span>
                  </div>
                ))}
                <div className="contact-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
                  <a href="tel:0731797072">07 3179 7072</a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
