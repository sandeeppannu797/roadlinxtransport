import { staticPages } from '@/content/pages';
import { StaticPage } from '@/components/StaticPage';
import { pageMetadata } from '@/lib/meta';

// The legacy page pointed its canonical and og:url at /policies-compliance,
// a URL that has never existed. Corrected to this page's own URL via
// lib/corrections.ts; everything else here is verbatim.
const page = staticPages['privacy-compliance'];

export const metadata = pageMetadata(page.head);

export default function PrivacyCompliance() {
  return <StaticPage page={page} />;
}
