/*
 * Renders one of the seven hand-written legacy pages (home, about, fleet,
 * industries, policies, and the three hub indexes). Their <main> markup is
 * carried across verbatim from the PHP source so no business copy, link or
 * heading can drift; only the surrounding chrome is React.
 */
import type { StaticPage as StaticPageData } from '@/content/pages';
import { JsonLd } from './JsonLd';
import { LiteralUrlTags } from './LiteralUrlTags';

export function StaticPage({ page }: { page: StaticPageData }) {
  return (
    <>
      <LiteralUrlTags head={page.head} />
      <JsonLd blocks={page.head.jsonLd} />
      <main id="main" dangerouslySetInnerHTML={{ __html: page.mainHtml }} />
    </>
  );
}
