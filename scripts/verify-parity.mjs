/*
 * Verifies the migrated site against the legacy source, URL by URL.
 *
 * For every path in legacy-src/url-inventory.txt it checks that
 *   1. the legacy .php URL still resolves, via a 301/308 to the
 *      extensionless path (the .htaccess contract), and
 *   2. the rendered page carries the same title, meta description,
 *      keywords, robots, canonical, og/twitter tags, H1 and JSON-LD
 *      as the legacy PHP file it replaces.
 *
 * Expected values are parsed straight from the legacy files, so this
 * exercises the whole pipeline (extraction → data → metadata → HTML)
 * rather than comparing the generated data to itself.
 *
 * Usage:  node scripts/verify-parity.mjs [baseUrl]     (default :3000)
 */
import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const LEGACY = 'legacy-src/roadlinxtransport.com.au';

const inventory = readFileSync('legacy-src/url-inventory.txt', 'utf8')
  .split('\n').map((l) => l.trim()).filter(Boolean);

/*
 * Values the migrated site is expected to change, keyed by public path.
 * Declared here independently of lib/corrections.ts — if the two disagree,
 * this check fails rather than rubber-stamping whatever shipped.
 * Anything not listed must still match the legacy page exactly.
 */
const EXPECTED_DIVERGENCES = {
  // Legacy canonical/og:url pointed at /policies-compliance, which 404s.
  '/privacy-compliance': {
    canonical: 'https://roadlinxtransport.com.au/privacy-compliance',
    ogUrl: 'https://roadlinxtransport.com.au/privacy-compliance',
  },
};

/** head.php's banner comment contains an illustrative <script> line. */
const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

/** The org knowledge graph from head.php is on every legacy page. */
const orgJsonLd = [...stripComments(readFileSync(join(LEGACY, 'partials/head.php'), 'utf8'))
  .matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((m) => JSON.parse(m[1]));

function publicPath(phpPath) {
  let p = '/' + phpPath.replace(/\.php$/, '');
  if (p === '/index') return '/';
  return p.replace(/\/index$/, '');
}

const header = readFileSync(join(LEGACY, 'partials/header.php'), 'utf8');
const footer = readFileSync(join(LEGACY, 'partials/footer.php'), 'utf8');
const locationSidebar = readFileSync(join(LEGACY, 'partials/location-side-bar.php'), 'utf8');
const serviceSidebar = readFileSync(join(LEGACY, 'partials/service-side-bar.php'), 'utf8');

/**
 * Matches the single <?php … ?> block that includes a given partial. The
 * inner tempered pattern refuses to cross a "?>", so the match can never
 * run past its own block and swallow page content.
 */
function includeOf(partial) {
  const name = partial.replace(/\./g, '\\.');
  return new RegExp(`<\\?php(?:(?!\\?>)[\\s\\S])*?${name}(?:(?!\\?>)[\\s\\S])*?\\?>`);
}

/** Resolves a legacy href the way <base href="../"> plus .htaccess did. */
function normaliseHref(href) {
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return null;
  let p = href.startsWith('/') ? href : '/' + href.replace(/^\.\//, '');
  p = p.replace(/\.(php|html)$/, '');
  if (p === '/index') return '/';
  return p.replace(/\/index$/, '') || '/';
}

/** Every internal page link on a page, deduplicated. */
function internalLinks($) {
  const set = new Set();
  $('a[href]').each((_, el) => {
    const p = normaliseHref($(el).attr('href'));
    if (p) set.add(p);
  });
  return [...set].sort();
}

function tags($) {
  const meta = (n) => $(`meta[name="${n}"]`).attr('content') ?? null;
  const og = (p) => $(`meta[property="og:${p}"]`).attr('content') ?? null;
  return {
    title: $('title').first().text().trim(),
    description: meta('description'),
    keywords: meta('keywords'),
    // A page-level robots tag follows (and overrides) head.php's default —
    // services/local-transport.php noindexes itself that way.
    robots: $('meta[name="robots"]').last().attr('content') ?? null,
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    ogTitle: og('title'),
    ogDescription: og('description'),
    ogUrl: og('url'),
    ogImage: og('image'),
    ogSiteName: og('site_name'),
    ogType: og('type'),
    ogLocale: og('locale'),
    twitterCard: meta('twitter:card'),
    twitterTitle: meta('twitter:title'),
    twitterDescription: meta('twitter:description'),
    twitterImage: meta('twitter:image'),
    h1: $('h1').first().text().trim(),
  };
}

function jsonLd($) {
  return $('script[type="application/ld+json"]').toArray()
    .map((el) => JSON.parse($(el).text()));
}

/** Order-insensitive deep comparison of the JSON-LD block sets. */
function sameJsonLd(a, b) {
  const norm = (list) => list.map((o) => JSON.stringify(o, Object.keys(o).sort())).sort();
  const [x, y] = [norm(a), norm(b)];
  return x.length === y.length && x.every((v, i) => v === y[i]);
}

const failures = [];
let checked = 0;

for (const phpPath of inventory) {
  const path = publicPath(phpPath);
  const legacyRaw = readFileSync(join(LEGACY, phpPath), 'utf8');
  // Legacy pages inherit head.php, so splice it in the way PHP does.
  const legacyHead = stripComments(legacyRaw).replace(
    /<\?php\s+include\s+'(\.\.\/)?partials\/head\.php';\s*\?>/,
    stripComments(readFileSync(join(LEGACY, 'partials/head.php'), 'utf8')),
  );
  const $legacy = load(legacyHead);
  const expected = { ...tags($legacy), ...(EXPECTED_DIVERGENCES[path] ?? {}) };
  const fail = (msg) => failures.push(`${path}: ${msg}`);

  // 1. The .php URL must still redirect to the extensionless path.
  const redirect = await fetch(`${BASE}/${phpPath}`, { redirect: 'manual' });
  if (redirect.status !== 301) {
    fail(`/${phpPath} returned ${redirect.status}, expected 301`);
  } else {
    const location = new URL(redirect.headers.get('location'), BASE).pathname;
    if (location !== path) fail(`/${phpPath} redirects to ${location}, expected ${path}`);
  }

  // 2. The page itself must render with the legacy head values.
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    fail(`${path} returned ${res.status}`);
    continue;
  }
  const $ = load(await res.text());
  const actual = tags($);

  for (const key of Object.keys(expected)) {
    // Site-wide og/twitter defaults come from head.php; only compare them
    // where the legacy page actually set a value.
    if (expected[key] === null && /^(og|twitter)/.test(key)) continue;
    if (expected[key] !== actual[key]) {
      fail(`${key}\n      legacy: ${JSON.stringify(expected[key])}\n      built:  ${JSON.stringify(actual[key])}`);
    }
  }

  // A canonical must point at the page it is on. The legacy site broke this
  // on /privacy-compliance, aiming search engines at a URL that 404s.
  const selfUrl = `https://roadlinxtransport.com.au${path}`;
  if (actual.canonical !== selfUrl) {
    fail(`canonical ${actual.canonical} does not point at this page (${selfUrl})`);
  }

  const expectedLd = [...orgJsonLd, ...jsonLd(load(legacyRaw))];
  const actualLd = jsonLd($);
  if (!sameJsonLd(expectedLd, actualLd)) {
    fail(`JSON-LD differs (legacy ${expectedLd.length} block(s), built ${actualLd.length})`);
  }

  // 3. Internal linking — the header/footer menus and the per-page
  //    "You might also need" cards are what tie the landing pages
  //    together, so the set of internal targets must match exactly.
  const legacyFull = stripComments(legacyRaw)
    .replace(includeOf('header.php'), header)
    .replace(includeOf('footer.php'), footer)
    .replace(includeOf('location-side-bar.php'), locationSidebar)
    .replace(includeOf('service-side-bar.php'), serviceSidebar);
  const expectedLinks = internalLinks(load(legacyFull));
  const actualLinks = internalLinks($);
  const missing = expectedLinks.filter((l) => !actualLinks.includes(l));
  const extra = actualLinks.filter((l) => !expectedLinks.includes(l));
  if (missing.length) fail(`internal links missing: ${missing.join(', ')}`);
  if (extra.length) fail(`internal links added: ${extra.join(', ')}`);

  checked++;
}

console.log(`Checked ${checked}/${inventory.length} URLs against ${LEGACY}`);
if (failures.length) {
  console.error(`\n${failures.length} mismatch(es):`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('All URLs resolve and every head value matches the legacy site.');
