import type { Metadata } from 'next';
import type { ArticleInfo, PageHead } from '@/content/types';

export const canonicalOf = (head: PageHead): string => head.canonical;
export const ogUrlOf = (head: PageHead): string | null => head.ogUrl;

/**
 * Next normalises metadata URLs against its trailingSlash setting, which
 * would rewrite the home page's canonical from ".../" to "..." — a change
 * to an indexed SEO value. Those pages emit the two URL tags literally
 * instead (see LiteralUrlTags); this reports which ones.
 */
export function hasTrailingSlashUrl(head: PageHead): boolean {
  return canonicalOf(head).endsWith('/') || Boolean(ogUrlOf(head)?.endsWith('/'));
}

/** Robots directive for pages that don't set their own. */
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large';

/**
 * Converts a page's <head> record into Next metadata.
 *
 * Next replaces (not deep-merges) the openGraph/twitter objects when a page
 * defines them, so the site-wide og:site_name/type/locale and twitter:card
 * are re-stated here; blog posts get og:type article instead. Robots lives
 * only here, not in the layout, so the 404 page isn't told to be indexed
 * alongside Next's own noindex.
 */
export function pageMetadata(head: PageHead, article?: ArticleInfo): Metadata {
  const literalUrls = hasTrailingSlashUrl(head);
  const ogUrl = ogUrlOf(head);
  return {
    title: head.title,
    description: head.description,
    ...(head.keywords ? { keywords: head.keywords } : {}),
    robots: head.robots ?? DEFAULT_ROBOTS,
    ...(literalUrls ? {} : { alternates: { canonical: canonicalOf(head) } }),
    openGraph: {
      siteName: 'Road Linx Transport',
      locale: 'en_AU',
      ...(article
        ? { type: 'article', publishedTime: article.published, authors: ['Road Linx Transport'] }
        : { type: 'website' }),
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
