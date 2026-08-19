import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages.industries;

export const metadata = pageMetadata(page.head);

export default function Industries() {
  return <StaticPage page={page} />;
}
