import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages['services-index'];

export const metadata = pageMetadata(page.head);

export default function ServicesIndex() {
  return <StaticPage page={page} />;
}
