'use client';

/*
 * Global header: top bar, primary nav with CSS hover/focus dropdowns, and
 * the mobile drawer. Sticky scroll state and active-nav highlighting are
 * ported from the legacy site.js.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const Caret = () => (
  <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

/* Featured menu links. */
const menuServices = [
  { href: '/services/general-freight-transport', title: 'General Freight', sub: 'Everyday palletised & non-palletised loads', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg> },
  { href: '/services/full-truck-load-ftl', title: 'Full Truck Load (FTL)', sub: 'Dedicated, direct point-to-point runs', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { href: '/services/taxi-truck-hire', title: 'Taxi Truck Hire', sub: 'On-demand utes to 12-tonne trucks', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 17H3V6a1 1 0 0 1 1-1h11v12h-4"/><path d="M15 8h4l3 4v5h-4"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> },
  { href: '/services/tail-lift-tailgate-delivery', title: 'Tail-Lift Delivery', sub: 'Sites with no forklift', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h11v11H3z"/><path d="M14 9h4l3 3v4h-7"/><path d="M2 20h10"/><circle cx="18" cy="18" r="2"/></svg> },
  { href: '/services/hot-shot-same-day-freight', title: 'Hot Shot & Same-Day', sub: 'Urgent, time-critical freight', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg> },
  { href: '/services/semi-trailer-hire', title: 'Semi-Trailer Hire', sub: '22 & 24-pallet semis with a driver', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="5" width="16" height="11"/><path d="M17 9h4l2 3v4h-6z"/><circle cx="6" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg> },
];

const menuLocations = [
  { href: '/locations/brisbane', title: 'Brisbane', sub: 'Metro, Port & Ipswich' },
  { href: '/locations/gold-coast', title: 'Gold Coast', sub: 'Yatala to Tweed' },
  { href: '/locations/sunshine-coast', title: 'Sunshine Coast', sub: 'Caloundra to Noosa' },
  { href: '/locations/toowoomba', title: 'Toowoomba', sub: 'Range & Darling Downs' },
  { href: '/locations/northern-nsw', title: 'Northern NSW', sub: 'Tweed, Ballina, Lismore' },
  { href: '/locations/port-of-brisbane', title: 'Port of Brisbane', sub: 'Container cartage' },
];

const drawerServices = [
  { href: '/services/general-freight-transport', label: 'General Freight Transport' },
  { href: '/services/full-truck-load-ftl', label: 'Full Truck Load (FTL)' },
  { href: '/services/taxi-truck-hire', label: 'Taxi Truck Hire' },
  { href: '/services/tail-lift-tailgate-delivery', label: 'Tail-Lift Delivery' },
  { href: '/services/hot-shot-same-day-freight', label: 'Hot Shot & Same-Day Freight' },
  { href: '/services/semi-trailer-hire', label: 'Semi-Trailer Hire' },
];

const drawerLocations = [
  { href: '/locations/brisbane', label: 'Brisbane' },
  { href: '/locations/gold-coast', label: 'Gold Coast' },
  { href: '/locations/sunshine-coast', label: 'Sunshine Coast' },
  { href: '/locations/toowoomba', label: 'Toowoomba' },
  { href: '/locations/northern-nsw', label: 'Northern NSW' },
  { href: '/locations/port-of-brisbane', label: 'Port of Brisbane' },
];

function navSection(pathname: string): string {
  if (pathname === '/') return 'home';
  return pathname.split('/')[1]; // services, locations, fleet, industries, blog, about, …
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The drawer remembers the page it was opened on, so any navigation
  // (a drawer link, the back button) closes it with no extra effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const drawerOpen = openOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = navSection(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // While open: lock page scroll, focus the close button, close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenOn(null);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  function dismiss() {
    setOpenOn(null);
    toggleRef.current?.focus();
  }

  /* Keeps Tab cycling inside the open drawer. */
  function trapFocus(e: React.KeyboardEvent) {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button, summary');
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const navClass = (section: string) => (active === section ? 'is-active' : undefined);

  return (
    <>
      <div className="site-topbar">
        <div className="container">
          <div className="topbar-left">
            <a className="tb-item" href="tel:0731797072" aria-label="Call Road Linx Transport on 07 3179 7072">
              <PhoneIcon />
              07 3179 7072
            </a>
            <a className="tb-item hide-sm" href="mailto:admin@roadlinxtransport.com.au">
              <MailIcon />
              admin@roadlinxtransport.com.au
            </a>
            <span className="tb-item hide-sm" style={{ opacity: 0.7 }}>ABN 25 387 822 327</span>
          </div>
          <div className="topbar-right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
            SE QLD &amp; Northern NSW · After-hours available
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container">
          <Link className="brand" href="/" aria-label="Road Linx Transport — home">
            <img src="/assets/img/roadlinx-logo.png" alt="Road Linx Transport" width={130} height={65} />
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            <ul>
              <li><Link href="/" className={navClass('home')}>Home</Link></li>
              <li className="has-menu">
                <Link href="/services" className={navClass('services')}>Services
                  <Caret />
                </Link>
                <div className="nav-menu">
                  <div className="nav-menu-label">Freight &amp; transport services</div>
                  <div className="nav-menu-grid">
                    {menuServices.map((s) => (
                      <Link key={s.href} href={s.href}><span className="nm-ic">{s.icon}</span><span className="nm-txt"><strong>{s.title}</strong><span>{s.sub}</span></span></Link>
                    ))}
                  </div>
                  <Link className="nav-menu-foot" href="/services"><span>View all 14 services</span><ArrowRight /></Link>
                </div>
              </li>
              <li className="has-menu">
                <Link href="/locations" className={navClass('locations')}>Locations
                  <Caret />
                </Link>
                <div className="nav-menu">
                  <div className="nav-menu-label">Where we deliver</div>
                  <div className="nav-menu-grid">
                    {menuLocations.map((l) => (
                      <Link key={l.href} href={l.href}><span className="nm-ic"><PinIcon /></span><span className="nm-txt"><strong>{l.title}</strong><span>{l.sub}</span></span></Link>
                    ))}
                  </div>
                  <Link className="nav-menu-foot" href="/locations"><span>All service areas — SE QLD &amp; Northern NSW</span><ArrowRight /></Link>
                </div>
              </li>
              <li><Link href="/fleet" className={navClass('fleet')}>Fleet</Link></li>
              <li><Link href="/industries" className={navClass('industries')}>Industries</Link></li>
              <li><Link href="/blog" className={navClass('blog')}>Blog</Link></li>
              <li><Link href="/about" className={navClass('about')}>About</Link></li>
            </ul>
          </nav>

          <div className="header-cta">
            <a className="btn btn-ghost btn-hide-mob" href="tel:0731797072">
              <PhoneIcon />
              07 3179 7072
            </a>
            <Link className="btn btn-accent" href="/quote">Get a quote</Link>
          </div>

          <button
            ref={toggleRef}
            className="nav-toggle"
            aria-label="Open menu"
            aria-controls="mobileNav"
            aria-expanded={drawerOpen}
            onClick={() => setOpenOn(pathname)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </header>

      <div className={`mobile-nav${drawerOpen ? ' is-open' : ''}`} id="mobileNav">
        <div className="mn-scrim" onClick={dismiss}></div>
        <div
          ref={panelRef}
          className="mn-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onKeyDown={trapFocus}
          // A link to the page already showing doesn't change the path, so close on any link click too.
          onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpenOn(null); }}
        >
          <div className="mn-head">
            <img src="/assets/img/roadlinx-logo.png" alt="Road Linx Transport" width={80} height={40} />
            <button ref={closeRef} className="mn-close" aria-label="Close menu" onClick={dismiss}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <Link href="/">Home</Link>
          <details>
            <summary>Services ▾</summary>
            <div className="inner-menu">
              <Link href="/services">All Services </Link>
              {drawerServices.map((s) => <Link key={s.href} href={s.href}>{s.label}</Link>)}
            </div>
          </details>
          <details>
            <summary>Service Areas ▾</summary>
            <div className="inner-menu">
              <Link href="/locations">All Locations</Link>
              {drawerLocations.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
            </div>
          </details>
          <Link href="/fleet">Our Fleet</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link className="btn btn-accent btn-block mn-cta" href="/quote">Get a free quote</Link>
          <a className="btn btn-ghost btn-block" href="tel:0731797072" style={{ marginTop: 12 }}>Call 07 3179 7072</a>
        </div>
      </div>
    </>
  );
}
