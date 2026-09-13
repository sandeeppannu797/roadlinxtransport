// Shared types for the page content in this folder.

export interface PageHead {
  title: string;
  description: string;
  keywords: string | null;
  canonical: string;
  /** Page-level robots override (e.g. local-transport is noindexed). */
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  /**
   * Raw JSON-LD blocks for the page. Landing pages leave FAQPage out:
   * LandingTemplate builds it from `faq.items`, so it always matches the
   * visible FAQ.
   */
  jsonLd: string[];
}

export interface Crumb { label: string; href: string | null }

/** Publication details for a blog post, shown on the page and used in its metadata. */
export interface ArticleInfo {
  /** ISO date, e.g. "2026-05-05". Keep the Article JSON-LD's datePublished in step. */
  published: string;
  readMinutes: number;
  category: string;
}

export interface LandingPage {
  slug: string;
  head: PageHead;
  hero: {
    breadcrumbs: Crumb[];
    overline: string;
    h1: string;
    lead: string | null;
    media: { html: string; style: string | null };
    actions: { label: string; href: string }[];
  };
  proseHtml: string;
  proseStyle: string | null;
  faq: { heading: string; items: { q: string; a: string }[] };
  related: { overline: string; heading: string; cards: { href: string; title: string }[] };
  cta: { heading: string; text: string };
  /** Blog posts only. */
  article?: ArticleInfo;
}
