import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages['locations-index'];

export const metadata = pageMetadata(page.head);

export default function LocationsIndex() {
  return <StaticPage page={page} />;
}
