import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages.home;

export const metadata = pageMetadata(page.head);

export default function Home() {
  return <StaticPage page={page} />;
}
