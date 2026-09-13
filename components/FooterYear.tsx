'use client';

import { useSyncExternalStore } from 'react';

/* The prerendered HTML carries the year the site was built; the browser
 * swaps in the current one, so the copyright can't go stale between
 * deploys. buildYear comes from the server so hydration matches. */
const subscribe = () => () => {};

export function FooterYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => String(buildYear),
  );
  return <span data-year>{year}</span>;
}
