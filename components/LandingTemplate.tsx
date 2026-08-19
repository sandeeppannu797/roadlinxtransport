/*
 * The one template behind all 40 landing pages (15 locations, 15 services,
 * 10 blog posts). Markup is ported verbatim from the legacy PHP templates;
 * everything that varies between pages comes in via the extracted
 * LandingPage record. Locations/services render prose + quote sidebar;
 * blog posts render a full-width article and no sidebar.
 */
import Link from 'next/link';
import type { LandingPage } from '@/content/types';
import { JsonLd } from './JsonLd';
import { QuoteSidebar } from './QuoteSidebar';

export type LandingVariant = 'location' | 'service' | 'blog';

const sidebarOverline: Record<string, string> = {
  location: 'Local freight', // legacy location-side-bar.php
  service: 'Get moving',     // legacy service-side-bar.php
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

function toStyle(style: string | null): React.CSSProperties | undefined {
  if (!style) return undefined;
  const out: Record<string, string> = {};
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    out[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return out;
}

function HeroAction({ label, href }: { label: string; href: string }) {
  if (href.startsWith('tel:')) {
    return <a className="btn btn-onnavy-ghost btn-lg" href={href}>{label}</a>;
  }
  return <Link className="btn btn-accent btn-lg" href={href}>{label}</Link>;
}

export function LandingTemplate({ page, variant }: { page: LandingPage; variant: LandingVariant }) {
  const { hero, faq, related, cta } = page;
  return (
    <>
      <JsonLd blocks={page.head.jsonLd} />
      <main id="main">
        <section className="page-hero has-media">
          <div className="container">
            <div className="ph-copy">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                {hero.breadcrumbs.map((c, i) => (
                  <span key={i} style={{ display: 'contents' }}>
                    {i > 0 && <span className="sep">/</span>}
                    {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                  </span>
                ))}
              </nav>
              <span className="overline" style={{ color: 'var(--orange-300)' }}>{hero.overline}</span>
              <h1>{hero.h1}</h1>
              {hero.lead && <p className="ph-lead" dangerouslySetInnerHTML={{ __html: hero.lead }} />}
              <div className="ph-actions">
                {hero.actions.map((a) => <HeroAction key={a.href} {...a} />)}
              </div>
            </div>
            <div className="ph-media" style={toStyle(hero.media.style)} dangerouslySetInnerHTML={{ __html: hero.media.html }} />
          </div>
        </section>

        {variant === 'blog' ? (
          <section className="section">
            <div className="container">
              <article className="prose" style={toStyle(page.proseStyle)} dangerouslySetInnerHTML={{ __html: page.proseHtml }} />
            </div>
          </section>
        ) : (
          <section className="section">
            <div className="container layout-aside">
              <div className="prose" style={toStyle(page.proseStyle)} dangerouslySetInnerHTML={{ __html: page.proseHtml }} />
              <QuoteSidebar overline={sidebarOverline[variant]} />
            </div>
          </section>
        )}

        <section className="section section--sunken">
          <div className="container">
            <div className="section-head reveal center">
              <span className="overline">Frequently asked questions</span>
              <h2>{faq.heading}</h2>
            </div>
            <div className="faq-list reveal" style={{ marginInline: 'auto' }}>
              {faq.items.map((item, i) => (
                <div className="faq-item" key={i}>
                  <button className="faq-q" aria-expanded="false">
                    <span>{item.q}</span>
                    <span className="faq-ic"><PlusIcon /></span>
                  </button>
                  <div className="faq-a"><div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: item.a }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="overline">{related.overline}</span>
              <h2>{related.heading}</h2>
            </div>
            <div className="grid grid-3">
              {related.cards.map((card) => (
                <Link className="card card--hover service-card reveal" href={card.href} key={card.href}>
                  <h3>{card.title}</h3>
                  <span className="more">Learn more <ArrowRight /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-tight">
          <div className="container">
            <div className="cta-band reveal">
              <div className="cta-inner">
                <div>
                  <h2>{cta.heading}</h2>
                  <p>{cta.text}</p>
                </div>
                <div className="cta-actions">
                  <Link className="btn btn-accent btn-lg" href="/quote">Get a free quote</Link>
                  <a className="btn btn-onnavy btn-lg" href="tel:0731797072">Call 07 3179 7072</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
