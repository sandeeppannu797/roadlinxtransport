/**
 * Deliberate divergences from the legacy site.
 *
 * The migration preserves legacy SEO values verbatim; this file is the
 * single exception list, and every entry needs a reason why carrying the
 * legacy value across would actively harm the site. scripts/verify-parity.mjs
 * declares the same expectations independently, so a mistake here shows up
 * as a verification failure rather than passing silently.
 */

/** Legacy URL → the URL that should ship instead. */
export const URL_CORRECTIONS: Record<string, string> = {
  // privacy-compliance.php declares both its canonical and its og:url as
  // /policies-compliance, which has never been a page on this site. A
  // canonical pointing at a 404 tells search engines to drop the real page,
  // so it is corrected to its own URL.
  'https://roadlinxtransport.com.au/policies-compliance':
    'https://roadlinxtransport.com.au/privacy-compliance',
};

export function correctUrl<T extends string | null>(url: T): T {
  if (!url) return url;
  return (URL_CORRECTIONS[url] ?? url) as T;
}
