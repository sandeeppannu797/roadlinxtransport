import Link from 'next/link';

/*
 * Branded 404 for unknown URLs. Next adds a noindex robots tag to 404
 * responses itself; the <title> is hoisted into <head> by React.
 */
const destinations = [
  { href: '/services', title: 'Freight services', text: 'General freight, taxi trucks, tail-lift, semi hire and more.' },
  { href: '/locations', title: 'Service areas', text: 'Brisbane, the coasts, the Downs, the Wide Bay and Northern NSW.' },
  { href: '/contact', title: 'Contact us', text: 'Call, email or send us a message.' },
];

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default function NotFound() {
  return (
    <main id="main">
      <title>Page not found | Road Linx Transport</title>
      <section className="page-hero">
        <div className="container">
          <span className="overline">Error 404</span>
          <h1>We couldn&apos;t find that page</h1>
          <p className="ph-lead">It may have moved when we rebuilt the site. Try one of these, or tell us what you need to move.</p>
          <div className="ph-actions">
            <Link className="btn btn-accent btn-lg" href="/quote">Get a free quote</Link>
            <a className="btn btn-onnavy-ghost btn-lg" href="tel:0731797072">Call 07 3179 7072</a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {destinations.map((d) => (
              <Link className="card card--hover service-card" href={d.href} key={d.href}>
                <h2 className="service-card-title">{d.title}</h2>
                <p>{d.text}</p>
                <span className="more">Go <ArrowRight /></span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 'var(--space-6)', color: 'var(--text-muted)' }}>
            Or head back to the <Link href="/">home page</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
