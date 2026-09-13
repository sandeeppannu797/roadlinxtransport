/*
 * Quote-CTA aside, ported verbatim from legacy partials/location-side-bar.php
 * and service-side-bar.php — the two files are identical except for the
 * overline text ("Local freight" on locations, "Get moving" on services).
 */
import Link from 'next/link';

export function QuoteSidebar({ overline }: { overline: string }) {
  return (
    <aside>
      <div className="aside-card">
        <span className="overline">{overline}</span>
        <h3>Get a quote</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-4)' }}>Tell us the pickup, delivery and timing and we will match the right truck and confirm a straight price.</p>
        <Link className="btn btn-accent btn-block" href="/quote">Get a free quote</Link>
        <p className="aside-note">Not sure which truck you need? Try the <Link href="/fleet/truck-finder">truck finder</Link>.</p>
        <div className="contact-row" style={{ marginTop: 'var(--space-4)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg><a href="tel:0731797072">07 3179 7072</a></div>
        <div className="contact-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><a href="mailto:admin@roadlinxtransport.com.au" style={{ wordBreak: 'break-all' }}>admin@roadlinxtransport.com.au</a></div>
      </div>
    </aside>
  );
}
