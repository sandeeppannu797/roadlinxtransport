# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Road Linx Transport

Brisbane freight company site (Next.js App Router on Vercel). **The site's
entire commercial value is organic search rankings for local freight terms.**
Titles, descriptions, canonicals, OG tags, JSON-LD and internal links are
production data, not copy to tidy up.

History: migrated in 2026 from a static-PHP site, which had replaced a
WordPress site. The PHP source is retired. `content/*.ts` is now the source of
truth, and `scripts/seo-baseline.json` records the SEO footprint the PHP site
had plus every deliberate change since.

## Commands

```bash
pnpm dev                        # dev server
pnpm lint                       # ESLint (5 known <img> warnings, see bottom)
pnpm build                      # production build — also the only type-check
pnpm verify [baseUrl]           # SEO check against the baseline, default http://localhost:3000
pnpm verify --update [baseUrl]  # record the running build as the new baseline
```

There is no unit test suite. `pnpm verify` is the test, and it always walks
every page; there is no per-URL filter.

**Run this after any change:**

```bash
pnpm build && pnpm start    # then in another shell:
pnpm verify
```

`scripts/verify-seo.mjs` fails if any page's title, description, keywords,
robots, canonical, OG/Twitter tags, H1s, JSON-LD blocks or set of internal
links differs from the baseline. It also checks that every canonical points at
its own page, every legacy `.php` URL and old WordPress URL still 301s to its
page, `/sitemap.xml` lists exactly the indexable pages, and unknown URLs 404
with only a noindex robots tag. JSON-LD is compared as parsed JSON with keys
sorted at every depth: formatting never counts, every value does.

**Deliberate SEO changes:** make the change, run `pnpm verify` to see exactly
what moved, then `pnpm verify --update` and review
`git diff scripts/seo-baseline.json`. That diff *is* the SEO change and belongs
in the same commit. Never run `--update` to get past a failure you don't
understand, and don't weaken a check to make a change pass. JSON-LD and links
that every page shares are stored once under `site`, so a header/footer or
org-schema change is one hunk.

## How content works

- `content/locations.ts` / `services.ts` / `blog.ts` — the 40 landing pages
  (15 / 15 / 10), each a record of slug, head values, hero, prose, FAQs and
  related-service cards. All 40 render through `components/LandingTemplate.tsx`
  (the blog variant drops the quote sidebar); the `[slug]` routes set
  `dynamicParams = false`, so an unknown slug 404s.
- `content/pages.ts` — home, about, fleet, industries, privacy-compliance and
  the three hub indexes, whose `<main>` HTML `components/StaticPage.tsx`
  renders whole. It also holds the head values for `/quote`, `/contact` and
  `/fleet/truck-finder`; their bodies are JSX in `app/`, and their
  `mainHtml` is empty.
- Prose and FAQ answers are raw HTML rendered with `dangerouslySetInnerHTML`.
- Landing-page FAQPage JSON-LD is generated from `faq.items` by
  LandingTemplate. Don't add FAQPage blocks to a landing page's `head.jsonLd`.
  The static pages with FAQs (home, about, fleet, industries,
  privacy-compliance) keep a hand-written FAQPage block next to the FAQ HTML
  in `mainHtml`: change both together, since Google penalises schema that
  doesn't match visible content.
- Blog posts carry `article` (published date, read time, category), which
  drives the date line under the H1, `og:type article` and the sitemap's
  `lastModified`. Keep the Article JSON-LD's `datePublished` in step.
- `services.ts` is prettier-formatted (unquoted keys); the other content files
  are JSON-style. Both are fine, but content scripts must not assume JSON.
- Every page's head tags go through `pageMetadata()` in `lib/meta.ts`. Next
  replaces rather than merges `openGraph`/`twitter` per page, so it repeats
  the site-wide defaults. Robots is set only there, not in the layout, so the
  404 page gets Next's single noindex.

### Adding or removing a page

A landing page needs only its record in the right content file; the route and
sitemap pick it up, and `pnpm verify --update` adds any new sitemap URL to the
baseline. A new static page also needs its own `app/` route and an entry in the
explicit list in `app/sitemap.ts`. A noindexed page is not in the sitemap, so
add its path to the baseline's `pages` by hand (as `{}`) before `--update`.

To remove a page, delete its baseline entry by hand. If it ever had traffic,
301 it in `next.config.ts` and add the redirect to `WORDPRESS_REDIRECTS`-style
checks in `verify-seo.mjs`.

## Facts worth not rediscovering

- **`services/local-transport` is orphaned on purpose**: zero inbound links,
  `noindex, nofollow`, excluded from the sitemap, but still resolves (it is in
  the baseline). The nav's "View all 14 services" refers to the other 14.
- Redirects in `next.config.ts`: `.php` → extensionless (the legacy .htaccess
  contract) and six old WordPress URLs (`/about-us/`, `/contact-us/`,
  `/our-services/`, `/policies-compliance/`, `/semi-trailer-hire/`,
  `/wp-sitemap.xml`). `verify-seo.mjs` declares the WordPress ones
  independently. They use `statusCode: 301`, not `permanent: true` (308).
- The home page's canonical ends in a slash, which Next's metadata layer would
  strip; `components/LiteralUrlTags.tsx` emits those two tags literally instead.
- `ORG_JSONLD` in `lib/site.ts` is the site-wide `LocalBusiness` graph on every
  page: Willawong address, ABN and ACN, Facebook `sameAs`. The ABN (25 387 822
  327) doesn't embed the ACN (666 887 903); the owner confirmed both are right.
  Don't use `MovingCompany` (schema.org's removalist type) or invented types.
  The address and profile URLs live in `lib/site.ts` and feed the footer and
  contact page too.
- Styling is the ported legacy CSS in `app/styles/` (design tokens plus
  `roadlinx.css`), no Tailwind. Fonts are self-hosted with `next/font` in
  `app/layout.tsx` and reach the CSS as variables in `tokens/typography.css`.
  Orange buttons use navy text (white on the logo orange is 2.9:1); small
  orange text on light backgrounds uses `--color-accent-text`.
- Icons use Next's file conventions: `app/favicon.ico`, `app/icon.png`,
  `app/apple-icon.png`, `app/manifest.ts` (192/512 icons in `public/icons/`).
  og:image and the JSON-LD logo are still `/assets/img/roadlinx-logo.png`.
- Client behaviours: `components/Header.tsx` (scroll state, active nav,
  mobile drawer with Escape, focus trap and aria-expanded),
  `SiteBehaviors.tsx` (FAQ accordion via delegation so it reaches inside HTML
  blobs, reveal-on-scroll), `FooterYear.tsx`.
- Forms are server actions plus Resend (`app/quote`, `app/contact`,
  `lib/mailer.ts`), with the legacy plain-text body, subjects led by 🚚, plus an HTML
  version from `lib/emailTemplates.ts` (table layout, inline styles, all
  submitted values escaped). The recipient (`admin@`, not legacy `info@`) and
  sender (`noreply@mail.` subdomain) are deliberate: `info@` does not exist in
  the Microsoft 365 tenant, and M365 has SMTP AUTH off. `RESEND_API_KEY` comes
  from env — see `.env.example`. Without it, or before
  `mail.roadlinxtransport.com.au` is verified in Resend, the forms show "Sorry,
  something went wrong" and log the failure. Resend's SDK returns errors
  instead of throwing; `sendMail` rethrows. A hidden honeypot field
  (`website`) catches bots: `isBot()` gives them a fake success and sends
  nothing.
- `/fleet/truck-finder` (`app/fleet/truck-finder/`) suggests a vehicle from
  a few answers. Its sizing rules follow the Fleet and service copy, except
  `RIGID_MAX_PALLETS` (12, typical for a 12-tonne rigid), which the business
  has not confirmed. "Get a quote for this" links to
  `/quote?service=…&load=…`, and `QuoteForm` fills those fields from the
  query on the client; `service` must match one of its options.
- `/sitemap.xml` and `/robots.txt` are generated from the content collections
  and filter out `noindex` pages (49 of 50 URLs).
- Security headers are set in `next.config.ts` `headers()`. There is no CSP:
  GA, Google Maps and Next's inline scripts would need a nonce setup.

## Use your judgement freely on

Component structure, accessibility, responsive design, performance, images,
type safety, visual design.

Known deferred follow-up: `<img>` rather than `next/image`. The 5 lint
warnings are the quote/contact hero images, the two header logos and the
footer logo. Content images sit inside HTML strings in `content/`, so moving
them to `next/image` means rendering those images from structured fields.
