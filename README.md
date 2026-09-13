# Road Linx Transport

The website for Road Linx Transport, a Brisbane freight company. Next.js App
Router, deployed on Vercel.

The site's commercial value is its organic search rankings, so every change is
checked against a recorded SEO baseline before it ships.

```bash
pnpm dev      # develop
pnpm build    # production build (also the type-check)
pnpm verify   # SEO check — needs a running server (pnpm build && pnpm start)
```

## Where the content lives

Page content is data in `content/`, edited directly:

| File | Contents |
| --- | --- |
| `content/locations.ts` | the 15 location landing pages |
| `content/services.ts` | the 15 service landing pages |
| `content/blog.ts` | the 10 blog posts |
| `content/pages.ts` | home, about, fleet, industries, privacy & compliance, the three hub pages, and the head tags for quote, contact and the truck finder |

Prose and FAQ answers are HTML strings. All 40 landing pages render through
one component, `components/LandingTemplate.tsx`, which also builds each page's
FAQ structured data from its visible FAQ. Site-wide details (address, profiles,
organisation schema) are in `lib/site.ts`.

The content was first extracted from the static PHP site this replaced; that
source is retired.

## Checking a change

`scripts/seo-baseline.json` records, for every page, the title, description,
keywords, robots, canonical, Open Graph/Twitter tags, H1, JSON-LD and internal
links. `pnpm verify` compares the running build against it, and also checks
that:

1. every canonical points at its own page,
2. the legacy `.php` URLs and the old WordPress URLs 301 to their pages,
3. `/sitemap.xml` lists exactly the indexable pages, and
4. unknown URLs return a noindexed 404.

```bash
pnpm build && pnpm start
pnpm verify
```

If a change is meant to alter SEO values (a new page, a title rewrite, a new
footer link), run `pnpm verify` to see what moved, then record it with
`pnpm verify --update` and commit the baseline diff with the change. Review
that diff: it is the SEO change.

## Forms and mail setup

`/quote` and `/contact` post to server actions (`app/*/actions.ts`) that send
mail through [Resend](https://resend.com) via `lib/mailer.ts`, with a plain-text
body and a branded HTML version (`lib/emailTemplates.ts`, every submitted value
escaped). Both send to `admin@roadlinxtransport.com.au` from
`noreply@mail.roadlinxtransport.com.au`, with the submitter as Reply-To. A
hidden honeypot field quietly drops spam-bot submissions.

- **Recipient.** The old PHP site sent to `info@`, which is not a mailbox in the
  business's Microsoft 365 tenant.
- **Transport and sender.** Microsoft 365 disables SMTP AUTH on new tenants, so
  mail goes through Resend, from the `mail.` subdomain so the apex domain's
  sending reputation stays with Microsoft 365.

Before the forms will send:

1. **`mail.roadlinxtransport.com.au` must be verified in Resend.** Add it as a
   domain in the Resend dashboard, publish the DNS records it shows, and wait
   for it to show as Verified.
2. **`RESEND_API_KEY` must be set in the Vercel project environment**
   (Production, plus Preview if you want forms on preview deploys). Use a
   sending-only key restricted to that domain. Locally, copy `.env.example` to
   `.env.local`. Never commit the key.

If the key is missing or Resend rejects a message, the forms show "Sorry,
something went wrong" and log the error server-side.

## Sitemap, robots and redirects

`app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`
from the content collections, so a new page shows up without a second edit.
Pages with `noindex` are left out — currently `/services/local-transport`,
which is deliberately unlinked.

`next.config.ts` 301s the legacy `.php` URLs to their extensionless pages and
the old WordPress URLs (`/about-us/`, `/contact-us/`, `/our-services/`,
`/policies-compliance/`, `/semi-trailer-hire/`) to their replacements, and
sets the security headers.
