import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

const page = staticPages['privacy-compliance'];

export const metadata = pageMetadata(page.head);

export default function PrivacyCompliance() {
  return <StaticPage page={page} />;
}
