'use client';

import { useSyncExternalStore } from 'react';

/* Legacy site.js filled the footer year in on the client so the copyright
 * could not go stale between deploys of a static site. Same here: the
 * prerendered HTML carries the year the legacy markup shipped with, and
 * the browser swaps in the real one. */
const subscribe = () => () => {};

export function FooterYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => '2026',
  );
  return <span data-year>{year}</span>;
}
