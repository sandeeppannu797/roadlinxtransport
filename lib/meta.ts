import type { Metadata } from 'next';
import type { PageHead } from '@/content/types';
import { correctUrl } from './corrections';

/** The canonical/og:url a page actually ships, after lib/corrections. */
export const canonicalOf = (head: PageHead): string => correctUrl(head.canonical);
export const ogUrlOf = (head: PageHead): string | null => correctUrl(head.ogUrl);

/**
 * Next normalises metadata URLs against its trailingSlash setting, which
 * would rewrite the home page's canonical from ".../" to "..." — a change
 * to an indexed SEO value. Those pages emit the two URL tags literally
 * instead (see LiteralUrlTags); this reports which ones.
 */
export function hasTrailingSlashUrl(head: PageHead): boolean {
  return canonicalOf(head).endsWith('/') || Boolean(ogUrlOf(head)?.endsWith('/'));
}

/**
 * Converts an extracted legacy <head> record into Next metadata.
 *
 * Next replaces (not deep-merges) the openGraph/twitter/robots objects when
 * a page defines them, so the site-wide values from legacy head.php
 * (og:site_name/type/locale, twitter:card, robots) are re-stated here to
 * keep every page's emitted tags identical to the legacy output.
 */
export function pageMetadata(head: PageHead): Metadata {
  const literalUrls = hasTrailingSlashUrl(head);
  const ogUrl = ogUrlOf(head);
  return {
    title: head.title,
    description: head.description,
    ...(head.keywords ? { keywords: head.keywords } : {}),
    ...(head.robots ? { robots: head.robots } : {}),
    ...(literalUrls ? {} : { alternates: { canonical: canonicalOf(head) } }),
    openGraph: {
      siteName: 'Road Linx Transport',
      type: 'website',
      locale: 'en_AU',
      ...(head.ogTitle ? { title: head.ogTitle } : {}),
      ...(head.ogDescription ? { description: head.ogDescription } : {}),
      ...(ogUrl && !literalUrls ? { url: ogUrl } : {}),
      ...(head.ogImage ? { images: head.ogImage } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(head.twitterTitle ? { title: head.twitterTitle } : {}),
      ...(head.twitterDescription ? { description: head.twitterDescription } : {}),
      ...(head.twitterImage ? { images: head.twitterImage } : {}),
    },
  };
}
