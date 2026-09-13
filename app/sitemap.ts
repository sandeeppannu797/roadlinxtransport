import type { MetadataRoute } from 'next';
import { locations } from '@/content/locations';
import { services } from '@/content/services';
import { blogPosts } from '@/content/blog';
import { staticPages } from '@/content/pages';
import { canonicalOf } from '@/lib/meta';
import type { PageHead } from '@/content/types';

/*
 * Built from the same content collections the pages render from, so a new
 * location or service appears here automatically.
 *
 * URLs come from each page's canonical — by definition the URL that should
 * be indexed — and a page carrying a noindex robots directive is left out,
 * since listing a page you have asked not to be indexed is a contradiction
 * search engines report as an error.
 */
const isIndexable = (head: PageHead) => !/noindex/i.test(head.robots ?? '');

const entry = (head: PageHead, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: canonicalOf(head),
  ...(lastModified ? { lastModified } : {}),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const heads: PageHead[] = [
    // Home, the three hub indexes, then the standalone pages.
    staticPages.home.head,
    staticPages['locations-index'].head,
    staticPages['services-index'].head,
    staticPages['blog-index'].head,
    staticPages.about.head,
    staticPages.fleet.head,
    staticPages.industries.head,
    staticPages['privacy-compliance'].head,
    staticPages.quote.head,
    staticPages.contact.head,
    ...locations.map((l) => l.head),
    ...services.map((s) => s.head),
  ];

  return [
    ...heads.filter(isIndexable).map((head) => entry(head)),
    ...blogPosts.filter((p) => isIndexable(p.head)).map((p) => entry(p.head, p.article?.published)),
  ];
}
