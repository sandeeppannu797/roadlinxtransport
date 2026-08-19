import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages.about;

export const metadata = pageMetadata(page.head);

export default function About() {
  return <StaticPage page={page} />;
}
