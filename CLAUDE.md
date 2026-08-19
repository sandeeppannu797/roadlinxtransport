# Road Linx Transport rebuild

Migrating ./legacy-src/roadlinxtransport.com.au (static PHP) to
Next.js App Router. Brisbane freight company. The site's entire
commercial value is organic search rankings for local freight terms.

## Hard rules

- NEVER invent business facts. Service areas, fleet details,
  compliance claims, phone numbers, hours, testimonials must be
  copied verbatim from legacy-src. If content looks thin or missing,
  FLAG IT — do not write plausible filler.
- Every URL in ./url-inventory.txt must resolve after migration,
  same path or 301. This file is the redirect contract.
- Preserve every page's title, description, canonical, OG tags and
  JSON-LD exactly. Do not "improve" the SEO copy.
- partials/location-side-bar.php and service-side-bar.php define
  internal linking between 30 landing pages. Reproduce that link
  structure exactly.
- 15 location pages are one template plus data. Don't generate 15
  components.

## Use your judgement freely on

Component structure, accessibility, responsive design, performance,
images, type safety, visual design.
