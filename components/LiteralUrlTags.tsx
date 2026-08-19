import type { PageHead } from '@/content/types';
import { canonicalOf, hasTrailingSlashUrl, ogUrlOf } from '@/lib/meta';

/*
 * Emits canonical and og:url exactly as the legacy page had them, for the
 * pages whose URLs end in a slash. Next's metadata layer would strip that
 * slash; React hoists these tags into <head> unchanged. A no-op elsewhere,
 * and pageMetadata() drops the same two tags so nothing is duplicated.
 */
export function LiteralUrlTags({ head }: { head: PageHead }) {
  if (!hasTrailingSlashUrl(head)) return null;
  const ogUrl = ogUrlOf(head);
  return (
    <>
      <link rel="canonical" href={canonicalOf(head)} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
    </>
  );
}
