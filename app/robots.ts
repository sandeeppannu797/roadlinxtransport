import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/*
 * Crawl everything, and point at the sitemap so the indexable URLs are
 * discoverable without relying on internal links alone (one service page
 * has no inbound links at all).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
