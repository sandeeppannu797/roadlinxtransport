import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages['blog-index'];

export const metadata = pageMetadata(page.head);

export default function BlogIndex() {
  return <StaticPage page={page} />;
}
