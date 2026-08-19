# Road Linx Transport

The Road Linx Transport site (Brisbane freight company), migrated from the
static PHP site archived in `legacy-src/roadlinxtransport.com.au` to the
Next.js App Router.

The site's commercial value is its organic search rankings, so the migration
is deliberately conservative: page copy, titles, descriptions, canonicals,
OG/Twitter tags, JSON-LD and the internal link structure are carried across
from the legacy source unchanged, and a script checks that they still match.

```bash
pnpm dev      # develop
pnpm build    # production build (all 52 routes prerender)
pnpm verify   # parity check against legacy-src — needs a running server
```

## Where the content lives

Page content is **generated, not hand-written**. `scripts/extract-content.mjs`
parses the legacy PHP files and writes `content/*.ts`:

| File | Contents |
| --- | --- |
| `content/locations.ts` | the 15 location landing pages |
| `content/services.ts` | the 15 service landing pages |
| `content/blog.ts` | the 10 blog posts |
| `content/pages.ts` | home, about, fleet, industries, policies, quote, contact and the three hub indexes |

Run `pnpm extract` to regenerate. It fails if a page's FAQ accordion and its
FAQPage JSON-LD disagree, so the two can't drift apart.

Editing `content/*.ts` by hand will be overwritten. To change page copy,
either change it in `legacy-src` and re-extract, or move that page off the
generated data once the site is settled.

All 40 landing pages render through one component, `components/LandingTemplate.tsx`.

## Verifying a change

`pnpm verify` walks every URL in `legacy-src/url-inventory.txt` and checks that

1. the legacy `.php` URL still returns a permanent redirect to its
   extensionless path (the contract the old `.htaccess` provided), and
2. the rendered page's title, description, keywords, robots, canonical,
   OG/Twitter tags, H1, JSON-LD blocks and set of internal links match the
   legacy page it replaces.

Expected values are read from the legacy PHP files, not from `content/`, so
the check covers the whole pipeline. Run it against a production build:

```bash
pnpm build && pnpm start
pnpm verify
```

## Forms

`/quote` and `/contact` post to server actions (`app/*/actions.ts`) that send
mail through Nodemailer, replacing the legacy `mail()` calls. Recipients,
sender, subjects and body layout are unchanged: both go to
`info@roadlinxtransport.com.au` from `admin@roadlinxtransport.com.au` with the
submitter as Reply-To. Copy `.env.example` to `.env.local` and fill in the
SMTP credentials — without them the forms show the legacy
"Sorry, something went wrong" message and log the failure.

## Sitemap and robots

`app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`
from the same content collections the pages render from, so a new location or
service shows up without a second edit. Each URL is the page's own canonical,
and pages carrying a `noindex` directive are filtered out — currently
`/services/local-transport`, leaving 49 of the 50 URLs. The legacy site had
neither file.

## Deliberate changes from the legacy site

Everything else is preserved verbatim. `lib/corrections.ts` is the full list
of intentional divergences, and `scripts/verify-parity.mjs` declares the same
expectations separately so a wrong correction fails the check.

- **`/privacy-compliance` canonical and og:url** pointed at
  `/policies-compliance`, a URL that has never existed. A canonical aimed at a
  404 tells search engines to drop the real page, so both now point at the
  page's own URL. `pnpm verify` also asserts that *every* page's canonical
  points at itself, which is the check that would have caught this.

## Known legacy quirks, preserved on purpose

- **`/services/local-transport` has no inbound links** anywhere on the site
  and carries `noindex, nofollow`. It is built and reachable (it is in the URL
  inventory) but stays unlinked, exactly as before, and is kept out of the
  sitemap to match its own noindex.
- The nav says "View all 14 services" while 15 exist — the orphaned page above
  is the fifteenth.
