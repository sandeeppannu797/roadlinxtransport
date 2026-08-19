/* Global footer, ported verbatim from legacy partials/footer.php. */
import Link from 'next/link';
import { FooterYear } from './FooterYear';

const footerServices = [
  { href: '/services/general-freight-transport', label: 'General Freight' },
  { href: '/services/full-truck-load-ftl', label: 'Full Truck Load (FTL)' },
  { href: '/services/taxi-truck-hire', label: 'Taxi Truck Hire' },
  { href: '/services/tail-lift-tailgate-delivery', label: 'Tail-Lift Delivery' },
  { href: '/services/hot-shot-same-day-freight', label: 'Hot Shot & Same-Day' },
  { href: '/services/semi-trailer-hire', label: 'Semi-Trailer Hire' },
];

const footerLocations = [
  { href: '/locations/brisbane', label: 'Brisbane' },
  { href: '/locations/port-of-brisbane', label: 'Port of Brisbane' },
  { href: '/locations/gold-coast', label: 'Gold Coast' },
  { href: '/locations/sunshine-coast', label: 'Sunshine Coast' },
  { href: '/locations/toowoomba', label: 'Toowoomba' },
  { href: '/locations/northern-nsw', label: 'Northern NSW' },
];

const ShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>
);

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link href="/"><img src="/assets/img/roadlinx-logo.png" alt="Road Linx Transport" /></Link>
            <p>A Brisbane freight and transport company moving business freight across South East Queensland and Northern NSW — from a single pallet to full semi-trailer loads. Load-rated equipment, trained drivers, one accountable team.</p>
            <div className="chip-row" style={{ marginTop: 20 }}>
              <span className="chip"><ShieldCheck />NHVR compliant</span>
              <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/></svg>COR trained</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {footerServices.map((s) => <li key={s.href}><Link href={s.href}>{s.label}</Link></li>)}
              <li><Link href="/services">All services →</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Service areas</h4>
            <ul>
              {footerLocations.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><Link href="/locations">All areas →</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h4>Get in touch</h4>
            <div className="fc-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              <a href="tel:0731797072">07 3179 7072</a>
            </div>
            <div className="fc-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <a href="mailto:admin@roadlinxtransport.com.au">admin@roadlinxtransport.com.au</a>
            </div>
            <div className="fc-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ color: 'var(--text-on-navy-muted)' }}>Brisbane, Queensland<br />Serving SE QLD &amp; Northern NSW</span>
            </div>
            <Link className="btn btn-accent" href="/quote" style={{ marginTop: 8 }}>Request a quote</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© <FooterYear /> Road Linx Transport · ABN 25 387 822 327 · All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
