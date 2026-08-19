import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages.fleet;

export const metadata = pageMetadata(page.head);

export default function Fleet() {
  return <StaticPage page={page} />;
}
