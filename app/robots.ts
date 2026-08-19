import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/*
 * The legacy site shipped no robots.txt, so crawlers fell back to "crawl
 * everything" — which stays the intent here. The addition is the sitemap
 * pointer, so the 49 indexable URLs are discoverable without relying on
 * internal links alone (one service page has no inbound links at all).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
