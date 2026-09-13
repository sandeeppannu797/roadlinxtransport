/*
 * Checks the running build against the site's recorded SEO footprint.
 *
 * scripts/seo-baseline.json holds, for every public page, what search
 * engines index: title, description, keywords, robots, canonical, the
 * OG/Twitter tags, the H1, the JSON-LD blocks and the set of internal
 * links. It was first recorded from the legacy PHP site this build
 * replaced, so it began as that site's exact footprint.
 *
 * `pnpm verify` fails on any drift from the baseline, and also checks that
 *   - every page's canonical points at the page itself,
 *   - legacy .php URLs and the old WordPress URLs 301 to their pages,
 *   - /sitemap.xml lists exactly the indexable pages,
 *   - an unknown URL returns a 404 that is noindexed.
 *
 * Deliberate SEO changes are recorded with `pnpm verify --update`, which
 * rewrites the baseline from the running build and lists what changed.
 * The resulting diff of seo-baseline.json is the SEO change: review it.
 *
 * Usage: node scripts/verify-seo.mjs [--update] [baseUrl]   (default :3000)
 */
import { load } from 'cheerio';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const UPDATE = args.includes('--update');
const BASE = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3000').replace(/\/$/, '');
const SITE = 'https://roadlinxtransport.com.au';
const BASELINE = new URL('./seo-baseline.json', import.meta.url);

/*
 * URLs from the WordPress site that preceded the PHP one. They were indexed
 * until late 2025 and may still be linked from elsewhere, so each must
 * permanently redirect to its replacement. Declared here independently of
 * next.config.ts, so a broken redirect fails instead of passing on trust.
 */
const WORDPRESS_REDIRECTS = {
  '/about-us/': '/about',
  '/contact-us/': '/contact',
  '/our-services/': '/services',
  '/policies-compliance/': '/privacy-compliance',
  '/semi-trailer-hire/': '/services/semi-trailer-hire',
  '/wp-sitemap.xml': '/sitemap.xml',
};

/** The .php URL the legacy site served a page from; .htaccess 301'd it away. */
function legacyPhpUrl(path) {
  if (path === '/') return '/index.php';
  if (['/locations', '/services', '/blog'].includes(path)) return `${path}/index.php`;
  return `${path}.php`;
}

/** JSON with object keys sorted at every depth, so key order is never a change. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const same = (a, b) => canonical(a) === canonical(b);

function internalPath(href) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return null;
  return href.split(/[?#]/)[0].replace(/(.)\/$/, '$1');
}

function readPage(html) {
  const $ = load(html);
  const meta = (n) => $(`meta[name="${n}"]`).attr('content') ?? null;
  const og = (p) => $(`meta[property="og:${p}"]`).attr('content') ?? null;
  const all = (sel, read) => $(sel).toArray().map((el) => read($(el)));
  const links = new Set();
  $('a[href]').each((_, el) => {
    const path = internalPath($(el).attr('href'));
    if (path) links.add(path);
  });
  return {
    title: $('title').first().text().trim(),
    description: meta('description'),
    keywords: meta('keywords'),
    // Arrays, so a duplicated or conflicting tag shows up as a change.
    robots: all('meta[name="robots"]', (el) => el.attr('content')),
    canonical: all('link[rel="canonical"]', (el) => el.attr('href')),
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
    h1: all('h1', (el) => el.text().trim()),
    jsonLd: all('script[type="application/ld+json"]', (el) => JSON.parse(el.text())),
    links: [...links].sort(),
  };
}

async function get(path, init) {
  try {
    return await fetch(BASE + path, init);
  } catch (err) {
    console.error(`Cannot reach ${BASE} (${err.cause?.code ?? err.message}). Run \`pnpm build && pnpm start\` first.`);
    process.exit(2);
  }
}

async function sitemapPaths() {
  const xml = await (await get('/sitemap.xml')).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, '$1'));
}

const isIndexable = (page) => page.robots.every((r) => !/noindex/i.test(r));
const ldLabel = (o) => o['@type'] ?? 'untyped';

// ---------------------------------------------------------------------------
// --update: record the running build as the new baseline.
// ---------------------------------------------------------------------------
if (UPDATE) {
  const old = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : { site: {}, pages: {} };
  // Known pages plus anything newly in the sitemap. Pages outside the
  // sitemap (the noindexed ones) are only ever tracked once listed here.
  const paths = [...new Set([...Object.keys(old.pages), ...(await sitemapPaths())])].sort();

  const read = {};
  const missing = [];
  for (const path of paths) {
    const res = await get(path);
    if (res.ok) read[path] = readPage(await res.text());
    else missing.push(`${path} returned ${res.status}`);
  }
  if (missing.length) {
    console.error(`Not updating: ${missing.join('; ')}.`);
    console.error('If a page was removed on purpose, delete its entry from seo-baseline.json by hand.');
    process.exit(1);
  }

  // What every page carries (the org JSON-LD, header and footer links) is
  // stored once, so a site-wide change is one hunk in the diff, not fifty.
  const pages = Object.values(read);
  const siteLd = pages[0].jsonLd.filter((b) => pages.every((p) => p.jsonLd.some((o) => same(o, b))));
  const siteLinks = pages[0].links.filter((l) => pages.every((p) => p.links.includes(l)));
  const baseline = {
    site: { jsonLd: siteLd, links: siteLinks },
    pages: Object.fromEntries(Object.entries(read).map(([path, p]) => [path, {
      ...p,
      jsonLd: p.jsonLd.filter((b) => !siteLd.some((s) => same(s, b))),
      links: p.links.filter((l) => !siteLinks.includes(l)),
    }])),
  };

  const changes = [];
  for (const key of ['jsonLd', 'links']) {
    if (!same(old.site[key] ?? null, baseline.site[key])) changes.push(`  ~ site-wide ${key}`);
  }
  for (const [path, page] of Object.entries(baseline.pages)) {
    const before = old.pages[path];
    if (!before || !Object.keys(before).length) { changes.push(`  + ${path}`); continue; }
    const fields = Object.keys(page).filter((k) => !same(before[k] ?? null, page[k]));
    if (fields.length) changes.push(`  ~ ${path}: ${fields.join(', ')}`);
  }

  writeFileSync(BASELINE, JSON.stringify(baseline, null, 2) + '\n');
  console.log(`Recorded ${paths.length} pages in scripts/seo-baseline.json.`);
  console.log(changes.length ? `Changes:\n${changes.join('\n')}` : 'No changes.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Verify the running build against the baseline.
// ---------------------------------------------------------------------------
if (!existsSync(BASELINE)) {
  console.error('No scripts/seo-baseline.json. Record one with `pnpm verify --update`.');
  process.exit(2);
}
const { site, pages } = JSON.parse(readFileSync(BASELINE, 'utf8'));
const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

for (const [path, expected] of Object.entries(pages)) {
  // The legacy .php URL must still 301 straight to the page.
  const php = legacyPhpUrl(path);
  const redirect = await get(php, { redirect: 'manual' });
  const location = redirect.headers.get('location');
  if (redirect.status !== 301) fail(php, `returned ${redirect.status}, expected 301 to ${path}`);
  else if (new URL(location, BASE).pathname !== path) fail(php, `redirects to ${location}, expected ${path}`);

  const res = await get(path);
  if (!res.ok) { fail(path, `returned ${res.status}`); continue; }
  const actual = readPage(await res.text());

  for (const key of Object.keys(actual)) {
    if (key === 'jsonLd' || key === 'links') continue;
    if (!same(expected[key] ?? null, actual[key])) {
      fail(path, `${key}\n      expected: ${JSON.stringify(expected[key])}\n      built:    ${JSON.stringify(actual[key])}`);
    }
  }

  // A canonical must point at the page it is on. The legacy site broke this
  // on /privacy-compliance, aiming search engines at a URL that 404s.
  const self = path === '/' ? `${SITE}/` : SITE + path;
  if (!same(actual.canonical, [self])) fail(path, `canonical ${JSON.stringify(actual.canonical)} should be ["${self}"]`);

  const want = [...site.jsonLd, ...expected.jsonLd].map(canonical);
  const got = actual.jsonLd.map(canonical);
  const lostLd = want.filter((b) => !got.includes(b));
  const newLd = got.filter((b) => !want.includes(b));
  if (lostLd.length || newLd.length || want.length !== got.length) {
    const types = (list) => list.map((b) => ldLabel(JSON.parse(b))).join(', ') || 'none';
    fail(path, `JSON-LD differs — missing or changed: ${types(lostLd)}; new or changed: ${types(newLd)}`);
  }

  const wantLinks = [...new Set([...site.links, ...expected.links])];
  const lostLinks = wantLinks.filter((l) => !actual.links.includes(l));
  const newLinks = actual.links.filter((l) => !wantLinks.includes(l));
  if (lostLinks.length) fail(path, `internal links missing: ${lostLinks.join(', ')}`);
  if (newLinks.length) fail(path, `internal links added: ${newLinks.join(', ')}`);
}

// Old WordPress URLs: a chain of permanent redirects ending at the page
// (Next first drops the trailing slash with a 308, then the 301 applies).
for (const [from, to] of Object.entries(WORDPRESS_REDIRECTS)) {
  let at = from;
  for (let hop = 0; hop < 5 && at !== to; hop++) {
    const res = await get(at, { redirect: 'manual' });
    if (res.status !== 301 && res.status !== 308) { fail(from, `hit ${res.status} at ${at}, expected a redirect to ${to}`); break; }
    at = new URL(res.headers.get('location'), BASE).pathname;
  }
  if (at === to && !(await get(to)).ok) fail(from, `redirects to ${to}, which does not load`);
  else if (at !== to && !failures.some((f) => f.startsWith(`${from}:`))) fail(from, `ends at ${at}, expected ${to}`);
}

// The sitemap lists every indexable page, and nothing else.
const listed = await sitemapPaths();
const indexable = Object.entries(pages).filter(([, p]) => isIndexable(p)).map(([path]) => path);
const unlisted = indexable.filter((p) => !listed.includes(p));
const stray = listed.filter((p) => !indexable.includes(p));
if (unlisted.length) fail('/sitemap.xml', `missing indexable pages: ${unlisted.join(', ')}`);
if (stray.length) fail('/sitemap.xml', `lists pages that are not indexable baseline pages: ${stray.join(', ')}`);

// Unknown URLs must 404, and the 404 must not ask to be indexed.
const notFound = await get('/__verify-seo-missing-page');
const notFoundRobots = readPage(await notFound.text()).robots;
if (notFound.status !== 404) fail('404 page', `returned ${notFound.status}`);
if (!notFoundRobots.length || !notFoundRobots.every((r) => /noindex/i.test(r))) {
  fail('404 page', `robots ${JSON.stringify(notFoundRobots)} should all be noindex`);
}

const count = Object.keys(pages).length;
console.log(`Checked ${count} pages, ${Object.keys(WORDPRESS_REDIRECTS).length} WordPress redirects, the sitemap and the 404 page.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error('  ✗ ' + f);
  console.error('\nIf these changes are intended, record them with `pnpm verify --update` and review the baseline diff.');
  process.exit(1);
}
console.log('Every page matches the SEO baseline.');
