import Link from 'next/link';
import { staticPages } from '@/content/pages';
import { pageMetadata } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { ContactForm } from './ContactForm';

/* Page chrome ported from legacy contact.php. */
const page = staticPages.contact;

export const metadata = pageMetadata(page.head);

export default function Contact() {
  return (
    <>
      <JsonLd blocks={page.head.jsonLd} />
      <main id="main">
        <section className="page-hero has-media">
          <div className="container">
            <div className="ph-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Contact</span></nav>
              <span className="overline" style={{ color: 'var(--orange-300)' }}>Get in touch</span>
              <h1>Talk to the team</h1>
              <p className="ph-lead">One phone number, one team, one point of accountability for your freight. Call us, email us, or send a message and we&apos;ll get straight back to you.</p>
            </div>
            <div className="ph-media" style={{ aspectRatio: 'unset' }}><img src="/assets/img/truck-operator.jpg" alt="" /></div>
          </div>
        </section>

        <section className="section">
          <div className="container layout-aside">
            <div>
              <div className="grid grid-2" style={{ marginBottom: 'var(--space-6)' }}>
                <a className="card card--hover service-card" href="tel:0731797072">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg></div>
                  <h3>Call us</h3><p style={{ color: 'var(--navy-600)', fontWeight: 700, fontSize: 'var(--fs-lead)' }}>07 3179 7072</p><p>We answer the phone — no call centre.</p>
                </a>
                <a className="card card--hover service-card" href="mailto:admin@roadlinxtransport.com.au">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
                  <h3>Email us</h3><p style={{ color: 'var(--navy-600)', fontWeight: 700, wordBreak: 'break-all' }}>admin@roadlinxtransport.com.au</p><p>Send your load details for a quote.</p>
                </a>
              </div>

              <ContactForm />
            </div>

            <aside>
              <div className="aside-card">
                <span className="overline">Road Linx Transport</span>
                <h3>Business details</h3>
                <div className="contact-row" style={{ borderTop: 'none' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span style={{ fontSize: 'var(--fs-small)' }}>Brisbane, Queensland</span></div>
                <div className="contact-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span style={{ fontSize: 'var(--fs-small)' }}>7 days · after-hours available</span></div>
                <div className="contact-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span style={{ fontSize: 'var(--fs-small)' }} className="mono">ABN 25 387 822 327</span></div>
                <div className="contact-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg><span style={{ fontSize: 'var(--fs-small)' }}>NHVR compliant · COR trained</span></div>
              </div>
              <div className="aside-card" style={{ marginTop: 'var(--space-5)', padding: 0, overflow: 'hidden' }}>
                <iframe
                  title="Road Linx Transport service area — Brisbane, Queensland"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d453481.7413141102!2d152.66354136203068!3d-27.381145764141067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b91579aac93d233%3A0x402a35af3deaf40!2sBrisbane%20QLD%2C%20Australia!5e0!3m2!1sen!2sin!4v1784014279330!5m2!1sen!2sin"
                  height={400}
                  style={{ border: 0, width: '100%' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
