/*
 * Extracts page content from legacy-src/roadlinxtransport.com.au into
 * checked-in TypeScript data modules (content/*.ts).
 *
 * The legacy copy is the source of truth for all business facts and SEO
 * values, so nothing here is typed by hand: head tags, JSON-LD (kept as
 * raw strings), prose HTML, FAQs and link cards are read from the PHP
 * files. Internal hrefs are rewritten from the legacy relative-URL +
 * <base href="../"> + .php→301 scheme to the final extensionless
 * root-relative paths the live site canonicalises to.
 *
 * Run:  node scripts/extract-content.mjs
 */
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const LEGACY = 'legacy-src/roadlinxtransport.com.au';
const OUT = 'content';
const problems = [];

/* Legacy pages use <base href="../"> in subdirectories, so every relative
 * URL resolves against the site root. Extensionless is the canonical form
 * (.htaccess 301s .php away); index.php collapses to the directory. */
function rewriteUrl(href) {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#|\/)/.test(href)) return href;
  let path = '/' + href.replace(/^\.\//, '');
  // .php is the real legacy extension; a handful of links on
  // after-hours-time-slot-delivery.php say .html by mistake (404 on the
  // live site) — normalise both to the canonical extensionless form.
  path = path.replace(/\.(php|html)$/, '');
  if (path === '/index') path = '/';
  path = path.replace(/\/index$/, '');
  return path;
}

function rewriteLinks($, root) {
  $(root).find('a[href]').each((_, el) => {
    $(el).attr('href', rewriteUrl($(el).attr('href')));
  });
  $(root).find('img[src]').each((_, el) => {
    $(el).attr('src', rewriteUrl($(el).attr('src')));
  });
}

function jsonLdRaw(raw) {
  const out = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(raw))) {
    const s = m[1];
    try { JSON.parse(s); } catch (e) { problems.push(`invalid JSON-LD: ${e.message}`); }
    out.push(s);
  }
  return out;
}

function head($, raw, file) {
  const meta = (n) => $(`meta[name="${n}"]`).attr('content') ?? null;
  const og = (p) => $(`meta[property="og:${p}"]`).attr('content') ?? null;
  const h = {
    title: $('title').first().text(),
    description: meta('description'),
    keywords: meta('keywords'),
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    robots: meta('robots'), // page-level override, e.g. local-transport's noindex
    ogTitle: og('title'),
    ogDescription: og('description'),
    ogUrl: og('url'),
    ogImage: og('image'),
    twitterTitle: meta('twitter:title'),
    twitterDescription: meta('twitter:description'),
    twitterImage: meta('twitter:image'),
    jsonLd: jsonLdRaw(raw),
  };
  for (const k of ['title', 'description', 'canonical']) {
    if (!h[k]) problems.push(`${file}: missing ${k}`);
  }
  return h;
}

function hero($, file) {
  const ph = $('.page-hero');
  if (ph.length !== 1) problems.push(`${file}: expected one .page-hero`);
  const breadcrumbs = ph.find('.breadcrumbs').children(':not(.sep)').toArray()
    .map((el) => ({ label: $(el).text(), href: el.tagName === 'a' ? rewriteUrl($(el).attr('href')) : null }));
  // Most heroes hold an <img>, but two blog posts ship a .img-ph placeholder
  // block instead, so the media slot is carried across as raw HTML.
  const media = ph.find('.ph-media');
  rewriteLinks($, media);
  return {
    breadcrumbs,
    overline: ph.find('.overline').text(),
    h1: ph.find('h1').text(),
    lead: ph.find('.ph-lead').length ? ph.find('.ph-lead').html() : null,
    media: { html: media.html(), style: media.attr('style') ?? null },
    actions: ph.find('.ph-actions a').toArray()
      .map((el) => ({ label: $(el).text(), href: rewriteUrl($(el).attr('href')) })),
  };
}

function faqSection($, raw, file) {
  const sec = $('.section--sunken');
  if (sec.length !== 1) problems.push(`${file}: expected one FAQ section`);
  const heading = sec.find('.section-head h2').text();
  const items = sec.find('.faq-item').toArray().map((el) => ({
    q: $(el).find('.faq-q > span').first().text(),
    a: $(el).find('.faq-a-inner').html(),
  }));
  // The visible accordion must match the FAQPage JSON-LD, question for question.
  const faqLd = jsonLdRaw(raw).map((s) => JSON.parse(s)).find((d) => d['@type'] === 'FAQPage');
  if (!faqLd) problems.push(`${file}: no FAQPage JSON-LD`);
  else {
    const ld = faqLd.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
    if (ld.length !== items.length) problems.push(`${file}: FAQ count JSON-LD=${ld.length} visible=${items.length}`);
    ld.forEach(([q, a], i) => {
      if (items[i] && (items[i].q !== q || items[i].a !== a)) {
        problems.push(`${file}: FAQ #${i + 1} differs between JSON-LD and visible list`);
      }
    });
  }
  return { heading, items };
}

function relatedSection($, file) {
  const sec = $('main > .section').last();
  const cards = sec.find('a.service-card').toArray()
    .map((el) => ({ href: rewriteUrl($(el).attr('href')), title: $(el).find('h3').text() }));
  if (!cards.length) problems.push(`${file}: no related cards`);
  return {
    overline: sec.find('.section-head .overline').text(),
    heading: sec.find('.section-head h2').text(),
    cards,
  };
}

function ctaBand($, file) {
  const band = $('.cta-band');
  if (band.length !== 1) problems.push(`${file}: expected one .cta-band`);
  return { heading: band.find('h2').text(), text: band.find('p').text() };
}

function landingPage(dir, slug) {
  const file = `${dir}/${slug}.php`;
  const raw = readFileSync(join(LEGACY, file), 'utf8');
  const $ = load(raw);
  const sidebar = raw.match(/include '\.\.\/partials\/(location|service)-side-bar\.php'/)?.[1];
  if (dir !== 'blog' && sidebar !== dir.replace(/s$/, '')) problems.push(`${file}: unexpected sidebar '${sidebar}'`);
  const prose = $('.prose');
  if (prose.length !== 1) problems.push(`${file}: expected one .prose`);
  rewriteLinks($, prose);
  return {
    slug,
    head: head($, raw, file),
    hero: hero($, file),
    proseHtml: prose.html(),
    proseStyle: prose.attr('style') ?? null,
    faq: faqSection($, raw, file),
    related: relatedSection($, file),
    cta: ctaBand($, file),
  };
}

function staticPage(file, key) {
  const raw = readFileSync(join(LEGACY, file), 'utf8');
  const $ = load(raw);
  const main = $('main#main');
  if (main.length !== 1) problems.push(`${file}: expected <main id="main">`);
  rewriteLinks($, main);
  return {
    key,
    dataPage: $('body').attr('data-page') ?? null,
    head: head($, raw, file),
    mainHtml: main.html(),
  };
}

const slugsIn = (list) => list.trim().split('\n');

const locationSlugs = slugsIn(`ballina
brisbane
bundaberg
chinchilla
dalby
gold-coast
hervey-bay
lismore
maryborough
northern-nsw
oakey
port-of-brisbane
sunshine-coast
toowoomba
tweed-heads`);

const serviceSlugs = slugsIn(`after-hours-time-slot-delivery
b2b-transport
curtainsider-tautliner-hire
distribution-solutions
flatbed-drop-deck-transport
full-truck-load-ftl
general-freight-transport
hot-shot-same-day-freight
interstate-northern-nsw-freight
local-transport
permanent-hire-relief-driver
semi-trailer-hire
tail-lift-tailgate-delivery
taxi-truck-hire
warehouse-relocations`);

const blogSlugs = slugsIn(`22-vs-24-pallet-trailer
chain-of-responsibility-explained
ftl-vs-ltl
hot-shot-freight-guide
how-to-choose-freight-company-brisbane
nhvr-load-restraint-guide
tail-lift-truck-guide
trailer-types-guide
what-is-a-taxi-truck
what-is-b2b-transport`);

const staticPages = [
  ['index.php', 'home'],
  ['about.php', 'about'],
  ['fleet.php', 'fleet'],
  ['industries.php', 'industries'],
  ['privacy-compliance.php', 'privacy-compliance'],
  ['quote.php', 'quote'],
  ['contact.php', 'contact'],
  ['locations/index.php', 'locations-index'],
  ['services/index.php', 'services-index'],
  ['blog/index.php', 'blog-index'],
];

function writeModule(name, typeName, typeDef, exportName, data) {
  const body = `// GENERATED by scripts/extract-content.mjs from ${LEGACY} — do not edit by hand.
// Business copy, SEO values and JSON-LD are verbatim from the legacy site.

${typeDef}

export const ${exportName}: ${typeName} = ${JSON.stringify(data, null, 2)};
`;
  writeFileSync(join(OUT, name), body);
  console.log(`wrote ${OUT}/${name}`);
}

mkdirSync(OUT, { recursive: true });

const sharedTypes = `export interface PageHead {
  title: string;
  description: string;
  keywords: string | null;
  canonical: string;
  /** Page-level robots override (e.g. local-transport is noindexed). */
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  /** Raw JSON-LD blocks, byte-for-byte from the legacy <head>. */
  jsonLd: string[];
}

export interface Crumb { label: string; href: string | null }

export interface LandingPage {
  slug: string;
  head: PageHead;
  hero: {
    breadcrumbs: Crumb[];
    overline: string;
    h1: string;
    lead: string | null;
    media: { html: string; style: string | null };
    actions: { label: string; href: string }[];
  };
  proseHtml: string;
  proseStyle: string | null;
  faq: { heading: string; items: { q: string; a: string }[] };
  related: { overline: string; heading: string; cards: { href: string; title: string }[] };
  cta: { heading: string; text: string };
}`;

writeFileSync(join(OUT, 'types.ts'),
  `// GENERATED by scripts/extract-content.mjs — do not edit by hand.\n\n${sharedTypes}\n`);
console.log(`wrote ${OUT}/types.ts`);

writeModule('locations.ts', 'LandingPage[]',
  `import type { LandingPage } from './types';`, 'locations',
  locationSlugs.map((s) => landingPage('locations', s)));

writeModule('services.ts', 'LandingPage[]',
  `import type { LandingPage } from './types';`, 'services',
  serviceSlugs.map((s) => landingPage('services', s)));

writeModule('blog.ts', 'LandingPage[]',
  `import type { LandingPage } from './types';`, 'blogPosts',
  blogSlugs.map((s) => landingPage('blog', s)));

writeModule('pages.ts', 'Record<string, StaticPage>',
  `import type { PageHead } from './types';

export interface StaticPage {
  key: string;
  dataPage: string | null;
  head: PageHead;
  mainHtml: string;
}`,
  'staticPages',
  Object.fromEntries(staticPages.map(([f, k]) => [k, staticPage(f, k)])));

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('\nAll consistency checks passed.');
